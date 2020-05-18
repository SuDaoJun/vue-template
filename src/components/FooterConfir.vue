<template>
  <div :class='collapse?"footer-confir footer-collapse":"footer-confir"'>
    <el-button size="medium" style='margin-right: 40px;' @click.native='canceEvent'>{{cancelTxt}}</el-button>
    <el-button type="primary" size="medium" @click.native='submitEvent'>{{confirTxt}}</el-button>
  </div>
</template>

<script>
export default {
  name: "FooterConfir",
  props: {
    cancelTxt: {
      type: String,
      default: '返 回'
    },
    confirTxt: {
      type: String,
      default: '提 交'
    }
  },
  data() {
    return {

    };
  },
  mounted(){
    let collapse = sessionStorage.getItem('collapse')?sessionStorage.getItem('collapse'):'0'
    this.$store.dispatch('operateCollapse', collapse)
  },
  computed: {
    collapse() {
      return this.$store.getters.getCollapse === '1'?true:false
    }
  },
  methods: {
    canceEvent(){
      this.$router.back(-1)
      this.$emit('cancelEvent','')
    },
    submitEvent(){
      this.$emit('submitEvent','')
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer-confir{
    width: calc( 100% - 240px);
    height: 70px;
    position: fixed;
    right: 0;
    bottom: 0;
    background-color: #fff;
    box-shadow: 0px -12px 8px -12px rgba(0,0,0,.2);
    z-index: 9;
    transition: width 0.4s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .footer-collapse{
    width: calc( 100% - 65px);
  }
</style>
