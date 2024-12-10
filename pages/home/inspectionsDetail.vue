<template>
	<u-modal :show="show" :title="' '" :content="' '" @cancel="onCancel" :showConfirmButton="false">
		<view class="c-inspectionsDetail" v-if="items">
			<view class="c-inspectionsDetail__table">
				<view class="th">
					<view class="td" style="width: 100%;">检查记录</view>
				</view>
				<view class="tr">
			
					<view class="td" style="width: 100%;">{{items[selectIndex][0].project||'-'}}</view>
				</view>
				
				<view class="tr" v-for="(item,index) in items[selectIndex]">
					<view class="td" style="width: 10%;">{{index+1}}</view>
					<view class="td value" style="width: 90%;">
					{{item.require}}
					<text style="float: right;">{{status[item.result]?status[item.result].name:'-'}}</text>
					<FUploadShow v-if="item.picture" v-model="item.picture"></FUploadShow>
					</view>
				</view>
			</view>

			<view class="c-inspectionsDetail__footer" slot="confirmButton">
				<view class="btn " @click="selectIndex++" v-if="items.length>1&&selectIndex!=items.length-1">
					下一个
				</view>
				<view class="btn " @click="selectIndex--" v-if="items.length>1&&selectIndex!=0">
					上一个
				</view>
				<view class="btn btn2" @click="onCancel">
					确定
				</view>
			</view>
		</view>
	</u-modal>

</template>
<script>
	import FUploadShow from "@/components/FUploadShow.vue"
	export default {
		props:["item","items"],
		components:{FUploadShow},
		watch:{
			items(){
				this.selectIndex = 0;
			}
		},
		data() {
			return {
				selectIndex:0,
				show: true,
				status: [{
						name: "✅ 正常",
						id: "0"
					},
					{
						name: "❌ 异常",
						id: "1"
					},
					{
						name: "无此项",
						id: "2"
					},
					{
						name: "未检查",
						id: "3"
					}
				],
			}
		},
		methods: {
			onCancel() {
				this.selectIndex = 0;
				this.show = false;
				this.$emit('onClose')
			},
		},
		created(){
			this.selectIndex = 0;
		}
	}
</script>
<style lang="scss">
	/deep/.u-radio {
		text {
			font-size: 24rpx !important;
		}
	}

	.c-inspectionsDetail {
		height: 500px;
		
		width: 100%;
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;



		&__table {
			flex: 1;
			overflow-y: auto;

			background-color: #fff;
			display: flex;
			flex-direction: column;
			border-top: 1px solid #f2f2f2;
			// border-left: 1px solid #f2f2f2;
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

					// border-right: 1rpx solid rgb(232, 232, 232);
					line-height: 48rpx;
					position: relative;
					text-align: center;
					padding: 10rpx 8rpx;
					box-sizing: border-box;

				}


				.value {
					text-align: left;
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
				width: 150rpx;
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
