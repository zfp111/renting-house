import React, { Component } from 'react'

import { Route, Switch, Redirect } from 'react-router-dom'

import { TabBar } from 'antd-mobile'

import styles from './index.module.scss'

// 导入子组件
import Home from '../Home'
import House from '../House'
import Info from '../Info'
import My from '../My'
import NotFound from '../NotFound'

export default class Layout extends Component {
  constructor(props) {
    super()

    this.state = {
      selectedPath: props.location.pathname
    }
  }

  // tabs数组
  TABS = [
    {
      title: '首页',
      icon: 'icon-index',
      path: '/layout/home'
    },
    {
      title: '找房',
      icon: 'icon-findHouse',
      path: '/layout/house'
    },
    {
      title: '资讯',
      icon: 'icon-info',
      path: '/layout/info'
    },
    {
      title: '我的',
      icon: 'icon-my',
      path: '/layout/my'
    }
  ]

  /**
   * 当 props 发生了改变的时候，执行，可以在里面覆盖掉 state 的值
   * @param {*} props 
   * @param {*} state 
   */
  static getDerivedStateFromProps(props, state){
    if (state.selectedPath !== props.location.pathname) {
      return {
        selectedPath: props.location.pathname
      }
    } else {
      return null
    }
  }

  /**
   * 渲染tabBar
   */
  renderTabBar = () => {
    return (
      <TabBar tintColor="#21B97A" noRenderContent>
        {this.TABS.map(item => {
          return <TabBar.Item 
            key={item.path} 
            title={item.title} 
            icon={<i className={`iconfont ${item.icon}`}/>}
            selectedIcon={<i className={`iconfont ${item.icon}`}/>}
            selected={this.state.selectedPath === item.path}
            onPress={() => {
              // 切换选中的高亮状态
              this.setState({
                selectedPath: item.path
              })

              // 让上面的路由部分切换
              if (this.state.selectedPath !== item.path) {
                this.props.history.push(item.path)
              }
            }}
          />
        })}
      </TabBar>
    )
  }

  render() {
    return (
      <div className={styles.layout}>
        {/* 配置嵌套路由规则 */}
        <div>
          <Switch>
            <Route path="/layout/home" component={Home} />
            <Route path="/layout/house" component={House} />
            <Route path="/layout/info" component={Info} />
            <Route path="/layout/my" component={My} />
            <Redirect exact from="/layout" to="/layout/home" />
            <Route component={NotFound} />
          </Switch>
        </div>
        <div className={styles.tabbar}>{this.renderTabBar()}</div>
      </div>
    )
  }
}
