<template>
    <div class="flex flex-col items-center justify-center py-16">
        <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50">
            <el-icon :size="36" class="text-primary-300"><FolderOpened /></el-icon>
        </div>
        <p class="mt-4 text-sm text-slate-400">{{ description ?? '暂无数据' }}</p>
        <div v-if="$slots.default" class="mt-4">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue'

/**
 * 空状态：柔和插画风格占位
 */
defineProps<{
    description?: string
}>()
</script>
