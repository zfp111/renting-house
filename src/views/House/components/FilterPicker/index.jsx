import React, { Component } from 'react'
import { PickerView } from 'antd-mobile'
import { connect } from 'react-redux'
import FilterFooter from '../FilterFooter'

import * as filterActionCreator from '../../../../store/actionCreators/filterActionCreator'
import { bindActionCreators } from 'redux'

class FilterPicker extends Component {
  constructor(props) {
    super()

    this.state = {
      // 根据openType，取出对应的值，赋值给value
      value: props.selectValue[props.openType],
      openType: props.openType
    }
  }

  // new props  new state forceUpdate
  static getDerivedStateFromProps(props, state) {
    // 我们的筛选项，从一个切换到了另外一个
    if (props.openType != state.openType) {
      return {
        ...state,
        value: props.selectValue[props.openType], // 取出最新的openType的选中值赋值给 value
        openType: props.openType // 取出最新的openTyp赋值给 state中的openType
      }
    } else {
      return state
    }
  }

  select = val => {
    this.setState({
      value: val
    })
  }

  render() {
    const { value } = this.state
    const { openType, area, subway, rentType, price } = this.props
    let cols = 3
    let data = null
    switch (openType) {
      case 'area':
        data = [area, subway]
        break

      case 'mode':
        data = rentType
        cols = 1
        break

      case 'price':
        data = price
        cols = 1
        break

      default:
        break
    }

    return (
      <div>
        <PickerView
          value={value}
          onChange={this.select}
          data={data}
          cols={cols}
        />
        <FilterFooter
          onCancel={() => this.props.setOpenType('')}
          onOk={() => {
            this.props.setOpenType('')
            this.props.setSelectValue({ [openType]: value })
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = ({
  filters: {
    openType,
    filterData: { area, subway, rentType, price },
    selectValue
  }
}) => {
  // 会赋值给组件的props
  return {
    openType,
    area,
    subway,
    rentType,
    price,
    selectValue
  }
}

const mapDispatchToProps = dispatch => {
  // bindActionCreators 作用就是把 filterActionCreator 中的方法映射给组件的props
  return bindActionCreators(filterActionCreator, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPicker)
