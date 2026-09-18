/** 调用状态 */
export type CallStatus = 'success' | 'failed' | 'processing'

/** 调用计费类型 */
export type CallBillingType = 'text' | 'image' | 'video'

/** 日志计费模式（视频拆秒数 / Token） */
export type CallLogBillingMode = CallBillingType | 'video_seconds' | 'video_tokens'

/** 日志搜索模型筛选项 */
export interface CallLogModelOption {
    id: string
    name: string
}

/** 调用日志（示例页精简字段） */
export interface CallLogItem {
    id: string
    traceId: string
    time: string
    apiKeyName: string
    apiKeyValue: string
    model: string
    status: CallStatus
    billingType: CallBillingType
    billingMode: CallLogBillingMode
    videoBillingMode?: 'seconds' | 'token'
    videoResolution?: string
    videoDuration?: number
    videoTotalTokens?: number
    videoInputType?: 'with_video' | 'without_video'
    inputTokens?: number
    outputTokens?: number
    cachedTokens?: number
    cacheCreationTokens?: number
    cachePriceEnabled?: boolean
    imageCount?: number
    imageWidth?: number
    imageHeight?: number
    imageResolution?: string
    cost: number
    duration: number
    errorCode?: string
    errorMessage?: string
}

/** 调用日志查询 */
export interface CallLogQuery {
    page: number
    pageSize: number
    keyword: string
    model: string
    status: CallStatus | ''
    billingMode: CallLogBillingMode | ''
    videoBillingMode: 'seconds' | 'token' | ''
    range: [string, string] | null
}

/** 账户概览 */
export interface AccountOverview {
    quota: number | null
    userConsumed: number
    remainingQuota: number | null
    inputTokens: number
    outputTokens: number
    totalTokens: number
    totalRequests: number
    successRequests: number
    failedRequests: number
}

/** 额度调整类型 */
export type QuotaAdjustType = 'set' | 'increase' | 'decrease' | 'cancel'

/** 额度修改记录 */
export interface QuotaChangeRecord {
    id: string
    time: string
    operatorName: string
    type: QuotaAdjustType
    beforeQuota: number | null
    afterQuota: number | null
    reason: string
}
