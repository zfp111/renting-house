import React, { Component } from 'react'

import styles from './index.module.scss'

import { Flex } from 'antd-mobile'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as filterActionCreators from '../../../../store/actionCreators/filterActionCreator'

import classNames from 'classnames'

const types = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

function FilterTitle(props) {
  return (
    <Flex className={styles.root}>
      {types.map(item => {
        const isSelect = props.selectTitleValue[item.type]

        return (
          <Flex.Item
            key={item.type}
            onClick={() => {
              // 触发更改openType的action
              props.setOpenType(item.type)
              // 触发更改selectTitleValue的action
              props.setSelectTitleValue({ [item.type]: true })
            }}
          >
            <span
              className={classNames(styles.dropdown, {
                [styles.selected]: isSelect
              })}
            >
              <span>{item.title}</span>
              <i className="iconfont icon-arrow"></i>
            </span>
          </Flex.Item>
        )
      })}
    </Flex>
  )
}

const mapStateToProps = ({ filters: { selectTitleValue } }) => {
  return {
    selectTitleValue
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(filterActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterTitle)
