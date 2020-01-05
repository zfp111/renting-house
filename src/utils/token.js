const KEY = 'login_token'

export const setToken = token => {
  window.localStorage.setItem(KEY, token)
}

export const getToken = () => {
  return window.localStorage.getItem(KEY)
}

export const removeToken = () => {
  window.localStorage.removeItem(KEY)
}

/**
 * 判断是否登录了
 */
export const isAuth = () => {
  if (window.localStorage.getItem(KEY)) return true

  return false
}
