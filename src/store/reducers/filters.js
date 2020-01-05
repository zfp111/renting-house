import {
  SET_OPEN_TYPE,
  SET_FILTER_DATA,
  SET_SELECT_VALUE,
  SET_SELECT_TITLE_VALUE
} from '../acionTypes/filterActionType'

const initState = {
  openType: '', // 这个就是我们要操作的openType，到时候更改不同openType就可以切换不同的组件
  filterData: {}, // 展示FilterPicker 与 FilterMore所需要的数据
  selectValue: {
    // 选中的值
    area: ['area', 'null'],
    mode: ['null'],
    price: ['null'],
    more: []
  },
  selectTitleValue: {
    // 标题选中时候的值，如果为true则高亮，false则不高亮
    area: false,
    mode: false,
    price: false,
    more: false
  },
  isOperationCompleted: false
}

// 导出去的纯函数
export default (state = initState, action) => {
  switch (action.type) {
    case SET_OPEN_TYPE:
      // 把之前的数据，进行深拷贝
      const newState1 = JSON.parse(JSON.stringify(state))
      newState1.isOperationCompleted = false
      newState1.openType = action.payload.openType

      // 处理selectTitleValue的选中状态
      Object.keys(newState1.selectTitleValue).forEach(key => {
        if (key === 'area') {
          newState1.selectTitleValue['area'] = newState1.selectValue['area'].length > 2
        } else if (key === 'mode' || key === 'price'){
          newState1.selectTitleValue[key] = newState1.selectValue[key][0] != 'null'
        } else if (key === 'more') {
          newState1.selectTitleValue['more'] = newState1.selectValue['more'].length > 0
        }
      })

      return newState1

    case SET_FILTER_DATA:
      // 把之前的数据，进行深拷贝
      const newState2 = JSON.parse(JSON.stringify(state))
      newState2.isOperationCompleted = false

      return { ...newState2, ...action.payload }

    case SET_SELECT_VALUE:
      // 把之前的数据，进行深拷贝
      const newState3 = JSON.parse(JSON.stringify(state))
      newState3.selectValue = { ...newState3.selectValue, ...action.payload }
      newState3.isOperationCompleted = true

      // 处理selectTitleValue的选中状态
      Object.keys(newState3.selectTitleValue).forEach(key => {
        if (key === 'area') {
          newState3.selectTitleValue['area'] = newState3.selectValue['area'].length > 2
        } else if (key === 'mode' || key === 'price'){
          newState3.selectTitleValue[key] = newState3.selectValue[key][0] != 'null'
        } else if (key === 'more') {
          newState3.selectTitleValue['more'] = newState3.selectValue['more'].length > 0
        }
      })

      // 点击确定之后，关闭掉FilterPicker或是FilterMore
      // newState3.openType = ''

      return newState3

    case SET_SELECT_TITLE_VALUE:
       // 把之前的数据，进行深拷贝
       const newState4 = JSON.parse(JSON.stringify(state))
       newState4.isOperationCompleted = false

       newState4.selectTitleValue = {...newState4.selectTitleValue,...action.payload}
       
       return newState4
    default:
      return state
  }
}
