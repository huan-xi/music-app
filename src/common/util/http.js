/**
 * Created by huanxi
 */
import axios from 'axios'
import Qs from 'qs'
import context from '../../main'
import Config from './config'

axios.defaults.timeout = 50000
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' // 此处是增加的代码，设置请求头的类型

// http request 拦截器
axios.interceptors.request.use(
    (config) => {
        config.baseURL = Config.baseUrl

        if (config.method === 'post') {
            config.data = Qs.stringify(config.data)
        }
        return config
    },
    error => Promise.reject(error)
)


// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        reject(error)
    }
)

/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */

export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params
        })
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                if (err !== false) {
                    context.$message.error('服务器请求错误')
                }
                reject(err)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then((response) => {
                resolve(response.data)
            }, (err) => {
                if (err !== false) {
                    context.$message.error('服务器请求错误')
                }
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then((response) => {
                resolve(response.data)
            }, (err) => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then((response) => {
                resolve(response.data)
            }, (err) => {
                reject(err)
            })
    })
}

/**
 * 封装delete方法
 * @param url
 * @param params
 * @returns {Promise}
 */

export function deleteData(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {
            params
        })
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * 封装文件下载
 * @param url
 * @param data
 * @returns {Promise}
 */

export function exportData(url, name, params = {}) {
    return axios.get(url, {
        params,
        responseType: 'blob' // 告诉服务器我们需要的响应格式
    })
        .then((res) => {
            const blob = new Blob([res.data], {
                type: 'application/vnd.ms-excel' // 将会被放入到blob中的数组内容的MIME类型
            })
            const todayDate = new Date()
            const date = todayDate.getDate()
            const month = todayDate.getMonth() + 1
            const year = todayDate.getFullYear()
            const fileName = `${name + year}-${month}-${date}.xls`
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            window.URL.revokeObjectURL(link.href)
        })
        .catch((err) => {
            console.log(err)
        })
}

/**
 * 封装图片下载
 * @param url
 * @param data
 * @returns {Promise}
 */

export function downloadImg(url, name, params = {}) {
    return axios.get(url, {
        params,
        responseType: 'blob' // 告诉服务器我们需要的响应格式
    })
        .then((res) => {
            const blob = new Blob([res.data], {
                type: 'application/vnd.ms-image' // 将会被放入到blob中的数组内容的MIME类型
            })
            const fileName = name
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            window.URL.revokeObjectURL(link.href)
        })
        .catch((err) => {
            console.log(err)
        })
}

