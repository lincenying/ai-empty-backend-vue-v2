<template>
    <nav class="flex items-center gap-1">
        <template v-for="item in navItems" :key="item.label">
            <a
                v-if="item.external"
                :href="item.path"
                target="_blank"
                rel="noopener noreferrer"
                :class="[navLinkClass, navLinkIdleClass]"
            >
                {{ item.label }}
            </a>
            <RouterLink
                v-else
                :to="item.path"
                :class="[
                    navLinkClass,
                    item.match(route.path) ? 'bg-primary-50 text-primary-600' : navLinkIdleClass,
                ]"
            >
                {{ item.label }}
            </RouterLink>
        </template>
    </nav>
</template>

<script setup lang="ts">
/**
 * 驾驶舱一级导航
 */
const route = useRoute()

const navLinkClass = 'rounded-full px-4 py-1.5 text-sm font-medium transition-colors'
const navLinkIdleClass = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'

interface InternalNavItem {
    label: string
    path: string
    external?: false
    match: (path: string) => boolean
}

interface ExternalNavItem {
    label: string
    path: string
    external: true
}

type NavItem = InternalNavItem | ExternalNavItem

const navItems: NavItem[] = [
    {
        label: '驾驶舱',
        path: '/blank',
        match: (path: string) => path === '/' || path.startsWith('/blank'),
    },
    {
        label: '天宽云',
        path: 'https://tokens.tiankuan.com/#/',
        external: true,
    },
]
</script>
