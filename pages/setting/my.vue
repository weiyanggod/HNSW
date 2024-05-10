<template>
	<gracePage :customHeader="false" class="container">
		<view slot="gBody">
			<view class="my-header">
				<image class="my-header-bg" src="../../static/images/setting/mine_bg_3x.png" mode=""></image>
				<view class="my-info">
					<image class="my-info-avatar" src="../../static/images/setting/mine_def_touxiang_3x.png"></image>
					<text class="my-info-name">{{ me.name }}</text>
				</view>
			</view>
			<view class="ucenter-line"></view>
			<view class="grace-list grace-border-t grace-border-b">
				<!-- <view class="grace-list-items" @click="onRoute('info')">
					<text class="grace-list-icon iconfont grace-blue">&#xe63d;</text>
					<view class="grace-list-body border-b">
						<view class="grace-list-title"><text class="grace-list-title-text">个人信息</text></view>
					</view>
					<text class="grace-list-arrow-right grace-icons">&#xe601;</text>
				</view> -->
				<view class="item" @click="onRoute('info')">
					<u-icon name="account-fill" color="#2979ff" class="left" size="28"></u-icon>
					<text>个人信息</text>
					<u-icon name="arrow-right" class="right"></u-icon>
				</view>
				<u-line></u-line>
				<view class="item" @click="onRoute('setting')">
					<u-icon name="setting-fill" color="#ffaa00" class="left" size="28"></u-icon>
					<text>设置</text>
					<u-icon name="arrow-right" class="right"></u-icon>
				</view>
				<!--        <view class="item" @click="onRoute('about')">
          <u-icon
            name="more-circle-fill"
            color="#00557f"
            class="left"
            size="40"
          ></u-icon>
          <text>关于</text>
          <u-icon name="arrow-right" class="right"></u-icon>
        </view>
        -->
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from '../../components/gracePage.vue';
import { mapMutations, mapState } from 'vuex';
export default {
	computed: {
		...mapState('common', ['me'])
	},
	data() {
		return {};
	},
	methods: {
		...mapMutations(['set_token']),
		onTest() {
			uni.showToast({
				title: '开发中...',
				icon: 'none'
			});
		},
		onRoute(path) {
			uni.navigateTo({
				url: path + '/' + path
			});
		}
	},
	components: {
		gracePage
	},
	onLoad() {}
};
</script>
<style lang="scss">
page {
	background-color: #f3f4f8;
}
.my-header {
	position: relative;
}
.my-header-bg {
	height: 480rpx;
	width: 750rpx;
	background-color: $page-color;
}

.my-info {
	position: absolute;
	width: 750rpx;
	height: 100%;
	left: 20rpx;
	top: 160rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.my-info-avatar {
	height: 180rpx;
	width: 180rpx;
}
.my-info-name {
	color: #fff;
	font-size: $font-lg;
	margin-top: 20rpx;
	margin-left: 16rpx;
}
.ucenter-line {
	height: 20rpx;
}
.grace-list {
	background-color: #fff;
	position: relative;
}

.grace-list-items {
	padding: 0 20rpx;
}
.grace-list-items:active {
	background-color: $active-color;
}

.grace-list-title-text {
	font-size: $font-base;
}

/* #ifndef APP-NVUE */
.grace-list-items {
	display: flex;
	flex-direction: row;
	align-items: center;
}
.grace-list-body {
	flex: 1;
}
/* #endif */
.container {
	height: 100%;
	overflow-x: hidden;
	.item {
		background-color: #fff;
		padding: 0 20rpx;
		height: 90rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		text {
			margin-left: 20rpx;
			flex: 1;
		}
	}
}
</style>
