import type { AccountOverview, QuotaChangeRecord } from '@/types/example'
import { queryMockAccountOverview, queryMockQuotaRecords } from '@/mock/account'
import { showMsg } from '@/utils/element'

/**
 * 账户示例页：Mock 概览卡片与额度修改记录
 */
export function useAccountExample() {
    const overviewLoading = shallowRef(true)
    const overview = ref<AccountOverview | null>(null)
    const recordsLoading = shallowRef(false)
    const changeRecords = ref<QuotaChangeRecord[]>([])
    const recordTotal = shallowRef(0)
    const recordQuery = reactive({
        page: 1,
        pageSize: 10,
    })

    /**
     * 加载账户概览
     */
    async function loadOverview(): Promise<void> {
        overviewLoading.value = true
        try {
            overview.value = await queryMockAccountOverview()
        }
        finally {
            overviewLoading.value = false
        }
    }

    /**
     * 加载额度修改记录
     */
    async function loadRecords(): Promise<void> {
        recordsLoading.value = true
        try {
            const result = await queryMockQuotaRecords(recordQuery.page, recordQuery.pageSize)
            changeRecords.value = result.list
            recordTotal.value = result.total
        }
        finally {
            recordsLoading.value = false
        }
    }

    /**
     * 刷新额度修改记录
     */
    function handleRefreshRecords(): void {
        loadRecords()
        showMsg({ content: '已刷新', type: 'success' })
    }

    watch(
        () => [recordQuery.page, recordQuery.pageSize],
        () => loadRecords(),
    )

    onMounted(() => {
        loadOverview()
        loadRecords()
    })

    return {
        overviewLoading,
        overview,
        recordsLoading,
        changeRecords,
        recordTotal,
        recordQuery,
        handleRefreshRecords,
    }
}
