<template>
    <div class="flex flex-col items-center justify-center gap-3 py-16">
        <span
            class="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600"
        />
        <p class="text-sm text-slate-400">{{ text ?? '加载中…' }}</p>
    </div>
</template>

<script setup lang="ts">
/**
 * 加载状态：居中旋转指示器
 */
defineProps<{
    text?: string
}>()
</script>
