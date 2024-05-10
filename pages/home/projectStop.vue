<template>
	<u-modal :show="show" :title="' '" :content="' '" @cancel="onCancel" :showConfirmButton="false">
		<view class="c-work">
			<view class="c-work__table">
				<view class="th">
					<view class="td" style="width: 100%">工程停工</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">开始日期</view>
					<view class="td value" style="width: 70%; padding-right: 20rpx; box-sizing: border-box">
						<text>{{ form.stime }}</text>
						<!-- <u-icon name="arrow-down" color="#000" size="12"></u-icon> -->
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">结束日期</view>
					<view class="td value" style="width: 70%; padding-right: 20rpx; box-sizing: border-box">
						<!-- <text>{{form.etime||"请选择停工结束日期"}}</text> -->
						<picker style="width: 100%" mode="date" :value="form.etime" :start="form.stime" fields="day" @change="bindDateChange">
							<view style="display: flex; justify-content: space-between">
								<text>{{ form.etime }}</text>
								<u-icon name="arrow-down" color="#000" size="12"></u-icon>
							</view>
						</picker>
					</view>
				</view>

				<view class="tr">
					<view class="td" style="width: 30%">区块</view>
					<view class="td" style="width: 70%; text-align: left" @click="showBlock = true">
						<!-- 	<u-radio-group v-model="form.block">
							<u-radio name="0" size="14" labelSize="12" label="正常作业"> </u-radio>
							<text style="margin-right: 20rpx;"></text>
							<u-radio name="1" size="14" labelSize="12" label="取消作业"></u-radio>
						</u-radio-group> -->

						<!-- <u-checkbox-group v-model="form.block" placement="column">
							<u-checkbox :customStyle="{marginBottom: '8px'}" v-for="(item, index) in archive.block"
								:key="index" :label="item.name" :name="item.name" size="14">
							</u-checkbox>
						</u-checkbox-group> -->
						<div v-for="block in form.block" :key="block">{{ block }}</div>
						<div class="add">+</div>
					</view>
				</view>
			</view>

			<view class="c-work__footer" slot="confirmButton">
				<view class="btn" @click="onCancel">取消</view>
				<view class="btn btn2" @click="onSubmit">确定</view>
			</view>
			<!-- <mxdatepicker :show="showStime" type="date" :show-tips="true" @confirm="onSelectedDate"
				@cancel="onCancelPicker" /> -->
			<u-modal :show="showBlock" :title="'请选择区块'" @confirm="showBlock = false">
				<view class="blockSelect">
					<u-checkbox-group v-model="form.block" placement="column">
						<u-checkbox
							:customStyle="{ marginBottom: '8px' }"
							v-for="(item, index) in archive.block"
							:key="index"
							:label="item.name"
							:name="item.name"
							size="14"
						></u-checkbox>
					</u-checkbox-group>
				</view>
			</u-modal>

			<u-toast ref="uToast"></u-toast>
		</view>
	</u-modal>
</template>
<script>
import { mapState } from 'vuex'
import FUpload from '@/components/FUpload.vue'
import mxdatepicker from '@/components/mx-datepicker/mx-datepicker.vue'
export default {
	computed: {
		...mapState('common', ['archive', 'dicts', 'users', 'me'])
	},
	components: {
		FUpload,
		mxdatepicker
	},
	data() {
		return {
			show: true,
			id: '',
			timeType: null,
			showStime: false,
			showList: false,
			showBlock: false,

			form: {
				time: null,
				file: null,
				remark: null,
				result: null,
				block: []
			},
			selectId: 0,
			rules: {
				etime: [
					{
						required: true,
						message: '请输入停工结束时间',
						trigger: ['blur']
					}
				],
				block: [
					{
						required: true,
						message: '请选择区块',
						trigger: ['blur']
					}
				]
			}
		}
	},
	methods: {
		bindDateChange(date) {
			this.form.etime = date.detail.value
		},
		onCancel() {
			this.show = false
			this.$emit('onClose')
		},
		onCancelPicker() {
			this.showStime = false
		},
		onSelectedDate(e) {
			let date = new Date(e.date).Format('YYYY-MM-DD')
			// this.inspectionForm.pstime = Date.parse(date) / 1000;
			this.form[this.timeType] = date
			this.showStime = false
		},
		onSubmit() {
			let rules = ['etime', 'block']
			// 没有选择区块
			if (this.form.block.length <= 0) {
				return this.$refs.uToast.show({
					type: 'warning',
					message: '请先选择区块',
					icon: false,
					position: 'top'
				})
			}
			if (rules.find((i) => !this.form[i])) {
				return this.$refs.uToast.show({
					type: 'error',
					message: this.rules[rules.find((i) => !this.form[i])][0].message,
					icon: false,
					complete() {}
				})
			}

			uni.showModal({
				title: '提示',
				content: '确定提交工程停工吗？',
				success: (e) => {
					if (e.confirm) {
						uni.showLoading({
							title: '提交中...'
						})
						let form = JSON.parse(JSON.stringify(this.form))
						// form.etime = form.etime + " 00:00:00"
						this.$request
							.post(`project/daystop`, {
								code: this.archive.code,
								endDate: form.etime,
								endDate: form.etime,
								blocks: form.block.map((b) => {
									const block = this.archive.block.find((i) => i.name == b) || {}
									return {
										blockName: block.name,
										blockCode: block.code
									}
								})
							})
							.then((res) => {
								uni.hideLoading()
								this.init()

								uni.showModal({
									title: '创建成功！',
									showCancel: false,
									success: () => {
										this.$emit('onClose')
									}
								})
							})
							.catch((err) => {
								uni.hideLoading()
								uni.showModal({
									title: '提示',
									content: ((err || {}).data || {}).error,
									showCancel: false
								})
							})
					}
				},
				cancel: (e) => {
					uni.hideLoading()
				}
			})
		},
		init() {
			this.listValue = {
				category: '',
				type: ''
			}
			this.form = {
				stime: new Date().toISOString().slice(0, 10),
				etime: new Date().toISOString().slice(0, 10),
				block: []
			}
		}
	},
	onReady() {
		this.init()
	}
}
</script>
<style lang="scss">
.blockSelect {
	max-height: 80vh;
	overflow-y: auto;
	padding: 100rpx 10px 10px;
	box-sizing: border-box;
	z-index: 9999;
}
/deep/.u-radio {
	text {
		font-size: 24rpx !important;
	}
}

.c-work {
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
	.add {
		margin: 0 auto;
		text-align: center;
		background-color: #169bd5;
		color: #fff;
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
