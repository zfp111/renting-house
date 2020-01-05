import React, { Component } from 'react'

import styles from './index.module.scss'

import NavHeader from '../../components/NavHeader'

import { setCity,getLocationCity } from '../../utils/city'

import { AutoSizer, List } from 'react-virtualized'

import { Toast } from 'antd-mobile';

// 每一行标题的高度
const TITLE_HEIGHT = 36
// 每一行中，它下面的每一个城市的高度
const ROW_HEIGHT = 50

const HOT_CITYNAMES = ['北京','上海','广州','深圳']

export default class CityList extends Component {
  constructor() {
    super()

    this.state = {
      cityListObj: null, // 左边渲染列表所需要的数据
      cityIndexList: null, // 渲染右边索引的数组
      activeIndex: 0 // 右边激活的索引
    }
  }

  toggle = item => {
    if (!HOT_CITYNAMES.includes(item.label)) {
      Toast.info('该城市暂无房源哦~',1)
      return
    }

    // 更新本地的缓存
    setCity({label:item.label,value:item.value})

    // 通过编程式返回到首页
    this.props.history.goBack()
  }

  // 创建Ref
  listRef = React.createRef()

  componentDidMount() {
    // 获取城市列表数据
    this.getCityListData()
  }

  getCityListData = async () => {
    const result = await this.$axios.get('area/city?level=1')

    this.dealWithCityData(result.data.body)
  }

  /**
   * 处理渲染所需要的数据
   */
  dealWithCityData = async list => {
    // 1、处理服务返回的城市列表数据
    const tempObj = {}

    // 处理左边列表渲染所需的数据
    list.forEach(item => {
      // firstLetter 例如就是 a、b、c
      const firstLetter = item.short.substr(0, 1)

      if (tempObj[firstLetter]) {
        // 有值
        tempObj[firstLetter].push(item)
      } else {
        // 没有值
        tempObj[firstLetter] = [item]
      }
    })

    // 处理右边索引渲染所需要的数据
    const tempIndex = Object.keys(tempObj).sort()

    // 2、处理服务器返回的热门城市列表数据
    const result = await this.$axios.get('/area/hot')
    tempIndex.unshift('hot')
    tempObj['hot'] = result.data.body

    // 3、获取定位城市
    const locationCity = await getLocationCity()
    tempIndex.unshift('#')
    tempObj['#'] = [locationCity]

    this.setState({
      cityListObj: tempObj,
      cityIndexList: tempIndex
    })
  }

  // 格式化我们的字母
  formatLetter = letter => {
    switch (letter) {
      case '#':
        return '定位城市'

      case 'hot':
        return '热门城市'

      default:
        return letter.toUpperCase()
    }
  }

  // 渲染左边列表每一行
  rowRenderer = ({ key, index, style }) => {
    // 去除右边索引的每一个字母
    const letter = this.state.cityIndexList[index]

    // 去除每一个字母它下面的城市列表数组
    const list = this.state.cityListObj[letter]
    return (
      <div className={styles.city} key={key} style={style}>
        <div className={styles.title}>{this.formatLetter(letter)}</div>
        {list.map(item => {
          return (
            <div onClick={() => this.toggle(item)} key={item.value} className={styles.name}>
              {item.label}
            </div>
          )
        })}
      </div>
    )
  }

  // 计算每一行的高度
  calcRowHeight = ({ index }) => {
    // # hot a b c
    const cityIndex = this.state.cityIndexList[index]

    // 拿到 cityIndex 对应的数据
    const list = this.state.cityListObj[cityIndex]

    return TITLE_HEIGHT + list.length * ROW_HEIGHT
  }

  // 渲染右边的索引列表
  renderCityIndexList = () => {
    const { cityIndexList, activeIndex } = this.state

    return (
      <div className={styles.cityIndex}>
        {cityIndexList.map((item, index) => {
          return (
            <div
              key={item}
              className={styles.cityIndexItem}
              onClick={() => this.clickIndex(index)}
            >
              <span className={index === activeIndex ? styles.indexActive : ''}>
                {item === 'hot' ? '热' : item.toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  // 滚动左边的长列表触发的方法
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  // 点击右边的索引
  clickIndex = index => {
    this.listRef.current.scrollToRow(index)
  }

  render() {
    const { cityListObj, cityIndexList } = this.state
    return (
      <div className={styles.citylist}>
        {/* 渲染NavHeader子组件 */}
        <NavHeader>城市选择</NavHeader>
        {/* 渲染左边的长列表 */}
        {cityListObj && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={this.listRef}
                height={height}
                width={width}
                rowCount={cityIndexList.length}
                rowHeight={this.calcRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment="start"
              />
            )}
          </AutoSizer>
        )}
        {/* 渲染右边的索引列表 */}
        {cityIndexList && this.renderCityIndexList()}
      </div>
    )
  }
}
