import type { CallBillingType, CallLogItem, CallLogQuery } from '@/types/example'
import { MOCK_CALL_LOG_MODELS, queryMockCallLogs } from '@/mock/call-log'
import { showMsg } from '@/utils/element'

/**
 * 调用日志示例页：Mock 列表查询、筛选与详情
 */
export function useCallLogExample() {
    const billingFilter = shallowRef('')
    const loading = shallowRef(false)
    const list = ref<CallLogItem[]>([])
    const total = shallowRef(0)
    const modelOptions = MOCK_CALL_LOG_MODELS
    const detailVisible = shallowRef(false)
    const currentRow = ref<CallLogItem | null>(null)

    const query = reactive<CallLogQuery>({
        page: 1,
        pageSize: 10,
        keyword: '',
        model: '',
        billingMode: '',
        videoBillingMode: '',
        status: '',
        range: null,
    })

    /**
     * 计费筛选变更：视频映射为 video_seconds / video_tokens
     */
    function handleBillingFilterChange(value?: string | null): void {
        if (value === 'video-seconds') {
            query.billingMode = 'video_seconds'
            query.videoBillingMode = 'seconds'
            return
        }
        if (value === 'video-token') {
            query.billingMode = 'video_tokens'
            query.videoBillingMode = 'token'
            return
        }
        query.billingMode = (value as CallBillingType | '') || ''
        query.videoBillingMode = ''
    }

    /**
     * 加载调用日志列表
     */
    async function loadList(): Promise<void> {
        loading.value = true
        try {
            const result = await queryMockCallLogs({ ...query })
            list.value = result.list
            total.value = result.total
        }
        finally {
            loading.value = false
        }
    }

    /**
     * 从第一页重新查询；若已在第一页则直接拉取
     */
    function reloadFromFirstPage(): void {
        if (query.page === 1) {
            loadList()
            return
        }
        query.page = 1
    }

    /**
     * 按当前筛选条件查询
     */
    function handleSearch(): void {
        reloadFromFirstPage()
    }

    /**
     * 清空筛选并重新查询
     */
    function handleReset(): void {
        query.keyword = ''
        query.model = ''
        query.billingMode = ''
        query.videoBillingMode = ''
        billingFilter.value = ''
        query.status = ''
        query.range = null
        reloadFromFirstPage()
    }

    /**
     * 刷新当前页
     */
    function handleRefresh(): void {
        loadList()
        showMsg({ content: '已刷新', type: 'success' })
    }

    /**
     * 打开调用详情
     */
    function openDetail(row: CallLogItem): void {
        currentRow.value = row
        detailVisible.value = true
    }

    watch(
        () => [query.page, query.pageSize],
        () => loadList(),
    )

    onMounted(() => {
        loadList()
    })

    return {
        query,
        billingFilter,
        loading,
        list,
        total,
        modelOptions,
        detailVisible,
        currentRow,
        handleBillingFilterChange,
        handleSearch,
        handleReset,
        handleRefresh,
        openDetail,
    }
}
