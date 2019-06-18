import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let router = new Router({
    //mode: 'history',
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            component: resolve => {
                require.ensure(['@/components/Home/index.vue'], () => {
                    resolve(require('@/components/Home/index.vue'));
                });
            }
        },
        {
            path: '/campaign/:id',
            component: resolve => {
                require.ensure(['@/components/Campaign/profile.vue'], () => {
                    resolve(require('@/components/Campaign/profile.vue'));
                });
            }
        },
        {
            path: '/address/:address',
            component: resolve => {
                require.ensure(['@/components/Address/profile.vue'], () => {
                    resolve(require('@/components/Address/profile.vue'));
                });
            }
        },
        {
            path: '/create',
            component: resolve => {
                require.ensure(['@/components/Create/index.vue'], () => {
                    resolve(require('@/components/Create/index.vue'));
                });
            }
        },
        {
            path: '/donate',
            component: resolve => {
                require.ensure(['@/components/Donate/index.vue'], () => {
                    resolve(require('@/components/Donate/index.vue'));
                });
            }
        },
        {
            path: '*',
            component: resolve => {
                require.ensure(['@/components/Errors/404.vue'], () => {
                    resolve(require('@/components/Errors/404.vue'));
                });
            }
        }
    ]
});
export default router;