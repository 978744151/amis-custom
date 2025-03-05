import React, { useState, useEffect } from 'react'

import { AmisEditor } from '../packages'
import { Button, Modal, Form, Input, Row, Col,message } from 'antd'
import './my-editor.scss'
import { downloadJSON, getRandomNumber, getTid, randomLenNum } from '../utils'
import { useStore } from '@/store/root'
import { observer } from 'mobx-react'
import axios from '@/plugins/axios'
import loginService from '@/services/login.js'

import { BrowserRouter as Router, Switch, Route, Link ,useParams,useLocation,useHistory} from 'react-router-dom'
import { SchemaObject } from 'amis'

function MyEditor({ theme,isEditor }: { theme: string ,isEditor:Boolean}) {
  const routeParam = useParams()


  // 随机字符串
  const [randomStr, setRandomStr] = useState(randomLenNum(4, true))

  async function  save() {
    sessionStorage.setItem('amisSchema', JSON.stringify(value))
    const res = await loginService.putAmisDetail({id:routeParam.id,title:routeParam.title,amisJson:JSON.stringify(value),status:0})
    console.log(res)
    if(res.data.data) message.success('成功');
    
  }
  const initJSON = sessionStorage.getItem('amisSchema')
  let initValue = {} as SchemaObject
  if (initJSON) {
    initValue = JSON.parse(initJSON)
  }
  const [value, setValue] = useState(initValue)
  const [isPreview, setPreview] = useState(false)
  const [visible, setVisible] = useState(false)
  const amisJson = ''
  const { auth } = useStore()
  const onFinish = ({ username="admin", password="123456", code }) => {
    auth.login({ username, password, code, randomStr }).then(() => {
      setVisible(false) 
    })
  }


  useEffect(()=>{
    const fetchData = async () => {
      const {data} = await loginService.getAmisDetail(routeParam.id)
      console.log(data)
      setValue(JSON.parse(data.data.amisJson))
    }
    fetchData()
  },[])
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div className="my-editor">
      <div className="my-editor__header">
        <div>{auth.app.appName}</div>
        <div>{auth.accessToken}</div>
        <div>
          <Link to="/preview">
            <Button
              className="preview-btn"
              type="dashed"
              onClick={() => {
                save()
              }}
            >
              预览生产
            </Button>
          </Link>

          <Button className="preview-btn" type="primary" onClick={() => setPreview(!isPreview)}>
            {isPreview ? '退出' : '预览'}
          </Button>
          <Button
            className="preview-btn"
            onClick={() => {
              save()
              // downloadJSON(value)
            }}
          >
            保存
          </Button>
          <Button
            onClick={() => {
              if (auth.accessToken) {
                auth.logout()
              } else {
                setVisible(true)
              }
            }}
          >
            {auth.accessToken ? '退出登录' : '登录'}
          </Button>
        </div>
      </div>
      {!isEditor && 
        <AmisEditor
        className="my-editor__body"
        value={value}
        preview={isPreview}
        axios={axios}
        onChange={(e) => setValue(e)}
        onPreview={() => setPreview(true)}
        showCustomRenderersPanel={true}
        theme={theme}
      />
      }
      
      <Modal
        title="登录"
        footer={null}
        open={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose={true}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default observer(MyEditor)
