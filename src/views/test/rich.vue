<template>
  <div class='index-random'>
    <h2>富文本编辑器</h2>
    <div class='index-edit'>
      <editor-bar v-model="detail" :isClear="isClear" @change="change"></editor-bar>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
import EditorBar from '@/components/wangEnduit'
export default {
  data() {
    return {
      random: 0,
      isClear: false,
      detail:""
    }
  },
  created() {

  },
  mounted() {
    this.random = Math.floor(Math.random() * 101);
  },
  methods: {
    change(val){
      console.log(val)
    }
  },
  components: { 
    EditorBar 
    },
  computed: {

  }
}
</script>