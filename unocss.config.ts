import { webConfig } from '@lincy/unocss-base-config'

const base = webConfig('wind3', {
    preflight: 'on-demand',
})

export default {
    ...base,
    theme: {
        ...base.theme,
        colors: {
            ...(base.theme as { colors?: Record<string, unknown> })?.colors,
            primary: {
                50: '#eff6ff',
                100: '#dbeafe',
                200: '#bfdbfe',
                300: '#93c5fd',
                400: '#60a5fa',
                500: '#3b82f6',
                600: '#2563eb',
                700: '#1d4ed8',
                800: '#1e40af',
                900: '#1e3a8a',
            },
        },
    },
    shortcuts: [
        ...(Array.isArray(base.shortcuts) ? base.shortcuts : []),
        {
            'shadow-card': 'shadow-[0_1px_3px_0_rgba(16,42,100,0.04),0_4px_16px_-2px_rgba(16,42,100,0.06)]',
            'shadow-card-hover': 'shadow-[0_4px_12px_0_rgba(16,42,100,0.06),0_12px_32px_-4px_rgba(16,42,100,0.10)]',
            'shadow-soft': 'shadow-[0_2px_8px_rgba(16,42,100,0.05)]',
        },
    ],
}
