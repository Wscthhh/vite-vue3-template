import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosInterceptorManager, AxiosResponse } from 'axios'
import { apiKeyType, apiKeyDataType } from './index'
import store from '@/store/index'
import { IReqList } from '@/interfaces/common'

type ResultDataType = apiKeyDataType[apiKeyType]
/* 
NewAxiosInstance接口得根据自己情况来定
interceptors属性是必须要有，因为后续要用到拦截器
至于<T = any>(config: AxiosRequestConfig): AxiosPromise<T> 后续二次封装axios时采用的是此类型
*/
interface NewAxiosInstance extends AxiosInstance {
  /* 
设置泛型T，默认为any，将请求后的结果返回变成AxiosPromise<T>
*/
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse<ResultDataType>>
  }
}

//基本的初始化设置
let http: NewAxiosInstance = axios.create({
  timeout: 1000 * 60,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
})

let reqList = <IReqList[]>[]

const stopRepeatRequest = function (reqList: IReqList[], url: string, cancel: any, errorMessage: string) {
  // const errorMsg = errorMessage || ''
  const index = reqList.findIndex((item) => item.url === url)
  if (index !== -1) {
    reqList[index].cancel(reqList[index].errorMessage)
    allowRequest(reqList, url)
  }
  reqList.push({
    url,
    cancel,
    errorMessage: errorMessage || ''
  })
}

const allowRequest = function (reqList: IReqList[], url: string) {
  const index = reqList.findIndex((item) => item.url === url)
  if (index !== -1) {
    reqList.splice(index, 1)
  }
}

/**
 * @description 检查请求是否已经存在于vuex中
 * @param url string 请求地址
 * @param params any 请求参数
 * @param cancel CancelToken 取消请求方法
 */
const checkCache = (url: string, params: any, cancel: any) => {
  const cache = store.getters.requestCacheMap[url]
  if (cache && JSON.stringify(params) === JSON.stringify(cache.params)) {
    cancel(cache.data)
  }
}

/**
 * @description 将请求返回结果存入vuex中
 * @param url string 请求地址
 * @param params any 请求参数
 * @param data any 请求返回结果
 */
const cacheResponse = (url: string, params: any, data: any) => {
  store.dispatch('setRequestCacheMap', { url, params, data })
}

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    config.cancelToken = new axios.CancelToken((c: any) => {
      store.dispatch('pushCancelTokenArr', c)
      stopRepeatRequest(reqList, config.url as string, c, config.url as string)
      if (config.headers?.request && config.headers?.request === 'false') {
        checkCache(config.url as string, config.data, c)
      }
    })
    return config
  },
  (error) => {
    return error
  }
)

/**
 * 响应拦截器
 */
http.interceptors.response.use(
  (response) => {
    const request = response.config.headers?.request
    if (request === 'false') {
      const url = response.config.url
      const params = response.config.data
      cacheResponse(url as string, params, response.data)
    }
    allowRequest(reqList, response.config.url as string)
    return Promise.resolve(response)
  },
  (error) => {
    let { response } = error
    if (axios.isCancel(error)) {
      if (typeof error.message === 'string') {
        console.log('请求取消了', error.message)
      } else if (typeof error.message === 'object') {
        response = { data: { code: 200, msg: '成功', payload: error.message } }
        return Promise.resolve(response)
      }
    } else {
      allowRequest(reqList, error.config.url)
      const response = error.response

      //   if (!response && error.message === `timeout of ${error.config.timeout}ms exceeded`) {
      //     notification.error({
      //       message: `请求超时! http timeout!`
      //     })
      //     throw new Error('请求超时! http timeout!')
      //   }
      //   switch (response.status) {
      //     case 500:
      //       notification.error({
      //         message: response.data.msg ? response.data.msg : error.message,
      //         // description: response.data.msg ? response.data.msg : error.message
      //       })
      //       break
      //     case 404:
      //       notification.error({
      //         message: response.data.msg ? response.data.msg : error.message,
      //         // description: response.data.msg ? response.data.msg : error.message
      //       })
      //       break
      //     case 400:
      //       notification.error({
      //         message: response.data.msg ? response.data.msg : error.message,
      //         // description: response.data.msg ? response.data.msg : error.message
      //       })
      //       break
      //     case 401:
      //       //   console.log(reqList)
      //       if (reqList.length >= 1) return
      //       store.dispatch('deleteUserInfo')
      //       notification.warning({
      //         message: '您的登录信息已过期，请重新登录',
      //         duration: 1.5
      //       })
      //       break
      //     case 411:
      //       store.dispatch('deleteUserInfo')
      //       notification.error({
      //         message: response.data.msg ? response.data.msg : error.message
      //         // message: `HTTP CODE ${response.status}`,
      //         // description: response.data.msg ? response.data.msg : error.message
      //   })
      //   break
      // default:
      //   break
      //   }
    }
    return Promise.reject(error)
  }
)

export default http

function thrown(thrown: any) {
  throw new Error('Function not implemented.')
}
