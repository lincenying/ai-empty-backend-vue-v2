<template>
    <BaseDrawer v-model="visible" title="调用详情" size="720px" hide-footer>
        <div v-if="target" class="space-y-6">
            <div
                class="rounded-2xl p-5"
                :class="getCallStatusBannerClass(target.status)"
            >
                <div class="flex items-center justify-between">
                    <p class="text-base font-semibold text-slate-900">{{ target.model }}</p>
                    <StatusTag
                        :status="getCallStatusTagStatus(target.status)"
                        :text="getCallStatusText(target.status)"
                    />
                </div>
                <div class="mt-3 flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
                    <span class="shrink-0 text-xs text-slate-400">Trace ID</span>
                    <code class="min-w-0 flex-1 truncate font-mono text-xs text-slate-600">
                        {{ dash(target.traceId) }}
                    </code>
                    <el-tooltip v-if="target.traceId" content="复制 Trace ID" placement="top">
                        <el-button link size="small" @click="copyTraceId">
                            <el-icon class="text-slate-400 hover:text-primary-600"><CopyDocument /></el-icon>
                        </el-button>
                    </el-tooltip>
                </div>
            </div>

            <div class="rounded-2xl border border-slate-100 p-5">
                <p class="mb-3 text-sm font-semibold text-slate-900">基础信息</p>
                <KvTable :rows="basicRows" :columns="2" />
            </div>

            <div class="rounded-2xl border border-slate-100 p-5">
                <p class="mb-3 text-sm font-semibold text-slate-900">用量</p>
                <div class="whitespace-pre-line text-13px leading-relaxed text-slate-600">
                    {{ formatUsageLines(target).join('\n') }}
                </div>
            </div>

            <div v-if="isCallFailedStatus(target.status)" class="rounded-2xl border border-red-100 bg-red-50/50 p-5">
                <p class="mb-3 flex items-center gap-1.5 text-sm font-semibold text-red-600">
                    <el-icon><WarningFilled /></el-icon>异常信息
                </p>
                <el-descriptions :column="1" size="small">
                    <el-descriptions-item v-if="target.errorCode" label="错误码">
                        <el-tag type="danger" size="small">{{ target.errorCode }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="错误原因">
                        <span class="text-red-600">{{ dash(target.errorMessage) }}</span>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </div>
    </BaseDrawer>
</template>

<script setup lang="ts">
import type { IKvTableRow } from '@/components/KvTable.vue'
import type { CallLogItem } from '@/types/example'
import { CopyDocument, WarningFilled } from '@element-plus/icons-vue'
import { formatBillingTypeLabel } from '@/utils/billing-label'
import {
    getCallStatusBannerClass,
    getCallStatusTagStatus,
    getCallStatusText,
    isCallFailedStatus,
} from '@/utils/call-status'
import { showMsg } from '@/utils/element'
import { copyText, formatDurationSeconds, formatPoints, formatUsageLines } from '@/utils/format'

const props = defineProps<{
    target: CallLogItem | null
}>()

/**
 * 调用日志详情抽屉
 */
const visible = defineModel<boolean>({ default: false })

/**
 * 空值展示为 —
 */
function dash(value?: string | number | null): string {
    if (value === undefined || value === null || value === '')
        return '—'
    return String(value)
}

/** 基础信息键值表行 */
const basicRows = computed((): IKvTableRow[] => {
    const target = props.target
    if (!target)
        return []
    return [
        { key: 'traceId', label: 'Trace ID', value: dash(target.traceId), mono: true },
        { key: 'time', label: '调用时间', value: dash(target.time) },
        { key: 'apiKeyName', label: 'API Key名称', value: dash(target.apiKeyName) },
        { key: 'apiKeyValue', label: 'API Key值', value: dash(target.apiKeyValue), mono: true },
        { key: 'model', label: '使用模型', value: dash(target.model) },
        { key: 'status', label: '调用状态', value: getCallStatusText(target.status) },
        {
            key: 'duration',
            label: '请求耗时',
            value: `${formatDurationSeconds(target.duration)} 秒`,
            valueClass: target.duration > 10000 ? 'text-amber-600' : undefined,
        },
        {
            key: 'billingMode',
            label: '计费模式',
            value: formatBillingTypeLabel(target.billingMode ?? target.billingType, target.videoBillingMode),
        },
        { key: 'cost', label: '调用费用', value: `${formatPoints(target.cost, 4)} 元` },
    ]
})

/**
 * 复制 Trace ID
 */
async function copyTraceId(): Promise<void> {
    if (!props.target?.traceId)
        return
    const ok = await copyText(props.target.traceId)
    ok ? showMsg({ content: 'Trace ID 已复制', type: 'success' }) : showMsg({ content: '复制失败', type: 'error' })
}
</script>
