import React, { Component } from 'react'

import styles from './index.module.scss'

export default class Sticky extends Component {
  placeholderRef = React.createRef()
  contentRef = React.createRef()

  handleScroll = () => {
    const placeholderDom = this.placeholderRef.current
    const contentDom = this.contentRef.current

    // 监测 placeholderDom 距离顶部的间距
    const { top } = placeholderDom.getBoundingClientRect()

    if (top < 0) {
      placeholderDom.style.height = `${this.props.contentHeight}px`
      contentDom.classList.add(styles.fixed)
    } else {
      placeholderDom.style.height = '0px'
      contentDom.classList.remove(styles.fixed)
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <div>
        {/* 这是一个占位的div,刚开始高度为0 */}
        <div ref={this.placeholderRef}></div>

        {/* 这个其实就是筛选组件 */}
        <div ref={this.contentRef}>{this.props.children}</div>
      </div>
    )
  }
}

Sticky.defaultProps = {
  contentHeight: 40
}
