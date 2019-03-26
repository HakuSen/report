import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Login = () => import('../reportCenter/home/Login');
const Welcome = () => import('../reportCenter/home/Welcome');
const Frame = () => import('../reportCenter/frame/Frame');
const Home = () => import('../reportCenter/home/Home');

const Register = () => import('../reportCenter/home/register');
const Findpass = () => import('../reportCenter/home/findpass');
const Acount = () => import('../reportCenter/home/acount');
const OldLogin = () => import('../reportCenter/home/oldlogin');

// 路由配置
const routesConfig = [
  { path: '/', redirect: '/welcome' },
  { path: '', redirect: '/welcome' },
  { path: '/welcome', component: Welcome },
  { path: '/login', component: Login },
  {
    path: '/frame',
    component: Frame,
    children: [
      { path: '/', redirect: '/frame/home' },
      { path: '', redirect: '/frame/home' },
      { path: 'home', component: Home }
    ]
  },
  {
    path: '/acount',
    component: Acount,
    children: [
      { path: 'register', component: Register },
      { path: 'findpass', component: Findpass },
      { path: 'oldlogin', component: OldLogin }
    ]
  }
];

// 创建路由实例
const router = new Router({
  routes: routesConfig
});

export default router;
