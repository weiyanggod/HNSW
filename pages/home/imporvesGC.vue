<template>
	<u-modal :show="show" :title="' '" :content="' '" @cancel="onCancel" :showConfirmButton="false">
		<view class="c-improves">
			<view class="c-improves__table">
				<view class="th">
					<view class="td" style="width: 100%">隐患整改发起</view>
				</view>

				<view class="tr">
					<view class="td" style="width: 30%">检查类型</view>
					<view
						class="td value"
						style="width: 70%; padding-right: 20rpx; box-sizing: border-box"
						@click="
							listType = `checkType`
							showList = true
						"
					>
						<text>{{ listValue[`checkType`] || '请选择' }}</text>
						<u-icon name="arrow-down" color="#000" size="12"></u-icon>
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">检查项目</view>
					<view class="td" style="width: 70%">
						<input style="text-align: left; width: 100%" v-model="form.name" placeholder="请输入" />
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">项目编号</view>
					<view class="td" style="width: 70%">
						<input style="text-align: left; width: 100%" v-model="form.code" placeholder="请输入" />
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">整改要求</view>
					<view class="td value" style="width: 70%">
						<textarea style="text-align: left; width: 100%; height: 90rpx" v-model="form.require" placeholder="请输入"></textarea>
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">责任单位</view>
					<view
						class="td value"
						style="width: 70%; padding-right: 20rpx; box-sizing: border-box"
						@click="
							listType = `responsibleOrg`
							showList = true
						"
					>
						<text>{{ listValue[`responsibleOrg`] || '请选择' }}</text>
						<u-icon name="arrow-down" color="#000" size="12"></u-icon>
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">整改期限</view>
					<view class="td value" style="width: 70%; padding-right: 20rpx; box-sizing: border-box" @click="showStime = true">
						<text>{{ form.date || '请选择整改期限' }}</text>
						<u-icon name="arrow-down" color="#000" size="12"></u-icon>
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">图片</view>
					<view class="td value" style="width: 70%; justify-content: flex-start">
						<FUpload v-model="form.file"></FUpload>
					</view>
				</view>
			</view>
			<u-collapse ref="collapseRef">
				<u-collapse-item title="明细表">
					<u-icon name="plus" color="#3badfb" @click="addQuestion"></u-icon>
					<view class="c-improves__table" v-for="(item, index) in form.items" :key="index">
						<view class="tr">
							<view class="td" style="width: 30%">存在问题</view>
							<view class="td" style="width: 70%">
								<textarea style="text-align: left; width: 100%; height: 120rpx" v-model="item.question" placeholder="请输入" />
							</view>
						</view>
					</view>
				</u-collapse-item>
			</u-collapse>

			<view class="c-improves__footer" slot="confirmButton">
				<view class="btn" @click="onCancel">取消</view>
				<view class="btn btn2" @click="onSubmit">发布隐患</view>
			</view>
			<mxdatepicker :show="showStime" type="date" :show-tips="true" @confirm="onSelectedDate" @cancel="onCancelPicker" />

			<u-picker :show="showList" :columns="[list[listType]]" @confirm="onSelect" keyName="name"></u-picker>
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
		...mapState('common', ['archive', 'dicts', 'users', 'me', 'companys'])
	},
	components: {
		FUpload,
		mxdatepicker
	},
	watch: {
		// dicts() {
		// 	this.init()
		// }
	},
	props: {
		item: {
			type: Object,
			default: () => {}
		},
		block: {
			default: null
		}
	},
	data() {
		return {
			show: true,
			id: '',
			showStime: false,
			showList: false,
			list: {
				responsibleOrg: [],
				checkType: []
			},
			listType: '',
			listValue: {
				responsibleOrg: '',
				checkType: ''
			},
			form: {
				name: null,
				code: null,
				checkType: null,
				items: [
					{
						question: null
					}
				],
				require: null,
				responsibleOrg: null,
				file: null,
				date: null
			},
			selectId: 0,
			rules: {
				queation: [
					{
						required: true,
						message: '请输入存在问题',
						trigger: ['blur']
					}
				],
				checkType: [
					{
						required: true,
						message: '请选择检查类型',
						trigger: ['blur']
					}
				],
				require: [
					{
						required: true,
						message: '请选择整改要求',
						trigger: ['blur']
					}
				],
				responsibleOrg: [
					{
						required: true,
						message: '请选择责任单位',
						trigger: ['blur']
					}
				],
				date: [
					{
						required: true,
						message: '请输入整改期限',
						trigger: ['blur']
					}
				]
			}
		}
	},
	methods: {
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
			this.form.date = date
			this.showStime = false
		},
		initDict() {
			if (this.dicts) {
				this.list = {
					responsibleOrg: this.companys,
					checkType: [
						{
							id: '0',
							name: '上级检查'
						},
						{
							id: '1',
							name: '集团检查'
						},
						{
							id: '2',
							name: '公司检查'
						},
						{
							id: '3',
							name: '第三方检查'
						},
						{
							id: '4',
							name: '督导员检查'
						}
					]
				}
			}
		},
		addQuestion() {
			this.form.items.push({
				question: ''
			})
			this.$nextTick(() => {
				this.$refs.collapseRef.init()
			})
		},
		onSelect(target) {
			this.listValue[this.listType] = target.value[0].name
			this.form[this.listType] = target.value[0].id
			this.showList = false
		},
		onSubmit() {
			let rules = ['name', 'code', 'checkType', 'date', 'require', 'responsibleOrg']

			if (rules.find((i) => !this.form[i])) {
				return this.$refs.uToast.show({
					type: 'error',
					message: this.rules[rules.find((i) => !this.form[i])][0].message,
					icon: false,
					complete() {}
				})
			}
			this.form.items.forEach((i) => {
				if (!i.question) {
					this.$refs.uToast.show({
						type: 'error',
						message: '请输入存在问题',
						icon: false,
						complete() {}
					})
					throw new Error('终止循环')
				}
			})
			uni.showModal({
				title: '提示',
				content: '确定提交隐患通知单吗？',
				success: (e) => {
					if (e.confirm) {
						uni.showLoading({
							title: '提交中...'
						})
						let form = JSON.parse(JSON.stringify(this.form))
						form.code = this.archive.code
						form.name = this.archive.name
						form.block_code = this.block
						this.$request.post(`new/improves/project`, form).then(({ data }) => {
							if (data.code === 200) {
								uni.hideLoading()
								this.init()

								uni.showModal({
									title: '创建成功！',
									showCancel: false,
									success: () => {
										this.$emit('onClose')
									}
								})
							} else {
								uni.hideLoading()
								uni.showModal({
									title: '提示',
									content: data.message,
									showCancel: false
								})
							}
						})
					}
				}
			})
		},
		init() {
			this.listValue = {
				category: '',
				type: ''
			}
			this.form = {
				name: this.archive.name,
				code: this.archive.code,
				checkType: null,
				items: [
					{
						question: this.item.name
					}
				],
				require: null,
				responsibleOrg: null,
				file: null,
				date: null
			}
		}
	},
	onReady() {
		this.initDict()
		this.init()
	}
}
</script>
<style lang="scss" scoped>
.c-improves {
	max-height: 1200rpx;
	overflow-y: auto;
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
	/deep/ .u-collapse-item__content_text {
		padding: 12px 0;
	}
}
</style>
