import axios from 'axios'
import { getLocationCity } from '../../utils/city'
import {
  SET_OPEN_TYPE,
  SET_FILTER_DATA,
  SET_SELECT_VALUE,
  SET_SELECT_TITLE_VALUE
} from '../acionTypes/filterActionType'

/**
 * 更改openType的同步action
 * @param {*} openType 你要打开的类型 'area' 'mode' 'price' 'more'
 */
export const setOpenType = openType => {
  return {
    type: SET_OPEN_TYPE,
    payload: { openType }
  }
}

/**
 * 同步的更改filterData的方法
 * @param {*} filterData
 */
const setFilterData = filterData => {
  return {
    type: SET_FILTER_DATA,
    payload: { filterData }
  }
}

/**
 * 异步的action，用于获取数据
 */
export const asyncSetFilterData = () => {
  return async dispatch => {
    const { value } = await getLocationCity()

    const result = await axios.get(`/houses/condition?id=${value}`)

    // 触发同步的action
    dispatch(setFilterData(result.data.body))
  }
}

/**
 * 触发选中值的action
 * 
 * @param {*} obj  {mode:['true']}   {pric:['PRICE|100001']}
 */
export const setSelectValue = obj => {
  return {
    type: SET_SELECT_VALUE,
    payload: obj
  }
}

/**
 * 触发标题选中的action
 * @param {*} titleObj {area:true} {price:true}
 */
export const setSelectTitleValue = titleObj => {
  return {
    type: SET_SELECT_TITLE_VALUE,
    payload: titleObj
  }
}
