let mqtt = require('mqtt')
import { Message } from 'iview';
let client = null
export default {
  launch(options, callback, callbackOpen) {
    console.log(options.modeType + '-'+ new Date().getTime())
    if(!client){
      client = mqtt('tcp://192.168.1.107:8083/mqtt', {
        username: options.username,
        password: options.password,
        // clientId: options.deviceId,
        clientId:  options.modeType + '-'+ new Date().getTime(),
        clean: false
      })
      client.on('connect', (e) => {
        callbackOpen('success')
      })
      client.on('message', (topic, message) => {
        console.log('收到消息')
        callback(topic, message)
      })
      client.on('error', (e) => {
        console.log('mqtt连接失败')
        callbackOpen('fail')
        client = null
        callback(null)
        setTimeout(()=>{
          launch(options, callback, callbackOpen)
        },5000)
      })
    }
  },
  end() {
    client.end()
    client = null
  },
  subscribe(topic,qos=1) {
    console.log('subscribe')
    console.log(topic)
    client.subscribe(topic, {qos},(err)=>{
      if(err){
        Message.warning('subscribe失败')
      }else{
        console.log('订阅成功')
      }
    })
  },
  publish(topic, message, qos=1) {
    console.log('publish')
    client.publish(topic, message, {qos},(err)=>{
      if(err){
        Message.warning('publish失败')
      }else{
        console.log('发布成功')
      }
    })
    // client.publish(topic, JSON.stringify(message), {qos})
  }
}