import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        /** 页面 / 菜单标题 */
        title?: string
        /** Element Plus 图标组件名 */
        icon?: string
        /** 侧边栏分区标题 */
        group?: string
        /** 侧边栏父级菜单，有值时该路由作为子菜单展示 */
        parent?: {
            /** 父级菜单唯一标识 */
            key: string
            /** 父级菜单标题 */
            title: string
            /** 父级菜单图标 */
            icon?: string
        }
        /** 是否在菜单中隐藏 */
        hidden?: boolean
    }
}
