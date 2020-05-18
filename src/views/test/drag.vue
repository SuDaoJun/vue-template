<template>
  <div class="home">
    <el-select v-model="value" placeholder="请选择" @change='selectChange'>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div id="drag-list" class='data-list'>
      <div class="drag-target list-show" v-for="(item, index) in selectList" :key="index">
        <i :class='item.icon' v-show='item.icon'></i>
        <el-image
        v-show='item.pic'
        style="width: 60px; height: 60px"
        :src="item.pic"></el-image>
      </div>
    </div>
    <div id="drag-map" class='map-list'>
      <div class="drag-target list-show" :style="item.style" v-for="(item, index) in mapList" :key="index">
        <i :class='item.icon' v-show='item.icon'></i>
        <el-image
        v-show='item.pic'
        style="width: 60px; height: 60px"
        :src="item.pic"></el-image>
        <div class="box-close el-icon-error" @click='removeData(item,index)'>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// drag-map文档地址https://github.com/osvlabs/drag-map
import DragMap from 'drag-map';
export default {
  name: 'home',
  components: {},
  data () {
    return {
      options: [{
        value: 'icon',
        label: '图标'
      }, {
        value: 'pic',
        label: '图片'
      }, {
        value: 'mixing',
        label: '图片图标混合'
      }],
      value: 'icon',
      fileList: [],
      selectList: [
        {
          num: '0',
          icon: 'el-icon-edit'
        },
        {
          num: '1',
          icon: 'el-icon-eleme'
        },
        {
          num: '2',
          icon: 'el-icon-user'
        },
        {
          num: '3',
          icon: 'el-icon-phone'
        },
        {
          num: '4',
          icon: 'el-icon-warning'
        }
      ],
      mapList: [],
      dragMap: null
    };
  },
  mounted () {
    this.initDragMap();
  },
  methods: {
    selectChange(val){
      if(val === 'icon'){
        this.selectList = [
          {
            num: '0',
            icon: 'el-icon-edit'
          },
          {
            num: '1',
            icon: 'el-icon-eleme'
          },
          {
            num: '2',
            icon: 'el-icon-user'
          },
          {
            num: '3',
            icon: 'el-icon-phone'
          },
          {
            num: '4',
            icon: 'el-icon-warning'
          }
        ]
        this.mapList = []
      }else if(val === 'pic'){
        this.selectList = [
          {
            num: '0',
            pic: require('@/assets/img/icon-blue01.png')
          },
          {
            num: '1',
            pic: require('@/assets/img/icon-blue02.png')
          },
          {
            num: '2',
            pic: require('@/assets/img/icon-blue03.png')
          },
          {
            num: '3',
            pic: require('@/assets/img/icon-blue04.png')
          },
          {
            num: '4',
            pic: require('@/assets/img/icon-blue05.png')
          }
        ]
        this.mapList = []
      }else if(val === 'mixing'){
        this.selectList = [
          {
            num: '0',
            icon: 'el-icon-edit'
          },
          {
            num: '1',
            pic: require('@/assets/img/icon-blue04.png')
          },
          {
            num: '2',
            icon: 'el-icon-eleme'
          },
          {
            num: '3',
            pic: require('@/assets/img/icon-blue05.png')
          },
          {
            num: '4',
            icon: 'el-icon-user'
          }
        ]
        this.mapList = []
      }
    },
    initDragMap () {
      this.dragMap = new DragMap(
        {
          list: '#drag-list',   // 可选目标列表
          map: '#drag-map',     // 拖拽目标区域
          target: '.drag-target'  // 拖拽目标
        }
      )
      this.dragMap.on('drop', this.onDrop);
      this.dragMap.on('dragleave', this.onDropLeave)
    },
    onDrop (data) {
      const index = data.index;
      if (data.action === 'add') {  // add
        /*
        * 获取索引值对应数据，并使用...进行深拷贝
        * 设置style属性
        * 使用$set设置响应式属性，放入数组
        * */
       if(this.mapList.length > 0){
         this.mapList = this.mapList.filter((item)=>{
           return parseInt(item.num) !== index
         })
       }
        let target = {...this.selectList[index]}
        target.style = data.percentStyle;
        // this.mapList.push(target)
        this.$set(this.mapList, this.mapList.length, target)
      } else if(data.action === 'edit') {
        if(this.mapList[index]){
          this.mapList[index].style = data.percentStyle;
        }
      }
      // 渲染完成后，重新获取dom节点
      this.$nextTick(() => {
        this.dragMap.refresh();
      })
    },
    removeData(item,index){
      this.mapList.splice(index, 1);
      this.$nextTick(() => {
        this.dragMap.refresh();
      })
    },
    onDropLeave (data) {
      // remove
      this.mapList.splice(data.index, 1);
      this.$nextTick(() => {
        this.dragMap.refresh();
      })
    }
  }
}
</script>

<style lang="scss">
  .home {
    width: 100%;
    padding: 40px;
    .data-list {
      border: 1px solid #E4E7ED;
      margin-top: 40px;
      padding: 10px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .list-show{
      width: 80px;
      height: 80px;
      background-color: rgba(192,196,204,.3);
      margin: 0 10px 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: move;
      i {
        font-size: 40px;
        color: #E6A23C;
        overflow: hidden;
      }
    }
    .map-list {
      height: 600px;
      margin-top: 20px;
      position: relative;
      background: url('../../assets/img/test.jpg') no-repeat center;
      background-size: 100% 100%;
      .drag-target {
        position: absolute;
        .box-close{
          position: absolute;
          right: 5px;
          top: 5px;
          color: #909399;
          cursor: pointer;
          display: none;
        }
        &:hover .box-close{
          display: block;
        }
      }
    }
  }
</style>