import type { CallLogItem } from '@/types/example'
import { calcStandardInputTokens, formatVideoInputType, isVideoBilling, isVideoTokenBilling } from '@/utils/billing-label'

/**
 * 数字千分位
 */
export function formatNumber(value: number): string {
    return value.toLocaleString('zh-CN')
}

/**
 * 按计费模式生成用量多行文案
 */
export function formatUsageLines(row: CallLogItem): string[] {
    const billingMode = row.billingMode ?? row.billingType ?? 'text'

    if (isVideoBilling(billingMode)) {
        if (isVideoTokenBilling(billingMode, row.videoBillingMode)) {
            return [
                `总Token数：${formatNumber(row.videoTotalTokens ?? 0)}`,
                `输入类型：${formatVideoInputType(row.videoInputType)}`,
                `分辨率：${row.videoResolution || '—'}`,
            ]
        }
        return [
            `时长：${formatNumber(row.videoDuration ?? 0)} 秒`,
            `分辨率：${row.videoResolution || '—'}`,
        ]
    }

    if (billingMode === 'image') {
        return [
            `张数：${formatNumber(row.imageCount ?? 0)}`,
            `像素：${row.imageWidth && row.imageHeight ? `${row.imageWidth} × ${row.imageHeight}` : '—'}`,
            `分辨率：${row.imageResolution || '—'}`,
        ]
    }

    const lines = [
        `标准输入：${formatNumber(calcStandardInputTokens(row.inputTokens, row.cachedTokens, row.cacheCreationTokens))}`,
        `输出：${formatNumber(row.outputTokens ?? 0)}`,
    ]
    if (row.cachePriceEnabled)
        lines.push(`缓存命中：${formatNumber(row.cachedTokens ?? 0)}`)
    return lines
}

/**
 * 毫秒转秒展示（保留小数）
 */
export function formatDurationSeconds(ms: number, digits = 2): string {
    const seconds = (Number(ms) || 0) / 1000
    return seconds.toLocaleString('zh-CN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    })
}

/**
 * 金额数值（不含货币符号）
 */
export function formatPoints(value: number | null | undefined, digits = 4): string {
    const num = Number.isFinite(Number(value)) ? Number(value) : 0
    return num.toLocaleString('zh-CN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: digits,
    })
}

/**
 * 金额摘要：¥1,234.56
 */
export function formatMoney(value: number, digits = 2): string {
    const num = Number.isFinite(Number(value)) ? Number(value) : 0
    const formatted = num.toLocaleString('zh-CN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    })
    return `¥${formatted}`
}

/**
 * 大数缩写：1.2 万 / 3.4 亿
 */
export function formatCompact(value: number): string {
    if (value >= 1_0000_0000)
        return `${(value / 1_0000_0000).toFixed(2)} 亿`
    if (value >= 1_0000)
        return `${(value / 1_0000).toFixed(1)} 万`
    return formatNumber(value)
}

/**
 * 复制文本到剪贴板
 */
export async function copyText(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    }
    catch {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(textarea)
        return ok
    }
}

/**
 * 拆分调用时间为日期与时刻两行
 */
export function splitDateTime(time: string): { date: string, clock: string } {
    const [date = time, clock = ''] = time.split(' ')
    return { date, clock }
}

/**
 * 模拟请求延迟
 */
export function waitMock(ms = 280): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
