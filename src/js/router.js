// router.js
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const index = r => require.ensure([], () => r(require('../page/index.vue')), 'index');
const login = r => require.ensure([], () => r(require('../page/login.vue')), 'login');
const reg = r => require.ensure([], () => r(require('../page/reg.vue')), 'login');
const router = new Router({
  mode: 'history',
  routes: [
{
      path: '/login', 
      name: 'login',
      component: login
    },
      {
      path: '/reg', 
      name: 'reg',
      component: reg
    },
    {
      path: '/',
      name: 'index',
      component: index
    }, 

]});
export default router