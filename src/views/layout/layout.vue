<template>
  <div :class='collapse?"index-layout index-collapse":"index-layout"'>
    <div class="layout-sidebar">
      <div class="sider-logo" @click='logoIndex' v-show='!collapse'>
        Logo
      </div>
      <div class="sider-menu">
        <el-scrollbar style='height: calc(100% - 64px)' class='wrap-scroll'>
          <el-menu
          :default-active="defaultActive"
          ref='menu'
            class="el-menu-vertical-demo"
            router
            :collapse="collapse"
            @select='menuRefresh'>
            <menu-item :totalRoutes='totalRoutes'></menu-item>
          </el-menu>
        </el-scrollbar>
      </div>
    </div>
    <div class="layout-container">
      <div class="container-header fixed-header">
        <div class="info-header">
          <div class="header-left">
            <div class="left-collapse" @click='collapseChange'>
              <i :class='collapse?"el-icon-s-unfold":"el-icon-s-fold"'></i>
            </div>
            <el-breadcrumb class="header-breadcrumb" separator="/">
              <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="(item,index) in bredlList" :key="item.path">
                  <span v-if="index==bredlList.length-1" class="no-redirect">{{ item.meta.title }}</span>
                  <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
                </el-breadcrumb-item>
              </transition-group>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <div class="right-notice" @click='drawerOpen'>
              <el-badge :value="1">
                <i class="el-icon-bell"></i>
              </el-badge>
            </div>
            <el-dropdown @command="handleCommand" placement='bottom'>
              <div class="el-dropdown-link">
                <el-avatar icon="el-icon-user-solid"></el-avatar>
                
                <span>管理员</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="user" icon="el-icon-setting">账户设置</el-dropdown-item>
                <el-dropdown-item command="modifyPwd" icon="el-icon-edit">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout" divided icon="el-icon-switch-button">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <tags-view v-show='tagShow' />
      </div>
      <el-scrollbar style='height: 100vh' class='wrap-scroll'>
        <div :class="!tagShow?'container-show tag-show':'container-show'">
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </el-scrollbar>
    </div>
    <!-- <div class="right-panel" @click='drawerSetting = true'>
      <i class="el-icon-setting" />
    </div> -->
    <el-drawer
      title="配置中心"
      size='260px'
      :visible.sync="drawerSetting">
      <div class="box-drawer">
        <div class="drawer-item">
          <span>主题切换</span>
          <el-switch v-model="theme" @change='colorChange' />
        </div>
        <div class="drawer-item">
          <span>开启Tags-View</span>
          <el-switch v-model="tagShow" @change='tagChange' />
        </div>
      </div>
    </el-drawer>
    <el-drawer
      title="消息中心"
      :visible.sync="drawer">
      <empty-show iconLeft="50%" :hide="true" />
    </el-drawer>
    <el-dialog title="修改密码" :visible.sync="pwdModel" width='640px' @keyup.enter.native="modifyPwd">
      <my-form
        :ref='pwdForm.ref'
        :formConfig="pwdForm"
      ></my-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdModel = false">取 消</el-button>
        <el-button type="primary" @click.native="modifyPwd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="账号管理" :visible.sync="infoModel" width='640px'>
      <div class="person-info">
        <div class="info-avatar">
          <el-image v-if='infoForm.formModel.avatarId' :src='infoForm.formModel.avatarId' class='image-avatar'>
            <div slot="error" class="icon-avatar">
              <i class="el-icon-user-solid"></i>
            </div>
          </el-image>
          <div v-else class="icon-avatar">
            <i class="el-icon-user-solid"></i>
          </div>
          <upload-file type='avatar' avatarSlot='avatarSlot' :progress='progressObj' @uploadEvent='beforeUpload'>
            <div calss='avatar-show' slot='avatarSlot'>
              <el-button size="small" style='margin-left: 20px'>{{infoForm.formModel.avatarId?'更换头像':'上传头像'}}</el-button>
            </div>
          </upload-file>
        </div>
        <my-form
          :ref='infoForm.ref'
          :formConfig="infoForm"
        >
        <span slot='userName'>abc@ss.cn</span>
        <span slot='role'>管理员</span>
        <span slot='company'>科技有限公司</span>
        </my-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoModel = false">取 消</el-button>
        <el-button type="primary" @click.native="infoModel = false">更新信息</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  .index-layout{
    width: 100%;
    height: 100%;
    position: relative;
    .layout-sidebar{
      transition: width 0.28s;
      width: 240px;
      background-color: #165787;
      height: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
      .sider-logo{
        width: 100%;
        height: 64px;
        font-size: 24px;
        font-weight: 600;
        color: #fff;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .sider-menu{
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    }
    .layout-container{
      min-height: 100%;
      transition: all .28s;
      margin-left: 240px;
      position: relative;
      .container-header{
        background-color: #fff;
        .info-header{
          height: 64px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E7E8EA;
          .header-left{
            display: flex;
            align-items: center;
            .left-collapse{
              cursor: pointer;
              margin-right: 30px;
              i{
                font-size: 22px;
              }
            }
            .header-breadcrumb{
              .no-redirect{
                color: #9D9FA2;
                cursor: text;
              }
            }
          }
          .header-right{
            display: flex;
            align-items: center;
            .right-notice{
              height: 100%;
              padding-right: 15px;
              margin-right: 25px;
              display: flex;
              align-items: center;
              cursor: pointer;
              .el-icon-bell{
                font-size: 18px;
                color: #606266;
              }
            }
            .el-dropdown-link{
              color: #606266;
              display: flex;
              align-items: center;
              cursor: pointer;
              .el-avatar {
                margin-right: 10px;
              }
            }
          }
        }
      }
      .container-show{
        width: 100%;
        min-height: 100vh;
        padding: 120px 24px 0;
        background-color: #F9F9F9;
        position: relative;
        overflow: hidden;
      }
      .tag-show{
        padding-top: 90px;
      }
      .fixed-header{
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9;
        width: calc(100% - 240px);
        transition: width 0.28s;
        .info-header{
          padding-right: 42px;
        }
        & + .container-show{
          height: 100vh;
          // overflow-y: hidden;
        }
      }
    }
  }
  .index-collapse{
    .layout-container{
      margin-left: 65px;
      .fixed-header{
        width: calc(100% - 65px);
      }
    }
    /deep/ .el-menu{
      .el-submenu [class^=el-icon-], .el-submenu [class^=mio-], .el-menu-item [class^=el-icon-], .el-menu-item [class^=mio-]{
        margin-right: 22px;
      }
      .el-icon-arrow-right{
        display: none;
      }
    }
  }
  .right-panel{
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    position: fixed;
    right: 0;
    top: 240px;
    font-size: 24px;
    background-color: rgb(24, 144, 255);
    color: #fff;
    cursor: pointer;
    border-radius: 6px 0 0 6px;
    z-index: 10;
  }
  .box-drawer{
    padding: 0 20px;
    .drawer-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      span{
        color: #72767b;
        font-size: 14px;
      }
    }
  }
  /deep/ .wrap-scroll{
    &>.el-scrollbar__wrap {
      overflow-x: hidden;
    }
    &>.is-horizontal{
      display: none;
    }
    &>.is-vertical {
      right: 0;
    }
  }
  .person-info{
    display: flex;
    .info-avatar{
      width: 120px;
      flex-shrink: 0;
      margin-right: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .image-avatar{
        width: 90px;
        height: 90px;
        border-radius: 50%;
        margin-bottom: 20px;
      }
      .icon-avatar{
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background-color: #c0c4cc;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-icon-user-solid{
          font-size: 40px;
          color: #fff;
        }
      }
      .user-id{
        margin-top: 20px;
      }
    }
  }
</style>

<script>
import TagsView from '@/components/TagsView';
import MenuItem from '@/views/layout/MenuItem';
import MyForm from '@/components/MyForm'
import EmptyShow from "@/components/EmptyShow"
import UploadFile from "@/components/UploadFile"
import Format from "@/utils/format.js"
export default {
  data() {
    const validatePwdCheck = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error('请输入确认密码'));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('确认密码字符长度为6-16个字符'));
      } else if (value != this.pwdForm.formModel.newPwd) {
        callback(new Error('确认密码和新密码不一致'));
      } else {
        callback();
      }
    }
    return {
      drawer: false,
      drawerSetting: false,
      tagShow: true,
      theme: true,
      defaultActive: '',
      bredlList: [],
      pwdModel: false,
      pwdForm: {
        ref: 'pwdRef',
        labelWidth: '80px',
        labelPosition: 'right',
        requiredAsterisk: true,
        formItemList: [
          {
            type: "password",
            prop: "oldPwd",
            width: '450px',
            label: "原密码",
            placeholder: "请输入原密码"
          },
          {
            type: "password",
            prop: "newPwd",
            width: '450px',
            label: "新密码",
            placeholder: "请输入新密码"
          },
          {
            type: "password",
            prop: "confirPwd",
            width: '450px',
            label: "确认密码",
            placeholder: "请输入确认密码"
          }
        ],
        formModel: {
          oldPwd: '',
          newPwd: '',
          confirPwd: ''
        },
        rules: {
          oldPwd: [
            { required: true, validator: Format.FormValidate.Form('原密码').Password, trigger: 'blur' }
          ],
          newPwd: [
            { required: true, validator: Format.FormValidate.Form('新密码').Password, trigger: 'blur' }
          ],
          confirPwd: [
            { required: true, validator: validatePwdCheck, trigger: 'blur' }
          ]
        }
      },
      progressObj: {
        width: '180px'
      },
      infoModel: false,
      infoForm: {
        ref: 'userRef',
        labelWidth: '100px',
        labelPosition: 'right',
        requiredAsterisk: true,
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: '280px',
            label: "昵称：",
            placeholder: "请输入昵称"
          },
          {
            type: "text",
            prop: "phone",
            width: '280px',
            label: "手机号码：",
            placeholder: "请输入手机号码"
          },
          {
            label: "账号名：",
            slot: "userName"
          },
          {
            label: "账户类型：",
            slot: "role"
          },
          {
            label: "公司名称：",
            slot: "company"
          }
        ],
        formModel: {
          avatarId: '',
          name: '',
          phone: ''
        },
        rules: {
          name: [
            { required: true, validator: Format.FormValidate.Form('用户名').NoEmpty, trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: Format.FormValidate.Form('手机号码').Phone, trigger: 'blur' }
          ]
        }
      }
    }
  },
  created() {

  },
  mounted() {
    let collapse = sessionStorage.getItem('collapse')?sessionStorage.getItem('collapse'):'0'
    this.$store.dispatch('operateCollapse', collapse)
    this.theme = localStorage.getItem('propTheme')?(localStorage.getItem('propTheme') == 'custom-light'?true:false):true;
    this.tagShow = localStorage.getItem('tagShow')?(localStorage.getItem('tagShow') == 'false'?false:true):true;
    this.getBreadCrumb();
    this.getDefaultActive();
  },
  methods: {
    getBreadCrumb(){
      let matched = this.$route.matched;
      if(matched[0].path === matched[1].path){
        matched = this.$route.matched[0]
      }
      if(this.$route.name === 'index'){
        matched = [{ path: '/', meta: { title: '首页' }}]
      }else{
        matched = [{ path: '/', meta: { title: '首页' }}].concat(matched)
      }
       this.bredlList = matched;
    },
    handleLink(item) {
      let { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    },
    menuRefresh(index,indexPath){
      if(index === this.$route.fullPath){
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + index
          })
        })
      }
    },
    drawerOpen(){
      this.drawer = true;
    },
    logoIndex(){
      this.$router.push({ path: '/'})
    },
    colorChange(value){
      this.theme = value;
      if(value){
        document.body.setAttribute('data-theme','custom-light');
        localStorage.setItem('propTheme','custom-light');
        this.$router.replace({
          path: '/redirect' + this.$route.fullPath
        })
      }else{
        document.body.setAttribute('data-theme','custom-dark');
        localStorage.setItem('propTheme','custom-dark');
        this.$router.replace({
          path: '/redirect' + this.$route.fullPath
        })
      }
    },
    tagChange(value){
      this.tagShow = value;
      localStorage.setItem('tagShow',this.tagShow);
    },
    // 修改密码成功
    modifyPwd(){
      this.$refs['pwdRef'].$refs['pwdRef'].validate((valid) => {
        if (valid) {
          this.pwdModel = false
          this.logouts()
          this.$message.success('密码修改成功，请重新登录')
        } else {
          this.$message.warning('信息校验失败');
        }
      })
    },
    beforeUpload(file){
      this.infoForm.formModel.avatarId = 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
    },
    // 折叠变化
    collapseChange(){
      if(!this.collapse){
        let totalRoutes = this.totalRoutes
        for(let i = 0; i < totalRoutes.length; i++){
          if(totalRoutes[i].child){
            this.$refs.menu.close(totalRoutes[i].path)
          }
        }
      }
      setTimeout(()=>{
        let collapse = this.collapse?'0':'1'
        sessionStorage.setItem('collapse',collapse)
        this.$store.dispatch('operateCollapse', collapse)
      },200)
    },
    getDefaultActive(){
      let name = this.$route.name
      // 右侧隐藏页面需要重新赋值高亮
      if( name === 'organizationClientEdit'){
        this.defaultActive = '/organization/client'
      }else{
        this.defaultActive = this.$route.path
      }
    },
    // 下拉菜单选择
    async handleCommand(command){
      if(command === 'user'){
        if(this.$refs["userRef"]){
          this.$refs["userRef"].$refs["userRef"].resetFields();
        }
        this.infoForm.formModel = {
          avatarId: '',
          name: '蓓蓓',
          phone: '16654567963'
        }
        this.infoModel = true
      }else if(command === 'modifyPwd'){
        if(this.$refs["pwdRef"]){
          this.$refs["pwdRef"].$refs["pwdRef"].resetFields();
        }
        this.pwdModel = true
      }else if(command == 'logout'){
        await this.$store.dispatch('logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  },
  watch: {
    $route(route) {
      this.getBreadCrumb()
      this.getDefaultActive()
    }
  },
  components: {
    TagsView,
    MyForm,
    EmptyShow,
    UploadFile,
    MenuItem
  },
  computed: {
    collapse() {
      return this.$store.getters.getCollapse === '1'?true:false
    },
    totalRoutes(){
      return this.$store.getters.getTotalRoutes
    }
  }
}
</script>
