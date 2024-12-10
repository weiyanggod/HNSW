<template>
	<view class="c-safe">
		<view class="header">
			<view
				class="item"
				v-for="(item, index) in inspections"
				:key="item.id"
				:class="{ itemed: index == selectId }"
				@click="selectId = index"
			>
				{{ item.name }}
			</view>
		</view>
		<view class="body">
			<view class="c-safe__table">
				<view class="th">
					<view class="td" style="width: 10%">序号</view>
					<view class="td" style="width: 35%">检查要求</view>
					<view class="td" style="width: 20%">状态</view>
					<view class="td" style="width: 15%">图片</view>
					<view class="td" style="width: 20%">隐患发起</view>
				</view>
				<view
					class="tr"
					v-for="item in inspections[selectId].items"
					:key="item.id"
				>
					<view class="td" style="width: 10%">{{ item.id }}</view>
					<view class="td" style="width: 35%; text-align: left">
						{{ item.name }}
					</view>
					<view
						class="td status"
						style="width: 20%; padding-right: 20rpx"
						@click="onSelectItem(item)"
					>
						<!-- 是否需要录入数据 -->
						<view v-if="item.isFillIn === '否'">
							<text>
								{{
									formValue[
										`${item.inspectionId}_${item.id}`
									] || '请选择'
								}}
							</text>
							<u-icon
								name="arrow-down"
								color="#000"
								size="12"
							></u-icon>
						</view>
						<view v-else>
							<textarea
								@input="Oninput($event, item)"
								:value="
									form[
										`${item.inspectionId}_${item.id}_inputValue`
									]
								"
								:auto-height="true"
								:maxlength="100"
								cols="30"
								rows="10"
								style="width: 70px"
							></textarea>
						</view>
					</view>
					<view
						class="td status"
						style="width: 15%"
						@click="onPhoto(item)"
					>
						<image
							class="improve"
							:src="
								form[`${item.inspectionId}_${item.id}_photo`]
									? photoImg
									: photoDefaultImg
							"
							mode=""
						></image>
					</view>
					<view
						class="td status"
						style="width: 20%; color: #3c9cff"
						@click="onImprove(item)"
					>
						<image
							class="improve"
							src="@/static/img/improve.png"
							mode=""
						></image>
						整改
					</view>
				</view>
			</view>
		</view>
		<view class="c-safe__footer">
			<view class="btn" @click="onSubmitStorage()">保存</view>
			<view class="btn btn2" @click="onSubmit">提交</view>
		</view>
		<u-modal
			:show="showPhoto"
			:title="' '"
			:content="' '"
			@cancel="onPhotoCancel"
			:showConfirmButton="false"
		>
			<view class="u-modal">
				<view class="u-modal_photo" v-if="showPhoto">
					<FUpload
						v-model="
							form[
								`${selectItem.inspectionId}_${selectItem.id}_photo`
							]
						"
					></FUpload>
				</view>
				<view class="u-modal_btn" @click="onPhotoCancel">确定</view>
			</view>
		</u-modal>
		<u-picker
			:show="showStatus"
			:columns="[status]"
			@confirm="onSelect"
			@cancel="onSelectCancel"
			keyName="name"
		></u-picker>
		<!-- 整改弹框 -->
		<improves
			v-if="showImproves && category != '工程'"
			:block="block"
			:item="selectItem"
			@onClose="onCancel"
		></improves>
		<improvesGC
			v-if="showImproves && category == '工程'"
			:block="block"
			:item="selectItem"
			@onClose="onCancel"
		></improvesGC>
	</view>
</template>
<script>
import improves from './imporves.vue'
import improvesGC from './imporvesGC.vue'
import FUpload from '@/components/FUpload.vue'
import { mapState } from 'vuex'
export default {
	computed: {
		...mapState('common', ['archive', 'inspections', 'users', 'me']),
	},
	watch: {
		block() {
			this.init()
		},
		archive() {
			this.category = (this.archive || {}).category1 || this.category
		},
	},
	props: {
		block: {
			default: null,
		},
	},
	components: {
		improves,
		improvesGC,
		FUpload,
	},
	data() {
		return {
			category: null,
			photoImg: require('@/static/img/photo.png'),
			photoDefaultImg: require('@/static/img/photodefault.png'),
			showImproves: false,
			id: '',
			showPhoto: false,
			showStatus: false,
			status: [
				{
					name: '✅ 正常',
					id: '0',
				},
				{
					name: '❌ 异常',
					id: '1',
				},
				{
					name: '无此项',
					id: '2',
				},
				{
					name: '未检查',
					id: '3',
				},
			],
			selectId: 0,
			selectItem: {},
			form: {},
			formValue: {},
			resultData: '',
		}
	},
	methods: {
		onSelectCancel() {
			this.showStatus = false
			this.$emit('onClose')
		},
		onSelectItem(item) {
			if (item.isFillIn === '否') {
				this.id = `${item.inspectionId}_${item.id}`
				this.showStatus = true
				this.$emit('onAdd')
			}
		},
		onCancel() {
			this.showImproves = false
			this.$emit('onClose')
		},
		onPhotoCancel() {
			this.showPhoto = false
			this.$emit('onClose')
		},
		onPhoto(item) {
			this.selectItem = item
			this.showPhoto = true
			this.$emit('onAdd')
		},
		onImprove(item) {
			this.selectItem = item
			this.showImproves = true
			this.$emit('onAdd')
		},
		initInspections(inspections) {
			this.form = {}
			this.formValue = {}
			;(this.inspections || []).forEach((i) => {
				;(i.items || []).forEach((c) => {
					const inspection = inspections.find(
						(i) => i.requirement == c.name,
					)
					this.form[`${c.inspectionId}_${c.id}`] = inspection
						? inspection.result
						: '3'
					this.formValue[`${c.inspectionId}_${c.id}`] =
						this.status[
							this.form[`${c.inspectionId}_${c.id}`]
						]?.name
					this.form[`${c.inspectionId}_${c.id}_photo`] = inspection
						? inspection.file
						: null
					this.form[`${c.inspectionId}_${c.id}_inputValue`] =
						inspection ? inspection.resultData : null
				})
			})
			inspections.forEach(() => {})
		},
		onSelect(target) {
			this.formValue[this.id] = target.value[0].name
			this.form[this.id] = target.value[0].id
			this.showStatus = false
			this.$emit('onClose')
		},
		Oninput(event, item) {
			this.form[item.inspectionId + '_' + item.id + '_inputValue'] =
				event.detail.value
		},
		onSubmitStorage() {
			// uni.showModal({
			// 	title: "提示",
			// 	content: "确定提交巡检单吗？",
			// 	confirm: e => {
			// 		if (e.confirm) {
			uni.showLoading({
				title: '提交中...',
			})
			let inspections = []

			this.inspections.forEach((i) => {
				i.items.forEach((c) => {
					inspections.push({
						id: c.id,
						inspectionId: c.inspectionId,
						result:
							this.form[`${c.inspectionId}_${c.id}`] != null
								? this.form[`${c.inspectionId}_${c.id}`]
								: '3',
						file:
							this.form[`${c.inspectionId}_${c.id}_photo`] || '',
						requirement: c.name,
						resultData:
							this.form[`${c.inspectionId}_${c.id}_inputValue`] ||
							'',
					})
				})
			})
			this.$request
				.post(`inspections/storage`, {
					code: this.archive.code,
					name: this.archive.name,
					block_code: this.block,
					date: new Date().Format('YYYY-MM-DD'),
					inspections: inspections,
				})
				.then((res) => {
					uni.hideLoading()
					if (res.data.code == 200) {
						uni.showModal({
							title: '保存成功！',
							showCancel: false,
							success: () => {
								this.init()
							},
						})
					} else {
						uni.showModal({
							title: '保存失败',
							content: '保存失败,请联系管理员',
							showCancel: false,
						})
					}
				})

			// }
			// 	},
			// 	cancel:e=>{
			// 		uni.hideLoading();
			// 	}
			// });
		},
		onSubmit() {
			let ins = null
			this.inspections.forEach((c) => {
				c.items.forEach((i) => {
					const inputValue =
						this.form[`${i.inspectionId}_${i.id}_inputValue`]
					if (
						i.isFillIn === '是' &&
						(inputValue == null || inputValue == '')
					) {
						ins = { title: `未填写：${i.name}`, showCancel: false }
					}
					if (
						this.form[`${i.inspectionId}_${i.id}`] == null ||
						(this.form[`${i.inspectionId}_${i.id}`] == '3' &&
							i.isFillIn === '否')
					) {
						ins = { title: `未检查：${i.name}`, showCancel: false }
					}
					if (
						this.archive.category1 == '工程' &&
						this.form[`${i.inspectionId}_${i.id}`] != '2' &&
						!this.form[`${i.inspectionId}_${i.id}_photo`] &&
						this.form[`${i.inspectionId}_${i.id}_inputValue`] !==
							'无'
					) {
						ins = {
							title: `未上传图片：${i.name}`,
							showCancel: false,
						}
					}
					if (
						this.archive.category1 != '工程' &&
						this.form[`${i.inspectionId}_${i.id}`] == '1' &&
						!this.form[`${i.inspectionId}_${i.id}_photo`]
					) {
						ins = {
							title: `未上传异常图片：${i.name}`,
							showCancel: false,
						}
					}
				})
			})

			if (ins) {
				return uni.showModal(ins)
			}
			uni.showModal({
				title: '提示',
				content: '确定提交巡检单吗？',
				success: (e) => {
					if (e.confirm) {
						uni.showLoading({
							title: '提交中...',
						})

						let inspections = []
						this.inspections.forEach((i) => {
							i.items.forEach((c) => {
								inspections.push({
									id: c.id,
									inspectionId: c.inspectionId,

									result:
										this.form[
											`${c.inspectionId}_${c.id}`
										] != null
											? this.form[
													`${c.inspectionId}_${c.id}`
											  ]
											: '2',
									file:
										this.form[
											`${c.inspectionId}_${c.id}_photo`
										] || '',
									requirement: c.name,
									resultData:
										this.form[
											`${c.inspectionId}_${c.id}_inputValue`
										] || '',
								})
							})
						})
						this.$request
							.post(`inspections`, {
								code: this.archive.code,
								block_code: this.block,
								name: this.archive.name,
								date: new Date().Format('YYYY-MM-DD'),
								inspections: inspections,
							})
							.then((res) => {
								uni.hideLoading()
								if (res.data.code !== 200) {
									uni.showModal({
										title: '提交失败',
										content: '提交失败,请联系管理员',
										showCancel: false,
									})
								} else {
									uni.showModal({
										title: '提交成功！',
										showCancel: false,
										success: () => {
											this.init()
										},
									})
								}
							})
					}
				},
				cancel: (e) => {
					uni.hideLoading()
				},
			})
		},
		init() {
			if ((this.inspections || []).length && this.block) {
				this.$request
					.get(
						`inspections/${(this.archive || {}).code}/${
							this.block
						}/storage`,
					)
					.then((res) => {
						this.initInspections(
							(res.data.data || {}).inspections || [],
						)
					})
			}
		},
	},
	onReady() {
		this.category = (this.archive || {}).category1 || this.category
		this.init()
	},
}
</script>
<style lang="scss">
.c-safe {
	.header {
		display: flex;

		.item {
			min-width: initial;
			padding: 10rpx 4rpx;
			flex-grow: 1;
			background-color: rgb(234, 243, 254);
			border-radius: 8rpx 8rpx 0 0;
			border: 1px solid rgb(234, 243, 254);
			border-bottom: 1px solid rgb(232, 232, 232);
			display: flex;
			align-items: center;
		}

		.itemed {
			background-color: #fff;
			border: 1px solid rgb(232, 232, 232);
			border-bottom: 1px solid #fff;
		}
	}

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
				// padding-left: 8rpx;
				border-right: 1rpx solid rgb(232, 232, 232);
				line-height: 48rpx;
				position: relative;
				text-align: center;
				padding: 0 2rpx;
				// display: flex;
				// align-items: center;
			}

			.name {
				width: 26%;
			}

			.value {
				flex: 1;
			}

			.status {
				align-items: center;
				justify-content: center;
				display: flex;

				text {
					flex: 1;
				}
			}

			.improve {
				margin-right: 4rpx;
				width: 42rpx;
				height: 40rpx;
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
	.u-modal {
		height: 600rpx;
		display: flex;
		flex-direction: column;
	}
	.u-modal_photo {
		flex: 1;

		line-height: 48rpx;
	}
	.u-modal_btn {
		height: 70rpx;
		border-radius: 8rpx;
		width: 200rpx;
		background-color: #f2f2f2;
		text-align: center;
		line-height: 70rpx;
		margin: auto auto 10rpx;
		background-color: #169bd5;
		color: #fff;
	}
}
</style>
