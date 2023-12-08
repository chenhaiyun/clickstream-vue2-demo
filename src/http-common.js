import axios from "axios";
import { Message, Loading } from 'element-ui'
import { ClickstreamAnalytics } from '@aws/clickstream-web';


const ConfigBaseURL = 'http://localhost:4001/aa' //默认路径，这里也可以使用env来判断环境
let loadingInstance = null //这里是loading
//使用create方法创建axios实例
export const Service = axios.create({
  timeout: 7000, // 请求超时时间
  baseURL: ConfigBaseURL,
  method: 'post',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
// 添加请求拦截器
Service.interceptors.request.use(config => {
  // Add Clickstream SDK
  ClickstreamAnalytics.record({
    name: 'http_request',
    attributes: { request_url: config.url, request_config: JSON.stringify(config) }
  });
  console.info("request config:",config)
  loadingInstance = Loading.service({
    lock: true,
    text: 'loading...'
  })
  return config
})
// 添加响应拦截器
Service.interceptors.response.use(response => {
  // Add Clickstream SDK
  console.info("response:",response)
  ClickstreamAnalytics.record({
    name: 'http_request',
    attributes: { response_url: response.request.request_url, response_config: JSON.stringify(response) }
  });
  loadingInstance.close()
  // console.log(response)
  return response.data
}, (error) => {
  console.info("error.request:",error.request);
  const msg = error.message !== undefined ? error.message : ''
  Message({
    message: '网络错误' + msg,
    type: 'error',
    duration: 3 * 1000
  })
  // Add Clickstream SDK
  console.info("error:", error.toString())
  ClickstreamAnalytics.record({
    name: 'http_error',
    attributes: { error_message: msg, error_code: error.request.status, request_url: error.request.responseURL}
  });
  loadingInstance.close()
  return Promise.reject(error)
})

// export default axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: {
//     "Content-type": "application/json"
//   }
// });
