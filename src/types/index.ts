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
