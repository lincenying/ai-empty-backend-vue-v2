import type { CommonStatus } from '@/types'

export type CallStatusTone = 'success' | 'processing' | 'failed'

/**
 * 将调用状态规范为成功 / 处理中 / 失败
 */
export function getCallStatusTone(status?: string | null): CallStatusTone {
    const key = (status ?? '').toLowerCase()
    if (key === 'success')
        return 'success'
    if (key === 'processing' || key === 'pending')
        return 'processing'
    return 'failed'
}

/**
 * 调用状态展示文案
 */
export function getCallStatusText(status?: string | null): string {
    const tone = getCallStatusTone(status)
    if (tone === 'success')
        return '成功'
    if (tone === 'processing')
        return '处理中'
    return '失败'
}

/**
 * 映射为 StatusTag 可用的通用状态
 */
export function getCallStatusTagStatus(status?: string | null): CommonStatus {
    const tone = getCallStatusTone(status)
    if (tone === 'success')
        return 'success'
    if (tone === 'processing')
        return 'processing'
    return 'failed'
}

/**
 * 详情头背景色
 */
export function getCallStatusBannerClass(status?: string | null): string {
    const tone = getCallStatusTone(status)
    if (tone === 'success')
        return 'bg-emerald-50'
    if (tone === 'processing')
        return 'bg-blue-50'
    return 'bg-red-50'
}

/**
 * 是否为失败状态
 */
export function isCallFailedStatus(status?: string | null): boolean {
    return getCallStatusTone(status) === 'failed'
}
