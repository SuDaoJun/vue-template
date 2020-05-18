import Vue from 'vue'
import Router from 'vue-router'

const redirect = resolve => require(['@/views/redirect/redirect.vue'], resolve);
const login = resolve => require(['@/views/login/login.vue'], resolve);
const layout = resolve => require(['@/views/layout/layout.vue'], resolve);
const error = resolve => require(['@/views/errorPage/404.vue'], resolve);
const index = resolve => require(['@/views/home/index.vue'], resolve);

const testTable = resolve => require(['@/views/test/table.vue'], resolve);
const testDrag = resolve => require(['@/views/test/drag.vue'], resolve);
const testRich = resolve => require(['@/views/test/rich.vue'], resolve);



Vue.use(Router)
// hidden子菜单是否显示在侧边栏
// meta.affix是否固定在标签栏
// child是否显示子菜单

export const constantRoutes = [
  {
    path: '/redirect',
    name: 'redirect',
    component: layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: redirect
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    hidden: true,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    name: 'Page404',
    component: error,
    hidden: true,
    meta: {
      title: '404'
    }
  }
]

export const asyncRoutes = [
  {
    path: '/',
    component: layout,
    redirect: '/index',
    meta: { 
      title: '首页',
      authId: '1',
      icon: 'el-icon-location',
      affix: true
    },
    children: [
      {
        path: '/index',
        component: index,
        name: 'index',
        meta: { 
          title: '首页',
          authId: '1',
          affix: true
        }
      }
    ]
  },
  {
    path: '/test',
    component: layout,
    meta: { 
      title: '测试页面',
      icon: 'el-icon-setting',
      authId: '1'
    },
    redirect: '/test/table',
    child: true,
    children: [
      {
        path: '/test/table',
        component: testTable,
        name: 'testTable',
        meta: { 
          title: '表格测试',
          authId: '1'
        }
      },
      {
        path: '/test/drag',
        component: testDrag,
        name: 'testDrag',
        meta: { 
          title: '拖拽测试',
          authId: '1'
        }
      },
      {
        path: '/test/rich',
        component: testRich,
        name: 'testRich',
        meta: { 
          title: '富文本编辑器测试',
          authId: '1'
        }
      }
    ]
  },
  {
    path: '*', 
    redirect: '/404',
    hidden: true,
    meta: {
      title: '404',
      authId: '1'
    }
  }
]

const createRouter = () => new Router({
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
