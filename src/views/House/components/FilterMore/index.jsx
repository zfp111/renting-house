import React, { Component } from 'react'

import { connect } from 'react-redux'
import FilterFooter from '../FilterFooter'

import styles from './index.module.scss'

import classNames from 'classnames'

import * as filterActionCreator from '../../../../store/actionCreators/filterActionCreator'
import { bindActionCreators } from 'redux'

class FilteMore extends Component {
  constructor(props) {
    super()

    this.state = {
      value: props.more
    }
  }

  toggleSelect = val => {
    // 深拷贝之前的数组
    let oldValue = JSON.parse(JSON.stringify(this.state.value))

    // 判断 val 是否之前存在于 oldValue 数组中，如果存在则干掉，如果不存在添加
    if (oldValue.includes(val)) {
      // 包含
      oldValue = oldValue.filter(item => item !== val)
    } else {
      // 不包含
      oldValue.push(val)
    }

    // 赋值给value，重新渲染之后，添加高亮
    this.setState({
      value: oldValue
    })
  }

  renderDd = data => {
    const { value } = this.state
    return (
      <dd className={styles.dd}>
        {data.map(item => {
          return (
            <span
              onClick={() => this.toggleSelect(item.value)}
              className={classNames(styles.tag, {
                [styles.tagActive]: value.includes(item.value)
              })}
              key={item.value}
            >
              {item.label}
            </span>
          )
        })}
      </dd>
    )
  }

  render() {
    const { roomType, oriented, floor, characteristic } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩 */}
        <div
          className={styles.mask}
          onClick={() => this.props.setOpenType('')}
        ></div>
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            {this.renderDd(roomType)}
            <dt className={styles.dt}>朝向</dt>
            {this.renderDd(oriented)}
            <dt className={styles.dt}>楼层</dt>
            {this.renderDd(floor)}
            <dt className={styles.dt}>房屋亮点</dt>
            {this.renderDd(characteristic)}
          </dl>
        </div>
        <div className={styles.footer}>
          <FilterFooter
            onCancel={() => this.setState({ value: [] })}
            onOk={() => {
              this.props.setOpenType('')
              this.props.setSelectValue({ more: this.state.value })
            }}
            cancelText="清除"
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({
  filters: {
    filterData: { roomType, oriented, floor, characteristic },
    selectValue: { more }
  }
}) => {
  // 返回的对象，将会赋值给组件的props
  return {
    roomType,
    oriented,
    floor,
    characteristic,
    more
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(filterActionCreator, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FilteMore)
