import ajax from '@/uni_modules/u-ajax'
import config from './config.js'

// 创建请求实例
const instance = ajax.create({
	// 默认配置
	baseURL: `${config.path}/api`,
	timeout: 800000
})

// 添加请求拦截器
instance.interceptors.request.use(
	(config) => {
		// 在发送请求前做些什么
		// console.log('发送请求前', config)
		config.header.Authorization = uni.getStorageSync('token')
		return config
	},
	(error) => {
		// 对请求错误做些什么
		// console.log('发请求错误', error)
		return Promise.reject(error)
	}
)

// 添加响应拦截器
instance.interceptors.response.use(
	(response) => {
		// 对响应数据做些什么
		// console.log('响应成功后', response)
		return response
	},
	(error) => {
		// 对响应错误做些什么
		// console.log('响应错误后', error)
		return Promise.reject(error)
	}
)
export default instance
