//用于格式化时间：
export function uniStorage() {
	//存储：
	const originSetStorageSync = uni.setStorageSync
	//改写uni.setStorageSync方法：
	//key--键，data--值(字符串)，expires--有效时间，expires以秒为单位，且为正整数
	uni.setStorageSync = function (key, data, expires) {
		//未传递有效时间，直接使用原存储方法:
		if (!expires) {
			return originSetStorageSync(key, data)
		}
		//传递有效时间，使用改写后的方法：1秒 === 1000毫秒
		let reg = /^\d+$/
		if (reg.test(expires)) {
			//正整数
			//计算时间：
			let date = parseInt(new Date().valueOf() / 1000) + expires
			//存储：
			originSetStorageSync(key, { data, expires: date })
		} else {
			throw '参数错误，有效时间请使用正整数类型！'
		}
	}
	//提取：
	const originGetStorageSync = uni.getStorageSync
	uni.getStorageSync = function (key) {
		//根据key获取存储的数据：
		const data = originGetStorageSync(key)
		//判断是否设置有效期：
		if (typeof data !== 'object' || (typeof data === 'object' && !data.expires)) {
			//未设置有效期：
			return data
		}
		//获取当前时间：
		const now = parseInt(new Date().valueOf() / 1000)
		//获取有效期到期的时间：
		if (now < data.expires) {
			//未过期
			return data.data
		} else {
			//已过期
			uni.removeStorageSync(key)
			return ''
		}
	}
}
