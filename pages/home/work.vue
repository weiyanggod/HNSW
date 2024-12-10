<template>
	<u-modal :show="show" :title="' '" :content="' '" @cancel="onCancel" :showConfirmButton="false">
		<view class="c-work">


			<view class="c-work__table">
				<view class="th">
					<view class="td" style="width: 100%;">作业审批</view>
				</view>
				<!-- <view class="tr">
					<view class="td" style="width: 30%;">作业项目名称</view>
					<view class="td" style="width: 70%;">
						{{form.name}}
					</view>

				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">单据号</view>
					<view class="td" style="width: 70%;">
						{{form.code}}
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">作业性质</view>
					<view class="td" style="width: 70%;">
						{{form.type}}
					</view>
				</view> -->

				<view class="tr">
					<view class="td" style="width: 30%;">发生时间</view>
					<view class="td value" style="width: 70%;padding-right: 20rpx;box-sizing: border-box;"
						@click="showStime = true">
						<text>{{form.time||"请选择发生时间"}}</text>
						<u-icon name="arrow-down" color="#000" size="12"></u-icon>
					</view>
				</view>

				
				<view class="tr">
					<view class="td" style="width: 30%;">作业结果</view>
					<view class="td" style="width: 70%;display: flex;align-items: center;">
						<u-radio-group v-model="form.result">
							<u-radio name="0" size="14" labelSize="12" label="正常作业"> </u-radio>
							<text style="margin-right: 20rpx;"></text>
							<u-radio name="1" size="14" labelSize="12" label="取消作业"></u-radio>
						</u-radio-group>
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">签字表</view>
					<view class="td value" style="width: 70%;justify-content: flex-start;">
						<FUpload v-model="form.file"></FUpload>
					</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 30%;">备注</view>
					<view class="td" style="width: 70%;">
						<input style="text-align: left;width: 100%;" v-model="form.remark" placeholder="请输入"></input>
					</view>
				</view>
			</view>

			<view class="c-work__footer" slot="confirmButton">

				<view class="btn" @click="onCancel">
					取消
				</view>
				<view class="btn btn2" @click="onSubmit">
					提交审批
				</view>


			</view>
			<mxdatepicker :show="showStime" type="date" :show-tips="true" @confirm="onSelectedDate"
				@cancel="onCancelPicker" />

			<u-toast ref="uToast"></u-toast>
		</view>
	</u-modal>

</template>
<script>
	import {
		mapState
	} from "vuex";
	import FUpload from "@/components/FUpload.vue";
	import mxdatepicker from "@/components/mx-datepicker/mx-datepicker.vue";
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
				id: "",
				showStime: false,
				showList: false,

				form: {
			
					time: null,
					file: null,
					remark: null,
					result: null

				},
				selectId: 0,
				rules: {
		
					file: [{
						required: true,
						message: "请上传签字表",
						trigger: ["blur"]
					}],
					result: [{
						required: true,
						message: "作业结果",
						trigger: ["blur"]
					}],
					time: [{
						required: true,
						message: "请输入填报时间",
						trigger: ["blur"]
					}],

				}
			}
		},
		methods: {
			onCancel() {
				this.show = false;
				this.$emit('onClose')
			},
			onCancelPicker() {
				this.showStime = false;
			},
			onSelectedDate(e) {

				let date = new Date(e.date).Format('YYYY-MM-DD');
				// this.inspectionForm.pstime = Date.parse(date) / 1000;
				this.form.time = date;
				this.showStime = false;
			},
			onSubmit() {
				let rules = ["time", "result",  "file"];

				if (rules.find(i => !this.form[i])) {
					return this.$refs.uToast.show({
						type: 'error',
						message: this.rules[rules.find(i => !this.form[i])][0].message,
						icon: false,
						complete() {

						}
					})
				}

				uni.showModal({
					title: "提示",
					content: "确定提交作业审批吗？",
					success: e => {
						if (e.confirm) {
						uni.showLoading({
							title: "提交中..."
						});
						let form = JSON.parse(JSON.stringify(this.form));

						form.time = form.time + " 00:00:00"
						this.$request.post(`worker`, {
							code: this.archive.code,
							form: form
						}).then(res => {
							uni.hideLoading();
							this.init()

							uni.showModal({
								title: "创建成功！",
								showCancel: false,
								success: () => {
									this.$emit('onClose')
								}
							});
						}).catch(err=>{
											uni.hideLoading();
											uni.showModal({
												title: "提示",
												content: ((err||{}).data||{}).error,
												showCancel: false,
											})
								});
						}
					},
					cancel:e=>{
						uni.hideLoading();
					}
				});


			},
			init() {
				this.listValue = {
					category: '',
					type: ''
				};
				this.form = {
	
					time: new Date().Format('YYYY-MM-DD'),
				};
			},
		},
		onReady() {
			this.init();
		}
	}
</script>
<style lang="scss">
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
