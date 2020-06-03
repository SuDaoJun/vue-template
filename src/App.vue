<template>
  <div id="app" class='body-index'>
    <router-view/>
  </div>
</template>

<script>
import '@/assets/css/common.scss';
export default {
  name: 'App',
  mounted(){

  },
  methods: {

  }
}
</script>

<style lang="scss">
.body-index {
  height: 100%;
  background-color: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
// 消息提示 Popover 弹出框去除padding
.notice-popper.el-popover{
  padding: 0;
  background-color: transparent;
  border: 1px solid #e4e4e4;
}
</style>
