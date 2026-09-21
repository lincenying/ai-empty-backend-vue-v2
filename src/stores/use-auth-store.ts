import type { LoginParams, UserInfo } from '@/types'
import { mockGetUserInfo, mockLogin } from '@/mock/user'
import {
    getToken,
    removeRememberedAccount,
    removeToken,
    setRememberedAccount,
    setToken,
} from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
    const token = shallowRef(getToken())
    const user = shallowRef<UserInfo | null>(null)

    const isLoggedIn = computed(() => Boolean(token.value))
    const role = computed(() => user.value?.role ?? null)

    /**
     * 登录：写入 token 与用户信息，按需记住账号
     */
    async function login(params: LoginParams): Promise<void> {
        const result = await mockLogin(params)
        token.value = result.token
        user.value = result.user
        setToken(result.token)

        if (params.remember) {
            setRememberedAccount({ username: params.username, password: params.password })
        }
        else {
            removeRememberedAccount()
        }
    }

    /**
     * 刷新后根据本地 token 恢复用户信息
     */
    async function fetchUserInfo(): Promise<UserInfo> {
        const info = await mockGetUserInfo(token.value)
        user.value = info
        return info
    }

    /**
     * 登出：清空本地登录态
     */
    async function logout(): Promise<void> {
        token.value = ''
        user.value = null
        removeToken()
    }

    return { token, user, isLoggedIn, role, login, fetchUserInfo, logout }
})
