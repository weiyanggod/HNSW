<template>
	<u-modal :show="show" :title="' '" :content="' '" @cancel="onCancel" :showConfirmButton="false">
		<view class="c-info" >
			<view class="c-info__table">
				<view class="th">
					<view class="td" style="width: 100%;">账号信息</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">公司</view>
					<view class="td value" style="width: 70%;">{{me.dept||'-'}}</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">账号</view>
					<view class="td value" style="width: 70%;">
						{{me.name||"-"}}
						<text  @click="toUnbind">解绑</text>
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">手机号</view>
					<view class="td value" style="width: 70%;">{{me.mobile||'-'}}</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">定位</view>
					<view class="td value" style="width: 70%;word-wrap: break-word;" @click="toPositions">{{positions?JSON.stringify(positions):'-'}}【查看】</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">定位误差</view>
					<view class="td value" style="width: 70%;">{{positionAccuracy||'-'}}米</view>
				</view>
			</view>
			<view class="c-info__footer" slot="confirmButton">
				<view class="btn btn2" @click="onCancel">
					确定
				</view>
			</view>
		</view>
	</u-modal>

</template>
<script>
	import { mapState, mapMutations } from "vuex";
	import transformCoordinate from "@/libs/transformCoordinate.js"
	export default {
		computed:{
			...mapState("common",["me"]),
		},
		props:["item","positions","positionAccuracy"],
		data() {
			return {
				show: true,
			}
		},
		methods: {
			...mapMutations(['set_token']),
			toPositions(){
				uni.navigateTo({
					url:`../position/position?lon=${this.positions[0]}&lat=${this.positions[1]}`
				})
			},
			onShowPosition(){
				
				
			
			// 			const p = transformCoordinate.wgs84togcj02(this.positions[0],this.positions[1])

			// 			uni.openLocation({
			// 				latitude: p[1],
			// 				longitude: p[0],
			// 				success: function () {
			// 					console.log('success');
			// 				}
			// 			});
					
				
			},
			onCancel() {
				this.show = false;
				this.$emit('onClose')
			},
			toUnbind(){
				uni.showModal({
					title: '提示',
					content: '确定解绑当前帐号吗？',
					success: e => {
						if (e.confirm) {
							
					
							uni.showLoading({
								title: '解绑中...'
							});
							const rep = wx.getAccountInfoSync();
							const appid = rep.miniProgram.appId;
							wx.login({
								success: e => {
									this.$request.get(`openid`, {
										appid: rep.miniProgram.appId,
										code: e.code
									}).then(({
										data
									}) => {
										this.$request.get(`unbind/${data.data.openid}`).then(res => {
											uni.hideLoading();
											this.set_token(null);
											uni.removeStorageSync('token');
											uni.reLaunch({
												url: '../bind/bind'
											});
										})
									
									}).catch(err=>{
										uni.hideLoading();
									});
								}
							});
							
							
							
						}
					}
				});
				
			}
		}
	}
</script>
<style lang="scss">
	/deep/.u-radio {
		text {
			font-size: 24rpx !important;
		}
	}

	.c-info {
		width: 100%;
		position: relative;
		z-index: 10;



		&__table {

			background-color: #fff;
			display: flex;
			flex-direction: column;
			border-top: 1px solid #f2f2f2;
			border-left: 1px solid #f2f2f2;
			margin: 20rpx 0 0;
			// font-size: 28rpx;

			.th {
				background-color: rgb(232, 232, 232);

			}

			.tr {
				.name {
					background-color: rgba(242, 242, 242, 1);
				}
			}

			.tr,
			.th {
				display: flex;
				border-bottom: 1rpx solid rgb(232, 232, 232);

				.td {

					border-right: 1rpx solid rgb(232, 232, 232);
					line-height: 48rpx;
					position: relative;
					text-align: center;
					padding: 10rpx 8rpx;
					box-sizing: border-box;

				}


				.value {
					text-align: left;


					align-items: center;
					justify-content: center;
					
					

				
				}
				text{
					float: right;
					text-align: right;
					color: #169bd5;
				}
				
			}
		}

		&__footer {
			margin: 40rpx 20rpx 0;
			display: flex;
			justify-content: space-evenly;

			.btn {
				height: 70rpx;
				border-radius: 8rpx;
				width: 200rpx;
				background-color: #f2f2f2;
				text-align: center;
				line-height: 70rpx;
			}

			.btn2 {
				background-color: #169bd5;
				color: #fff;
			}

		}
	}
</style>
