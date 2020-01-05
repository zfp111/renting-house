import React from 'react'

import { isAuth } from '../../utils/token'

import { Route, Redirect } from 'react-router-dom'

/**
 * rest 剩余参数，就是除了它前面的参数以后的参数集合
 * 并且剩余参数必须放在最后一个参数
 */
function AuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        if (isAuth()) {
          return <Component {...props} />
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { toWhere: props.location.pathname }
              }}
            />
          )
        }
      }}
    />
  )
}

export default AuthRoute
