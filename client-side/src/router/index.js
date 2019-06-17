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
            path: '/dashboard',
            component: resolve => {
                require.ensure(['@/components/Dashboard/index.vue'], () => {
                    resolve(require('@/components/Dashboard/index.vue'));
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