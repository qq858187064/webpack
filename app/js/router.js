// router.js
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const login = r => require.ensure([], () => r(require('../page/login.vue')), 'login');
//const reg = r => require.ensure([], () => r(require('../page/reg.vue')), 'login');
//const index = r => require.ensure([], () => r(require('../page/index.vue')), 'index');
const router = new Router({
  mode: 'history',
  routes: [
{
      path: '/login', // 大屏首页
      name: 'login',
      component: pc
    },
      {
      path: '/reg', // 大屏banner
      name: 'reg',
      component: bner
    },
    {
      path: '/', // 扶贫报告
      name: 'index',
      component: index
    }, 

]});
export default router