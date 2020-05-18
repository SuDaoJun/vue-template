## 前言

此 vue-template 模板项目是基于 vue 全家桶 + Elementui

## 效果

效果图：

![首页](http://sdj_work.gitee.io/note/img/vueTemplate.png)

## 前端技术

- vue
- vuex
- vue-route
- axios
- element-ui
- moment
- nprogress
- scss
- echarts
- wangeditor
- xlsx
- drag-map

## 主要项目结构

```
- components
  - TagsView 路由标签导航
  - ChartCard 卡片
  - EmptyShow 数据为空提示
  - FooterConfir 底部固定提交确认
  - Identify canvas随机验证码
  - MyEcharts echarts图标封装
  - MyForm 表单封装
  - MyTable 表格封装
  - TreeSelect 下拉树型结构
  - UploadFile 文件上传
  - WangEnduit WangEnduit 富文本编辑器
- views
  - errorPage 错误页面，如404
  - home 数据统计图表页面
  - layout 头部导航以及侧边导航
  - login 登录
  - test 一定区域拖拽图标
  - redirect 路由重定向
- api axios封装以及api接口
- assets 图片和css资源
- router 路由
- store vuex 的状态管理
- utils 封装的常用的方法，如表单验证，excel导出，mqtt以及websocket封装（包括连接断开，发送和接收消息以及错误重连）
- permission.js 路由权限拦截，通过后台返回权限加载对应路由
- main.js 入口文件，实例化Vue、插件初始化
- app.vue 根组件
```

## Build Setup ( 建立安装 )

```
# install dependencies
npm install

# serve with hot reload at localhost: 8090
npm run dev

# build for production with minification
npm run build
```
