import React, { Component } from 'react'

import styles from './index.module.scss'

import NavHeader from '../../components/NavHeader'

import { getLocationCity } from '../../utils/city'

import { Toast } from 'antd-mobile'

import classNames from 'classnames'

import HouseItem from '../../components/HouseItem'

const BMap = window.BMap

// 圆形覆盖物的样式：
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends Component {
  state = {
    houseList: [], // 小区下面的房源列表
    isShow: false // 是否该显示展示房源的div
  }

  componentDidMount() {
    this.initMap()
  }

  initMap = async () => {
    const { label, value } = await getLocationCity()

    // 创建地图实例
    this.map = new BMap.Map('container')

    this.map.addEventListener('touchstart', () => {
      this.setState({
        isShow: false
      })
    })

    // 设置中心点坐标
    // var point = new BMap.Point(116.404, 39.915)
    // 利用百度地图提供的地址解析，通过城市名称，获取经纬度
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          this.map.centerAndZoom(point, 11)

          // 渲染三级覆盖物
          this.renderOverlays(value)
        }
      },
      label
    )

    // 地图初始化，同时设置地图展示级别
    // 如果地图级别越大，展示信息越详细 但是真实的距离越小
    // map.centerAndZoom(point, 11)
  }

  getTypeAndNextZoom = () => {
    let type = 'circle' // 圆形覆盖物，适合第一二级
    let nextZoom = 11 // 点击之后的缩放级别

    // 获取当前地图的缩放级别
    const currentZoom = this.map.getZoom()
    if (currentZoom > 10 && currentZoom < 12) {
      type = 'circle'
      nextZoom = 13
    } else if (currentZoom > 12 && currentZoom < 14) {
      type = 'circle'
      nextZoom = 15
    } else if (currentZoom > 14) {
      type = 'rect'
    }

    return {
      type,
      nextZoom
    }
  }

  // 渲染覆盖物（一共有三级）
  renderOverlays = async id => {
    Toast.loading('拼命加载中...', 0)
    const result = await this.$axios.get(`/area/map?id=${id}`)
    Toast.hide()

    const { type, nextZoom } = this.getTypeAndNextZoom()

    // 渲染覆盖物(告诉它，此刻该渲染圆形还是方形的覆盖物，以及地图的缩放级别)
    result.data.body.forEach(item => {
      if (type === 'circle') {
        this.renderCircleOverlays(item, nextZoom)
      } else {
        this.renderRectOverlays(item)
      }
    })
  }

  // 添加第一级、第二级覆盖物
  renderCircleOverlays = (item, nextZoom) => {
    // 根据item 生成 一个一个的覆盖物，并且创建好之后，添加到地图上
    const {
      coord: { longitude, latitude },
      count,
      label: name,
      value
    } = item

    // 这个是覆盖物的中心点，一定要记住，经度在前面，纬度在后面，不要弄错
    var point = new BMap.Point(longitude, latitude)
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(30, -30) //设置文本偏移量
    }

    var label = new BMap.Label('', opts) // 创建文本标注对象
    // 覆盖物的样式
    label.setStyle(labelStyle)
    // 覆盖物要显示的内容
    label.setContent(`<div class=${styles.bubble}>
      <p class=${styles.name}>${name}</p>
      <p class=${styles.name}>${count}</p>
    </div>`)
    // 给 label 添加点击事件
    label.addEventListener('click', () => {
      setTimeout(() => {
        // 清除已有的覆盖物
        this.map.clearOverlays()
      }, 0)

      // 变化地图的中心点和缩放级别
      this.map.centerAndZoom(point, nextZoom)

      // 调用renderOverlays请求二、三级覆盖物的数据，并且渲染
      this.renderOverlays(value)
    })

    // 添加覆盖物
    this.map.addOverlay(label)
  }

  // 添加第三级覆盖物
  renderRectOverlays = item => {
    const {
      coord: { longitude, latitude },
      label: name,
      count,
      value
    } = item

    // 创建覆盖物的中心点
    var point = new BMap.Point(longitude, latitude)
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -20) //设置文本偏移量
    }

    var label = new BMap.Label('', opts) // 创建文本标注对象
    // 添加覆盖物的样式
    label.setStyle(labelStyle)
    // 添加覆盖物的内容
    label.setContent(`
      <div class=${styles.rect}>
        <span class=${styles.housename}>${name}</span>
        <span class=${styles.housenum}>${count}</span>
        <i class=${styles.arrow}></i>
      </div>
    `)
    // 添加点击事件
    label.addEventListener('click', e => {
      if (e && e.changedTouches) {
        // 拿到鼠标或是手指点击的位置
        const { clientX, clientY } = e.changedTouches[0]

        // 计算应该移动的像素
        const moveX = window.innerWidth / 2 - clientX
        const moveY = (window.innerHeight - 330 + 45) / 2 - clientY

        // 让我们点击的小区显示在可视区域中心
        this.map.panBy(moveX, moveY)

        // 发送请求，获取该小区下面的房源列表
        this.getHouseListById(value)
      }
    })

    this.map.addOverlay(label)
  }

  // 根据小区的id，获取小区下面的房源信息
  getHouseListById = async id => {
    Toast.loading('数据加载中...', 0)
    const result = await this.$axios.get(`/houses?cityId=${id}`)
    Toast.hide()

    this.setState({
      houseList: result.data.body.list,
      isShow: true
    })
  }

  // 渲染房源列表
  renderHouseList = () => {
    const { houseList, isShow } = this.state
    // return <div className={[styles.houseList,isShow ? styles.show : ''].join(' ')}>
    return (
      <div className={classNames(styles.houseList, { [styles.show]: isShow })}>
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <a className={styles.titleMore} href="#/house/list">
            更多房源
          </a>
        </div>
        <div className={styles.houseItems}>
          {houseList.map(item => {
            return <HouseItem key={item.houseCode} {...item} />
          })}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container"></div>
        {this.renderHouseList()}
      </div>
    )
  }
}
