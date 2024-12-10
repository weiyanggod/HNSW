<template>
	<view class="p-about">
		<view class="p-about__logo">
			<image :src="getLogo()" mode=""></image>
			<view class="version">版本 {{version}}</view>
		</view>
		<view class="body">
			<!-- #ifdef APP-PLUS -->
			<!-- <u-form-item class="item" label="" @click="onUpdate" labelWidth="8">
				<text >检测新版本 </text>
				<u-icon slot="right" name="arrow-right" class="right"></u-icon>
			</u-form-item> -->
			<!-- #endif -->
			<!-- <u-form-item class="item" label="" labelWidth="8">
				<text>意见反馈 </text>
				<u-icon slot="right" name="arrow-right" class="right"></u-icon>
			</u-form-item> -->
			<u-cell-group>
				<!-- #ifdef APP-PLUS -->
				<u-cell-item  title="检测新版本" value="" :arrow="true" @click="onUpdate"></u-cell-item>
				<!-- #endif -->
				<u-cell-item  title="意见反馈" value="" :arrow="true"></u-cell-item>
			</u-cell-group>
		</view>
		
	</view>
</template>

<script>
import { mapState } from "vuex";
export default {
	computed: {
		...mapState("common", ["system", "me"]),
		...mapState(["path"])
	},
	data() {
		return {
			version: '1.0.0'
		};
	},
	methods: {
		onUpdate() {
			uni.showLoading({
				title: "检测中..."
			});
			setTimeout(() => {
				uni.showToast({
					title: "当前最新版本"
				});
			}, 500);
		},
		getLogo() {
			if (this.me.o_corp.logo) {
				return this.path + "/images/" + this.me.o_corp.logo + "/200/200";
			} else {
				return "/static/logo.png";
			}
		}
	},
	onShow() {

		// #ifndef APP-PLUS
		this.version = (this.system||{}).version||this.version;
		// #endif
	}
};
</script>

<style lang="scss" scoped>
.p-about {
	width: 100%;
	min-height: 100%;
	background-color: $page-color;
	&__logo {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		padding-top: 50rpx;
		image {
			width: 100rpx;
			height: 100rpx;
			background-color: #fff;
			padding: 20rpx;
			border-radius: 20rpx;
		}

		.version {
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}
	}
	// .body{
	// 	box-shadow: 0 0 3rpx #ccc;
	// }
	// .item{
	// 	border-bottom: 1rpx solid #f8f8f8;
	// 	padding:10px;
	// 	background-color: #fff;
	// }
	// .item:last-child{
	// 	border-bottom: 0;
	// }
	
}
</style>
