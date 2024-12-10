<template>
	<view class="c-box">
		<view class="header">
			<image class="img" src="../static/img/title.png" mode=""></image>
			<text>{{title}}</text>
			<slot name="title2"></slot>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default{
		props:{
			title:{
				default:""
			}
		}
	}
</script>

<style lang="less">
	.c-box{
		margin: -40rpx 20rpx 60rpx;
		padding: 0 0rpx 20rpx;
		background-color: #fff;
		border-radius: 8rpx;
		box-shadow: 0 0 3rpx #ccc;
		.header{
			display: flex;
			align-items: center;
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 20rpx;
			font-weight: bold;
			position: relative;
			.img{
				margin-right: 20rpx;
				width: 58rpx;
				height: 16rpx;
			}
		}
	}
</style>