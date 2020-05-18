import moment from 'moment'
import { Message } from "element-ui";

// 常量数据
export let constant = {
	reqSuccess: '10000',
	dataAlready: '10001',
	dataFail: '10002',
	pwdFail: '10003',
	codeFail: '10004',
	timeOver: '10005',
	randomFail: '10006',
  dataNot: '10007',
  statusFail: '10008',
  weekArr: [
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六",
    "周日"
  ]
}
// 与当前时间相差天数
export function diffDay(time, type = 'day') {
  let currentTime = moment();
  let endTime = moment(time);
  let diffTime = endTime.diff(currentTime, type)
  return diffTime
}
// 当前时间格式化
export function currentDay(type = 'time') {
  if(type === 'time'){
    return moment().format('YYYY-MM-DD HH:mm:ss')
  }else if(type === 'month'){
    return moment().format('YYYY-MM')
  }else if(type === 'day'){
    return moment().format('YYYY-MM-DD')
  }
}
// 传入时间格式化
export function timeTransform(time,type = 'time') {
  if(type === 'time'){
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  }else if(type === 'month'){
    return moment(time).format('YYYY-MM')
  }else if(type === 'day'){
    return moment(time).format('YYYY-MM-DD')
  }else if(type === 'hour'){
    return moment(time).format('HH:mm:ss')
  }
}
// 转化时间戳
export function timeValue(time = '') {
  if(time){
    return moment(time).valueOf()
  }else{
    return moment().valueOf()
  }
}
// 获取月份最大天数
export function monthMaxDay(time) {
  return moment(time, "YYYY-MM").daysInMonth()
}
// 根据type获取不同的基本数据
export function timeDataArr(type = 'day', startTime, endTime) {
  let dataObj = {
    xArr: [],
    baseArr: []
  }
  if(type === 'day'){
    for(let i = 0; i < 24; i++){
      let num = zeroHandle(i)
      let obj = {
        name: num,
        value: 0
      }
      dataObj.xArr.push(num)
      dataObj.baseArr.push(obj)
    }
  }else if(type === 'week'){
    let week = moment(startTime).format('E')
    for(let i = 1; i < 8; i++){
      let data = moment(startTime).subtract(week-i, 'days').format('YYYY-MM-DD')
      let obj = {
        name: data,
        value: 0
      }
      // dataObj.xArr.push(data)
      dataObj.xArr.push(constant.weekArr[Number(moment(data).format('E'))-1])
      dataObj.baseArr.push(obj)
    }
  }else if(type === 'month'){
    let monthLen = moment(startTime, "YYYY-MM").daysInMonth()
    let timeArr = startTime.split('-')
    for(let i = 1; i < monthLen + 1; i++){
      let num = zeroHandle(i)
      let time =  `${timeArr[0]}-${timeArr[1]}-${num}`
      let obj = {
        name: time,
        value: 0
      }
      dataObj.xArr.push(time)
      dataObj.baseArr.push(obj)
    }
  }else if(type === 'year'){
    for(let i = 1; i < 13; i++){
      let num = zeroHandle(i)
      let obj = {
        name: num,
        value: 0
      }
      dataObj.xArr.push(num)
      dataObj.baseArr.push(obj)
    }
  }else if(type === 'timeSelect'){
    let currentDate  = moment(startTime).valueOf()
    let stopDate   = moment(endTime).valueOf()
    while(currentDate <= stopDate){
      let data = moment(currentDate).format('YYYY-MM-DD')
      let obj = {
        name: data,
        value: 0
      }
      dataObj.xArr.push(data)
      dataObj.baseArr.push(obj)
      currentDate = moment(currentDate).add(1, 'days')
    }
  }
  return dataObj
}
function zeroHandle(num){
  if(num < 10){
    return '0' + num
  }else{
    return num.toString()
  }
}
// 判断深层次对象属性是否存在
export let objProp = (data, path) => {
  if (!data || !path) {
    return null
  }
  let tempArr = path.split('.');
  for (let i = 0; i < tempArr.length; i++) {
    let key = tempArr[i]
    if (data[key]) {
      data = data[key]
    } else {
      return null
    }
  }
  return data
}
// 获取数组对象中的id转成字符串通过','连接
export function getIds(arr,id = 'id'){
  let str = ''
  if(arr.length > 0){
    let idsArr = []
    arr.forEach(item=>{
      idsArr.push(item[id])
    })
    str = idsArr.join(',')
  }
  return str
}
// 通过ids获取数组对象
export function getObjArr(ids,compareArr,id='id'){
  let arr = []
  if(ids){
    let arrData = ids.split(',')
    compareArr.forEach(item=>{
      arrData.forEach(dataItem=>{
        if(dataItem == item[id]){
          arr.push(item)
        }
      })
    })
  }
  return arr
}
// 缓存设置有效期
export const timeLocalStorage = {
  setItem: function (key, value, dayNum) {
    let data = { value: value, expirse: new Date().getTime() + dayNum * 1000 * 60 * 60 * 24 };
    localStorage.setItem(key, JSON.stringify(data));
  },
  getItem: function (key) {
    if (localStorage.getItem(key)) {
      let data = JSON.parse(localStorage.getItem(key));
      if (data !== null) {
        if (data.expirse != null && data.expirse < new Date().getTime()) {
          localStorage.removeItem(key);
        } else {
          return data.value;
        }
      }
    }
    return null;
  }
}

// message弹窗只显示一个
let messageInstance = null;
export function mainMessage(options) {
  //如果弹窗已存在先关闭
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = Message(options);
}
let arr = ['success', 'warning', 'info', 'error'];
arr.forEach(function (type) {
  mainMessage[type] = function (options) {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    options.duration = type === 'success'?1500:3000;
    return mainMessage(options);
  };
})
// 文章内容h标签生成标题目录
function toToc(data) {
  let levelStack = []
  let result = '<div class="catalog-title">目录</div>\n'
  const addStartList = () => { result += `<div class="catalog-list">\n`; }
  const addEndList = () => { result += '</div>\n'; }
  const addLInk = (index, itemText) => { result += `<div class='catalog-link' title='${itemText}' id='title${index}'>${itemText}</div>\n`; }
  data.forEach(function (item, index) {
    let itemText = item.replace(/<[^>]+>/g, '')  // 匹配h标签中的文字
    let itemLabel = item.match(/<\w+?>/)[0]  // 匹配h?标签<h?>
    let levelIndex = levelStack.indexOf(itemLabel) // 判断数组里有无<h?>
    // 没有找到相应<h?>标签，则将新增ul、li
    if (levelIndex === -1) {
      levelStack.unshift(itemLabel)
      addStartList()
      addLInk(index, itemText)
    }
    // 找到了相应<h?>标签，并且在栈顶的位置则直接将li放在此ul下
    else if (levelIndex === 0) {
      addLInk(index, itemText)
    }
    // 找到了相应<h?>标签，但是不在栈顶位置，需要将之前的所有<h?>出栈并且打上闭合标签，最后新增li
    else {
      while (levelIndex--) {
        levelStack.shift()
        addEndList()
      }
      addLInk(index, itemText)
    }
  })
  // 如果栈中还有<h?>，全部出栈打上闭合标签
  while (levelStack.length) {
    levelStack.shift()
    addEndList()
  }
  return result
}

export function catalogList(content) {
  const toc = content.match(/<[hH][1-6]>.*?<\/[hH][1-6]>/g)
  let tocList = null
  if (toc && toc.length > 0) {
    toc.forEach((item, index) => {
      let _toc = `<div class='rich-title' id='title${index}'>${item} </div>`
      content = content.replace(item, _toc)
    })
    tocList = toToc(toc)
  }else{
    tocList = '<div class="catalog-title">目录（无）</div>\n'
  }
  let obj = {
    tocList,
    content
  }
  return obj
}