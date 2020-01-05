import React, { Component } from 'react'

import styles from './index.module.scss'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'

export default class Rent extends Component {
  state = {
    list: null
  }

  componentDidMount() {
    this.getRentListData()
  }

  getRentListData = async () => {
    const result = await this.$axios.get('/user/houses')

    if (result.data.status === 200) {
      this.setState({
        list: result.data.body
      })
    }
  }

  renderHouseList = () => {
    return (
      <div className={styles.houses}>
        {this.state.list.map(item => (
          <HouseItem key={item.houseCode} {...item} />
        ))}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        <NavHeader>我的出租列表</NavHeader>
        {this.state.list && this.renderHouseList()}
      </div>
    )
  }
}
