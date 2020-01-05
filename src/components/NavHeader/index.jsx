import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import { NavBar } from 'antd-mobile'

import { withRouter } from 'react-router-dom'

import classNames from 'classnames'

function NavHeader({ children, history, className, rightContent }) {
  return (
    <NavBar
      className={classNames(styles.navBar, className)}
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={() => history.goBack()}
      rightContent={rightContent}
    >
      {children}
    </NavBar>
  )
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired
}

NavHeader.defaultProps = {
  children: ''
}

export default withRouter(NavHeader)
