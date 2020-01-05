import { createStore, applyMiddleware, compose } from 'redux'

// 导入根rudecer
import rootReducer from './reducers'

// 导入异步的redux-thunk
import thunk from 'redux-thunk'

// 创建仓库并且导出
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer,composeEnhancers(applyMiddleware(thunk)))

export default store
