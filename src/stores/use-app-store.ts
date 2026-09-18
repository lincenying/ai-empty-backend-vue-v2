/** 应用级 UI 状态：菜单折叠、响应式设备类型 */
export const useAppStore = defineStore('app', () => {
    const sidebarCollapsed = ref(false)
    const isMobile = ref(false)
    /** 移动端抽屉式菜单是否打开 */
    const mobileMenuOpen = ref(false)

    /**
     * 切换侧边栏：桌面端折叠，移动端开合抽屉
     */
    function toggleSidebar(): void {
        if (isMobile.value) {
            mobileMenuOpen.value = !mobileMenuOpen.value
        }
        else {
            sidebarCollapsed.value = !sidebarCollapsed.value
        }
    }

    /**
     * 根据窗口宽度设置是否为移动端
     */
    function setMobile(value: boolean): void {
        isMobile.value = value
        if (value) {
            sidebarCollapsed.value = false
            mobileMenuOpen.value = false
        }
    }

    /**
     * 关闭移动端抽屉菜单
     */
    function closeMobileMenu(): void {
        mobileMenuOpen.value = false
    }

    return { sidebarCollapsed, isMobile, mobileMenuOpen, toggleSidebar, setMobile, closeMobileMenu }
})
