import axios from 'axios'
import Cookies from 'js-cookie';

const configMethods = {
  baseURL: import.meta.env.VITE_URL_API,
  token: import.meta.env.VITE_TOKEN,
}

  axios.defaults.timeout = 60000

  axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500 // 默认的
  }

  axios.defaults.withCredentials = true // 跨域请求时发送Cookie

  const baseRequestConfig = {
    baseURL:configMethods.baseURL
  }
  
  const instancs = axios.create(baseRequestConfig)
    instancs.interceptors.request.use(
      (config) => {
        console.log(configMethods)
        const token =  Cookies.get(configMethods.token)
        if (token) {
          config.headers['Authorization'] = token // token
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    instancs.interceptors.response.use(
      (res) => {
        resolve(res)
        return res
      },
      (error) => {
        return Promise.reject(new Error(error))
      }
    )
  export default instancs

 
