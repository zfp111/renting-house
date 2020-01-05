import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import styles from './index.module.scss'

import { getLocationCity } from '../../../utils/city'

import debounce from 'loadsh/debounce'

import { connect } from 'react-redux'
import * as communityActionCreator from '../../../store/actionCreators/communityActionCreator'
import { bindActionCreators } from 'redux'

class Search extends Component {
  state = {
    list: null
  }

  async componentDidMount() {
    const { value } = await getLocationCity()

    this.id = value

    // this.debounceFunc = this.debounce(() => this.getCommunityList(this.keyword), 1000)
  }

  // 防抖函数
  //   debounce = (fun, delay) => {
  //     return function(args) {
  //       let that = this
  //       let _args = args
  //       clearTimeout(fun.id)
  //       fun.id = setTimeout(function() {
  //         fun.call(that, _args)
  //       }, delay)
  //     }
  //   }

  getCommunityList = debounce(async keyword => {
    const result = await this.$axios.get(`/area/community`, {
      params: {
        id: this.id,
        name: keyword
      }
    })

    this.setState({
      list: result.data.body
    })
  }, 500)

  getKeyWord = keyword => {
    // this.keyword = keyword
    if (keyword.trim().length === 0) return

    this.getCommunityList(keyword)
  }

  // 保存选中的小区到仓库中
  saveCommunity = (community, communityName) => {
    this.props.saveCommunity({ community, communityName })

    this.props.history.goBack()
  }

  renderList = () => {
    return (
      <ul className={styles.tips}>
        {this.state.list.map(item => {
          return (
            <li
              key={item.community}
              onClick={() => {
                this.saveCommunity(item.community, item.communityName)
              }}
              className={styles.tip}
            >
              {item.communityName}
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        <SearchBar
          onChange={this.getKeyWord}
          placeholder="请输入小区名称或地址"
          onCancel={() => this.props.history.goBack()}
        />
        {this.state.list && this.renderList()}
      </div>
    )
  }
}

export default connect(null, dispatch =>
  bindActionCreators(communityActionCreator, dispatch)
)(Search)
