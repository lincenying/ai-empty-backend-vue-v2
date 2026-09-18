<template>
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div
            class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover lg:col-span-5"
        >
            <div class="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
            <p class="relative text-sm font-medium text-blue-100">累计调用费用</p>
            <p class="relative mt-2 text-3xl font-semibold tracking-tight tabular-nums">
                {{ formatMoney(consumed) }}
            </p>
            <div v-if="hasQuota" class="relative mt-3">
                <div class="h-2 overflow-hidden rounded-full bg-white/20">
                    <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="progressHigh ? 'bg-amber-300' : 'bg-white'"
                        :style="{ width: `${progressPercent}%` }"
                    />
                </div>
                <div class="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-100">
                    <span>
                        剩余 {{ formatMoney(remaining) }} /
                        用户额度 {{ formatMoney(totalQuota) }}
                    </span>
                    <span class="font-medium text-white">{{ progressPercent }}%</span>
                </div>
            </div>
            <p v-else class="relative mt-3 text-xs leading-5 text-blue-100">
                未设置用户额度上限，仅受企业余额限制
            </p>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
            <div
                class="rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
                <p class="text-sm font-medium text-slate-500">累计消耗 Token</p>
                <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                    {{ formatCompact(overview.totalTokens) }}
                </p>
                <p class="mt-3 text-xs text-slate-400">
                    输入 {{ formatCompact(overview.inputTokens) }} · 输出 {{ formatCompact(overview.outputTokens) }}
                </p>
            </div>

            <div
                class="rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
                <p class="text-sm font-medium text-slate-500">累计请求次数</p>
                <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                    {{ formatNumber(overview.totalRequests) }}
                </p>
                <p class="mt-3 text-xs text-slate-400">
                    成功 {{ formatNumber(overview.successRequests) }} · 失败
                    {{ formatNumber(overview.failedRequests) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AccountOverview } from '@/types/example'
import { formatCompact, formatMoney, formatNumber } from '@/utils/format'

const props = defineProps<{
    overview: AccountOverview
}>()

/**
 * 账户概览卡片：累计费用 / Token / 请求次数
 */
const hasQuota = computed(() => props.overview.quota != null)
const remaining = computed(() => props.overview.remainingQuota ?? 0)
const totalQuota = computed(() => props.overview.quota ?? 0)
const consumed = computed(() => props.overview.userConsumed)
const progressPercent = computed(() => {
    if (!hasQuota.value || !totalQuota.value || totalQuota.value <= 0)
        return 0
    return Math.min(100, Math.round((consumed.value / totalQuota.value) * 1000) / 10)
})
const progressHigh = computed(() => progressPercent.value >= 85)
</script>
