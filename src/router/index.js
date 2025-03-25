import {
    createRouter,
    createWebHistory
} from 'vue-router'

const routes = [{
        path: '/',
        component: () => import('../views/Layout.vue'),
        meta: {
            requiresAuth: true,
        },
        children: [{
                path: '',
                name: 'Home',
                component: () => import('../views/MainContent.vue'),
            },
            {
                path: '/home/overview',
                name: 'HomeOverview',
                component: () => import('../views/Home/HomeOverview.vue')
            },
            {
                path: '/home/intelligent-board',
                name: 'IntelligentBoard',
                component: () => import('../views/Home/IntelligentBoard.vue')
            },
            {
                path: '/home/interface-service',
                name: 'InterfaceService',
                component: () => import('../views/Home/InterfaceService.vue')
            },
            {
                path: '/data/statistics',
                name: 'DataStatistics',
                component: () => import('../views/DataOverview/DataStatistics.vue')
            },
            {
                path: '/data/source-management',
                name: 'DataSourceManagement',
                component: () => import('../views/DataOverview/DataSourceManagement.vue')
            },
            {
                path: '/data/warning-instances',
                name: 'WarningInstances',
                component: () => import('../views/DataOverview/WarningInstances.vue')
            },
            {
                path: '/data/metadata',
                name: 'Metadata',
                component: () => import('../views/DataOverview/Metadata.vue')
            },
            {
                path: '/data/uploadanddownload',
                name: 'UploadAndDownload',
                component: () => import('../views/DataOverview/UploadAndDownload.vue')
            },
            {
                path: '/data/data-analyse',
                name: 'DataAnalyse',
                component: () => import('../views/DataOverview/DataAnalyse.vue')
            },
            {
                path: '/interface/interface-governance',
                name: 'InterfaceGovernance',
                component: () => import('../views/Interface/InterfaceGovernance.vue')
            },
            {
                path: '/setting/access-permissions',
                name: 'AccessPermissions',
                component: () => import('../views/Setting/AccessPermissions.vue')
            },
            {
                path: '/setting/user-management',
                name: 'UserManagement',
                component: () => import('../views/Setting/UserManagement.vue')
            },
            {
                path: '/setting/log-recording',
                name: 'LogRecording',
                component: () => import('../views/Setting/LogRecording.vue')
            }, {
                path: '/setting/menu-management',
                name: 'MenuManagement',
                component: () => import('../views/Setting/MenuManagement.vue')
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login/Login.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token')

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.path === '/login' && isAuthenticated) {
        next('/')
    } else {
        next()
    }
})

export default router