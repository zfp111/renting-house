import React, { Component } from 'react'

import styles from './index.module.scss'

import { WhiteSpace, WingBlank, Flex, Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'

import { setToken } from '../../utils/token'

import { withFormik, Form, Field, ErrorMessage } from 'formik'

import axios from 'axios'

import * as yup from 'yup'

class Login extends Component {
  render() {
    return (
      <div className={styles.root}>
        <NavHeader>账号登录</NavHeader>
        <WhiteSpace size="xl" />
        <WingBlank size="lg">
          <Form>
            <div className={styles.formItem}>
              <Field
                placeholder="请输入账号"
                className={styles.input}
                type="text"
                name="username"
              />
            </div>
            <ErrorMessage
              name="username"
              component="div"
              style={{ color: 'red' }}
            />
            <div className={styles.formItem}>
              <Field
                placeholder="请输入密码"
                className={styles.input}
                type="password"
                name="password"
              />
            </div>
            <ErrorMessage
              name="password"
              component="div"
              style={{ color: 'red' }}
            />
            <div className={styles.formSubmit}>
              <Field className={styles.submit} type="submit" value="登录" />
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <a href="#">还没有账号，去注册</a>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// 用户名长度的正则
const USERNAMEREG = /^[a-zA-Z_0-9]{5,8}$/
const PASSWORDREG = /^[a-zA-Z_0-9]{5,12}$/

export default withFormik({
  mapPropsToValues: props => ({ username: 'test2', password: 'test2' }),

  // 结合yup实现表单验证
  validationSchema: yup.object().shape({
    username: yup
      .string()
      .required('用户名为必填项')
      .matches(USERNAMEREG, '长度为5到8位，只能出现数字、字母、下划线'),
    password: yup
      .string()
      .required('密码为必填项')
      .matches(PASSWORDREG, '长度为5到12位，只能出现数字、字母、下划线')
  }),
  /**
   * values 用户在表单中输入的值
   */
  handleSubmit: async (values, { props }) => {
    const result = await axios.post('/user/login', values)

    Toast.info(result.data.description, 1.5)
    if (result.data.status === 200) {
      // 设置token
      setToken(result.data.body.token)

      if (props.location.state) {
        // 登陆之后跳转到指定的页面
        // ['/my','/login','/rent']
        // props.history.push(props.location.state.toWhere)

        // ['/my','/rent']
        props.history.replace(props.location.state.toWhere)
      } else {
        // 退回到上个页面
        props.history.goBack()
      }
    }
  }
})(Login)
