import type { QuestionDto } from './types'

export const tableHeader = (t: (key: string) => string) => {
    return [
        {
            key: 'title',
            label: t('question-title'),
        },
        {
            key: 'options',
            label: t('options'),
        },
        {
            key: 'actions',
            label: t('actions'),
        },
    ]
}

export const fakeData: QuestionDto[] = [
    {
        id: '1',
        title: 'What is the capital of France?',
        options: [
            { title: 'London', isTrueAnswer: false },
            { title: 'Paris', isTrueAnswer: true },
            { title: 'Berlin', isTrueAnswer: false },
            { title: 'Madrid', isTrueAnswer: false },
        ],
        publishedAt: '2024-08-01',
        deleted: false,
        creationDate: '2024-08-01',
    },
    {
        id: '2',
        title: 'Which planet is known as the Red Planet?',
        options: [
            { title: 'Venus', isTrueAnswer: false },
            { title: 'Mars', isTrueAnswer: true },
            { title: 'Jupiter', isTrueAnswer: false },
            { title: 'Saturn', isTrueAnswer: false },
        ],
        publishedAt: '2024-08-15',
        deleted: false,
        creationDate: '2024-08-15',
    },
    {
        id: '3',
        title: 'What is 2 + 2?',
        options: [
            { title: '3', isTrueAnswer: false },
            { title: '4', isTrueAnswer: true },
            { title: '5', isTrueAnswer: false },
            { title: '6', isTrueAnswer: false },
        ],
        publishedAt: '2024-09-01',
        deleted: false,
        creationDate: '2024-09-01',
    },
    {
        id: '4',
        title: 'Who wrote "Romeo and Juliet"?',
        options: [
            { title: 'Charles Dickens', isTrueAnswer: false },
            { title: 'William Shakespeare', isTrueAnswer: true },
            { title: 'Jane Austen', isTrueAnswer: false },
            { title: 'Mark Twain', isTrueAnswer: false },
        ],
        publishedAt: '2024-09-15',
        deleted: false,
        creationDate: '2024-09-15',
    },
]
