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
        }
    ]
});
export default router;