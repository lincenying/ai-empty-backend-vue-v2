<template>
    <div class="min-h-screen bg-hex-f6f9fe">
        <PortalHeader />

        <div class="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 pt-16">
            <div class="pointer-events-none absolute inset-0">
                <div class="absolute -left-40 -top-40 h-480px w-480px rounded-full bg-blue-200/40 blur-3xl" />
                <div class="absolute -bottom-48 -right-32 h-520px w-520px rounded-full bg-sky-200/50 blur-3xl" />
                <div class="absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />
            </div>

            <div class="relative z-10 w-full max-w-md">
                <div class="mb-8 flex flex-col items-center">
                    <img :src="homeLogoUrl" :alt="platformName" class="h-14 w-14 object-contain drop-shadow-lg">
                    <h1 class="mt-4 text-24px font-semibold tracking-tight text-slate-900">{{ platformName }}</h1>
                    <p class="mt-1.5 text-14px text-slate-500">{{ platformDesc }}</p>
                </div>

                <div class="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-card-hover backdrop-blur-xl">
                    <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="handleLogin">
                        <el-form-item prop="username">
                            <el-input v-model="form.username" placeholder="用户ID">
                                <template #prefix>
                                    <el-icon><User /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="password">
                            <el-input v-model="form.password" type="password" placeholder="密码" show-password>
                                <template #prefix>
                                    <el-icon><Lock /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>

                        <div class="mb-5 flex items-center justify-between">
                            <el-checkbox v-model="form.remember" label="记住密码" />
                        </div>

                        <el-button
                            type="primary"
                            size="large"
                            class="w-full !h-12 !text-15px !font-medium"
                            :loading="loading"
                            @click="handleLogin"
                        >
                            登 录
                        </el-button>
                    </el-form>

                    <div class="mt-5 border-t border-slate-100 pt-4">
                        <p class="mb-2 text-center text-12px text-slate-400">演示账号（密码均为 123456）</p>
                        <div class="flex flex-wrap justify-center gap-2">
                            <el-button
                                v-for="item in quickAccounts"
                                :key="item.username"
                                size="small"
                                plain
                                @click="handleQuickFill(item)"
                            >
                                {{ item.label }}
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { useBranding } from '@/composables/use-branding'
import PortalHeader from '@/layouts/components/portal-header.vue'
import { useAuthStore } from '@/stores/use-auth-store'
import { getRememberedAccount } from '@/utils/auth'
import { ElMessage } from '~/config/element'

interface QuickAccount {
    label: string
    username: string
    password: string
}

interface LoginForm {
    username: string
    password: string
    remember: boolean
}

/**
 * Mock 登录页：用于演示顶栏用户信息
 */
defineOptions({
    name: 'LoginPage',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { platformName, platformDesc, homeLogoUrl } = useBranding()

const formRef = useTemplateRef<FormInstance>('formRef')
const loading = shallowRef(false)

const form = reactive<LoginForm>({
    username: '',
    password: '',
    remember: false,
})

const rules: FormRules<LoginForm> = {
    username: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码至少 6 位', trigger: 'blur' },
    ],
}

const quickAccounts: QuickAccount[] = [
    { label: '平台管理员', username: 'admin', password: '123456' },
    { label: '客户管理员', username: 'customer', password: '123456' },
    { label: '普通用户', username: 'user', password: '123456' },
]

/**
 * 快捷填充演示账号
 */
function handleQuickFill(account: QuickAccount): void {
    form.username = account.username
    form.password = account.password
    formRef.value?.clearValidate()
}

/**
 * 提交 Mock 登录
 */
async function handleLogin(): Promise<void> {
    if (!formRef.value || loading.value)
        return
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid)
        return

    loading.value = true
    try {
        await authStore.login(form)
        ElMessage.success(`欢迎回来，${authStore.user?.nickname}`)
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/blank'
        router.push(redirect)
    }
    catch (error) {
        const message = error instanceof Error ? error.message : '登录失败'
        ElMessage.error(message)
    }
    finally {
        loading.value = false
    }
}

onMounted(() => {
    const remembered = getRememberedAccount()
    if (!remembered)
        return
    form.username = remembered.username
    form.password = remembered.password
    form.remember = true
})
</script>
