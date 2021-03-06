<template>
  <div class='index-form'>
    <el-form
      :ref="formConfig.ref"
      :inline="formConfig.inline || false"
      :model="formConfig.formModel"
      :label-position="formConfig.labelPosition || 'left'"
      :label-width="formConfig.labelWidth"
      :hide-required-asterisk="formConfig.requiredAsterisk === false?false:true"
      :rules="formConfig.rules"
      :class='formConfig.inline?"form-box form-search":"form-search"'
      @keyup.enter.native="eventBind(formConfig.handleEnter,formConfig.ref)"
    >
      <el-form-item
        v-for="(item,index) in formConfig.formItemList"
        v-if='!item.hide'
        :key="index"
        :style='{marginRight: formConfig.marginRight || item.marginRight, marginBottom: formConfig.marginBottom || item.marginBottom}'
        :class='item.class'
        :label="item.label"
        :prop="item.prop"
      >
        <!-- 输入框文本和密码 -->
        <el-input
          v-if="item.type==='text' || item.type==='password'"
          v-model="formConfig.formModel[item.prop]"
          :type='item.type'
          :style='{width: item.width}'
          :disabled="item.disabled"
          :clearable="item.clearable === false?false:true"
          :placeholder="item.placeholder"
          :show-password="item.type==='password'"
          @blur='eventBind(item.blur,formConfig.formModel[item.prop])'
          @clear='eventBind(item.blur,formConfig.formModel[item.prop])'
        >
          <i slot="prefix" v-if='item.prefix' :class='[item.prefix,"custom-icon iconfont"]' @click='eventBind(item.blur,formConfig.formModel[item.prop])'></i>
          <i slot="suffix" v-if='item.suffix' :class='[item.suffix,"custom-icon iconfont"]' @click='eventBind(item.blur,formConfig.formModel[item.prop])'></i>
          <template slot="prepend" v-if='item.prepend'>{{item.prepend}}</template>
        </el-input>
        <!-- 输入建议 -->
        <el-autocomplete
          v-else-if="item.type==='inputAuto'"
          v-model="formConfig.formModel[item.prop]"
          :style='{width: item.width}'
          :disabled="item.disabled"
          :clearable="item.clearable === false?false:true"
          :prefix-icon='item.prefix'
          :suffix-icon='item.suffix'
          :value-key='item.valueKey || "value"'
          :placeholder="item.placeholder"
          :fetch-suggestions="item.fetchSuggestions"
          @select="eventBind(item.select,formConfig.formModel[item.prop])"
        ></el-autocomplete>
        <!-- 验证码 -->
        <div class="form-code" v-else-if="item.type==='code'">
          <el-input
            v-model="formConfig.formModel[item.prop]"
            type='text'
            :style='{width: item.width}'
            :disabled="item.disabled"
            :clearable="item.clearable === false?false:true"
            :placeholder="item.placeholder"
            @blur='eventBind(item.blur,formConfig.formModel[item.prop])'
            @clear='eventBind(item.blur,formConfig.formModel[item.prop])'
          >
            <i slot="prefix" v-if='item.prefix' :class='[item.prefix,"custom-icon iconfont"]'></i>
            <i slot="suffix" v-if='item.suffix' :class='[item.suffix,"custom-icon iconfont"]'></i>
          </el-input>
          <div v-if='item.codeSlot'>
            <slot :name="item.codeSlot" />
          </div>
        </div>
        <!-- 选择器 -->
         <!-- 2种传递方法 item.change和item.visibleChange -->
        <el-select
          v-else-if="item.type==='select'"
          v-model="formConfig.formModel[item.prop]"
          :clearable="item.clearable === false?false:true"
          :multiple="item.multiple"
          :filterable="item.filterable === false?false:true"
          :allow-create="item.allowCreate"
          :default-first-option="item.firstOption"
          :style='{width: item.width}'
          :disabled="item.disabled"
          :placeholder="item.placeholder"
          @change='eventBind(item.change,formConfig.formModel[item.prop])'
          @visible-change='($event)=>{eventBinds(item.visibleChange,$event)}'
        >
          <el-option
            v-for="(optItem,index) in item.arrList"
            :key="item.optionsObj?optItem[item.optionsObj.value]:optItem.value"
            :label="item.optionsObj?optItem[item.optionsObj.label]:optItem.label"
            :value="item.optionsObj?optItem[item.optionsObj.value]:optItem.value"
          >
          <div v-if='item.slotObj' class='select-customize'>
            <div class="customize-label">{{item.optionsObj?optItem[item.optionsObj.label]:optItem.label}}</div>
            <div class="customize-value" v-if='item.slotObj.name'>{{optItem[item.slotObj.name]?optItem[item.slotObj.name]+' ~ '+optItem[item.slotObj.value]: '休息'}}</div>
          </div>
          </el-option>
        </el-select>
        <!-- 树形选择器 props为树形属性映射配置 ，treeData为树形数组对象，value为树形初始值 -->
        <tree-select
          v-else-if="item.type==='treeSelect'"
          :props="item.props"
          :treeData="item.treeData"
          :value="item.value"
          :disabled="item.disabled"
          @getValue='($event)=>{eventBinds(item.getValue,$event)}'
        >
        </tree-select>
        <!-- 单选框 -->
        <el-radio-group
          v-else-if="item.type==='radio'"
          :disabled="item.disabled"
          :class='item.vertical === true?"radio-vertical":""'
          v-model="formConfig.formModel[item.prop]"
          @change='eventBind(item.change,formConfig.formModel[item.prop])'
        >
          <el-radio
            v-for="(optItem,index) in item.arrList"
            :key="item.optionsObj?optItem[item.optionsObj.value]:optItem.value"
            :label="item.optionsObj?optItem[item.optionsObj.value]:optItem.value"
            :disabled="optItem.disabled"
            :border="optItem.border"
          >{{item.optionsObj?optItem[item.optionsObj.label]:optItem.label}}</el-radio>
        </el-radio-group>
        <!-- 多选框 -->
        <el-checkbox-group
          v-else-if="item.type==='checkbox'"
          v-model="formConfig.formModel[item.prop]"
          @change='eventBind(item.change,formConfig.formModel[item.prop])'
        >
          <el-checkbox
            v-for="(optItem,index) in item.arrList"
            :key="item.optionsObj?optItem[item.optionsObj.value]:optItem.value"
            :label="item.optionsObj?optItem[item.optionsObj.value]:optItem.value"
            :disabled="optItem.disabled"
            :border="optItem.border"
          >{{item.optionsObj?optItem[item.optionsObj.label]:optItem.label}}</el-checkbox>
        </el-checkbox-group>
        <!-- 日期选择器 -->
        <el-date-picker
          v-else-if="item.type==='date'"
          v-model="formConfig.formModel[item.prop]"
          :type="item.dateType || item.type"
          :style='{width: item.width}'
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :clearable="item.clearable === false?false:true"
          :picker-options="item.pickerOptions || {}"
          :value-format="item.valueFormat || 'yyyy-MM-dd'"
          :format="item.format || 'yyyy-MM-dd'"
          range-separator="至"
          :start-placeholder="item.startPlaceholder || '开始日期'"
          :end-placeholder="item.endPlaceholder || '结束日期'"
          @change='eventBind(item.change,formConfig.formModel[item.prop])'
        >
        </el-date-picker>
        <!-- 时间选择器 -->
        <el-time-picker
          v-else-if="item.type==='time'"
          v-model="formConfig.formModel[item.prop]"
          :style='{width: item.width}'
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :value-format="item.valueFormat || 'HH:mm:ss'"
          :format="item.format || 'HH:mm:ss'"
          :clearable="item.clearable === false?false:true"
          :is-range="item.isRange === false?false:true"
          :picker-options="item.pickerOptions || {}"
          range-separator="至"
          :start-placeholder="item.startPlaceholder || '开始时间'"
          :end-placeholder="item.endPlaceholder || '结束时间'"
          @change='eventBind(item.change,formConfig.formModel[item.prop])'
        >
        </el-time-picker>
        <!-- 开关 -->
        <el-switch
          v-else-if="item.type==='switch'"
          :active-text="item.activeText"
          :inactive-text='item.inactiveText'
          :active-color='item.activeColor'
          :inactive-color='item.inactiveColor'
          :disabled="item.disabled"
          v-model="formConfig.formModel[item.prop]"
          @change='eventBind(item.change,formConfig.formModel[item.prop])'
        >
        </el-switch>
        <!-- 滑块 -->
        <el-slider
          v-else-if="item.type==='slider'"
          v-model="formConfig.formModel[item.prop]"
          :show-stops="item.showStops"
          :max="item.max"
          :range="item.range"
          :style='{width: item.width}'
          @change='eventBind(item.change,formConfig.formModel[item.prop])'
        ></el-slider>
        <!-- 多行文本 -->
        <el-input
          v-else-if="item.type==='textarea'"
          v-model="formConfig.formModel[item.prop]"
          :style='{width: item.width}'
          :rows="3"
          :autosize='{minRows: 3, maxRows: 6}'
          :type='item.type'
          :disabled="item.disabled"
          :clearable="item.clearable === false?false:true"
          :placeholder="item.placeholder"
        ></el-input>
        <!-- 级联选择器 -->
        <el-cascader
          v-else-if="item.type==='cascader'"
          v-model="formConfig.formModel[item.prop]"
          :style='{width: item.width}'
          :options="item.arrList || []"
          :disabled="item.disabled"
          :clearable="item.clearable === false?false:true"
          :filterable="item.filterable === false?false:true"
          :placeholder="item.placeholder"
          :props="item.props || null"
          @change='eventBind(item.change,formConfig.formModel[item.prop])'
          >
        </el-cascader>
        <!-- 计数器 -->
        <el-input-number 
        v-else-if="item.type==='inputNumber'"
        :style='{width: item.width}'
        v-model="formConfig.formModel[item.prop]"
        :controls-position="item.controlsPosition || 'right'"  
        :min="item.min"
        :max="item.max"
        :step="item.step" 
        :step-strictly="item.stepStrictly === false?false:true"
        :size="item.size"
        @change='eventBind(item.change,formConfig.formModel[item.prop])'
        >
        </el-input-number>
        <div v-if='item.slot' :style='{width: item.slotWidth}'>
          <slot :name="item.slot" />
        </div>
        <span v-if='item.slotUnit' :style='{width: item.slotUnit.width,marginLeft: item.slotUnit.marginLeft}'>
          {{item.slotUnit.name}}
        </span>
      </el-form-item>
      <div class="search-group" v-if='formConfig.operate'>
        <div class="search-btn" :style='{marginLeft: item.marginLeft || "20px"}' v-if='!item.hide' v-for="(item, index) in formConfig.operate" :key="index" @click='eventBind(item.handleClick,formConfig.ref)'>
          <div class="btn-click"  :class='item.type?"btn-"+item.type:""' v-if='!item.slot'>
            <i  class="icon-show" :class='item.icon' v-if='item.icon'></i>
            <span>{{item.name}}</span>
          </div>
          <div v-else>
            <slot :name="item.slot" />
          </div>
        </div>
      </div>
    </el-form> 
    <div class="form-slot" v-if='formConfig.slot'>
      <slot :name="formConfig.slot" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-form{
  display: flex;
  justify-content: space-between;
  /deep/ .el-input__suffix{
    right: 10px;
  }
}
.form-code{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-box{
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}
.form-search{
  flex: 1;
}
.search-group{
  margin-bottom: 22px;
  display: flex;
  .search-btn {
    .btn-click {
      padding: 10px 20px;
      border-radius: 4px;
      border: 1px solid;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      @include font-color($color-W100, $color-W100);
      @include bg-color($color-B50, $color-B70);
      @include bd-color($color-B50, $color-B70);
      .icon-show {
        margin-right: 5px;
        font-size: 16px;
      }
    }
    .btn-transparent {
      @include font-color($color-G90, $color-W90);
      @include bg-color($color-W100, $color-C50);
      @include bd-color($color-G40, $color-W10);
    }
  }
}
.select-customize{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

<script>
import TreeSelect from '@/components/TreeSelect'
export default {
  data() {
    return {

    };
  },
  props: {
    formConfig: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    }
  },
  created() {},
  mounted() {

  },
  methods: {
    eventBind(event,arg){
      if(typeof event === 'function'){
        return event(arg);
      }
    },
    eventBinds(event,arg){
      if(typeof event === 'function'){
        return event(arg);
      }
    }
  },
  components: {
    TreeSelect
  },
  computed: {}
};
</script>