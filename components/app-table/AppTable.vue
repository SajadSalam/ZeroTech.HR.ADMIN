<script setup generic="T" lang="ts">
import { get, orderBy } from 'lodash-es'
import TableHeadersGenerator from './components/TableHeadersGenerator.vue'
import TableLoading from './components/TableLoading.vue'
import TableNoData from './components/TableNoData.vue'
import type { GenerateSlots, SortOrder, TableHeader } from './types'

interface Props {
    headers: TableHeader[]
    items: T[]
    isLoading?: boolean,
    hideNoData?: boolean,
    rowKey?: string,
    highlightedRows?: string[] | number[],
}
const props = defineProps<Props>()

// Local reactive state instead of global store
const localHeaders = ref<TableHeader[]>([])
const localData = ref<any[]>([])
const originalData = ref<any[]>([])
const localIsLoading = ref(false)
const sortStates = ref<{ key: string; order: SortOrder }[]>([])

// Initialize headers with defaults
const initializeHeaders = (newHeaders: TableHeader[]) => {
    localHeaders.value = newHeaders.map(header => ({
        ...header,
        visible: header.visible ?? true,
        sortable: header.sortable ?? false,
        sortOrder: header.sortOrder ?? null
    }))
}

// Initialize data
const initializeData = (newData: any[]) => {
    localData.value = newData
    originalData.value = newData
}

// Watch for prop changes
watch(() => props.items, (newItems) => {
    initializeData(newItems)
}, { immediate: true })

watch(() => props.headers, (newHeaders) => {
    initializeHeaders(newHeaders)
}, { immediate: true })

// Computed properties
const isLoading = computed(() => localIsLoading.value || props.isLoading)
const headers = computed(() => {
    return localHeaders.value.filter(header => header.visible !== false)
})
const data = computed(() => localData.value)

// Column visibility methods
const toggleColumnVisibility = (key: string) => {
    const header = localHeaders.value.find(h => h.key === key)
    if (header) {
        header.visible = !header.visible
    }
}

const setColumnVisibility = (key: string, visible: boolean) => {
    const header = localHeaders.value.find(h => h.key === key)
    if (header) {
        header.visible = visible
    }
}

// Sorting methods
const sortColumn = (key: string, order: SortOrder) => {
    // Reset all other headers' sort order
    localHeaders.value.forEach(header => {
        if (header.key !== key) {
            header.sortOrder = null
        } else {
            header.sortOrder = order
        }
    })

    if (!order) {
        localData.value = [...originalData.value]
        return
    }

    localData.value = orderBy(originalData.value, [key], [order])
}

const sortData = () => {
    const sortKeys = []
    const sortOrder = []
    for (const sortState of sortStates.value) {
        sortKeys.push(sortState.key)
        sortOrder.push(sortState.order)
    }
    localData.value = orderBy(originalData.value, sortKeys, sortOrder)
}

// Loading methods
const setLoading = (status: boolean) => {
    localIsLoading.value = status
}

const toggleLoading = () => {
    localIsLoading.value = !localIsLoading.value
}

const emits = defineEmits<{
    (e: 'row-clicked', item: T): void
}>()
const slots = useSlots()
const hasSlot = (name: string) => !!slots[name]
const headerSlots = computed(() => {
    return Object.keys(slots).filter((name) => name.startsWith('header-'))
})

const dataSlotsKeys = computed(() => {
    return Object.keys(slots).filter((name) => name.startsWith('data-'))
})

const slotName = (slot: string): keyof GenerateSlots<T> => {
    return slot as keyof GenerateSlots<T>
}

defineSlots<GenerateSlots<T>>()

const isRowHighlighted = (rowId: string) => {
    return props.highlightedRows?.includes(rowId)
}

// Register with AppCrud if available - moved after headers initialization
const registerAppTable = inject<((context: any) => void) | null>('registerAppTable', null)

// Create the table context object
const createTableContext = () => ({
    headers: readonly(localHeaders),
    toggleColumnVisibility,
    setColumnVisibility,
    sortColumn,
    sortData,
    setLoading,
    toggleLoading
})

// Provide table methods for descendant components (like TableColumnChooser)
provide('appTable', createTableContext())

// Register with AppCrud after headers are initialized
watchEffect(() => {
    if (registerAppTable && localHeaders.value.length > 0) {
        registerAppTable(createTableContext())
    }
})

// Expose methods for external use if needed
defineExpose({
    toggleColumnVisibility,
    setColumnVisibility,
    sortColumn,
    sortData,
    setLoading,
    toggleLoading,
    headers: readonly(localHeaders),
    data: readonly(localData)
})
</script>
<template>
    <div class="w-full h-full">
        <div class="overflow-x-auto">
            <table v-if="!isLoading" class="min-w-full">
                <TableHeadersGenerator class="w-full" :headers="headers">
                    <template v-for="headerSlot in headerSlots" #[headerSlot]>
                        <slot :name="slotName(headerSlot)" />
                    </template>
                </TableHeadersGenerator>
                <TairoTableRow v-if="hasSlot('before-data')">
                    <TairoTableCell>
                        <slot name="before-data" />
                    </TairoTableCell>
                </TairoTableRow>

                <tr
                    v-for="(item, index) in data" :id="`row-${item[rowKey as keyof T]}`"
                    :key="`row-${item[rowKey as keyof T]}`"
                    :class="{ 'row-higthlight': isRowHighlighted(item[rowKey as keyof T]) }"
                    @click="() => emits('row-clicked', item)">
                    <td v-for="header in headers" :key="`table-header-${header.key}`" spaced>
                        <span v-if="!hasSlot(`data-${header.key}`)">
                            {{
                                get(item, header.key)
                                    ? get(item, header.key)
                                    : '-'
                            }}
                        </span>
                        <slot v-else :name="slotName(`data-${header.key}`)" :item="item" :index="index" />
                    </td>
                </tr>
                <TableNoData v-if="data?.length == 0 && !isLoading && !hideNoData" :cols="headers.length" />
            </table>
            <table v-else class="min-w-full">
                <TableLoading :columns="headers.length" :rows="5" />
            </table>
        </div>
        <slot name="default" />
    </div>
</template>
<style lang="scss">
table {
    border-collapse: separate;
    border-spacing: 0;
    border-spacing: 0 4px;
    overflow-x: auto;
    th {
        background: #000;
        border-inline-end: 1px solid #fff;
        color: #fff;
        font-size: 14px;
        text-align: start !important;
        font-weight: bold;
        padding: 14px;
        white-space: nowrap;

        @media (max-width: 768px) {
            font-size: 12px;
            padding: 8px 6px;
        }

        @media (max-width: 480px) {
            font-size: 11px;
            padding: 6px 4px;
        }
    }

    th:first-child {
        border-start-start-radius: 8px;
    }

    th:last-child {
        border-start-end-radius: 8px;
    }

    tr {
        margin: 4rem;
        background: rgba(235, 240, 245, 0.65);
        overflow-x: auto;
    }

    // make tr striped
    tr:nth-child(even) {
        background: #FFFFFF;
    }

    td:first-child {
        border-start-start-radius: 8px;
        border-end-start-radius: 8px;
    }

    td:last-child {
        border-start-end-radius: 8px;
        border-end-end-radius: 8px;
    }

    td {
        color: #000;
        font-weight: 400;
        text-align: start;
        padding: .8rem;
        direction: auto;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        /* Prevent cell content wrapping */
        @media (max-width: 768px) {
            font-size: 12px;
            padding: 0.6rem 0.4rem;
        }

        @media (max-width: 480px) {
            font-size: 11px;
            padding: 0.5rem 0.3rem;
        }
    }

    .row-higthlight {

        font-size: 14px;
        text-align: center !important;
        font-weight: bold;

        td {
            overflow: hidden;
            border-top: 1px solid #0BCB14;
            border-bottom: 1px solid #0BCB14;
            background: rgba(198, 255, 167, 0.20) !important;
            border-top: 1px solid #0BCB14;
            border-bottom: 1px solid #0BCB14;
        }

        td:first-child {

            border-inline-start: 1px solid #0BCB14;
        }

        td:last-child {
            border-inline-end: 1px solid #0BCB14;
        }

        @media (max-width: 768px) {
            font-size: 12px;
        }

        @media (max-width: 480px) {
            font-size: 11px;
        }
    }
}
</style>
