<template>
    <BaseTable
        v-model:page="page"
        v-model:page-size="pageSize"
        :columns="columns"
        :data="data"
        :loading="loading"
        :total="total"
        @row-click="(row: CallLogItem) => emit('detail', row)"
    >
        <template #header-apiKeyName>
            <div class="leading-tight">
                <p>API Key名称</p>
                <p class="text-12px text-slate-400">（API Key值）</p>
            </div>
        </template>
        <template #header-usage>
            <div class="inline-flex items-center gap-4px leading-tight">
                <div>
                    <p>用量</p>
                    <p class="text-12px text-slate-400">单位: Token</p>
                </div>
                <el-tooltip :content="STANDARD_INPUT_TOKEN_TIP" placement="top">
                    <el-icon class="cursor-help text-slate-400" :size="14">
                        <QuestionFilled />
                    </el-icon>
                </el-tooltip>
            </div>
        </template>

        <template #traceId="{ row }">
            <span class="font-mono text-12px text-slate-600" :title="row.traceId">
                {{ row.traceId || '—' }}
            </span>
        </template>

        <template #time="{ row }">
            <div class="font-mono text-13px text-slate-600 leading-tight">
                <p>{{ splitDateTime(row.time).date }}</p>
                <p class="text-slate-400">{{ splitDateTime(row.time).clock }}</p>
            </div>
        </template>

        <template #apiKeyName="{ row }">
            <div class="min-w-0 leading-tight">
                <p class="truncate text-13px text-slate-700">{{ row.apiKeyName || '—' }}</p>
                <p class="truncate font-mono text-xs text-slate-400" :title="row.apiKeyValue">
                    {{ row.apiKeyValue || '—' }}
                </p>
            </div>
        </template>

        <template #model="{ row }">
            <el-tag size="small" type="info" class="!max-w-full !bg-slate-100 !text-slate-600">
                <span class="block truncate" :title="row.model">{{ row.model }}</span>
            </el-tag>
        </template>

        <template #status="{ row }">
            <StatusTag :status="getCallStatusTagStatus(row.status)" :text="getCallStatusText(row.status)" />
        </template>

        <template #duration="{ row }">
            <span :class="row.duration > 10000 ? 'text-amber-600' : 'text-slate-700'">
                {{ formatDurationSeconds(row.duration) }} 秒
            </span>
        </template>

        <template #billingMode="{ row }">
            <el-tag size="small" effect="light">
                {{ formatBillingTypeLabel(row.billingMode ?? row.billingType, row.videoBillingMode) }}
            </el-tag>
        </template>

        <template #usage="{ row }">
            <div class="whitespace-pre-line text-12px leading-relaxed text-slate-600">
                {{ formatUsageLines(row).join('\n') }}
            </div>
        </template>

        <template #cost="{ row }">
            <span :class="row.cost > 0 ? 'text-slate-900' : 'text-slate-400'">
                {{ formatPoints(row.cost, 4) }}
            </span>
        </template>

        <template #actions="{ row }">
            <el-button link type="primary" size="small" @click.stop="emit('detail', row)">详情</el-button>
        </template>
    </BaseTable>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/types'
import type { CallLogItem } from '@/types/example'
import { QuestionFilled } from '@element-plus/icons-vue'
import { formatBillingTypeLabel, STANDARD_INPUT_TOKEN_TIP } from '@/utils/billing-label'
import { getCallStatusTagStatus, getCallStatusText } from '@/utils/call-status'
import { formatDurationSeconds, formatPoints, formatUsageLines, splitDateTime } from '@/utils/format'

defineProps<{
    data: CallLogItem[]
    loading: boolean
    total: number
}>()

const emit = defineEmits<{
    detail: [row: CallLogItem]
}>()

const page = defineModel<number>('page', { required: true })
const pageSize = defineModel<number>('pageSize', { required: true })

/**
 * 调用日志表格列
 */
const columns: TableColumn[] = [
    { prop: 'traceId', label: 'Trace ID', minWidth: 160, showOverflowTooltip: true },
    { prop: 'time', label: '调用时间', width: 120 },
    { prop: 'apiKeyName', label: 'API Key名称', minWidth: 140, showOverflowTooltip: true },
    { prop: 'model', label: '使用模型', minWidth: 160, showOverflowTooltip: true },
    { prop: 'status', label: '调用状态', width: 110 },
    { prop: 'duration', label: '请求耗时', width: 100, align: 'right' },
    { prop: 'billingMode', label: '计费模式', width: 110 },
    { prop: 'usage', label: '用量', width: 140 },
    { prop: 'cost', label: '调用费用（元）', width: 125, align: 'right' },
    { prop: 'actions', label: '操作', width: 75, fixed: 'right' },
]
</script>
