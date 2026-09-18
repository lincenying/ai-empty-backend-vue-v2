<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/blank' }">驾驶舱</el-breadcrumb-item>
        <el-breadcrumb-item v-for="crumb in crumbs" :key="crumb.key">
            {{ crumb.title }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
/**
 * 面包屑：根据当前路由 matched 链自动生成
 */
const route = useRoute()

const crumbs = computed(() => {
    const items: Array<{ key: string, title: string }> = []
    for (const record of route.matched) {
        if (!record.meta?.title)
            continue
        const parent = record.meta.parent
        if (parent?.title && !items.some(item => item.key === parent.key))
            items.push({ key: parent.key, title: parent.title })
        items.push({ key: record.path || '/', title: record.meta.title })
    }
    return items
})
</script>
