import type { LoginParams, LoginResult, UserInfo } from '@/types'
import { waitMock } from '@/utils/format'

/** Mock 账号表：用户ID + 密码登录 */
const MOCK_USERS: Array<UserInfo & { password: string }> = [
    {
        id: 'u_1001',
        username: 'admin',
        password: '123456',
        nickname: '张平台',
        avatar: 'https://api.dicebear.com/9.x/notionists-neutral/svg?seed=admin&backgroundColor=dbeafe',
        role: 'platform_admin',
        roleName: '平台管理员',
        orgName: '天宽云',
    },
    {
        id: 'u_2001',
        username: 'customer',
        password: '123456',
        nickname: '李客户',
        avatar: 'https://api.dicebear.com/9.x/notionists-neutral/svg?seed=customer&backgroundColor=bfdbfe',
        role: 'customer_admin',
        roleName: '客户管理员',
        orgName: 'Acme 科技有限公司',
    },
    {
        id: 'u_2101',
        username: 'user',
        password: '123456',
        nickname: '王研发',
        avatar: 'https://api.dicebear.com/9.x/notionists-neutral/svg?seed=user&backgroundColor=bbf7d0',
        role: 'ordinary_user',
        roleName: '普通用户',
        orgName: 'Acme 科技有限公司',
    },
]

/**
 * 从 Mock token 解析用户 ID
 */
function parseUserIdFromToken(token: string): string | null {
    const matched = token.match(/^mock_token_(.+)$/)
    return matched?.[1] ?? null
}

/**
 * 去掉密码字段后返回可展示的用户信息
 */
function toPublicUser(user: UserInfo & { password: string }): UserInfo {
    const { password: _password, ...publicUser } = user
    return publicUser
}

/**
 * Mock 登录
 */
export async function mockLogin(params: LoginParams): Promise<LoginResult> {
    await waitMock(420)
    const found = MOCK_USERS.find(
        item => item.username === params.username && item.password === params.password,
    )
    if (!found)
        throw new Error('用户ID或密码错误')
    return {
        token: `mock_token_${found.id}`,
        user: toPublicUser(found),
    }
}

/**
 * 根据 token 读取当前用户
 */
export async function mockGetUserInfo(token: string): Promise<UserInfo> {
    await waitMock(180)
    const id = parseUserIdFromToken(token)
    const found = id ? MOCK_USERS.find(item => item.id === id) : undefined
    if (!found)
        throw new Error('登录状态已失效')
    return toPublicUser(found)
}
