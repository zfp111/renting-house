import React, { Component } from 'react'

import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'

import styles from './index.module.scss'

import { BASEURL } from '../../utils/url'

// 导入本地图片
import image1 from '../../assets/images/nav-1.png'
import image2 from '../../assets/images/nav-2.png'
import image3 from '../../assets/images/nav-3.png'
import image4 from '../../assets/images/nav-4.png'

import { Link } from 'react-router-dom'

// 导入子组件
import SearchHeader from '../../components/SearchHeader'

// 导入定位城市
import { getLocationCity } from '../../utils/city'

export default class Home extends Component {
  constructor() {
    super()

    this.state = {
      imgHeight: 212, // 轮播图图片固定的高度
      swipers: null, // 轮播图数据
      groups: null, // 租房小组数据
      news: null, // 最新咨询
      cityName: ''
    }
  }

  // 定义的实例属性
  navs = [
    { icon: image1, text: '整租', path: '/layout/house' },
    { icon: image2, text: '合租', path: '/layout/house' },
    { icon: image3, text: '地图找房', path: '/map' },
    { icon: image4, text: '去出租', path: '/rent/add' }
  ]

  async componentDidMount() {
    const { label } = await getLocationCity()

    this.setState({
      cityName: label
    })

    // 获取轮播图数据
    this.getSwiperData()

    // 获取租房小组数据
    this.getGroupsData()

    // 获取最新咨询数据
    this.getNewsData()
  }

  getSwiperData = async () => {
    const result = await this.$axios.get('/home/swiper')

    this.setState({
      swipers: result.data.body
    })
  }

  getGroupsData = async () => {
    const result = await this.$axios.get(
      'home/groups?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState({
      groups: result.data.body
    })
  }

  getNewsData = async () => {
    const result = await this.$axios.get(
      'home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState({
      news: result.data.body
    })
  }

  // 渲染轮播图
  renderSwiper = () => {
    return (
      <div className={styles.swipers}>
        <Carousel autoplay infinite>
          {this.state.swipers.map(item => (
            <a
              key={item.id}
              href="http://www.alipay.com"
              style={{
                display: 'inline-block',
                width: '100%',
                height: this.state.imgHeight
              }}
            >
              <img
                src={`${BASEURL}${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'))
                  this.setState({ imgHeight: 'auto' })
                }}
              />
            </a>
          ))}
        </Carousel>
      </div>
    )
  }

  // 渲染导航菜单
  renderNav = () => {
    return (
      <div className={styles.nav}>
        <Flex>
          {this.navs.map(item => {
            return (
              <Flex.Item key={item.text}>
                <Link to={item.path}>
                  <img src={item.icon} alt="" />
                  <p>{item.text}</p>
                </Link>
              </Flex.Item>
            )
          })}
        </Flex>
      </div>
    )
  }

  // 渲染租房小组数据
  renderGroups = () => {
    return (
      <div className={styles.groups}>
        <Flex>
          <Flex.Item className={styles.title}>租房小组</Flex.Item>
          <Flex.Item align="end">更多</Flex.Item>
        </Flex>
        <Grid
          data={this.state.groups}
          hasLine={false}
          square={false}
          columnNum={2}
          renderItem={dataItem => {
            return (
              <div key={dataItem.id} className={styles.navItem}>
                <div className={styles.left}>
                  <p>{dataItem.title}</p>
                  <p>{dataItem.desc}</p>
                </div>
                <div className={styles.right}>
                  <img src={`${BASEURL}${dataItem.imgSrc}`} alt="" />
                </div>
              </div>
            )
          }}
        />
      </div>
    )
  }

  /**
   * 渲染新闻数据
   */
  renderNews = () => {
    return (
      <div className={styles.news}>
        <h3 className={styles.groupTitle}>最新咨询</h3>
        {this.state.news.map(item => {
          return (
            <WingBlank className={styles.newsItem} size="md" key={item.id}>
              <div className={styles.imgWrap}>
                <img src={`${BASEURL}${item.imgSrc}`} alt="" />
              </div>
              <Flex
                className={styles.content}
                direction="column"
                justify="between"
              >
                <h3 className={styles.title}>{item.title}</h3>
                <Flex className={styles.info} direction="row" justify="between">
                  <span>{item.from}</span>
                  <span>{item.date}</span>
                </Flex>
              </Flex>
            </WingBlank>
          )
        })}
      </div>
    )
  }

  render() {
    const { cityName, swipers, groups, news } = this.state
    return (
      <div className={styles.root}>
        {/* 搜索条 */}
        <SearchHeader cityName={cityName}></SearchHeader>
        {/* 渲染轮播图 */}
        {swipers && this.renderSwiper()}
        {/* 渲染导航菜单 */}
        {this.renderNav()}
        {/* 渲染租房小组 */}
        {groups && this.renderGroups()}
        {/* 渲染最新咨询 */}
        {news && this.renderNews()}
      </div>
    )
  }
}
