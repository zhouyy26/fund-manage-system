import Vue from 'vue';
import Router from 'vue-router';
import Index from './views/Index.vue';
import Register from './views/Register.vue';
import Login from './views/Login.vue';
import Nofind from './views/404.vue';
import Home from './views/Home.vue';
import FundStatement from './views/FundStatement.vue';
import PersonalInfo from './views/PersonalInfo.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home,
        },
        {
          path: '/fundStatement',
          name: 'fundStatement',
          component: FundStatement,
        },
        {
          path: '/personalInfo',
          name: 'personalInfo',
          component: PersonalInfo,
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      name: '/404',
      component: Nofind
    }
  ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('token') ? true : false;
  if(to.path == '/login' || to.path == '/register') {
    next();
  } else {
    isLogin ? next() : next('/login');
  }
});

export default router;