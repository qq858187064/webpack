// router.js
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const login = r => require.ensure([], () => r(require('../page/login.vue')), 'login');
const reg = r => require.ensure([], () => r(require('../page/reg.vue')), 'login');
const index = r => require.ensure([], () => r(require('../page/app.vue')), 'index');
const router = new Router({
  mode: 'history',
  routes: [
{
      path: '/login', 
      name: 'login',
      component: pc
    },
      {
      path: '/reg', 
      name: 'reg',
      component: bner
    },
    {
      path: '/',
      name: 'index',
      component: index
    }, 

]});
export default router