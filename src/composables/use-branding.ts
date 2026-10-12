const platformName = '驾驶舱'
const platformDesc = '经营驾驶舱'
const homeLogoUrl = '/logo-mark.png'
const footerCopyright = '© 2026 驾驶舱 保留所有权利'
const icpNumber = '浙ICP备00000000号'
const publicSecurityNumber = '浙公网安备 00000000000000号'

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
