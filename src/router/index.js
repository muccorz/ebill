import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
    //路由跳转配置
const routes = [{
        path: '/',
        name: 'loginView',
        component: () =>
            import ('../views/login.vue')
    },
    {
        path: '/home',
        name: 'homeView',
        component: () =>
            import ('../views/home.vue'),
        children: [
            // ***
            {
                path: '/billStyle', // 修改路径为 /bill
                name: 'billStyle',
                component: () =>
                    import ('../views/billStyle.vue')
            },
            {
                path: '/customer', // 修改路径为 /customer
                name: 'customerView',
                component: () =>
                    import ('../views/customer.vue')
            },
            // ***
            {
                path: '/roles',
                name: 'rolesView',
                component: () =>
                    import ('../views/roles.vue')
            },
            {
                path: '/category',
                name: 'categoryView',
                component: () =>
                    import ('../views/category.vue')
            },
            {
                path: '/search',
                name: 'searchView',
                component: () =>
                    import ('../views/search.vue')
            },
            {
                path: '/create',
                name: 'editView',
                component: () =>
                    import ('../views/edit.vue')
            },
            {
                path: '/edit/:billno',
                name: 'editView',
                component: () =>
                    import ('../views/edit.vue')
            }
        ]
    }
]

const router = new VueRouter({
        routes
    })
    // 路由守卫
router.beforeEach((to, from, next) => {
    const rolesno = sessionStorage.getItem('rolesno')

    if (to.path === '/') {
        next()
    } else {
        if (rolesno == null) {
            next('/')
        } else {
            next()
        }
    }
    switch (rolesno) {
        case '1':
            if (to.path == '/roles') {
                next('/search')
            } else if (to.path == '/category') {
                next('/search')
            }
            break;
        case '2':
            if (to.path == '/roles') {
                next('/search')
            } else if (to.path == '/category') {
                next('/search')
            } else if (to.path == '/edit') {
                next('/search')
            } else if (to.path == '/create') {
                next('/search')
            }
            break;
        case '3':
            if (to.path == '/roles') {
                next('/search')
            } else if (to.path == '/category') {
                next('/search')
            } else if (to.path == '/edit') {
                next('/search')
            } else if (to.path == '/create') {
                next('/search')
            }
            break;
        case '4':

            break;

        default:
            if (to.path === '/') {
                next()
            } else {
                next('/')
            }
            break;
    }
})

export default router