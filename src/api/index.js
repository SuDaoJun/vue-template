/** 
 * api接口的统一封装
 */
import axiosObj from '@/api/axios';
let axios = axiosObj.axios;

//用户管理
const user = {
    userInfo (params) {
        return axios.post('/userInfo',params)
    }
}
const index = {
    rankList (params) {
        return axios.get('/rankList',params)
    }
}
const tableList = {
    dataList (params) {
        return axios.get('/table/analysis',{params})
    },
    accountList (params) {
        return axios.get('/user',{params})
    },
    dataEdit (params) {
        return axios.put('',params,{
            headers : {
                "Content-Type": "application/json;charset=UTF-8"
            }
        })
    },
    dataAdd (url,params){
        return axios.post(url,params)
    },
    dataDelete (url){
        return axios.delete(url)
    }
}
const content = {
  newList (params) {
      return axios.get('/information/selectAll',{params})
  },
  newAdd (params) {
      return axios.post('/information/add',params)
  },
  newEdit (params) {
      return axios.put('/information',params)
  },
  newsDelete(id){
      return axios.delete('/information/delete/'+id)
  }
}
const upload = {
  uploadFile(param, callback) {
    return axios.post('/file/upload', param, {
      headers: {
        "Content-Type": "multipart/form-data;charset=UTF-8"
      },
      onUploadProgress: progressEvent => {
        callback(progressEvent);
      }
    })
  }
}
export default {
    user,
    index,
    tableList,
    upload,
    content
}