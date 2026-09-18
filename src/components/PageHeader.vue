<template>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div class="min-w-0">
            <h1 class="text-2xl font-semibold tracking-tight text-slate-900">{{ title }}</h1>
            <p v-if="description" class="mt-1.5 text-sm text-slate-500">{{ description }}</p>
        </div>
        <div v-if="$slots.actions" class="flex shrink-0 items-center gap-3">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 页面头：标题 + 描述；操作按钮放右侧
 */
defineProps<{
    title: string
    description?: string
}>()
</script>
