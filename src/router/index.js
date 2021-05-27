/*
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-03-25 19:56:25
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-06 16:45:22
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
  //设置根路径 重定向login
  {
    path:'/',
    redirect:'/login'
  },
  //匹配login路径页面
  {
    path:'/login',
    component:Login,
  },
  {
    path:'/home',
    component:()=>import('../components/Home.vue'),
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:()=>import('../components/index/Welcome.vue')},
      {path:'/users',component:()=>import('../components/user/Users.vue')},
      {path:'/rights',component:()=>import('../components/power/Rights.vue')},
      {path:'/roles',component:()=>import('../components/power/Roles.vue')},
      {path:'/categories',component:()=>import('../components/goods/Cate.vue')},
      {path:'/params',component:()=>import('../components/goods/Params.vue')},
      {path:'/goods',component:()=>import('../components/goods/List.vue')},
      {path:'/goods/add',component:()=>import('../components/goods/Add.vue')},
      {path:'/goods/edit',component:()=>import('../components/goods/Edit.vue')},
      {path:'/orders',component:()=>import('../components/order/Orders.vue')},
    ]
  }
  
]

const router = new VueRouter({
  routes
})
//路由守卫 to去往目标 from来源目标对象 next接下来操作
router.beforeEach((to,from,next)=>{
  //如果path是login放行
  if(to.path==='/login'){
    return next()
  }
  //如果用户未登录 跳转到login
  console.log(sessionStorage.getItem('userInfo'))
  const userInfo=JSON.parse(sessionStorage.getItem('userInfo'))
  if(!userInfo){
    return next('/login')
  }
  //如果用户已经登录 放行
  next()
})

export default router
