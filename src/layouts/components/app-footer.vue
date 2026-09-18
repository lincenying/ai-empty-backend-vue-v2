<template>
    <footer class="flex shrink-0 flex-col items-center justify-center gap-2 border-t border-slate-100 bg-white px-8 py-5 text-center text-xs text-slate-400 sm:flex-row sm:gap-4">
        <p>{{ footerCopyright }}</p>
        <span
            v-if="icpNumber || publicSecurityNumber"
            class="hidden text-slate-300 sm:inline"
        >|</span>
        <p v-if="icpNumber || publicSecurityNumber">
            {{ [icpNumber, publicSecurityNumber].filter(Boolean).join(' · ') }}
        </p>
    </footer>
</template>

<script setup lang="ts">
import { useBranding } from '@/composables/use-branding'

/**
 * 全局 Footer：版权与备案信息
 */
const { footerCopyright, icpNumber, publicSecurityNumber } = useBranding()
</script>
