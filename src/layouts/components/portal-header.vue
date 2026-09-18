<template>
    <header class="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 shadow-soft backdrop-blur-xl">
        <div class="flex h-16 w-full items-center gap-4 px-5 lg:px-8">
            <RouterLink to="/blank" class="flex shrink-0 items-center gap-2.5" @click="mobileOpen = false">
                <img :src="homeLogoUrl" :alt="platformName" class="h-8 w-8 object-contain">
                <span class="text-17px font-semibold tracking-tight text-slate-900">{{ platformName }}</span>
                <span class="hidden text-13px text-slate-400 sm:inline">{{ platformDesc }}</span>
            </RouterLink>

            <div class="hidden items-center gap-2 md:flex">
                <SiteNavLinks />
            </div>

            <div class="ml-auto flex items-center gap-1 sm:gap-2">
                <button
                    class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
                    aria-label="菜单"
                    @click="mobileOpen = !mobileOpen"
                >
                    <el-icon :size="20">
                        <Close v-if="mobileOpen" />
                        <Operation v-else />
                    </el-icon>
                </button>
            </div>
        </div>

        <transition name="portal-nav">
            <div v-if="mobileOpen" class="border-t border-slate-100 bg-white/95 px-5 pb-5 pt-2 backdrop-blur-xl md:hidden">
                <SiteNavLinks />
            </div>
        </transition>
    </header>
</template>

<script setup lang="ts">
import { Close, Operation } from '@element-plus/icons-vue'
import { useBranding } from '@/composables/use-branding'
import SiteNavLinks from './site-nav-links.vue'

/**
 * 全站一级导航：始终固定在页面顶部，不含登录用户信息
 */
const { platformName, platformDesc, homeLogoUrl } = useBranding()
const mobileOpen = shallowRef(false)
</script>

<style scoped>
.portal-nav-enter-active,
.portal-nav-leave-active {
    transition: all 0.2s ease;
}

.portal-nav-enter-from,
.portal-nav-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
