<template>
    <div class="px-6 py-6 lg:px-8" :class="narrow ? 'mx-auto max-w-7xl' : 'mx-auto w-full'">
        <slot />
    </div>
</template>

<script setup lang="ts">
/**
 * 页面容器：统一页面留白与最大宽度
 */
defineProps<{
    /** 是否收窄内容最大宽度 */
    narrow?: boolean
}>()
</script>
