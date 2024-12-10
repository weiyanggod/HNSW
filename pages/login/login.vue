<template>
	<u-loading-page :loading="true" loading-text="登录中..."></u-loading-page>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import gracePage from '@/components/gracePage.vue'
export default {
	components: {
		gracePage,
	},
	data() {
		return {
			loginType: 2,
			form: {
				account: '',
				password: '',
			},
			showPassword: false,
			save: false,
			name: '智能取水栓',
			timer: null,
			count: 0,
			current: 0,
			corps: [],
			model: {
				key: null,
				corp: null,
				corpName: null,
			},
			mobileForm: {
				mobile: null,
				code: null,
				id: null,
			},
			isbinding: true,
			show: false,
		}
	},
	methods: {
		...mapMutations(['set_token', 'set_archiveId']),
		...mapActions('common', ['init']),
		async loginSuccess(token) {
			uni.setStorageSync('token', token, 86400)
			this.set_token(token)
			uni.setStorageSync('bind', true)
			this.init()
			uni.navigateTo({
				url: '../home/home',
				success: () => {
					uni.hideLoading()
				},
			})
		},
		wxLogin() {
			console.log(999)
			const rep = wx.getAccountInfoSync()
			wx.login({
				success: (e) => {
					this.$request
						.post(`wxlogin`, {
							appid: rep.miniProgram.appId,
							code: e.code,
						})
						.then(({ data }) => {
							if ((data.data || {}).token) {
								this.loginSuccess(data.data.token)
							} else {
								uni.hideLoading()
								uni.reLaunch({
									url: '../bind/bind',
								})
							}
						})
						.catch((e) => {
							uni.hideLoading()
							uni.reLaunch({
								url: '../bind/bind',
							})
						})
				},
				complete: (a) => {
					console.log(a)
				},
			})
		},
	},

	onLoad(p) {
		this.wxLogin()
	},
}
</script>

<style lang="scss" scoped>
.p-login {
	height: 100%;
	overflow: hidden;

	&__title {
		color: #fff;
		text-align: center;
		font-size: 42rpx;
	}

	&__bg {
		background-color: #5064eb;
		height: 400rpx;
		width: 750rpx;
	}

	&__form {
		background-color: #fff;
		z-index: 100;
		top: 248rpx;
		text-align: center;
		padding: 56rpx;
		box-sizing: border-box;
		width: 706rpx;
		left: 22rpx;
		border-radius: 10px;
		position: absolute;
		margin-left: auto;
		margin-right: auto;

		.bg {
			height: 280rpx;
			width: 432rpx;
			position: absolute;
			top: -162rpx;
			right: -35rpx;

			image {
				height: 100%;
				width: 100%;
			}
		}

		.title {
			width: 80rpx;
			// height: 48rpx;
			font-size: 36rpx;
			color: #5064eb;

			// margin-bottom: 132rpx - 68rpx;
			padding-bottom: 22rpx;

			.line {
				height: 1;
				width: 28rpx;
				margin: 22rpx auto 132rpx - 68rpx;
				border-bottom: 6rpx solid #5064eb;
			}
		}

		.input {
			margin-top: 40rpx;
			display: flex;
			height: 82rpx;
			border-radius: 41rpx;
			width: 100%;
			background-color: #e2e6ff;
			color: #000;
			align-items: center;
			justify-content: center;
			padding: 0 40rpx;
			box-sizing: border-box;
			position: relative;

			image {
				width: 32rpx;
				height: 40rpx;
			}

			input {
				flex: 1;
				text-align: left;
				padding-left: 24rpx;
			}

			.code {
				// position: absolute;
				// top:20rpx;
				// right:20rpx;
				line-height: 80rpx;
				height: 80rpx;
				display: inline-block;
				color: #ccc;
			}

			.coded {
				color: #333;
			}
		}

		.btn {
			margin-top: 120rpx;

			button {
				border-radius: 60rpx;
				background-color: #5064eb;
				color: #fff;

				&::after {
					border-radius: 60rpx;
				}

				&:active {
					background-color: #5064eb;
				}
			}
		}

		.btn2 {
			margin-top: 40rpx;

			button {
				border-radius: 60rpx;
				background-color: #ccc;
				color: #fff;

				&::after {
					border-radius: 60rpx;
				}

				&:active {
					background-color: #ccc;
				}
			}
		}

		.desc {
			text-align: right;
			margin-top: 48rpx;

			label {
				color: #5064eb;
			}
		}

		.tip {
			margin-top: 16rpx;
			color: #5064eb;
		}
	}

	.tab {
		// width: 360px;
		margin-top: 40rpx;
		// border-bottom: 1px solid #ccc;
		color: #999;
		text-align: center;
		cursor: pointer;
	}
}
</style>
