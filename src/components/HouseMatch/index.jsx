import React, { Component } from 'react'

import styles from './index.module.scss'

import classNames from 'classnames'

// 所有房屋配置项
const HOUSE_PACKAGE = [
  {
    id: 1,
    name: '衣柜',
    icon: 'icon-wardrobe'
  },
  {
    id: 2,
    name: '洗衣机',
    icon: 'icon-wash'
  },
  {
    id: 3,
    name: '空调',
    icon: 'icon-air'
  },
  {
    id: 4,
    name: '天然气',
    icon: 'icon-gas'
  },
  {
    id: 5,
    name: '冰箱',
    icon: 'icon-ref'
  },
  {
    id: 6,
    name: '暖气',
    icon: 'icon-Heat'
  },
  {
    id: 7,
    name: '电视',
    icon: 'icon-vid'
  },
  {
    id: 8,
    name: '热水器',
    icon: 'icon-heater'
  },
  {
    id: 9,
    name: '宽带',
    icon: 'icon-broadband'
  },
  {
    id: 10,
    name: '沙发',
    icon: 'icon-sofa'
  }
]

export default class HouseMatch extends Component {
  constructor(props) {
    super()

    let supportings = null
    if (props.data) {
      // 在房屋详情页面中使用的时候，它传递过来的是一个字符串数组
      supportings = HOUSE_PACKAGE.filter(item => {
        return props.data.includes(item.name)
      })
    } else {
      // 没有给props传值，这个实在发布房源的时候用到的
      supportings = HOUSE_PACKAGE
    }

    this.state = {
      supportings,
      selectNames: [] // 选中的配套项的名字
    }
  }

  toggleSelect = name => {
    if (!this.props.selectable) return

    let oldArray = [...this.state.selectNames]

    if (oldArray.includes(name)) {
      oldArray = oldArray.filter(item => item !== name)
    } else {
      oldArray.push(name)
    }

    this.setState(
      {
        selectNames: oldArray
      },
      () => {
        this.props.onChange(this.state.selectNames.join('|'))
      }
    )
  }

  render() {
    const { selectNames } = this.state

    return (
      <ul className={styles.root}>
        {this.state.supportings.map(item => {
          return (
            <li
              className={classNames(styles.item, {
                [styles.active]: selectNames.includes(item.name)
              })}
              key={item.id}
              onClick={() => this.toggleSelect(item.name)}
            >
              <p>
                <i className={`iconfont ${item.icon} ${styles.icon}`}></i>
              </p>
              {item.name}
            </li>
          )
        })}
      </ul>
    )
  }
}

HouseMatch.defaultProps = {
  selectable: false
}
