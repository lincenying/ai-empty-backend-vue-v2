<template>
    <aside class="flex h-full flex-col bg-white">
        <el-scrollbar class="sidebar-scrollbar flex-1 px-3 pt-3">
            <el-menu
                :default-active="activePath"
                :collapse="collapsed"
                :collapse-transition="false"
                popper-class="sidebar-menu-popup"
                class="sidebar-menu"
                @select="handleSelect"
            >
                <template v-for="group in groups" :key="group.label">
                    <p
                        v-if="!collapsed"
                        class="mb-1.5 mt-4 px-3 text-11px font-medium uppercase tracking-wider text-slate-400 first:mt-1"
                    >
                        {{ group.label }}
                    </p>
                    <div v-else class="mx-3 my-3 border-t border-slate-100" />

                    <template v-for="entry in group.items" :key="entry.type === 'submenu' ? entry.key : entry.path">
                        <el-sub-menu v-if="entry.type === 'submenu'" :index="entry.key">
                            <template #title>
                                <el-icon><component :is="entry.icon" /></el-icon>
                                <span>{{ entry.title }}</span>
                            </template>
                            <el-menu-item
                                v-for="child in entry.children"
                                :key="child.path"
                                :index="child.path"
                            >
                                <el-icon><component :is="child.icon" /></el-icon>
                                <template #title>{{ child.title }}</template>
                            </el-menu-item>
                        </el-sub-menu>
                        <el-menu-item v-else :index="entry.path">
                            <el-icon><component :is="entry.icon" /></el-icon>
                            <template #title>{{ entry.title }}</template>
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
        </el-scrollbar>

        <div v-if="!collapsed" class="shrink-0 px-5 py-4">
            <div class="rounded-xl bg-primary-50 px-4 py-3">
                <p class="text-xs font-medium text-primary-700">经营驾驶舱 v1.0.0</p>
                <p class="mt-0.5 text-11px text-primary-400">客户中心与模型中心</p>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores/use-app-store'

/**
 * 控制台二级导航：按路由 meta 生成菜单
 */
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const collapsed = computed(() => !appStore.isMobile && appStore.sidebarCollapsed)
const activePath = computed(() => route.path)

interface MenuLeaf {
    type: 'item'
    path: string
    title: string
    icon: string
}

interface MenuSub {
    type: 'submenu'
    key: string
    title: string
    icon: string
    children: MenuLeaf[]
}

type MenuEntry = MenuLeaf | MenuSub

interface MenuGroup {
    label: string
    items: MenuEntry[]
}

/**
 * 将路由 path 规范为以 / 开头
 */
function resolveMenuPath(path: string): string {
    return path.startsWith('/') ? path : `/${path}`
}

/**
 * 将业务路由转为菜单叶子节点
 */
function toMenuLeaf(item: RouteRecordRaw): MenuLeaf {
    return {
        type: 'item',
        path: resolveMenuPath(item.path),
        title: String(item.meta?.title ?? ''),
        icon: String(item.meta?.icon ?? 'Menu'),
    }
}

/**
 * 按 meta.group 分区，并将 meta.parent 聚合为子菜单（保持路由定义顺序）
 */
function buildMenuGroups(routes: RouteRecordRaw[]): MenuGroup[] {
    const result: MenuGroup[] = []
    for (const item of routes) {
        const label = item.meta?.group ?? '其他'
        let group = result.find(g => g.label === label)
        if (!group) {
            group = { label, items: [] }
            result.push(group)
        }

        const leaf = toMenuLeaf(item)
        const parent = item.meta?.parent
        if (!parent) {
            group.items.push(leaf)
            continue
        }

        let sub = group.items.find(
            (entry): entry is MenuSub => entry.type === 'submenu' && entry.key === parent.key,
        )
        if (!sub) {
            sub = {
                type: 'submenu',
                key: parent.key,
                title: parent.title,
                icon: parent.icon ?? 'Menu',
                children: [],
            }
            group.items.push(sub)
        }
        sub.children.push(leaf)
    }
    return result
}

const groups = computed<MenuGroup[]>(() => {
    const menuRoutes = router.getRoutes().filter(item => item.meta?.title && !item.meta?.hidden)
    return buildMenuGroups(menuRoutes)
})

/**
 * 选择菜单项并关闭移动端抽屉
 */
function handleSelect(path: string): void {
    router.push(path)
    appStore.closeMobileMenu()
}
</script>

<style scoped>
.sidebar-menu {
    --el-menu-bg-color: transparent;
    --el-menu-text-color: #64748b;
    --el-menu-active-color: #2563eb;
    --el-menu-hover-bg-color: #f1f5fb;
    --el-menu-item-height: 44px;
    --el-menu-sub-item-height: 44px;

    border-right: none;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
    margin-bottom: 4px;
    font-weight: 500;
    border-radius: 10px;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
    color: #2563eb;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.sidebar-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: #2563eb;
}

.sidebar-menu :deep(.el-sub-menu .el-menu) {
    background: transparent;
}

.sidebar-menu.el-menu--collapse :deep(.el-menu-item),
.sidebar-menu.el-menu--collapse :deep(.el-sub-menu__title) {
    display: flex;
    justify-content: center;
}
</style>

<style>
.sidebar-menu-popup.el-menu--popup {
    --el-menu-text-color: #64748b;
    --el-menu-active-color: #2563eb;
    --el-menu-hover-bg-color: #f1f5fb;
    --el-menu-item-height: 44px;
}

.sidebar-menu-popup .el-menu-item {
    margin-bottom: 4px;
    font-weight: 500;
    border-radius: 10px;
}

.sidebar-menu-popup .el-menu-item.is-active {
    color: #2563eb;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}
</style>
