<template>
    <el-dropdown trigger="click" @command="handleCommand">
        <button
            class="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-slate-100"
        >
            <el-avatar :size="34" :src="avatarSrc">
                {{ avatarFallback }}
            </el-avatar>
            <div class="hidden text-left leading-tight lg:block">
                <p class="text-13px font-medium text-slate-800">{{ authStore.user?.nickname }}</p>
                <p class="text-11px text-slate-400">{{ authStore.user?.roleName }}</p>
            </div>
            <el-icon :size="12" class="text-slate-400"><ArrowDown /></el-icon>
        </button>

        <template #dropdown>
            <el-dropdown-menu>
                <div class="border-b border-slate-100 px-4 py-3">
                    <p class="text-14px font-semibold text-slate-900">{{ authStore.user?.nickname }}</p>
                    <p class="mt-0.5 font-mono text-12px text-slate-400">{{ authStore.user?.username }}</p>
                    <el-tag size="small" class="mt-2" type="primary">{{ authStore.user?.roleName }}</el-tag>
                </div>
                <el-dropdown-item command="workspace">
                    <el-icon><Monitor /></el-icon>控制台
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                    <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { ArrowDown, Monitor, SwitchButton } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/use-auth-store'
import { ElMessage, ElMessageBox } from '~/config/element'

type UserMenuCommand = 'workspace' | 'logout'

/**
 * 用户头像下拉：控制台 / 退出登录
 */
const router = useRouter()
const authStore = useAuthStore()

/** 有头像时使用图片地址，否则不传 src */
const avatarSrc = computed(() => authStore.user?.avatar || undefined)

/** 无头像时展示 nickname 首字符 */
const avatarFallback = computed(() => authStore.user?.nickname?.charAt(0) || '')

/**
 * 处理下拉菜单命令
 */
function handleCommand(command: UserMenuCommand): void {
    if (command === 'logout') {
        handleLogout()
        return
    }
    if (command === 'workspace') {
        router.push('/blank')
    }
}

/**
 * 二次确认后退出登录
 */
async function handleLogout(): Promise<void> {
    try {
        await ElMessageBox.confirm('确定要退出当前账号吗？', '退出登录', {
            confirmButtonText: '退出',
            cancelButtonText: '取消',
            type: 'warning',
            distinguishCancelAndClose: true,
            closeOnClickModal: false,
        })
        await authStore.logout()
        router.push('/login')
        ElMessage.success('已安全退出')
    }
    catch {
        /* 用户取消 */
    }
}
</script>
