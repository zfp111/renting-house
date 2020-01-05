import React from 'react'

import styles from './index.module.scss'

import classNames from 'classnames'

import { BASEURL } from '../../utils/url'

import { withRouter } from 'react-router-dom'

function HouseItem({ history,houseCode, desc, houseImg, price, tags, title, style }) {
  return (
    <div className={styles.house} style={style} onClick={() => history.push(`/detail/${houseCode}`)}>
      {/* 左边的图片 */}
      <div className={styles.imgWrap}>
        <img className={styles.img} src={`${BASEURL}${houseImg}`} alt="" />
      </div>
      {/* 右边的内容 */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{desc}</div>
        <div>
          {tags.map((item, index) => {
            const tagName = `tag${(index % 3) + 1}`
            return (
              <span
                key={item}
                className={classNames(styles.tag, styles[tagName])}
              >
                {item}
              </span>
            )
          })}
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>{price}</span>
          元/月
        </div>
      </div>
    </div>
  )
}

export default withRouter(HouseItem)
