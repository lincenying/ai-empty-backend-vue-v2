const TOKEN_KEY = 'empty_backend_token'
const REMEMBER_KEY = 'empty_backend_remember'
const AUTH_SEEDED_KEY = 'empty_backend_auth_seeded'
const DEMO_TOKEN = 'mock_token_u_1001'

/**
 * 是否可读写 localStorage
 */
function canUseStorage(): boolean {
    return typeof window !== 'undefined'
}

/**
 * 读取登录 token；首次访问自动写入演示账号，便于顶栏直接展示用户信息
 */
export function getToken(): string {
    if (!canUseStorage())
        return ''
    const existing = localStorage.getItem(TOKEN_KEY)
    if (existing)
        return existing
    if (!localStorage.getItem(AUTH_SEEDED_KEY)) {
        localStorage.setItem(TOKEN_KEY, DEMO_TOKEN)
        localStorage.setItem(AUTH_SEEDED_KEY, '1')
        return DEMO_TOKEN
    }
    return ''
}

/**
 * 写入登录 token
 */
export function setToken(token: string): void {
    if (!canUseStorage())
        return
    localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 清除登录 token（保留已初始化标记，避免退出后再被自动登录）
 */
export function removeToken(): void {
    if (!canUseStorage())
        return
    localStorage.removeItem(TOKEN_KEY)
}

/** 记住密码（Mock：仅本地演示，请勿在真实项目中明文存储密码） */
export interface RememberedAccount {
    username: string
    password: string
}

/**
 * 读取记住的账号
 */
export function getRememberedAccount(): RememberedAccount | null {
    if (!canUseStorage())
        return null
    const raw = localStorage.getItem(REMEMBER_KEY)
    if (!raw)
        return null
    try {
        return JSON.parse(raw) as RememberedAccount
    }
    catch {
        return null
    }
}

/**
 * 保存记住的账号
 */
export function setRememberedAccount(account: RememberedAccount): void {
    if (!canUseStorage())
        return
    localStorage.setItem(REMEMBER_KEY, JSON.stringify(account))
}

/**
 * 清除记住的账号
 */
export function removeRememberedAccount(): void {
    if (!canUseStorage())
        return
    localStorage.removeItem(REMEMBER_KEY)
}
