import axios from 'axios'

const KEY = 'hkzf_city_key'

/**
 * 保存城市到本地
 * @param {*} city {label:'深圳',value:"AREA|a6649a11-be98-b150"}
 */
export const setCity = city => {
    window.localStorage.setItem(KEY,JSON.stringify(city))
}

/**
 * 从本地取出保存的城市数据
 */
const getCity = () => {
    return window.localStorage.getItem(KEY)
}

/**
 * 获取定位城市，该方法中要返回Promise对象
 */
const BMap = window.BMap

export const getLocationCity = () => {
    /**
    if (本地没有) {
        return new Promise((resolve,reject) => {
            resolve(传递出去正确的结果)
        })
    } else {
        return Promise.resolve(传递出去的正确的结果)
    }
     */
    const city = getCity()

    if (!city) { // 本地没有之前缓存的城市
        return new Promise((resolve,reject) => {
            // 发送请求【百度地图定位API】，获取当前的定位城市(只能获取到城市的名字、经纬度)
            var myCity = new BMap.LocalCity()
            myCity.get(async result => {                
                // 再次发送请求给自家服务器，获取完整的城市信息(包含label和value)
                // /area/info?name=%E5%8C%97%E4%BA%AC
                const res = await axios.get(`/area/info?name=${result.name}`)

                // 把获取到的完整的城市信息，保存到本地
                setCity(res.data.body)

                // resolve 把结果传递给调用者
                resolve(res.data.body)
            })
        })
    } else {
        // return new Promise((resolve,reject) => {
        //     resolve(JSON.parse(city))
        // })
        return Promise.resolve(JSON.parse(city))
    }
}