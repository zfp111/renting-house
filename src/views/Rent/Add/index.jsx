import React, { Component } from 'react'

import NavHeader from '../../../components/NavHeader'

import {
  List,
  InputItem,
  Picker,
  TextareaItem,
  ImagePicker,
  Flex,
  Modal,
  Toast
} from 'antd-mobile'

import styles from './index.module.scss'

import { connect } from 'react-redux'

import HouseMatch from '../../../components/HouseMatch'

const Item = List.Item

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

class Add extends Component {
  constructor(props) {
    super()

    this.state = {
      community: props.community, // 小区的id
      communityName: props.communityName, // 小区的名称
      title: '', // 房屋标题
      description: '', // 房屋描述
      oriented: null, // 朝向
      price: '', // 价格
      roomType: null, // 房屋类型
      size: '', // 建筑面积
      floor: null, // 楼层
      files: [], // 图片
      supporting: '' // 房屋配套
    }
  }

  changeValue = (name, val) => {
    this.setState({
      [name]: val
    })
  }

  // 当选择头像的时候，触发的方法
  onChangeImage = (files, type, index) => {
    // console.log(files, type, index)
    this.setState({
      files
    })
  }

  // 取消发布
  cancelPublish = () => {
    Modal.alert('提示', '放弃发布房源?', [
      { text: '放弃', onPress: () => this.props.history.goBack() },
      {
        text: '继续编辑',
        onPress: null
      }
    ])
  }

  // 发布房源
  publishHouse = async () => {
    // 做发布之前的校验
    const {
      community, // 小区的id
      title, // 房屋标题
      description, // 房屋描述
      oriented, // 朝向
      supporting, // 房屋配套
      price, // 价格
      roomType, // 房屋类型
      size, // 建筑面积
      floor, // 楼层
      files // 头像
    } = this.state

    if (!community) {
      Toast.info('请选择小区', 0.8)
      return
    }

    if (price.trim().length === 0) {
      Toast.info('请输入租金', 0.8)
      return
    }

    if (size.trim().length === 0) {
      Toast.info('建筑面积', 0.8)
      return
    }

    if (!roomType) {
      Toast.info('请选择户型', 0.8)
      return
    }

    if (!floor) {
      Toast.info('请选择所在楼层', 0.8)
      return
    }

    if (!oriented) {
      Toast.info('请选择朝向', 0.8)
      return
    }

    if (title.trim().length === 0) {
      Toast.info('请输入标题', 0.8)
      return
    }

    if (files.length === 0) {
      Toast.info('请上传头像', 0.8)
      return
    }

    if (supporting.trim().length === 0) {
      Toast.info('请选择房屋配套', 0.8)
      return
    }

    // 1、先上传图片
    const formData = new FormData()
    files.forEach(item => {
      formData.append('file', item.file)
    })

    const result = await this.$axios.post('/houses/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (result.data.status !== 200) {
      Toast.info('文件上传失败', 1)
      return
    }

    // 发布房源
    const data = {
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community
    }

    // 处理上传之后的头像
    data.houseImg = result.data.body.join('|')

    const res = await this.$axios.post('/user/houses', data)
    if (res.data.status === 200) {
      Toast.info('发布房源成功~', 1, () => {
        this.props.history.replace('/rent')
      })
    }
  }

  render() {
    const {
      communityName,
      price,
      size,
      roomType,
      floor,
      oriented,
      title,
      description,
      files
    } = this.state
    return (
      <div className={styles.root}>
        <NavHeader>发布房源</NavHeader>
        <List renderHeader={() => '房源信息'}>
          <Item
            extra={communityName || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => this.props.history.push('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            value={price}
            onChange={val => this.changeValue('price', val)}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            value={size}
            onChange={val => this.changeValue('size', val)}
          >
            建筑面积
          </InputItem>
          <Picker
            data={roomTypeData}
            value={[roomType]}
            onChange={val => this.changeValue('roomType', val[0])}
            cols={1}
          >
            <List.Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </List.Item>
          </Picker>
          <Picker
            data={floorData}
            value={[floor]}
            cols={1}
            onChange={val => this.changeValue('floor', val[0])}
          >
            <List.Item arrow="horizontal">所在楼层</List.Item>
          </Picker>
          <Picker
            data={orientedData}
            cols={1}
            value={[oriented]}
            onChange={val => this.changeValue('oriented', val[0])}
          >
            <List.Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </List.Item>
          </Picker>
        </List>
        <List renderHeader={() => '房屋标题'}>
          <InputItem
            value={title}
            onChange={val => this.changeValue('title', val)}
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
          ></InputItem>
        </List>
        <List renderHeader={() => '房源头像'}>
          <ImagePicker
            files={files}
            onChange={this.onChangeImage}
            selectable={files.length < 8}
            multiple
          />
        </List>
        <List renderHeader={() => '房屋配套'}>
          <HouseMatch
            selectable
            onChange={val => this.setState({ supporting: val })}
          />
        </List>
        <List renderHeader={() => '房屋描述'}>
          <TextareaItem
            value={description}
            onChange={val => this.changeValue('description', val)}
            rows={6}
            placeholder="请输入房屋描述"
          ></TextareaItem>
        </List>
        <Flex className={styles.bottom}>
          <Flex.Item onClick={this.cancelPublish} className={styles.cancel}>
            取消
          </Flex.Item>
          <Flex.Item onClick={this.publishHouse} className={styles.confirm}>
            确定
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}

export default connect(({ community }) => {
  return community
}, null)(Add)
