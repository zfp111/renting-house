import React, { Component } from 'react'

// 导入样式
import styles from './index.module.scss'

import { Flex, Toast } from 'antd-mobile'

// 导入子组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
import Sticky from '../../components/Sticky'
// import Sticky from 'dzh-react-sticky'

import { getLocationCity } from '../../utils/city'

import {
  AutoSizer,
  List,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'

import { connect } from 'react-redux'

class House extends Component {
  constructor() {
    super()

    this.state = {
      cityName: '',
      list: null, // 获取的房源数组
      count: 0 // 获取的房源总数
    }
  }

  // 城市id
  cityId = null
  // 过滤的条件
  filters = {}
  // 是否加载完毕
  isLoaded = false

  async componentDidMount() {
    const { label, value } = await getLocationCity()

    this.setState({
      cityName: label
    })

    // 赋值城市id
    this.cityId = value

    // 加载第一页的数据
    this.getHouseList()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOperationCompleted) return

    // 处理筛选条件的数据，赋值给filters
    // 处理area 和 subway
    this.filters['area'] = null
    this.filters['subway'] = null
    const areaKey = nextProps.selectValue.area[0]
    if (nextProps.selectValue.area[1] !== 'null') {
      this.filters[areaKey] =
        nextProps.selectValue.area[2] == 'null'
          ? nextProps.selectValue.area[1]
          : nextProps.selectValue.area[2]
    }

    // 处理 mode 和 price more
    if (nextProps.selectValue.mode[0] !== 'null') {
      this.filters['rentType'] = nextProps.selectValue.mode[0]
    }

    if (nextProps.selectValue.price[0] !== 'null') {
      this.filters['price'] = nextProps.selectValue.price[0]
    }

    if (nextProps.selectValue.more.length > 0) {
      this.filters['more'] = nextProps.selectValue.more.join(',')
    }

    // 然后从新加载第一页的数据
    this.getHouseList()
  }

  // 加载第一页的数据
  getHouseList = async () => {
    Toast.loading('数据加载中...', 0)

    const result = await this.$axios.get('/houses', {
      params: {
        ...this.filters,
        cityId: this.cityId,
        start: 1,
        end: 20
      }
    })

    // 加载完毕
    this.isLoaded = true
    Toast.hide()

    if (result.data.body.count > 0) {
      Toast.info(`共查询到 ${result.data.body.count} 套房源`, 1)
    }

    this.setState({
      list: result.data.body.list,
      count: result.data.body.count
    })
  }

  rowRenderer = ({ key, index, style }) => {
    const item = this.state.list[index]

    if (!item) {
      // 如果没有内容，返回一个占位的div
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      )
    }

    return <HouseItem style={style} key={key} {...item} />
  }

  // 判断某一个是否加载完毕
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  // 加载更多数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // console.log(startIndex,stopIndex)
    return new Promise(async (resolve, reject) => {
      Toast.loading('数据加载中...', 0)

      const result = await this.$axios.get('/houses', {
        params: {
          ...this.filters,
          cityId: this.cityId,
          start: startIndex,
          end: stopIndex
        }
      })

      // 加载完毕
      this.isLoaded = true
      Toast.hide()

      if (result.data.body.count > 0) {
        Toast.info(`共查询到 ${result.data.body.count} 套房源`, 1)
      }

      this.setState(
        {
          list: [...this.state.list, ...result.data.body.list],
          count: result.data.body.count
        },
        () => {
          // 加载更多执行完毕
          resolve()
        }
      )
    })
  }

  // 渲染房源列表
  renderHoustList = () => {
    const { count } = this.state
    return (
      <div className={styles.houseList}>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows} // 触发上拉加载更多的代码
          rowCount={count}
          minimumBatchSize={20} // 每页加载多少条
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, isScrolling, scrollTop }) => (
                <AutoSizer>
                  {({ width }) => (
                    <List
                      autoHeight
                      height={height}
                      rowCount={count}
                      rowHeight={120}
                      rowRenderer={this.rowRenderer}
                      width={width}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      </div>
    )
  }

  render() {
    const { list } = this.state
    return (
      <div className={styles.root}>
        <Flex className={styles.listHeader}>
          <i
            onClick={() => this.props.history.goBack()}
            className="iconfont icon-back"
          />
          <SearchHeader
            cityName={this.state.cityName}
            className={styles.mySearchBar}
          />
        </Flex>
        {/* 刷选子组件 */}
        <Sticky contentHeight={40}>
          <Filter />
        </Sticky>
        {/* 渲染房源列表 */}
        {list && this.renderHoustList()}
      </div>
    )
  }
}

const mapStateToProps = ({
  filters: { selectValue, isOperationCompleted }
}) => {
  // 这里面返回的对象赋值给组件的 props
  return {
    selectValue,
    isOperationCompleted
  }
}

export default connect(mapStateToProps, null)(House)
