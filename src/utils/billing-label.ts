/** 标准输入 Token 数说明（列表头 / 详情表头） */
export const STANDARD_INPUT_TOKEN_TIP = '标准输入 Token 数 = 输入 Token 数 - 缓存命中 Token 数 - 显式缓存创建 Token 数'

/**
 * 是否为视频计费
 */
export function isVideoBilling(billingType?: string | null): boolean {
    return billingType === 'video'
        || billingType === 'video_seconds'
        || billingType === 'video_tokens'
}

/**
 * 是否为视频 Token 计费
 */
export function isVideoTokenBilling(
    billingMode?: string | null,
    videoBillingMode?: string | null,
): boolean {
    if (billingMode === 'video_tokens')
        return true
    if (billingMode === 'video_seconds')
        return false
    return videoBillingMode === 'token' || videoBillingMode === 'tokens'
}

/**
 * 计费类型短文案（列表标签）
 */
export function formatBillingTypeLabel(
    billingType?: string | null,
    videoBillingMode?: string | null,
): string {
    if (billingType === 'image')
        return '图片'
    if (billingType === 'video_tokens')
        return '视频-Token'
    if (billingType === 'video_seconds')
        return '视频-秒数'
    if (billingType === 'video' || isVideoBilling(billingType))
        return isVideoTokenBilling(billingType, videoBillingMode) ? '视频-Token' : '视频-秒数'
    return '文本'
}

/**
 * 日志列表筛选：兼容 video / video_seconds / video_tokens
 */
export function matchLogBillingFilter(
    row: { billingMode?: string | null, billingType?: string | null, videoBillingMode?: string | null },
    filter?: string | null,
): boolean {
    if (!filter)
        return true
    const rowMode = row.billingMode ?? row.billingType
    if (filter === 'video_seconds' || filter === 'video-seconds')
        return isVideoBilling(rowMode) && !isVideoTokenBilling(rowMode, row.videoBillingMode)
    if (filter === 'video_tokens' || filter === 'video-token' || filter === 'video-tokens')
        return isVideoTokenBilling(rowMode, row.videoBillingMode)
    return rowMode === filter
}

/**
 * 计算标准输入 Token 数
 */
export function calcStandardInputTokens(
    inputTokens?: number | null,
    cachedTokens?: number | null,
    cacheCreationTokens?: number | null,
): number {
    const input = Number(inputTokens) || 0
    const cached = Number(cachedTokens) || 0
    const cacheCreation = Number(cacheCreationTokens) || 0
    return Math.max(0, input - cached - cacheCreation)
}

/**
 * 视频输入类型文案
 */
export function formatVideoInputType(type?: string | null): string {
    if (type === 'without_video')
        return '不含视频'
    if (type === 'with_video')
        return '含视频'
    return '—'
}
