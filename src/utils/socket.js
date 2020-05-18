export const globalData = {
  wsUrl: "ws://192.168.31.104:9999",
  websock: null,
  mtype: {
    setType: '200201',
    controlType: '200202',
    successCode: '500200',
    failCode: '500101',
    resFailCode: '500112',
  },
  ptype: {
    // 参数设置类型
    thresholdValue: '2002010',
    rebootValue: '2002011',
    openKeepValue: '2002012',
    pwdValue: '2002013',
    adValue: '2002014',
    // 控制类型
    openDoorValue: '2002020',
    softUpdateValue: '2002021',
    lightnessValue: '2002022',
    volumeValue: '2002023',
    viewValue: '2002024',
  },
  resPtypeArr: [
    // 参数设置类型回复
    {
      ptype: '20020100',
      successText: '阈值设置成功',
      failText: '阈值设置失败'
    },
    {
      ptype: '20020101',
      successText: '重启设置成功',
      failText: '重启设置失败'
    },
    {
      ptype: '20020102',
      successText: '开门保持时间设置成功',
      failText: '开门保持时间设置失败'
    },
    {
      ptype: '20020103',
      successText: '密码设置成功',
      failText: '密码设置失败'
    },
    {
      ptype: '20020104',
      successText: '广告推送成功',
      failText: '广告推送失败'
    },
    // 控制类型回复
    {
      ptype: '20020200',
      successText: '开门成功',
      failText: '开门失败'
    },
    {
      ptype: '20020201',
      successText: '软件更新成功',
      failText: '软件更新失败'
    },
    {
      ptype: '20020202',
      successText: '亮度调节成功',
      failText: '亮度调节失败'
    },
    {
      ptype: '20020203',
      successText: '音量调节成功',
      failText: '音量调节失败'
    },
    {
      ptype: '20020204',
      successText: '视图模式更换成功',
      failText: '视图模式更换失败'
    }
  ]
}
//websocket
export class DeviceWs {
  constructor(options = {}) {
    //重连延迟函数序列
    this.setTime = ""
    //是否连接成功
    this.isConnect = false
    //心跳延迟函数序列
    this.heartsTime = 0
    //是否关闭心跳代码
    this.colseHeart = false
    // 消息头
    this.mtype = options.mtype
    this.clientId = options.clientId
    this.sn = options.sn
    // 操作类型
    this.ptype = options.ptype
    this.thresholdValue = options.thresholdValue
    this.restartTime = options.restartTime
    this.restartRule = options.restartRule
    this.openTime = options.openTime
    this.openPassword = options.openPassword
    this.adminPassword = options.adminPassword
    this.adTitle = options.adTitle
    this.adType = options.adType
    this.adContent = options.adContent
    this.effectiveTime  = options.effectiveTime
    this.deadline = options.deadline
    this.name = options.name
    this.version = options.version
    this.downloadPath = options.downloadPath
    this.desc = options.desc
    this.brightnessVal = options.brightnessVal
    this.volumeVal = options.volumeVal
    this.viewType = options.viewType
  }
  // ws用户认证连接
  connectWs(callback) {
    let that = this
    if(!globalData.websock){
      globalData.websock = new WebSocket(globalData.wsUrl)
      globalData.websock.onopen = function () {
        console.log('websocket已连接')
        that.socketOpen();
      }
    }
  }
  // 打开ws
  socketOpen(callback) {
    let that = this
    let websock = globalData.websock
    //检测异常关闭则执行重连
    websock.onerror = function (err) {
      console.log('websocket发生错误' + JSON.stringify(err))
      that.failReset();
    }
    websock.onclose = function (err) {
      console.log('websocket发生错误' + JSON.stringify(err))
      that.failReset();
    }
    // 打开ws发送消息
    // let msg = {
    //   "msg": 'heart'
    // }
    // websock.send(JSON.stringify(msg))
    this.isConnect = true;
    // this.heartConnect()
    this.resMsg(callback)
  }
  // 心跳发送
  heartConnect() {
    clearTimeout(this.heartsTime);
    this.heartsTime = setTimeout(() => {
      let heartbeat = {
        "msg": 'heart'
      }
      globalData.websock.send(JSON.stringify(heartbeat))
      this.heartConnect();
    }, 30 * 1000);
  }
  // 接受ws数据返回
  resMsg(callback) {
    globalData.websock.onmessage = function (res) {
      let response = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
      if(callback){
        callback(response)
      }
    }
  }
  // 失败处理
  failReset() {
    if (!this.colseHeart) {
      this.isConnect = false;
      this.resetWs();
    }
  }
  // ws重连
  resetWs() {
    //必须先清理之前的定时器
    let that = this;
    clearTimeout(this.setTime);
    //判断是否连接成功，成功则不再进行重新连接
    if (!this.isConnect) {
      //延迟发送
      globalData.websock = null
      this.setTime = setTimeout(() => {
        that.connectWs()
      }, 10 * 1000);
    }
  }
  //断开ws连接
  closeWs() {
    this.colseHeart = true;
    clearTimeout(this.setTime);
    clearTimeout(this.heartsTime);
    globalData.websock = null
    globalData.websock.close();
  }
  run(callback) {
    let msg = {}
    let {
      mtype, 
      ptype, 
      clientId, 
      sn, 
      thresholdValue, 
      restartTime, 
      restartRule, 
      openTime, 
      openPassword, 
      adminPassword,
      adTitle,
      adType,
      adContent,
      effectiveTime ,
      deadline,
      name,
      version,
      downloadPath,
      desc,
      brightnessVal,
      volumeVal,
      viewType,
    } = this
    if (mtype === globalData.mtype.setType) {
      // 参数设置类型
      if(ptype === globalData.ptype.thresholdValue){
         // 阀值设置
        msg = {
          mtype,
          clientId,
          sn,
          sendPayload: {
            ptype,
            thresholdValue
          }
        }
      }else if(ptype === globalData.ptype.rebootValue){
        // 重启设置
        msg = {
          mtype,
          clientId,
          sn,
          sendPayload: {
            ptype,
            restartTime,
            restartRule
          }
        }
      }else if(ptype === globalData.ptype.openKeepValue){
        // 开门保持时间设置
        msg = {
          mtype,
          clientId,
          sn,
          sendPayload: {
            ptype,
            openTime
          }
        }
      }else if(ptype === globalData.ptype.pwdValue){
        // 密码设置
        msg = {
          mtype,
          clientId,
          sn,
          sendPayload: {
            ptype,
            openPassword,
            adminPassword
          }
        }
      }else if(ptype === globalData.ptype.adValue){
        // 广告推送
        msg = {
          mtype,
          clientId,
          sn,
          sendPayload: {
            ptype,
            adTitle,
            adType,
            adType,
            adContent,
            effectiveTime,
            deadline
          }
        }
      }
    } else if (mtype === globalData.mtype.controlType) {
      // 控制类型
      if(ptype === globalData.ptype.openDoorValue){
         // 开门
        msg = {
          mtype,
          clientId,
          sn,
          sendPayload: {
            ptype
          }
        }
      }else if(ptype === globalData.ptype.softUpdateValue){
        // 软件更新
        msg = {
          mtype,
          clientId,
          sn,
          sendPayload: {
            ptype,
            name,
            version,
            downloadPath,
            desc
          }
        }
      }else if(ptype === globalData.ptype.lightnessValue){
        // 亮度调节
        msg = {
          mtype,
          clientId,
          sn,
          sendPayload: {
            ptype,
            brightnessVal
          }
        }
      }else if(ptype === globalData.ptype.volumeValue){
        // 音量调节
        msg = {
          mtype,
          clientId,
          sn,
          sendPayload: {
            ptype,
            volumeVal
          }
        }
      }else if(ptype === globalData.ptype.viewValue){
        // 视图调节
        msg = {
          mtype,
          clientId,
          sn,
          sendPayload: {
            ptype,
            viewType
          }
        }
      }
    }
    console.log(msg)
    globalData.websock.send(JSON.stringify(msg))
    this.resMsg(callback)
  }
}

export function wsRes(res){
  let resPtypeArr = globalData.resPtypeArr
  for(let i = 0; i < resPtypeArr.length; i++){
    if(res.ptype == resPtypeArr[i].ptype){
      if(res.statusCode == globalData.mtype.successCode){
        return {
          status: true,
          msg: resPtypeArr[i].successText
        }
      }else if(res.statusCode == globalData.mtype.failCode){
        return {
          status: false,
          msg: resPtypeArr[i].failText
        }
      }else if(res.statusCode == globalData.mtype.resFailCode){
        return {
          status: false,
          msg: '设备无响应'
        }
      }else{
        return {
          status: false,
          msg: '设备控制错误'
        }
      }
    }
  }
}