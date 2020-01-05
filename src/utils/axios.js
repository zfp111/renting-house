import axios from 'axios'
import { Component } from 'react'
import { BASEURL } from './url'
import { getToken, removeToken } from './token'

// 设置基准路径
axios.defaults.baseURL = BASEURL

// 设置拦截器
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }

    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.data.status === 400) {
    removeToken()
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
})

Component.prototype.$axios = axios
