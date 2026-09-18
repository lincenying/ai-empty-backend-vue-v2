<template>
    <div
        class="mb-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card"
        :class="nowrap ? 'flex-nowrap overflow-x-auto' : 'flex-wrap'"
    >
        <el-input
            v-model="keyword"
            :placeholder="placeholder ?? '请输入关键词搜索'"
            clearable
            class="!w-64 shrink-0"
            @keyup.enter="handleSearch"
            @clear="handleReset"
        >
            <template #prefix>
                <el-icon><Search /></el-icon>
            </template>
        </el-input>

        <slot />

        <div class="ml-auto flex shrink-0 items-center gap-2">
            <el-button :loading="loading" type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

defineProps<{
    placeholder?: string
    loading?: boolean
    /** 筛选项与按钮保持单行，内容过宽时横向滚动 */
    nowrap?: boolean
}>()

const emit = defineEmits<{
    search: [keyword: string]
    reset: []
}>()

/**
 * 搜索栏：关键词 + 筛选项 + 查询/重置
 */
const keyword = defineModel<string>({ default: '' })

/**
 * 触发查询
 */
function handleSearch(): void {
    emit('search', keyword.value)
}

/**
 * 清空关键词并重置
 */
function handleReset(): void {
    keyword.value = ''
    emit('reset')
}
</script>
