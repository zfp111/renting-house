import {combineReducers} from 'redux'

// 导入各个子recucer
import filters from './filters'
import community from './community'

// combineReducers 它是用来合并多个reducer，有点类似于vuex中module的感觉
export default combineReducers({
    filters,
    community
})