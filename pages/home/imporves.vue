<template>
	<u-modal :show="show" :title="' '" :content="' '" @cancel="onCancel" :showConfirmButton="false">
		<view class="c-improves">
			<view class="c-improves__table">
				<view class="th">
					<view class="td" style="width: 100%">隐患整改发起</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">检查单位</view>
					<view class="td" style="width: 70%">{{ me.dept }}</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">被检查单位</view>
					<view
						class="td value"
						style="width: 70%; padding-right: 20rpx; box-sizing: border-box"
						@click="
							listType = `inspectedUnit`
							showList = true
						"
					>
						<text>{{ listValue[0][`inspectedUnit`] || '请选择' }}</text>
						<u-icon name="arrow-down" color="#000" size="12"></u-icon>
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%">发生时间</view>
					<view
						class="td value"
						style="width: 70%; padding-right: 20rpx; box-sizing: border-box"
						@click="
							showStimeType = 'rtime'
							showStime = true
						"
					>
						<text>{{ form.rtime || '请选择发生时间' }}</text>
						<u-icon name="arrow-down" color="#000" size="12"></u-icon>
					</view>
				</view>
			</view>
			<u-collapse ref="collapseRef">
				<u-collapse-item title="明细表">
					<u-icon name="plus" color="#3badfb" @click="addQuestion"></u-icon>
					<view class="c-improves__table" v-for="(item, index) in form.items" :key="index">
						<view class="tr">
							<view class="td" style="width: 30%">隐患名称</view>
							<view class="td" style="width: 70%">
								<input style="text-align: left; width: 100%" v-model="item.name" placeholder="请输入" />
							</view>
						</view>
						<view class="tr">
							<view class="td" style="width: 30%">隐患分类</view>
							<view
								class="td value"
								style="width: 70%; padding-right: 20rpx; box-sizing: border-box"
								@click="
									listType = `category`
									showList = true
									selectIndex = index
								"
							>
								<text>{{ listValue[index][`category`] || '请选择' }}</text>
								<u-icon name="arrow-down" color="#000" size="12"></u-icon>
							</view>
						</view>
						<view class="tr">
							<view class="td" style="width: 30%">隐患类别</view>
							<view
								class="td value"
								style="width: 70%; padding-right: 20rpx; box-sizing: border-box"
								@click="
									listType = `type`
									showList = true
									selectIndex = index
								"
							>
								<text>{{ listValue[index][`type`] || '请选择' }}</text>
								<u-icon name="arrow-down" color="#000" size="12"></u-icon>
							</view>
						</view>
						<view class="tr">
							<view class="td" style="width: 30%">隐患描述</view>
							<view class="td value" style="width: 70%">
								<textarea type="text" style="text-align: left; width: 100%; height: 120rpx" v-model="item.desc" placeholder="请输入"></textarea>
							</view>
						</view>
						<view class="tr">
							<view class="td" style="width: 30%">地点</view>
							<view class="td value" style="width: 70%">
								<textarea style="text-align: left; width: 100%; height: 90rpx" v-model="item.address" placeholder="请输入"></textarea>
							</view>
						</view>

						<view class="tr">
							<view class="td" style="width: 30%">整改时限</view>
							<view
								class="td value"
								style="width: 70%; padding-right: 20rpx; box-sizing: border-box"
								@click="
									showStimeType = 'etime'
									showStime = true
									selectIndex = index
								"
							>
								<text>{{ item.etime || '请选择整改时限' }}</text>
								<u-icon name="arrow-down" color="#000" size="12"></u-icon>
							</view>
						</view>
						<view class="tr">
							<view class="td" style="width: 30%">图片</view>
							<view class="td value" style="width: 70%; justify-content: flex-start">
								<FUpload v-model="item.photo"></FUpload>
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
		dicts() {
			// this.init()
		}
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
			showStimeType: '',
			showStime: false,
			showList: false,
			list: {
				category: [],
				type: [],
				inspectedUnit: []
			},
			listType: '',
			listValue: [
				{
					category: '',
					type: '',
					inspectedUnit: ''
				}
			],
			form: {
				inspectedUnit: null,
				items: [
					{
						name: null,
						category: null,
						desc: null,
						address: null,
						discoverer: null,
						photo: null,
						etime: null,
						code: null
					}
				]
			},
			// 当前隐患对应的index
			selectIndex: 0,
			rules: {
				inspectedUnit: [
					{
						required: true,
						message: '请选择被检查单位',
						trigger: ['blur']
					}
				],
				rtime: [
					{
						required: true,
						message: '请输入发生时间',
						trigger: ['blur']
					}
				],
				name: [
					{
						required: true,
						message: '请输入隐患名称',
						trigger: ['blur']
					}
				],
				category: [
					{
						required: true,
						message: '请选择隐患分类',
						trigger: ['blur']
					}
				],
				type: [
					{
						required: true,
						message: '请选择隐患类别',
						trigger: ['blur']
					}
				],
				desc: [
					{
						required: true,
						message: '请输入隐患描述',
						trigger: ['blur']
					}
				],
				address: [
					{
						required: true,
						message: '请输入地点',
						trigger: ['blur']
					}
				],

				discoverer: [
					{
						required: true,
						message: '请输入发现人',
						trigger: ['blur']
					}
				],
				// photo: [{
				// 	required: true,
				// 	message: "请添加隐患照片",
				// 	trigger: ["blur"]
				// }],
				etime: [
					{
						required: true,
						message: '请输入整改时限',
						trigger: ['blur']
					}
				]
				// 问题列表
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
			if (this.showStimeType === 'rtime') {
				this.form[this.showStimeType] = date
			} else {
				this.form.items[this.selectIndex][this.showStimeType] = date
			}
			this.showStime = false
		},
		initDict() {
			if (this.dicts) {
				this.list = {
					category: this.dicts.improve_cate,
					type: this.dicts.improve_type,
					inspectedUnit: this.companys
				}
			}
		},
		// 新增隐患明细
		addQuestion() {
			this.form.items.push({
				name: null,
				category: null,
				type: null,
				desc: null,
				address: this.archive.name + (this.archive.address || ''),
				rtime: new Date().Format('YYYY-MM-DD'),
				photo: null,
				etime: null
			})
			this.listValue.push({
				category: '',
				type: '',
				inspectedUnit: ''
			})
			this.$nextTick(() => {
				this.$refs.collapseRef.init()
			})
		},
		onSelect(target) {
			this.listValue[this.selectIndex][this.listType] = target.value[0].name
			if (this.listType === 'inspectedUnit') {
				this.form[this.listType] = target.value[0].id
			} else {
				this.form.items[this.selectIndex][this.listType] = target.value[0].id
			}

			this.showList = false
		},
		onSubmit() {
			let rules = ['inspectedUnit', 'rtime', 'name', 'category', 'type', 'etime', 'desc', 'address']
			this.form.items.forEach((item, index) => {
				rules.forEach((i, inx) => {
					if (i === 'inspectedUnit' || i === 'rtime') {
						if (!this.form[i]) {
							this.$refs.uToast.show({
								type: 'error',
								message: this.rules[i][0].message,
								icon: false,
								complete() {}
							})
							throw new Error('终止循环')
						}
					} else {
						if (!this.form.items[index][i]) {
							this.$refs.uToast.show({
								type: 'error',
								message: this.rules[i][0].message,
								icon: false,
								complete() {}
							})
							throw new Error('终止循环')
						}
					}
				})
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
						form.items.forEach((i) => {
							i.etime = i.etime + ' 00:00:00'
							i.block_code = this.block
						})
						form.rtime = form.rtime + ' 00:00:00'
						form.block_code = this.block
						this.$request.post(`/new/improves/process`, form).then(({ data }) => {
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
				},
				cancel: (e) => {
					uni.hideLoading()
				}
			})
		},
		init() {
			this.form = {
				items: [
					{
						name: this.archive.name + '安全隐患',
						category: null,
						type: null,
						desc: this.item.name,
						address: this.archive.name + (this.archive.address || ''),
						photo: null,
						etime: null
					}
				]
			}
		}
	},
	onReady() {
		this.initDict()
		this.init()
	}
}
</script>
<style lang="scss">
.c-improves {
	width: 100%;
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
}
</style>
