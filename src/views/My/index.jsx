import React, { Component } from 'react'

import styles from './index.module.scss'

import { BASEURL } from '../../utils/url'

import { Button, Grid, Modal } from 'antd-mobile'

import { Link } from 'react-router-dom'

import { removeToken } from '../../utils/token'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-index', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record', to: '' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity',
    to: ''
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo', to: '' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust', to: '' }
]

export default class My extends Component {
  constructor() {
    super()

    this.state = {
      isLogin: false,
      userInfo: {
        nickname: '游客',
        avatar: '/img/profile/avatar.png'
      }
    }
  }

  componentDidMount() {
    this.getUserInfo()
  }

  getUserInfo = async () => {
    const result = await this.$axios.get('/user')

    if (result.data.status === 200) {
      this.setState({
        userInfo: {
          nickname: result.data.body.nickname,
          avatar: result.data.body.avatar
        },
        isLogin: true
      })
    }
  }

  // 退出
  logout = () => {
    Modal.alert('提示', '确定退出吗???', [
      { text: '取消', onPress: null },
      {
        text: '确定',
        onPress: async () => {
          const result = await this.$axios.post('/user/logout')

          if (result.data.status === 200) {
            // 删除token
            removeToken()
            // 重置数据
            this.setState({
              isLogin: false,
              userInfo: {
                nickname: '游客',
                avatar: '/img/profile/avatar.png'
              }
            })
          }
        }
      }
    ])
  }

  render() {
    const {
      userInfo: { nickname, avatar },
      isLogin
    } = this.state
    return (
      <div>
        {/* 背景图 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={`${BASEURL}/img/profile/bg.png`}
            alt=""
          />
          {/* 个人信息区域 */}
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img
                className={styles.avatar}
                src={`${BASEURL}${avatar}`}
                alt=""
              />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname}</div>
              <div className={styles.edit}>
                {isLogin ? (
                  <div className={styles.auth} onClick={this.logout}>
                    <span>退出</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      this.props.history.push('/login')
                    }}
                    type="primary"
                    size="small"
                    inline
                  >
                    去登录
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <Grid
          data={menus}
          hasLine={false}
          columnNum={3}
          square={false}
          renderItem={dataItem => {
            return (
              <Link key={dataItem.id} to={dataItem.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${dataItem.iconfont}`}></i>
                  <span>{dataItem.name}</span>
                </div>
              </Link>
            )
          }}
        />
        <div className={styles.ad}>
          <img src={`${BASEURL}/img/profile/join.png`} alt="" />
        </div>
      </div>
    )
  }
}
