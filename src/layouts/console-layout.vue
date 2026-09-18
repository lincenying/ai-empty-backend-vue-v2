<template>
    <div class="flex h-full flex-col overflow-hidden bg-hex-f8fafd">
        <PortalHeader />

        <div class="flex min-h-0 flex-1 overflow-hidden pt-16">
            <div
                v-if="!appStore.isMobile"
                class="h-full shrink-0 border-r border-slate-100 bg-white transition-[width] duration-200 ease-in-out"
                :style="{ width: sidebarWidth }"
            >
                <SidebarMenu />
            </div>

            <el-drawer
                v-if="appStore.isMobile"
                :model-value="appStore.mobileMenuOpen"
                direction="ltr"
                :size="264"
                :z-index="40"
                :with-header="false"
                class="rounded-r-2xl"
                @close="appStore.closeMobileMenu()"
            >
                <div class="console-drawer-body -m-5 pt-16">
                    <SidebarMenu />
                </div>
            </el-drawer>

            <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <div class="flex h-12 shrink-0 items-center gap-3 border-b border-slate-100 bg-white px-5 lg:px-8">
                    <button
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
                        aria-label="切换控制台菜单"
                        @click="appStore.toggleSidebar()"
                    >
                        <el-icon :size="18">
                            <component :is="appStore.sidebarCollapsed || appStore.isMobile ? 'Expand' : 'Fold'" />
                        </el-icon>
                    </button>
                    <Breadcrumb />
                </div>

                <main class="min-h-0 flex-1 overflow-y-auto">
                    <router-view v-slot="{ Component }">
                        <transition name="page-fade" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </main>
                <AppFooter />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/use-app-store'
import AppFooter from './components/app-footer.vue'
import Breadcrumb from './components/breadcrumb.vue'
import PortalHeader from './components/portal-header.vue'
import SidebarMenu from './components/sidebar-menu.vue'

/**
 * 控制台 Layout：
 * - 全局 Header 为一级导航
 * - 侧边栏为控制台二级导航，Breadcrumb 为三级导航
 * - 移动端（<1024px）：侧边栏变为抽屉
 */
const appStore = useAppStore()

const MOBILE_BREAKPOINT = 1024

const sidebarWidth = computed(() =>
    appStore.sidebarCollapsed ? 'var(--app-sidebar-collapsed-width)' : 'var(--app-sidebar-width)',
)

/**
 * 响应窗口尺寸切换移动端
 */
function handleResize(): void {
    appStore.setMobile(window.innerWidth < MOBILE_BREAKPOINT)
}

onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.console-drawer-body {
    height: calc(100% + 40px);
}
</style>
