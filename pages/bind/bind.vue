<template>
	<view class="p-bind">
		<view class="p-bind__form">
			<u-form ref="form" label-width="280px" labelPosition="top" :model="form">
				<u-form-item label="账号" borderBottom prop="account">
					<u-input v-model="form.account" border="none" placeholder="请输入账号" />
				</u-form-item>
				<u-form-item label="密码" borderBottom prop="password">
					<u-input v-model="form.password" border="none" placeholder="请输入密码" />
				</u-form-item>
			</u-form>
		</view>
		<view style="margin-top: 150rpx;padding: 0 24rpx;">
			<u-button @click="onSubmit" type="primary">绑定</u-button>
		</view>

		<u-modal :show="show" title="提示" content="您好,请先微信授权后绑定账号!">
			<template #confirmButton>
				<u-button open-type="getUserInfo" @getuserinfo="onLogin" type="primary">授权</u-button>
			</template>
		</u-modal>
	</view>
</template>

<script>
	
	import {
		mapMutations,
		mapActions
	} from 'vuex';
	export default {
		data() {
			return {
				show: false,
				form: {
					account: '',
					password: '',
					wxbind: {
						appid: null,
						openid: null,
						session_key: null,
						rawData: null,
						signature: null,
						encryptedData: null,
						iv: null
					}
				},
				rules: {
					account: [{
						required: true,
						message: '请输入账号',
						trigger: ['blur']
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['blur']
					}]
				}
			};
		},
		methods: {
			...mapMutations(['set_token', 'set_archiveId']),
			...mapActions('common', ['init']),
			onSubmit() {
				this.$refs.form.validate().then(() => {
					uni.showModal({
						title: '提示',
						content: '确定提交当前绑定信息吗？',
						success: e => {
							if (e.confirm) {
								uni.showLoading({
									title: '提交中...'
								});
								this.$request.post(`login`, {
									"account": this.form.account,
									"password": this.form.password,
								}).then(({
									data
								}) => {
									if((data.data||{}).token){
										uni.setStorageSync('token', data.data.token,86400);
										this.$request.post(`wxbind`, this.form.wxbind,).then((data2) => {
											uni.hideLoading();
											console.log(data2)
											if(data2.data.code==200){
												
												uni.showModal({
													title: "提示",
													content: "绑定成功!",
													showCancel: false,
													success: () => {
														this.loginSuccess(data.data.token)
													}
												})
											}else{
												uni.showModal({
													title: "提示",
													content: "其它用户已绑定!",
													showCancel: false,
													success: () => {
														this.loginSuccess(data.data.token)
													}
												})
												
											}
										}).catch(err=>{
											uni.hideLoading();
											uni.showModal({
												title: "提示",
												content: ((err||{}).data||{}).error,
												showCancel: false,
											})
										});
									}else{
										uni.hideLoading();
										uni.showModal({
											title: "提示",
											content: "账号或密码错误!",
											showCancel: false,
										})
									}
									
								}).catch(err=>{
									uni.hideLoading();
									uni.showModal({
										title: "提示",
										content: "账号或密码错误!",
										showCancel: false,
									})
								});


							}
						}
					});
				});
			},
			async loginSuccess(token) {
				uni.setStorageSync('token', token,86400);
				this.set_token(token);
				uni.setStorageSync('bind', true);
				this.init();
				uni.navigateTo({
					url: '../home/home',
					success: () => {
						uni.hideLoading();
					}
				});
			},
			onLogin(rep) {
				if (rep.detail) {
					this.form.wxbind.rawData = rep.detail.rawData;
					this.form.wxbind.signature = rep.detail.signature;
					this.form.wxbind.encryptedData = rep.detail.encryptedData;
					this.form.wxbind.iv = rep.detail.iv;
				}
				this.show = false;
			},
			getOpenid() {
				uni.showLoading({
					title: '加载中...'
				});
				const rep = wx.getAccountInfoSync();
				this.form.wxbind.appid = rep.miniProgram.appId;
				wx.login({
					success: e => {
						this.$request.get(`openid`, {
							appid: rep.miniProgram.appId,
							code: e.code
						}).then(({
							data
						}) => {
							this.form.wxbind.openId = data.data.openid;
							this.form.wxbind.session_key = data.data.session_key;
							uni.hideLoading();
						}).catch(err=>{
							uni.hideLoading();
						});
					}
				});
			}
		},
		onReady() {
			
			this.$refs.form.setRules(this.rules);
		},
		onShow(){
			uni.hideHomeButton()
		},
		onLoad() {
			this.show = true;
			this.getOpenid();
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.p-bind {
		&__form {
			padding: 0 20rpx;
		}
	}
</style>
