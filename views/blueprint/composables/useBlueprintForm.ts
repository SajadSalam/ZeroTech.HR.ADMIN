import { useI18n } from 'vue-i18n'
import { Validator } from '~/services/validator'
import { createValidator } from '~/services/validationWithI18n'
import { useAppToaster } from '~/services/toaster/toaster'
import { useBlueprintStore } from '~/views/blueprint/store'
import type { BlueprintItem, CountDetails, SelectedTopic, BlueprintDetailes, BlueprintQuestionBank, BlueprintTopic, TopicDetails, QuestionTypeStats, DifficultyStats, BlueprintCreate } from '~/views/blueprint/types/index'
import type { QuestionBankDto } from '~/views/question-bank/types'
import { difficultyOptions, questionTypeOptions } from '~/views/question-bank'
import { Difficulty, QuestionType } from '~/views/questions/types'
import { useQuestionBankStore } from '~/views/question-bank/store'

export type QuestionBank = QuestionBankDto & {
    selectedTopics: SelectedTopic[]
}

let formInstance: ReturnType<typeof createBlueprintForm> | null = null

function createBlueprintForm() {
    const { t } = useI18n()
    const blueprintStore = useBlueprintStore()
    const questionBankStore = useQuestionBankStore()
    const router = useRouter()
    const toaster = useAppToaster()
    const questionBanks = ref<QuestionBank[]>([])
    const countDetails = ref<Record<string, CountDetails>>({})
    const existingQuestionBanksIds = ref<string[]>([])
    const isLoading = ref(false)

    const validator = new Validator<BlueprintCreate>(
        {
            title: '',
            successGrade: 0,
            fullGrade: 0,
            description: '',
            displayResult: true,
            moveBetweenQuestion: true,
            randomizeAnswer: true,
            randomizeChoices: true,
            items: [],
            totalQuestionsGrade: 0,
        },
        {
            title: {
                required: createValidator(t, 'title', 'required'),
            },
            successGrade: {
                required: createValidator(t, 'half-success-grade', 'required'),
                minValue: createValidator(t, 'half-success-grade', 'minValue', 1),
            },
            fullGrade: {
                required: createValidator(t, 'success-grade', 'required'),
                minValue: createValidator(t, 'success-grade', 'minValue', 1),
            },
            totalQuestionsGrade: {
                required: createValidator(t, 'maximum-grade', 'required'),
                minValue: createValidator(t, 'maximum-grade', 'minValue', 1),
            },
        }
    )

    const body = validator.validation

    const isQuestionCountValid = (qbIndex: number, topicIndex: number) => {
        const topic = questionBanks.value[qbIndex].selectedTopics[topicIndex]
        const availableCount = topic.difficultyCount as number
        return availableCount > 0 && topic.numberOfQuestions > availableCount
    }

    const addQuestionBank = async (qb: QuestionBankDto) => {
        const response = await questionBankStore.getCountByQuestionBankId(qb.id)
        if (response) {
            countDetails.value[qb.id] = response
        }
        existingQuestionBanksIds.value.push(qb.id)
        questionBanks.value.push({
            ...qb,
            selectedTopics: [],
        }) 
    }

    const removeQuestionBank = (qbId: string) => {
        questionBanks.value = questionBanks.value.filter((QB: QuestionBankDto) => QB.id !== qbId)
        countDetails.value = Object.fromEntries(Object.entries(countDetails.value).filter(([key]) => key !== qbId))
    }

    const setQuestionBanks = async (questionBank: QuestionBankDto[]) => {
        if (questionBank.length === 0) {
            questionBanks.value = []
            existingQuestionBanksIds.value = []
            countDetails.value = {}
            return
        }
        isLoading.value = true
        try {
            const currentQuestionBankIds = questionBank.map(qb => qb.id)
            const idsToRemove = existingQuestionBanksIds.value.filter(
                id => !currentQuestionBankIds.includes(id)
            )
            idsToRemove.forEach(id => removeQuestionBank(id))
            for (const qb of questionBank) {
                if (!existingQuestionBanksIds.value.includes(qb.id)) {
                    await addQuestionBank(qb)
                }
            }
        } catch (error) {
            console.error('Error setting question banks:', error)
            toaster.show('danger', t('error-loading-question-banks'))
        } finally {
            isLoading.value = false
        }
    }

    const validateQuestionCounts = () => {
        for (let qbIndex = 0; qbIndex < questionBanks.value.length; qbIndex++) {
            const qb = questionBanks.value[qbIndex]
            for (let topicIndex = 0; topicIndex < qb.selectedTopics.length; topicIndex++) {
                if (isQuestionCountValid(qbIndex, topicIndex)) {
                    toaster.show('danger', t('number-of-questions-exceeds-available-count'))
                    return false
                }
            }
        }
        return true
    }

    const calculateTotalGrade = () => {
        let total = 0
        for (const qb of questionBanks.value) {
            for (const topic of qb.selectedTopics) {
                if (topic.difficulty) {
                    total += (topic.grade || 0) * (topic.numberOfQuestions || 0)
                }
            }
        }
        return total
    }

    const buildBlueprintItems = (): BlueprintItem[] => {
        const items: BlueprintItem[] = []
        
        for (const qb of questionBanks.value) {
            for (const topic of qb.selectedTopics) {
                if (topic.topicId && topic.questionType !== null && topic.difficulty !== null) {
                    items.push({
                        questionBankId: qb.id,
                        topicId: topic.topicId,
                        questionType: topic.questionType,
                        difficulty: topic.difficulty,
                        numberOfQuestions: topic.numberOfQuestions,
                        gradePerQuestion: topic.grade,
                    })
                }
            }
        }
        
        return items
    }

    const submit = async (
        blueprintId?: string,
    ) => {
        const isValid = await body.value.$validate()
        if (!isValid) return
        
        if (!validateQuestionCounts()) return
        if(Number(body.value.fullGrade.$model) <= Number(body.value.successGrade.$model)) {
            toaster.show('danger', t('success-grade-must-be-less-than-full-grade'))
            return
        }
        if(Number(body.value.fullGrade.$model) > Number(body.value.totalQuestionsGrade.$model)) {
            toaster.show('danger', t('full-grade-must-be-less-than-or-equal-to-total-questions-grade'))
            return
        }
        const totalGrade = calculateTotalGrade()
        const expectedGrade = Number(body.value.totalQuestionsGrade.$model)
        if (totalGrade !== expectedGrade) {
            toaster.show('danger', t('total-grade-must-equal-maximum-grade'))
            return
        }
        
        const items = buildBlueprintItems()
        if (items.length === 0) {
            toaster.show('danger', t('at-least-one-complete-topic-configuration-required'))
            return
        }
        
        try {
            isLoading.value = true
            const extractedBody = validator.extractBody()
            extractedBody.items = items
            
            if (blueprintId) {
                await blueprintStore.update(blueprintId, extractedBody)
                router.push('/blueprint')
            } else {
                await blueprintStore.create(extractedBody)
                router.push('/blueprint')
            }
        } catch (error) {
            console.error(error)
        } finally {
            isLoading.value = false
        }
    }

    // Convert string difficulty name to enum value
    const convertDifficultyStringToEnum = (difficultyString: string | number): number => {
        if (typeof difficultyString === 'number') {
            return difficultyString
        }
        const difficultyOpts = difficultyOptions(t)
        const option = difficultyOpts.find(opt => 
            opt.name.toLowerCase() === difficultyString.toLowerCase() || 
            opt.name.toLowerCase().replace(/\s+/g, '') === difficultyString.toLowerCase().replace(/\s+/g, '')
        )
        return option?.value ?? Difficulty.Easy
    }

    // Convert string question type name to enum value
    const convertQuestionTypeStringToEnum = (questionTypeString: string | number): number => {
        if (typeof questionTypeString === 'number') {
            return questionTypeString
        }
        const questionTypeOpts = questionTypeOptions(t)
        const option = questionTypeOpts.find(opt => 
            opt.name.toLowerCase() === questionTypeString.toLowerCase() || 
            opt.name.toLowerCase().replace(/\s+/g, '') === questionTypeString.toLowerCase().replace(/\s+/g, '')
        )
        return option?.value ?? QuestionType.SingleChoice
    }

    // Convert BlueprintTopic to SelectedTopic
    const convertBlueprintTopicToSelectedTopic = (topic: BlueprintTopic, countDetail: CountDetails | undefined): SelectedTopic => {
        // Convert string values to enum values
        const questionType = typeof topic.questionType === 'string' 
            ? convertQuestionTypeStringToEnum(topic.questionType) 
            : topic.questionType
        
        const difficulty = typeof topic.difficulty === 'string' 
            ? convertDifficultyStringToEnum(topic.difficulty) 
            : topic.difficulty

        // Find the difficulty count from countDetails
        let difficultyCount: number | undefined = undefined
        if (topic.topicId && questionType !== null && difficulty !== null && countDetail) {
            const topicDetail = countDetail.topics.find((t: TopicDetails) => t.id === topic.topicId)
            if (topicDetail) {
                const questionTypeDetail = topicDetail.types.find((t: QuestionTypeStats) => t.value === questionType)
                if (questionTypeDetail) {
                    const difficultyDetail = questionTypeDetail.difficulty.find((d: DifficultyStats) => d.value === difficulty)
                    if (difficultyDetail) {
                        difficultyCount = difficultyDetail.count
                    }
                }
            }
        }

        return {
            topicId: topic.topicId,
            questionType,
            difficulty,
            numberOfQuestions: topic.numberOfQuestions,
            grade: topic.grade,
            difficultyCount,
        }
    }

    // Populate form with blueprint details
    const populateFormFromBlueprint = async (blueprint: BlueprintDetailes) => {
        // Populate form fields
        body.value.title.$model = blueprint.title
        body.value.successGrade.$model = blueprint.successGrade
        body.value.fullGrade.$model = blueprint.fullGrade
        body.value.totalQuestionsGrade.$model = blueprint.totalQuestionsGrade
        body.value.description.$model = blueprint.description
        body.value.displayResult.$model = blueprint.displayResult
        body.value.moveBetweenQuestion.$model = blueprint.moveBetweenQuestion
        body.value.randomizeAnswer.$model = blueprint.randomizeAnswer
        body.value.randomizeChoices.$model = blueprint.randomizeChoices

        // Convert BlueprintQuestionBank[] to QuestionBankDto[] and populate selectedTopics
        const questionBankDtos: QuestionBankDto[] = blueprint.questionBanks.map((qb: BlueprintQuestionBank) => {
            // Create a minimal QuestionBankDto from the blueprint data
            // We'll use the data we have and let setQuestionBanks fetch count details
            return {
                id: qb.questionBankId,
                title: qb.questionBankTitle,
                subjectId: '',
                startEditingDatetimeUtc: null,
                endEditingDatetimeUtc: null,
                createdAtUtc: '',
                updatedAtUtc: '',
                subject: {} as any,
                topics: [],
                questionTypes: [],
                totalQuestionCount: 0,
            } as QuestionBankDto
        })

        // Set question banks (this will fetch count details for each)
        await setQuestionBanks(questionBankDtos)

        // After question banks are set and count details are loaded, populate selectedTopics
        // Wait a bit for count details to be loaded
        await nextTick()

        blueprint.questionBanks.forEach((qb: BlueprintQuestionBank) => {
            const formQuestionBank = questionBanks.value.find((fqb: QuestionBank) => fqb.id === qb.questionBankId)
            if (formQuestionBank) {
                // Convert BlueprintTopic[] to SelectedTopic[]
                const selectedTopics: SelectedTopic[] = qb.topics.map((topic: BlueprintTopic) => {
                    return convertBlueprintTopicToSelectedTopic(topic, countDetails.value[qb.questionBankId])
                })
                formQuestionBank.selectedTopics = selectedTopics
            }
        })
    }

    return {
        questionBanks,
        countDetails,
        body,
        isLoading,
        setQuestionBanks,
        buildBlueprintItems,
        calculateTotalGrade,
        submit,
        validator,
        isQuestionCountValid,
        populateFormFromBlueprint,
    }
}

export const useBlueprintForm = () => {
    if (!formInstance) {
        console.log("here");
        formInstance = createBlueprintForm()
    }
    return formInstance
}
