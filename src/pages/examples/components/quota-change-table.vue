<template>
    <BaseTable
        v-model:page="page"
        v-model:page-size="pageSize"
        :columns="columns"
        :data="data"
        :loading="loading"
        :total="total"
    >
        <template #time="{ row }">
            <span class="font-mono text-13px text-slate-600">{{ row.time }}</span>
        </template>
        <template #beforeQuota="{ row }">{{ quotaText(row.beforeQuota) }}</template>
        <template #afterQuota="{ row }">
            <span class="font-medium text-slate-900">{{ quotaText(row.afterQuota) }}</span>
        </template>
    </BaseTable>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/types'
import type { QuotaChangeRecord } from '@/types/example'
import { formatPoints } from '@/utils/format'

defineProps<{
    data: QuotaChangeRecord[]
    loading: boolean
    total: number
}>()

const page = defineModel<number>('page', { required: true })
const pageSize = defineModel<number>('pageSize', { required: true })

/**
 * 额度展示：null 为不限
 */
function quotaText(value: number | null): string {
    return value === null ? '不限' : formatPoints(value)
}

const columns: TableColumn[] = [
    { prop: 'time', label: '调整时间', width: 180 },
    { prop: 'operatorName', label: '调整人', minWidth: 120 },
    { prop: 'beforeQuota', label: '调整前额度', width: 130, align: 'right' },
    { prop: 'afterQuota', label: '调整后额度', width: 130, align: 'right' },
    { prop: 'reason', label: '调整原因', minWidth: 200, showOverflowTooltip: true },
]
</script>
