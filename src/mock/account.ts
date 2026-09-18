import type { PageResult } from '@/types'
import type { AccountOverview, QuotaChangeRecord } from '@/types/example'
import { waitMock } from '@/utils/format'

export const MOCK_ACCOUNT_OVERVIEW: AccountOverview = {
    quota: 5000,
    userConsumed: 1864.32,
    remainingQuota: 3135.68,
    inputTokens: 1286400,
    outputTokens: 412800,
    totalTokens: 1699200,
    totalRequests: 1286,
    successRequests: 1214,
    failedRequests: 72,
}

const MOCK_QUOTA_RECORDS: QuotaChangeRecord[] = [
    {
        id: 'q1',
        time: '2026-09-16 14:22:08',
        operatorName: '王管理',
        type: 'increase',
        beforeQuota: 3000,
        afterQuota: 5000,
        reason: 'Q3 业务扩容，上调个人额度',
    },
    {
        id: 'q2',
        time: '2026-08-20 10:05:41',
        operatorName: '李财务',
        type: 'set',
        beforeQuota: 2000,
        afterQuota: 3000,
        reason: '季度例行额度校准',
    },
    {
        id: 'q3',
        time: '2026-07-08 16:48:19',
        operatorName: '王管理',
        type: 'decrease',
        beforeQuota: 4000,
        afterQuota: 2000,
        reason: '项目阶段性结束后回收额度',
    },
    {
        id: 'q4',
        time: '2026-06-12 09:31:02',
        operatorName: '系统',
        type: 'set',
        beforeQuota: null,
        afterQuota: 4000,
        reason: '由不限额调整为固定额度',
    },
    {
        id: 'q5',
        time: '2026-05-18 11:16:55',
        operatorName: '李财务',
        type: 'increase',
        beforeQuota: 1000,
        afterQuota: null,
        reason: '试点期间临时取消额度上限',
    },
    {
        id: 'q6',
        time: '2026-04-02 15:40:27',
        operatorName: '王管理',
        type: 'set',
        beforeQuota: 500,
        afterQuota: 1000,
        reason: '开通正式账号，初始化额度',
    },
    {
        id: 'q7',
        time: '2026-03-21 08:12:44',
        operatorName: '系统',
        type: 'set',
        beforeQuota: 0,
        afterQuota: 500,
        reason: '试用账号开通',
    },
    {
        id: 'q8',
        time: '2026-03-10 19:08:13',
        operatorName: '李财务',
        type: 'cancel',
        beforeQuota: 200,
        afterQuota: 0,
        reason: '试用到期，额度清零',
    },
    {
        id: 'q9',
        time: '2026-02-26 13:55:30',
        operatorName: '王管理',
        type: 'increase',
        beforeQuota: 100,
        afterQuota: 200,
        reason: '补发试用额度',
    },
    {
        id: 'q10',
        time: '2026-02-14 09:20:06',
        operatorName: '系统',
        type: 'set',
        beforeQuota: null,
        afterQuota: 100,
        reason: '账号创建默认额度',
    },
    {
        id: 'q11',
        time: '2026-01-28 17:43:51',
        operatorName: '李财务',
        type: 'decrease',
        beforeQuota: 300,
        afterQuota: 100,
        reason: '异常消耗复核后下调',
    },
    {
        id: 'q12',
        time: '2026-01-08 10:02:18',
        operatorName: '王管理',
        type: 'set',
        beforeQuota: 0,
        afterQuota: 300,
        reason: '内部测试额度发放',
    },
]

/**
 * 查询 Mock 额度修改记录
 */
export async function queryMockQuotaRecords(page: number, pageSize: number): Promise<PageResult<QuotaChangeRecord>> {
    await waitMock()
    const start = (page - 1) * pageSize
    return {
        list: MOCK_QUOTA_RECORDS.slice(start, start + pageSize),
        total: MOCK_QUOTA_RECORDS.length,
        page,
        pageSize,
    }
}

/**
 * 查询 Mock 账户概览
 */
export async function queryMockAccountOverview(): Promise<AccountOverview> {
    await waitMock(360)
    return { ...MOCK_ACCOUNT_OVERVIEW }
}
