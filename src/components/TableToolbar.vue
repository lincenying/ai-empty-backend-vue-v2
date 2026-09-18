<template>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-baseline gap-2">
            <h3 v-if="title" class="text-base font-semibold text-slate-900">{{ title }}</h3>
            <span v-if="total !== undefined" class="text-xs text-slate-400">共 {{ total }} 条</span>
        </div>
        <div class="flex items-center gap-2">
            <slot />
            <el-tooltip content="刷新" placement="top">
                <el-button circle @click="emit('refresh')">
                    <el-icon><Refresh /></el-icon>
                </el-button>
            </el-tooltip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'

/**
 * 表格工具栏：左侧标题/统计，右侧操作按钮 + 刷新
 */
defineProps<{
    title?: string
    /** 数据总数（显示为副标题） */
    total?: number
}>()

const emit = defineEmits<{
    refresh: []
}>()
</script>
