/**
 * @author  huanxi
 * @date  2020/4/11 11:44 上午
 * @email 1355473748@qq.com
 */
import { post, get } from '../util/http'



export let getMusicList = (params) => get('/music/list', params)
export let getLink = (params) => get('/music/link', params)
export let save = (params) => post('/music/save', params)
export let download = (params) => get('/music/download', params)
export let getKey = (params) => get('/music/searchKey', params)
export let getInfo = (params) => get('/info', params)

