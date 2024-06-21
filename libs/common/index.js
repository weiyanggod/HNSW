export const tranObj = (model) => {
	return () => {
		let newModel = {}
		Object.keys(model).forEach((key) => {
			if (typeof model[key] == 'object') {
				newModel[key] = model[key].defaults
			} else {
				newModel[key] = null
			}
		})
		return newModel
	}
}
export const getModel = (model) => {
	let newModel = {}
	Object.keys(model).forEach((key) => {
		if (typeof model[key] == 'object') {
			newModel[key] = model[key].name
		} else {
			newModel[key] = model[key]
		}
	})
	return newModel
}

export const mouseEvent = {
	wheel(opt) {
		if (!opt.target) {
			console.log('什么都没有，还让我帮忙！')
			return
		}
		let callback = opt.callback || function () {}
		let target = opt.target

		//获取兼容事件
		let mouseWheel = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel'

		//IE
		if (document.attachEvent) {
			document.attachEvent('on' + mouseWheel, function (e) {
				if (e.target.parentElement == target) {
					callback(e, e.wheelDelta)
				}
			})
		}

		//FF、Chrome、Opera、safari
		else {
			document.addEventListener(mouseWheel, function (e) {
				e = e || window.event
				if ($(e.target).parents('.' + target.className)[0] == target) {
					if (e.detail) {
						//FF
						callback(e, e.detail * 40)
					} else {
						callback(e, e.wheelDelta)
					}
				}
			})
		}
	}
}

export const tranRank = (data) => {
	const target = {}

	const loop = (obj, pname) => {
		for (const key in obj) {
			let name = pname + '.' + key
			if (obj[key] && typeof obj[key] == 'object' && obj[key] instanceof Array == false) {
				loop(obj[key], name)
			} else {
				target[name] = obj[key]
			}
		}
	}
	for (const key in data) {
		let name = key
		if (data[key] && typeof data[key] == 'object' && data[key] instanceof Array == false) {
			loop(data[key], name)
		} else {
			target[name] = data[key]
		}
	}
	return target
}

export const clone = (target, data) => {
	for (let d in data) {
		if (d in target) {
			target[d] = data[d]
		}
	}
	return target
}

export const toDecimal = (num, decimal) => {
	num = parseFloat(num) + 0.0000001
	num = num.toString()
	var index = num.indexOf('.')
	if (index !== -1) {
		num = num.substring(0, decimal + index + 1)
	} else {
		num = num.substring(0)
	}

	return parseFloat(num).toFixed(decimal)
}

export const exportExcel = (table, name) => {
	let tableHtml
	if (table.$refs) {
		let header = table.$refs.header.querySelector('table').innerHTML
		let body = table.$refs.body.querySelector('tbody').outerHTML
		tableHtml = header + body
	} else {
		tableHtml = table.innerHTML
	}
	let uri = 'data:application/vnd.ms-excel;base64,',
		template = `<html>
            <head><meta charset="UTF-8"></head>
            <body><table border="1">${tableHtml}</table></body>
        </html>`

	let a = document.createElement('a')
	a.href = uri + window.btoa(unescape(encodeURIComponent(template)))
	a.download = name
	a.click()
	try {
		document.removeChild(a)
	} catch (e) {}
}

export function intervalTime(startTime, endTime) {
	var date1 = new Date(startTime) //开始时间
	var date2 = new Date(endTime) //结束时间
	var date3 = date2.getTime() - date1.getTime() //时间差的毫秒数
	//计算出相差天数
	var days = Math.floor(date3 / (24 * 3600 * 1000))
	//计算出小时数

	var leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000))
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000))

	//计算相差秒数

	var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000)
	if (days) {
		return `${days}天${hours}小时${minutes}分`
	} else if (hours) {
		return `${hours}小时${minutes}分`
	} else if (minutes) {
		return `${minutes}分`
	}
}

export function string2buffer(str, cb) {
	var b = new Blob([str])
	var f = new FileReader()
	f.onload = function (e) {
		cb(e.target.result)
	}
	f.readAsArrayBuffer(b)
}

/**
 * 将ArrayBuffer转换成字符串
 */
export function ab2hex(buffer, isArray = false) {
	var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
		return ('00' + bit.toString(16)).slice(-2)
	})
	return isArray ? hexArr : hexArr.join('')
}

export function hexCharCodeToStr(hexCharCodeStr) {
	var trimedStr = hexCharCodeStr.trim()
	var rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr
	var len = rawStr.length
	if (len % 2 !== 0) {
		alert('Illegal Format ASCII Code!')
		return ''
	}
	var curCharCode
	var resultStr = []
	for (var i = 0; i < len; i = i + 2) {
		curCharCode = parseInt(rawStr.substr(i, 2), 16) // ASCII Code Value
		resultStr.push(String.fromCharCode(curCharCode))
	}
	return resultStr.join('')
}

export function strToHexCharCode(str, array = false) {
	if (str === '') return ''
	var hexCharCode = []
	hexCharCode.push('0x')
	for (var i = 0; i < str.length; i++) {
		hexCharCode.push(str.charCodeAt(i).toString(16))
	}
	return array ? hexCharCode : hexCharCode.join('')
}
