/** 角色：平台管理员 / 客户管理员 / 普通用户 */
export type UserRole = 'platform_admin' | 'customer_admin' | 'ordinary_user'

/** 当前登录用户 */
export interface UserInfo {
    id: string
    /** 登录账号 */
    username: string
    /** 展示名 */
    nickname: string
    avatar: string
    role: UserRole
    roleName: string
    orgName: string
}

/** 登录表单参数 */
export interface LoginParams {
    username: string
    password: string
    remember: boolean
}

/** 登录结果 */
export interface LoginResult {
    token: string
    user: UserInfo
}

/** 通用状态 */
export type CommonStatus
    = | 'active'
        | 'inactive'
        | 'pending'
        | 'processing'
        | 'error'
        | 'success'
        | 'warning'
        | 'failed'

/** 分页结果 */
export interface PageResult<T> {
    list: T[]
    total: number
    page: number
    pageSize: number
}

/** 表格列配置（BaseTable 使用） */
export interface TableColumn {
    prop: string
    label: string
    width?: number | string
    minWidth?: number | string
    fixed?: boolean | 'left' | 'right'
    align?: 'left' | 'center' | 'right'
    sortable?: boolean
    showOverflowTooltip?: boolean
    /** 自定义插槽名，默认取 prop */
    slot?: string
}
