<template>
	<u-modal :show="show" :title="' '" :content="' '" @cancel="onCancel" :showConfirmButton="false">
		<view class="c-improve" v-if="item">
			<view class="c-improve__table">
				<view class="th">
					<view class="td" style="width: 100%;">隐患详情</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">隐患名称</view>
					<view class="td value" style="width: 70%;">{{items[selectIndex].name||'-'}}</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">发现时间</view>
					<view class="td value" style="width: 70%;">{{(items[selectIndex].rtime||'').split(' ')[0]}}</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">整改措施</view>
					<view class="td value" style="width: 70%;">{{items[selectIndex].method||'-'}}</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">整改时间</view>
					<view class="td value" style="width: 70%;">{{(items[selectIndex].time||'').split(' ')[0]}}</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">隐患状态</view>
					<view class="td value" style="width: 70%;">{{items[selectIndex].state||'-'}}</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">责任人</view>
					<view class="td value" style="width: 70%;">{{items[selectIndex].person_name||'-'}}</view>
				</view>
			</view>
			<improvesChange :item="items[selectIndex]" v-if="showChange"   @onClose="showChange = false"></improvesChange>

			<view class="c-improve__footer" slot="confirmButton">
				<view class="btn " @click="selectIndex++" v-if="items.length>1&&selectIndex!=items.length-1">
					下一个
				</view>
				<view class="btn " @click="selectIndex--" v-if="items.length>1&&selectIndex!=0">
					上一个
				</view>
				<view class="btn btn2" v-if="items[selectIndex].state!='已整改'&&items[selectIndex].state!='已完成'" @click="showChange = true" >
					整改
				</view>
				<view class="btn btn2" @click="onCancel">
					确定
				</view>
			</view>
		</view>
	</u-modal>

</template>
<script>
	import improvesChange from "./imporvesChange.vue";
	export default {
		props:["item","items"],
		components:{improvesChange},
		watch:{
			item(){
				this.selectIndex = 0;
			}
		},
		data() {
			return {
				showChange:false,
				selectIndex:0,
				show: true,
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

	.c-improve {
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
					display: flex;


					text {
						flex: 1;
					}
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
