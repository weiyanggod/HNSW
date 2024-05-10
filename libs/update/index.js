import {
	GetInstance
} from "../../apollo.js";
import config from '../../config.js'
let timer = null;
export const getUpdate = (callback) => {
	plus.runtime.getProperty(plus.runtime.appid, inf => {
		const version = inf.version;
		const appid = plus.runtime.appid;
		const os = plus.os.name;
		if (appid == 'HBuilder') return callback ? callback.call(this, false) : null;
		if (true) {
			const path = config.baseURL;
			console.log(path);
			GetInstance()
				.post(
					`${path}/api`, {
						query: `,
					query M($appid:String!) {
						app:app_by_appid(appid:$appid) {
							id
							name 
							android (version: "${version}") {
								id 
								version 
								resource 
								desc
							}
							ios (version: "${version}") {
								id 
								version 
								resource 
								desc
							}
							patch (version: "${version}") {
								id 
								version 
								resource 
								desc
							}
						}
					}
				`,
						variables: {
							appid: appid
						}
					}, {
						headers: {
							"Content-Type": "application/json"
						}
					}
				)
				.then(({
					data
				}) => {
					
					console.log('update', data);

					if (os == 'Android') {
						if (data.data.app.android) {
							const android = data.data.app.android;
							uni.showModal({
								title: android.version + " 版本更新",
								content: android.desc,
								confirmText: "立即更新",
								showCancel: false,
								success: res => {
									if (res.confirm) {
										androidUpdate(android, path);
									} else {
										plus.runtime.quit();
									}
								}
							})
						} else if (data.data.app.patch && !callback) {
							const patch = data.data.app.patch;
							wgtUpdate(patch, path);
						} else {
							if (!callback) {
								setTimeout(() => {
									getUpdate();
								}, 60000);
							} else {
								callback.call(this, false);
							}

						}
					}


				}).catch(e => {
					console.log(e);
				});
		}
	});
}

function androidUpdate(android, path) {
	uni.showLoading({
		title: '下载中...'
	});
	uni.downloadFile({
		url: path + '/download/' + android.resource,
		success: downloadResult => {
			uni.hideLoading();
			console.log(downloadResult);
			if (downloadResult.statusCode === 200) {
				plus.runtime.install( //安装
					downloadResult.tempFilePath, {},
					function() {
						// utils.showToast('更新成功，重启中');
						//plus.runtime.restart();


					},
					function(e) {
						console.log(e);
						// utils.showToast('更新失败');
					}
				);
			}
		},
		fail: e => {
			console.log(e);
		}
	})
}


function wgtUpdate(patch, path) {
	uni.downloadFile({
		url: path + '/download/' + patch.resource,
		success: downloadResult => {
			if (downloadResult.statusCode === 200) {
				plus.runtime.install( //安装
					downloadResult.tempFilePath, {},
					function() {
						setTimeout(() => {
							uni.showModal({
								title: patch.version + " 修复更新成功",
								content: patch.desc,
								showCancel: false,
								success: res => {
									plus.runtime.restart();
								}
							})
						}, 2000)
					},
					function(e) {
						console.log(e);
						// utils.showToast('更新失败');
					}
				);
			}
		},
		fail: e => {
			console.log(e);
		}
	})
}
