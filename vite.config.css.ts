import type { CSSOptions } from 'vite'
import { charsetRemoval, designHeight, designMultiple, designWidth, fontSize, minWidth, minWindow } from './src/design.config.ts'

const config: CSSOptions = {
    preprocessorOptions: {
        scss: {
            additionalData: `
                    $vmDesignWidth: ${designWidth};
                    $vmDesignHeight: ${designHeight};
                    $vmDesignMultiple: ${designMultiple};
                    $vmMinWidth: ${minWidth};
                    $vmMinWindow: ${minWindow};
                    $vmFontSize: ${fontSize};
                `,
            // 忽略scss global-builtin, import 提示3.0将删除的警告
            silenceDeprecations: ['global-builtin', 'import'],
        },
    },
    postcss: {
        plugins: [
            charsetRemoval(),
        ],
    },
}

export default config
