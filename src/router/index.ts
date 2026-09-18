import { createRouter, createWebHashHistory } from 'vue-router'
import emitter from '@/composables/emitter'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/layouts/console-layout.vue'),
            redirect: '/blank',
            children: [
                {
                    path: 'blank',
                    name: 'Blank',
                    component: () => import('@/pages/blank-page.vue'),
                    meta: {
                        title: '空白页',
                        icon: 'Monitor',
                        group: '驾驶舱',
                    },
                },
                {
                    path: 'examples/call-log',
                    name: 'CallLogExample',
                    component: () => import('@/pages/examples/call-log-page.vue'),
                    meta: {
                        title: '调用日志',
                        icon: 'Document',
                        group: '示例',
                    },
                },
                {
                    path: 'examples/account',
                    name: 'AccountExample',
                    component: () => import('@/pages/examples/account-page.vue'),
                    meta: {
                        title: '我的账户',
                        icon: 'Wallet',
                        group: '示例',
                    },
                },
            ],
        },
    ],
})

// 路由跳转前的监听操作
router.beforeEach((to) => {
    emitter.emit('nprogress-start', {
        type: 'router',
        url: to.path,
    })
    return true
})

// 路由跳转后的监听操作
router.afterEach(() => {
    emitter.emit('nprogress-done', {
        type: 'router',
        url: router.currentRoute.value.path,
    })
})

export default router
