<template>
	<u-modal :show="show" :title="' '" :content="' '" @cancel="onCancel" :showConfirmButton="false">
		<view class="c-improves">
			<view class="c-improves__table">
				<view class="th">
					<view class="td" style="width: 100%">隐患整改</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">隐患</view>
					<view class="td" style="width: 70%">{{ item.name }}</view>
				</view>

				<view class="tr">
					<view class="td" style="width: 30%">{{ type == 1 ? '整改完成情况' : '整改措施' }}</view>
					<view class="td value" style="width: 70%">
						<textarea type="text" style="text-align: left; width: 100%; height: 120rpx" v-model="form.measure" placeholder="请输入"></textarea>
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">整改时间</view>
					<view
						class="td value"
						style="width: 70%; padding-right: 20rpx; box-sizing: border-box"
						@click="
							showStimeType = 'time';
							showStime = true;
						"
					>
						<text>{{ form.time || '请选择整改时间' }}</text>
						<u-icon name="arrow-down" color="#000" size="12"></u-icon>
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">图片</view>
					<view class="td value" style="width: 70%; justify-content: flex-start">
						<FUpload v-model="form.file"></FUpload>
					</view>
				</view>
				<view class="tr" v-if="type == 1">
					<view class="td" style="width: 30%">整改状态</view>
					<view
						class="td value"
						style="width: 70%; padding-right: 20rpx; box-sizing: border-box"
						@click="
							listType = `status`;
							showList = true;
						"
					>
						<text>{{ listValue[`status`] || '请选择' }}</text>
						<u-icon name="arrow-down" color="#000" size="12"></u-icon>
					</view>
				</view>
			</view>

			<view class="c-improves__footer" slot="confirmButton">
				<view class="btn" @click="onCancel">取消</view>
				<view class="btn btn2" @click="onSubmit">提交整改</view>
			</view>
			<mxdatepicker :show="showStime" type="date" :show-tips="true" @confirm="onSelectedDate" @cancel="onCancelPicker" />

			<u-picker :show="showList" :columns="[list[listType]]" @confirm="onSelect" keyName="name"></u-picker>
			<u-toast ref="uToast"></u-toast>
		</view>
	</u-modal>
</template>
<script>
import { mapState } from 'vuex';
import FUpload from '@/components/FUpload.vue';
import mxdatepicker from '@/components/mx-datepicker/mx-datepicker.vue';
export default {
	computed: {
		...mapState('common', ['archive', 'dicts', 'users', 'me'])
	},
	components: {
		FUpload,
		mxdatepicker
	},
	props: {
		item: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			type: 1,
			show: true,
			id: '',
			showStimeType: '',
			showStime: false,
			showList: false,
			list: {
				status: []
			},
			listType: '',
			listValue: {
				status: ''
			},
			form: {
				id: null,
				time: null,
				file: null,
				status: null,
				measure: null,
				type: null
			},
			rules: {
				status: [
					{
						required: true,
						message: '请选择整改状态',
						trigger: ['blur']
					}
				],
				measure: [
					{
						required: true,
						message: '请输入整改措施',
						trigger: ['blur']
					}
				],
				// file: [{
				// 	required: true,
				// 	message: "请添加隐患照片",
				// 	trigger: ["blur"]
				// }],
				time: [
					{
						required: true,
						message: '请输入整改时间',
						trigger: ['blur']
					}
				]
			}
		};
	},
	methods: {
		onCancel() {
			this.show = false;
			this.$emit('onClose');
		},
		onCancelPicker() {
			this.showStime = false;
		},
		onSelectedDate(e) {
			let date = new Date(e.date).Format('YYYY-MM-DD');
			this.form[this.showStimeType] = date;
			this.showStime = false;
		},
		initDict() {
			this.list = {
				status: [
					{
						id: '0',
						name: '待接收'
					},
					{
						id: '1',
						name: '整改中'
					},
					{
						id: '2',
						name: '已超期'
					},
					{
						id: '3',
						name: '已完成'
					}
				]
			};
		},

		onSelect(target) {
			this.listValue[this.listType] = target.value[0].name;
			this.form[this.listType] = target.value[0].id;
			this.showList = false;
		},
		onSubmit() {
			let rules = [];
			if (this.type == 1) {
				rules = ['time', 'measure', 'status'];
			} else {
				rules = ['time', 'measure'];
			}

			if (rules.find((i) => !this.form[i])) {
				return this.$refs.uToast.show({
					type: 'error',
					message: this.rules[rules.find((i) => !this.form[i])][0].message,
					icon: false,
					complete() {}
				});
			}

			uni.showModal({
				title: '提示',
				content: '确定提交隐患通知单吗？',
				success: (e) => {
					if (e.confirm) {
						uni.showLoading({
							title: '提交中...'
						});
						let form = JSON.parse(JSON.stringify(this.form));
						form.type = this.type;
						form.id = this.item.id;
						this.$request
							.post(`improves/submit`, form)
							.then((res) => {
								uni.hideLoading();
								this.init();

								uni.showModal({
									title: '操作成功！',
									showCancel: false,
									success: () => {
										this.$emit('onClose');
									}
								});
							})
							.catch((err) => {
								uni.hideLoading();
								uni.showModal({
									title: '提示',
									content: ((err || {}).data || {}).error,
									showCancel: false
								});
							});
					}
				},
				cancel: (e) => {
					uni.hideLoading();
				}
			});
		},
		init() {
			this.listValue = {
				status: ''
			};
			this.type = this.archive.category1 != '工程' ? '0' : '1';
			this.form = {
				status: null,
				measure: null,
				time: new Date().Format('YYYY-MM-DD'),
				file: null,
				id: this.item.id,
				type: this.type
			};
		}
	},
	onReady() {
		this.initDict();
		this.init();
	}
};
</script>
<style lang="scss">
.c-improves {
	width: 100%;

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
