import {
	ab2hex
} from "./common";

const callback = {
	func: () => {}
};

export default {
	init(service, write, notify) {
		this.onBlueValueChange = () => {};
		this.service = service;
		this.write = write;
		this.notify = notify;
		return new Promise((resolve, reject) => {
			uni.openBluetoothAdapter({
				success: e => {
					resolve(e);
				},
				fail: err => {
					reject(err);
				}
			});
		});
	},
	connect(device) {
		this.device = device;
		uni.closeBLEConnection({
			deviceId: device
		});

		return new Promise((resolve, reject) => {
			uni.createBLEConnection({
				timeout: 8000,
				deviceId: device,
				success: () => {
					setTimeout(() => {
						this.getService((ret) => {
							if (ret.services.length > 0) {
								this.service = ret.services.find(s=> s.uuid.indexOf('0003CDD0')>-1).uuid;
							}
							this.getCharacteId(rep => {
								console.log(rep);
								if (rep && rep.characteristics.length > 0) {
									const notify = rep.characteristics.find(c => c.properties.notify == true);
									if (notify) {
										this.notify = notify.uuid;
										console.log('notify', notify);
									}
									const write = rep.characteristics.find(c => c.properties.write == true);
									if (write) {
										this.write = write.uuid;
										console.log('write', write);
									}
								}
								setTimeout(() => {
									console.log(this.notify);
									uni.notifyBLECharacteristicValueChange({
										deviceId: device,
										state: true,
										serviceId: this.service,
										characteristicId: this.notify,
										success: e => {
											console.log("开启监听成功！", e);
											uni.onBLECharacteristicValueChange(({
												value
											}) => {
												callback.func.call(this, value);
											});

											resolve(e);
										},
										fail: e => {
											console.log(e);
											reject(e);
										}
									});
								}, 1000);

							})


						});
					}, 500);
				},
				fail: () => {
					reject();
				}
			});
		});
	},
	getService(callback) {
		uni.getBLEDeviceServices({
			deviceId: this.device,
			success: e => {
				console.log(e);
				if (e.errMsg == "getBLEDeviceServices:ok") {
					callback.call(this, e);
				} else {
					uni.showToast({
						icon: "none",
						title: e.errMsg
					});
				}
			},
			fail(e) {}
		});
	},
	getCharacteId(callback) {
		console.log('service:',this.service)
		uni.getBLEDeviceCharacteristics({
			deviceId: this.device,
			serviceId: this.service,
			success: e => {
				console.log(e);
				callback.call(this, e);
			},
			fail: e => {
				console.log(e);
				callback.call(this);
			}
		});
	},
	getResult() {},
	sleep(delay) {
		const start = new Date().getTime();
		while (new Date().getTime() - start < delay) {
			continue;
		}
	},
	command(value, length = 0) {
		console.log("指令", value, 'length', length);
		const string2ab = val => {
			return new Uint8Array(
				val.match(/[\da-f]{2}/gi).map(function(h) {
					return parseInt(h, 16);
				})
			).buffer;
		};
		uni.writeBLECharacteristicValue({
			deviceId: this.device,
			serviceId: this.service,
			characteristicId: this.write,
			value: string2ab(value),
			success: e => {
				console.log("写入成功！");
			},
			fail: e => {
				uni.hideLoading();
				uni.showToast({
					title: "写入失败"
				});
				console.log(e);
			}
		});
		return new Promise((resolve, reject) => {
			let str = "";
			callback.func = ret => {
				const timer = setTimeout(() => {
					reject('timeout')
				}, 5000);

				if (length) {
					str += ab2hex(ret);
					if (str.length - 10 == length * 4) {
						clearTimeout(timer);
					
						resolve(str);
					}
				} else {
					console.log(ab2hex(ret));
					clearTimeout(timer);
					resolve(ab2hex(ret));
				}
			};
			
			setTimeout(()=>{
				if(!str) {
					reject();
				}
			},5000)
		});
	}
};
