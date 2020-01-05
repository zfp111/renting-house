import { SET_COMMUNITY } from '../acionTypes/communityType'

/**
 * 保存小区的方法
 * @param {*} obj 有id和name 
 */
export const saveCommunity = obj => {
    return {
        type: SET_COMMUNITY,
        payload: obj
    }
}