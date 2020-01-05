import React, { Component } from 'react'

import styles from './index.module.scss'

import { WhiteSpace, WingBlank, Flex, Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'

import { setToken } from '../../utils/token'

export default class Login extends Component {
  state = {
    username: 'test2',
    password: 'test2'
  }

  login = async e => {
    e.preventDefault()

    const result = await this.$axios.post('/user/login', this.state)

    Toast.info(result.data.description, 1.5)
    if (result.data.status === 200) {
      // 设置token
      setToken(result.data.body.token)

      // 退回到上个页面
      this.props.history.goBack()
    }
  }

  changeValue = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <div className={styles.root}>
        <NavHeader>账号登录</NavHeader>
        <WhiteSpace size="xl" />
        <WingBlank size="lg">
          <form onSubmit={this.login}>
            <div className={styles.formItem}>
              <input
                placeholder="请输入账号"
                className={styles.input}
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.changeValue}
              />
            </div>
            <div className={styles.formItem}>
              <input
                placeholder="请输入密码"
                className={styles.input}
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.changeValue}
              />
            </div>
            <div className={styles.formSubmit}>
              <input className={styles.submit} type="submit" value="登录" />
            </div>
          </form>
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
