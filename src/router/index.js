import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Login from '@/components/login'
import NotFound from '@/components/404'
import Org from '@/components/sys/org'
import User from '@/components/sys/user'
import Role from '@/components/sys/role'
import Resource from '@/components/sys/resource'
import RoleResource from '@/components/sys/roleResource'
import CertificateManager from '@/components/certificate/certificateManager'
import CertificateSearcher from '@/components/certificate/certificateSearcher'
import Visualize from '@/components/analysis/visualize'

Vue.use(Router)

let routes = [
  {
    path: '/',
    name: '门户',
    component: Home,
    hidden: true
  },
  {
    path: '/login',
    name: '登录界面',
    component: Login,
    hidden: true
  },
  {
    path: '/404',
    name: 'notFound',
    component: NotFound,
    hidden: true
  },
  {
    path: '/',
    name: '信息管理',
    iconClas: 'fa fa-id-card-o',
    component: Home,
    children: [
      { path: '/userInfo', component: User, name: '用户信息' },
      { path: '/orgInfo', component: Org, name: '单位管理' },
      { path: '/roleInfo', component: Role, name: '角色管理' },
      { path: '/resourceInfo', component: Resource, name: '权限管理' },
      { path: '/roleResource', component: RoleResource, name: '用户权限分配' }
    ]
  },
  {
    path: '/',
    name: '证书管理',
    iconClas: 'fa fa-address-card',
    component: Home,
    children: [
      { path: '/certificateManager', component: CertificateManager, name: '发证管理' },
      { path: '/certificateSearch', component: CertificateSearcher, name: '证书查询' }
    ]
  },
  {
    path: '/',
    name: '数据分析',
    iconClas: 'fa fa-bar-chart',
    component: Home,
    leaf: true,
    children: [
      { path: '/visualize', component: Visualize, name: '可视化分析' }
    ]
  },
  {
    path: '*',
    name: 'notFound',
    component: NotFound,
    hidden: true
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('user')
  }
  let user = JSON.parse(sessionStorage.getItem('user'))
  if (!user && to.path !== '/login') {
    next({ 'path': '/login' })
  } else {
    next()
  }
})

export default router
