<template>
    <PageContainer>
        <PageHeader
            title="我的账户"
            description="卡片页示例：查看剩余额度、资源消耗与额度修改记录（Mock 数据）"
        />

        <Loading v-if="overviewLoading" text="账户信息加载中…" />
        <AccountOverviewCards v-else-if="overview" :overview="overview" />

        <div class="mt-10">
            <TableToolbar title="额度修改记录" :total="recordTotal" @refresh="handleRefreshRecords" />
            <QuotaChangeTable
                v-model:page="recordQuery.page"
                v-model:page-size="recordQuery.pageSize"
                :data="changeRecords"
                :loading="recordsLoading"
                :total="recordTotal"
            />
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
import { useAccountExample } from '@/composables/use-account-example'
import AccountOverviewCards from './components/account-overview-cards.vue'
import QuotaChangeTable from './components/quota-change-table.vue'

/**
 * 卡片页示例：账户概览卡片 + 额度修改记录（Mock）
 */
defineOptions({
    name: 'AccountPage',
})

const {
    overviewLoading,
    overview,
    recordsLoading,
    changeRecords,
    recordTotal,
    recordQuery,
    handleRefreshRecords,
} = useAccountExample()
</script>
