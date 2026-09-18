<template>
    <PageContainer>
        <PageHeader
            title="调用日志"
            description="表格页示例：支持按 Trace ID、API Key、模型、状态与计费模式筛选（Mock 数据）"
        />

        <SearchBar
            v-model="query.keyword"
            placeholder="搜索 Trace ID / API Key名称 / API Key值"
            nowrap
            :loading="loading"
            @search="handleSearch"
            @reset="handleReset"
        >
            <el-date-picker
                v-model="query.range"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                class="shrink-0"
            />
            <el-select v-model="query.model" placeholder="模型" clearable filterable class="!w-52">
                <el-option
                    v-for="model in modelOptions"
                    :key="model.id"
                    :label="model.name"
                    :value="model.name"
                />
            </el-select>
            <el-select v-model="query.status" placeholder="调用状态" clearable class="!w-32">
                <el-option label="成功" value="success" />
                <el-option label="失败" value="failed" />
                <el-option label="处理中" value="processing" />
            </el-select>
            <el-select
                v-model="billingFilter"
                placeholder="计费模式"
                clearable
                class="!w-36"
                @change="handleBillingFilterChange"
            >
                <el-option label="文本" value="text" />
                <el-option label="图片" value="image" />
                <el-option label="视频-秒数" value="video-seconds" />
                <el-option label="视频-Token" value="video-token" />
            </el-select>
        </SearchBar>

        <TableToolbar title="调用记录" :total="total" @refresh="handleRefresh" />

        <CallLogTable
            v-model:page="query.page"
            v-model:page-size="query.pageSize"
            :data="list"
            :loading="loading"
            :total="total"
            @detail="openDetail"
        />

        <CallLogDetailDrawer v-model="detailVisible" :target="currentRow" />
    </PageContainer>
</template>

<script setup lang="ts">
import { useCallLogExample } from '@/composables/use-call-log-example'
import CallLogDetailDrawer from './components/call-log-detail-drawer.vue'
import CallLogTable from './components/call-log-table.vue'

/**
 * 表格页示例：调用日志列表 + 筛选 + 详情抽屉（Mock）
 */
defineOptions({
    name: 'CallLogPage',
})

const {
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
} = useCallLogExample()
</script>
