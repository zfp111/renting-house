import React, { Component } from 'react'

import styles from './index.module.scss'

// 导入子组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as filterActionCreator from '../../../../store/actionCreators/filterActionCreator'
import { Spring } from 'react-spring/renderprops'

class Filter extends Component {
  componentDidMount() {
    // 触发异步的action去发送网络请求获取数据
    this.props.asyncSetFilterData()
  }

  // 渲染遮罩
  renderMask = () => {
    const { openType } = this.props

    /**
    if (openType === '' || openType === 'more') return null

    return <div onClick={() => this.props.setOpenType('')} className={styles.mask}></div>
     */
    const isShow =
      openType === 'area' || openType === 'mode' || openType === 'price'

    return (
      <Spring to={{ opacity: isShow ? 1 : 0 }} config={{ duration: 250 }}>
        {props => {
          if (props.opacity === 0) {
            return null
          } else {
            return (
              <div
                style={props}
                onClick={() => this.props.setOpenType('')}
                className={styles.mask}
              ></div>
            )
          }
        }}
      </Spring>
    )
  }

  render() {
    const { openType } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩 */}
        {this.renderMask()}
        {/* 内容 */}
        <div className={styles.content}>
          <FilterTitle />
          {/* 根据openType的值，来渲染 FilterPicker 或是 FilterMore */}
          {(openType === 'area' ||
            openType === 'mode' ||
            openType === 'price') && <FilterPicker />}
          {openType === 'more' && <FilterMore />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ filters: { openType } }) => {
  return {
    openType
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(filterActionCreator, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
