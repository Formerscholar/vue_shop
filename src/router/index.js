import Vue from 'vue'
import VueRouter from 'vue-router'


// const Login = () => import('components/Login')
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ 'components/Login')
// const Home = () => import('components/Home/Home')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ 'components/Home/Home')
// const Welcome = () => import('components/Welcome')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ 'components/Welcome')



// const Users = () => import('components/user/Users')
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/user/Users')
// const Rights = () => import('components/popwer/Rights')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/popwer/Rights')
// const Roles = () => import('components/popwer/Roles')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/popwer/Roles')



// const Cate = () => import('components/goods/Cate')
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ 'components/goods/Cate')
// const Params = () => import('components/goods/Params')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ 'components/goods/Params')


// const List = () => import('components/goods/List')
const List = () => import(/* webpackChunkName: "List_Add" */ 'components/goods/List')
// const Add = () => import('components/goods/Add')
const Add = () => import(/* webpackChunkName: "List_Add" */ 'components/goods/Add')



// const Order = () => import('components/order/Order')
const Order = () => import(/* webpackChunkName: "Order_Report" */ 'components/order/Order')
// const Report = () => import('components/report/Report')
const Report = () => import(/* webpackChunkName: "Order_Report" */ 'components/report/Report')





Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: Users},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      {path: '/categories', component: Cate},
      {path: '/params', component: Params},
      {path: '/goods', component: List},
      {path: '/goods/add', component: Add},
      {path: '/orders', component: Order},
      {path: '/reports', component: Report}
    ]
  },

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
