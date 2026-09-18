<template>
    <span
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
        :class="config.cls"
    >
        <span class="h-1.5 w-1.5 rounded-full" :class="config.dot" />
        {{ text ?? config.label }}
    </span>
</template>

<script setup lang="ts">
import type { CommonStatus } from '@/types'

/**
 * 状态标签：带圆点的统一状态展示
 */
const props = defineProps<{
    /** 状态值，缺省或无效时展示未知状态 */
    status?: CommonStatus | null
    /** 自定义文案，缺省使用状态默认文案 */
    text?: string
}>()

const CONFIG: Record<CommonStatus, { label: string, dot: string, cls: string }> = {
    active: { label: '运行中', dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-600' },
    success: { label: '成功', dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-600' },
    inactive: { label: '已停用', dot: 'bg-slate-400', cls: 'bg-slate-100 text-slate-500' },
    pending: { label: '待处理', dot: 'bg-blue-500', cls: 'bg-blue-50 text-blue-600' },
    processing: { label: '处理中', dot: 'bg-blue-500', cls: 'bg-blue-50 text-blue-600' },
    warning: { label: '告警', dot: 'bg-amber-500', cls: 'bg-amber-50 text-amber-600' },
    error: { label: '异常', dot: 'bg-red-500', cls: 'bg-red-50 text-red-500' },
    failed: { label: '失败', dot: 'bg-red-500', cls: 'bg-red-50 text-red-500' },
}

const FALLBACK = { label: '未知', dot: 'bg-slate-300', cls: 'bg-slate-100 text-slate-400' }

const config = computed(() => {
    const status = props.status?.toLowerCase() as CommonStatus | undefined
    if (!status)
        return FALLBACK
    return CONFIG[status] ?? FALLBACK
})
</script>
