import React from 'react'
import axios,{ AxiosInstance, AxiosStatic} from 'axios'
import { Editor } from 'amis-editor'
import { fetcherFactory } from '@/packages/utils/amis'
import './amis-editor.scss'
import '../widgets'
import 'moment/dist/locale/zh-cn'
import 'echarts-wordcloud'
import { copyToClickboard } from './clickboard.js'
import { type EditorProps } from 'amis-editor-core/lib/component/Editor'
import Cookies from 'js-cookie';
export interface AmisEditorProps extends EditorProps {
  axios: AxiosStatic | AxiosInstance
}

export default function AmisEditor(props: AmisEditorProps) {
  const {  amisEnv = {} } = props
  const configMethods = {
    baseURL: import.meta.env.VITE_URL_API,
    token: import.meta.env.VITE_TOKEN,
  }
  const fetcher =  async ({
    url, // 接口地址
    method, // 请求方法 get、post、put、delete
    data, // 请求数据
    responseType,
    config, // 其他配置
    headers // 请求头
  }: any) => {
    console.log(url,method,data)
    config = config || {};
    config.withCredentials = true;
    responseType && (config.responseType = responseType);

    if (config.cancelExecutor) {
      config.cancelToken = new (axios as any).CancelToken(
        config.cancelExecutor
      );
    }
    if(config.responseType){}
    config.headers = {...headers,Authorization: `${Cookies.get(configMethods.token)}`  };
    if (method !== 'post' && method !== 'put' && method !== 'patch') {
      if (data) {
        config.params = data;
      }
     
      const reponse = {data:{},status:0}
      console.log(reponse)
      reponse.data  = (await (axios as any)[method](url, config)).data.resultData
      reponse.status  = 0
      return reponse
    } else if (data && data instanceof FormData) {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (
      data &&
      typeof data !== 'string' &&
      !(data instanceof Blob) &&
      !(data instanceof ArrayBuffer)
    ) {
      data = JSON.stringify(data);
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
    }
    const res = await (axios as any)[method](url, data, config)
   
    if(res.data.code !== 0){
      ElNotification.error(res.data.msg)
    }else{
      ElNotification.success('操作成功')
    }
  
    return res.resultData
  }
  return (
    <div className="amis-editor-container">
      <Editor
        {...props}
        amisEnv={{
          ...amisEnv,
          fetcher,
          copy: (content, options) => {
            copyToClickboard(content)
          },
        }}
      />
    </div>
  )
}
