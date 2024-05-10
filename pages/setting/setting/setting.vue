<template>
	<view class="p-setting">
		<view class="body">
			<u-cell-group><u-cell title="系统版本" value="1.0.0" :arrow="false"></u-cell></u-cell-group>
		</view>
		<view style="margin-top: 50rpx;">
			<!-- #ifndef MP-WEIXIN -->
			<u-button type="warning" @click="onLogout">退出登录</u-button>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<view class="ub-btn">
				<u-button type="error" @click="onUnbind">解绑</u-button>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
	data() {
		return {
			cache: null,
			customStyle: {
				position: 'absolute',
				bottom: '20rpx'
			}
		};
	},
	methods: {
		...mapMutations(['set_token']),
		onLogout() {
			uni.showModal({
				title: '提示',
				content: '确定退出当前帐号吗？',
				success: e => {
					if (e.confirm) {
						this.set_token(null);
						uni.removeStorageSync('token');
						uni.closeSocket({});
						uni.reLaunch({
							url: '../../login/login'
						});
					}
				}
			});
		},
		onUnbind() {
			uni.showModal({
				title: '提示',
				content: '确定解绑当前帐号吗？',
				success: e => {
					if (e.confirm) {
						const rep = wx.getAccountInfoSync();
						const appid = rep.miniProgram.appId;
						uni.showLoading({
							title: '解绑中...'
						});
						this.$apollo
							.mutate({
								mutation: UnBindWx,
								variables: {
									appid
								}
							})
							.then(() => {
								uni.hideLoading();
								this.set_token(null);
								uni.removeStorageSync('token');
								uni.reLaunch({
									url: '../../login/login'
								});
							});
					}
				}
			});
		},
		formatSize() {
			let that = this;
			plus.cache.calculate(function(size) {
				let sizeCache = parseInt(size);
				if (sizeCache == 0) {
					that.cache = '0B';
				} else if (sizeCache < 1024) {
					that.cache = sizeCache + 'B';
				} else if (sizeCache < 1048576) {
					that.cache = (sizeCache / 1024).toFixed(2) + 'KB';
				} else if (sizeCache < 1073741824) {
					that.cache = (sizeCache / 1048576).toFixed(2) + 'MB';
				} else {
					that.cache = (sizeCache / 1073741824).toFixed(2) + 'GB';
				}
			});
		},
		clearCache() {
			let that = this;
			let os = plus.os.name;
			if (os == 'Android') {
				uni.showLoading({ title: '清理中...' });
				let main = plus.android.runtimeMainActivity();
				let sdRoot = main.getCacheDir();
				let files = plus.android.invoke(sdRoot, 'listFiles');
				let len = files.length;
				for (let i = 0; i < len; i++) {
					let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径
					plus.io.resolveLocalFileSystemURL(
						filePath,
						function(entry) {
							if (entry.isDirectory) {
								entry.removeRecursively(
									function(entry) {
										//递归删除其下的所有文件及子目录
										uni.showToast({
											title: '缓存清理完成',
											duration: 2000
										});
										that.formatSize(); // 重新计算缓存
									},
									function(e) {
										console.log(e.message);
									}
								);
							} else {
								entry.remove();
							}
						},
						function(e) {
							console.log('文件路径读取失败');
						}
					);
				}
			} else {
				// ios暂时未找到清理缓存的方法，以下是官方提供的方法，但是无效，会报错
				plus.cache.clear(function() {
					uni.showToast({
						title: '缓存清理完成',
						duration: 2000
					});
					that.formatSize();
				});
			}
		},
		onSetting() {
			uni.showToast({
				icon: 'none',
				title: '开发中...'
			});
		}
	},
	onShow() {
		// #ifdef APP-PLUS
		this.formatSize();
		// #endif
	}
};
</script>

<style lang="scss">
.p-setting {
	overflow: hidden;
	width: 100%;
	min-height: 100%;
	background-color: #f8f8f8;
	.body {
		background: #fff;
	}
	.tui-btn-class {
		color: $uni-color-error !important;
	}

	.custom-style {
		margin-top: 32rpx;
		background-color: $uni-color-error !important;
		color: #fff;
	}
	.ub-btn {
		position: absolute;
		bottom: 20rpx;
		width: 100%;
	}
}
</style>
