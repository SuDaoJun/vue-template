<template>
  <div class="wrapper">
     <div class="wrapper-login" @keyup.enter='login'>
       <div class="login-title">
         <h3>标题</h3>
         <p>描述</p>
         <div class="title-img">
           <el-image :src="require('@/assets/img/bgLogin.png')"></el-image>
         </div>
       </div>
       <div class="login-form">
         <p class='form-login'>登录</p>
         <my-form :ref="loginForm.ref" :formConfig="loginForm">
           <div class='code-slot' slot='codeSlot' @click='refreshCode'>
             <Identify :identifyCode = 'identifyCode' canvasName='canvasLogin' :contentWidth='150'></Identify>
           </div>
         </my-form>
         <div class="btn-login" @click='login'>登录</div>
       </div>
     </div>
  </div>
</template>

<script>
import MyForm from "@/components/MyForm";
import Identify from "@/components/Identify";
import Format from "@/utils/format.js";
export default {
  data() {
    const codeCheck = (rule, value, callback) => {
      if (value === "" || value === undefined || value.length !== 4) {
        callback(new Error("验证码长度为6个字符"));
      } else if (
        value.length === 4 &&
        value.toUpperCase() !== this.identifyCode.toUpperCase()
      ) {
        callback(new Error("验证码错误"));
        this.refreshCode();
      } else {
        callback();
      }
    };
    return {
      identifyCode: "",
      identifyCodes: "234578ertypadfghjnmQERTYPADFGHJBNM",
      loginForm: {
        ref: "loginRef",
        marginBottom: "37px",
        formItemList: [
          {
            type: "text",
            prop: "userName",
            prefix: "el-icon-user-solid",
            placeholder: "账号"
          },
          {
            type: "password",
            prop: "password",
            prefix: "el-icon-s-goods",
            placeholder: "请输入密码"
          },
          {
            type: "code",
            prop: "code",
            width: "240px",
            prefix: "el-icon-right",
            placeholder: "验证码",
            codeSlot: "codeSlot"
          }
        ],
        formModel: {
          userName: "",
          password: "",
          code: ""
        },
        rules: {
          userName: [
            {
              required: true,
              validator: Format.FormValidate.Form("账号").NoEmpty,
              trigger: "blur"
            }
          ],
          password: [
            {
              required: true,
              validator: Format.FormValidate.Form("密码").Password,
              trigger: "blur"
            }
          ],
          code: [
            {
              required: true,
              validator: codeCheck,
              trigger: "blur"
            }
          ]
        }
      }
    };
  },
  created() {},
  mounted() {
    this.refreshCode();
  },
  methods: {
    getCode() {
      let str = "";
      for (let i = 0; i < 4; i++) {
        let index = Math.round(Math.random() * (this.identifyCodes.length - 1));
        str += this.identifyCodes[index];
      }
      return str;
    },
    refreshCode() {
      this.identifyCode = this.getCode();
    },
    login() {
      this.$refs["loginRef"].$refs["loginRef"].validate(valid => {
        if (valid) {
          let obj = {name: 'admin'}
          sessionStorage.setItem('token','token')
          sessionStorage.setItem("userInfo",JSON.stringify(obj))
          this.$store.dispatch('operateUserInfo', obj)
          let redirect = this.$route.query.redirect?this.$route.query.redirect:'';
          this.$router.push({ path: redirect || '/'})
        } else {
          this.$message.warning("信息校验失败");
        }
      });
    }
  },
  watch: {},
  components: {
    MyForm,
    Identify
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.wrapper-login {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  background-color: #313b4e;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-title {
    width: 600px;
    height: 600px;
    padding-top: 40px;
    padding-bottom: 60px;
    background-color: #273040;
    h3 {
      font-size: 30px;
      color: #fff;
      padding-left: 32px;
      margin-bottom: 45px;
      font-family: Adobe Heiti Std R;
    }
    p {
      font-size: 30px;
      font-family: FZLanTingHeiS-UL-GB;
      color: #fff;
      margin-bottom: 92px;
      text-align: center;
    }
    .title-img {
      padding: 0 64px;
    }
  }
  /deep/ .login-form {
    width: 600px;
    height: 600px;
    background-color: #fff;
    padding: 40px 70px 30px;
    box-shadow: 0px 5px 11px 3px rgba(143, 171, 216, 0.4);
    .form-login {
      font-size: 24px;
      color: #333333;
      margin-bottom: 60px;
    }
    .code-slot {
      cursor: pointer;
    }
    .el-input__inner {
      height: 62px;
      line-height: 62px;
      font-size: 18px;
      padding: 0 56px;
    }
    .el-input__prefix {
      top: 10px;
      left: 20px;
      i {
        font-size: 20px;
      }
    }
    .btn-login {
      height: 62px;
      line-height: 62px;
      text-align: center;
      background-color: #273040;
      border-radius: 10px;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      letter-spacing: 1px;
      margin-bottom: 28px;
      margin-top: 20px;
    }
    .go-register {
      color: #273040;
      font-size: 20px;
      letter-spacing: 1px;
      text-align: center;
      span {
        color: #19a2ff;
        cursor: pointer;
      }
    }
  }
}
</style>
