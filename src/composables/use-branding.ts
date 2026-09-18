const platformName = '天宽云'
const platformDesc = '经营驾驶舱'
const homeLogoUrl = '/tiankuan-logo-mark.png'
const footerCopyright = '© 2026 天宽云 保留所有权利'
const icpNumber = '浙ICP备13031450号'
const publicSecurityNumber = '浙公网安备 33010602012081号'

/**
 * 平台品牌（名称 / 描述 / Logo / 页脚）
 */
export function useBranding() {
    return {
        platformName,
        platformDesc,
        homeLogoUrl,
        footerCopyright,
        icpNumber,
        publicSecurityNumber,
    }
}
