<template>
	<view class="p-home" v-if="(archive && archive.code) || !isNewCode">
		<view class="p-home__header">
			<image class="img" src="../../static/img/logo.png"></image>
			<view class="name">安全管理一件事</view>
			<view class="info" @click="showInfo = true">
				{{ me.name }}
			</view>
		</view>
		<box title="风险源信息" class="p-home__info" style="margin-top: 20rpx">
			<view class="table">
				<view :class="index == 0 ? 'th' : 'tr'" v-for="(item, index) in info[archive.category1]" :key="item.name">
					<view class="td name">{{ item.name || '-' }}</view>
					<view class="td value">{{ archive[item.value] || '-' }}</view>
					<view class="td name" v-if="item.name2">{{ item.name2 || '-' }}</view>
					<view class="td value" v-if="item.name2">
						{{ archive[item.value2] || '-' }}
						<span
							v-if="item.value3"
							:style="{
								color: archive[item.value3] ? '#3ace3a' : '#ccc',
								fontSize: '32rpx'
							}"
						>
							{{ archive[item.value3] ? '√' : '○' }}
						</span>
					</view>
				</view>
			</view>
		</box>
		<box title="安全检查" class="p-home__info" style="margin-top: 20rpx">
			<view slot="title2" class="block" @click="showBlock = true">
				{{ selectBlock.name }}
				<u-icon name="arrow-down"></u-icon>
			</view>
			<safe v-if="hasInBlock" :block="selectBlock.code" @onClose="showImprove = false" @onAdd="showImprove = true"></safe>
			<view v-else class="desc">请前往该工程区域!</view>
		</box>
		<box title="工程项目" class="p-home__info" style="margin-top: 20rpx" v-if="archive.category1 == '工程'">
			<view class="items">
				<view class="item" v-for="item in projects" :key="item.name" @click="go(item)">
					<image class="img" :src="item.icon"></image>
					<view class="name">
						{{ item.name }}
					</view>
				</view>
			</view>
		</box>
		<box title="有限空间" class="p-home__info" style="margin-top: 20rpx" v-if="archive.category1 == '特种作业'">
			<view slot="title2" class="block" @click="showBlock = true">
				{{ selectBlock.name }}
				<u-icon name="arrow-down"></u-icon>
			</view>
			<view class="items" v-if="hasInBlock">
				<view class="item" v-for="item in actions" :key="item.name" @click="go(item)">
					<image class="img" :src="item.icon"></image>
					<view class="name">
						{{ item.name }}
					</view>
				</view>
			</view>
			<view v-else class="desc">请前往该工程区域!</view>
		</box>

		<box title="统计图表" class="p-home__info" style="margin-top: 20rpx">
			<view class="charts">
				<view class="select" v-if="archive.category1 != '特种作业'">
					<view class="btns" style="width: 160rpx">
						<view class="btn" @click="selectChartType(btn)" :class="{ btned: btn.value == charts.type }" v-for="btn in charts.types" :key="btn.value">
							{{ btn.name }}
						</view>
					</view>
					<view
						class="name"
						@click="selectChart(item)"
						:style="{ borderColor: charts.index == item ? charts[item].color : '#ccc', color: charts.index == item ? '#000' : '#ccc' }"
						v-for="item in [1, 2, 3]"
						:key="item"
					>
						{{ charts[item].name }}
					</view>
				</view>
				<u-circle-progress
					class="chart"
					v-if="!charts.loading && !charts.loading2 && archive.category1 != '特种作业'"
					v-show="!showWorder && !showBlock && !showImprove && !showDetail && !showInfo && !show && !showInspectionsDetail && !showStartProject && !showProject_stop"
					:active-color="charts[charts.index].color"
					:percent="charts[charts.index][charts.type]"
					width="260"
					:duration="0"
					:border-width="20"
				>
					<view class="content">
						<text class="name">{{ charts.type == 'month' ? '月' : '年' }}检查率</text>
						<view class="value" :style="{ color: charts[charts.index].color }">{{ charts[charts.index][charts.type] }}%</view>
					</view>
				</u-circle-progress>
				<u-circle-progress
					v-if="!charts.loading2"
					class="chart"
					:active-color="charts[4].color"
					v-show="!showWorder && !showBlock && !showImprove && !showDetail && !showInfo && !show && !showInspectionsDetail && !showStartProject && !showProject_stop"
					:percent="charts[4].value"
					width="260"
					:duration="0"
					:border-width="20"
				>
					<view class="content">
						<text class="name">隐患整改完成率</text>
						<view class="value" :style="{ color: charts[4].color }">{{ charts[4].value }}%</view>
					</view>
				</u-circle-progress>
			</view>
		</box>
		<box title="隐患及检查记录台账" class="p-home__info" style="margin-top: 20rpx">
			<view class="btns">
				<view class="btn" @click="selectListType(btn)" :class="{ btned: btn.value == list.type }" v-for="btn in list.types" :key="btn.value">
					{{ btn.name }}
				</view>
			</view>
			<view class="table table2" v-if="list.type == '2'">
				<view class="th">
					<view class="td" style="width: 10%">序号</view>
					<view class="td" style="width: 20%">检查时间</view>

					<view class="td" style="width: 15%">检查人</view>
					<view class="td" style="width: 25%">检查单位</view>
					<view class="td" style="width: 15%">隐患情况</view>
					<view class="td" style="width: 15%">整改情况</view>
				</view>
				<view class="tr" v-for="(item2, index) in list.inspections" :key="index">
					<view class="td" style="width: 10%">{{ index + 1 }}</view>
					<view class="td" style="width: 20%; color: #3c9cff" @click="onSelectInspections(item2)">
						{{ item2.time.split(' ')[0] }}
					</view>
					<view class="td" style="width: 15%">{{ item2.user }}</view>
					<view class="td" style="width: 25%">{{ item2.company }}</view>
					<view class="td" style="width: 15%">{{ item2.improve_situation }}</view>
					<view class="td" style="width: 15%; color: #3c9cff" @click="onSelectInspection(item2)">
						{{ item2.improve_state }}
					</view>
				</view>
			</view>

			<view class="table table2" v-else>
				<view class="th">
					<view class="td" style="width: 20%">隐患名称</view>
					<view class="td" style="width: 20%">发现时间</view>
					<view class="td" style="width: 25%">整改措施</view>
					<view class="td" style="width: 20%">整改时间</view>
					<view class="td" style="width: 15%">隐患状态</view>
				</view>
				<view
					class="tr"
					v-for="item in list.improves.filter((i) => (list.type == '1' ? i.state == '已整改' || i.state == '已完成' : i.state != '已整改' && i.state != '已完成'))"
					:key="item.code"
					@click="onSelectImprove(item)"
				>
					<view class="td line" style="width: 20%">{{ item.name || '-' }}</view>
					<view class="td" style="width: 20%; color: #3c9cff">{{ item.rtime ? item.rtime.split(' ')[0] : '-' }}</view>
					<view class="td line" style="width: 25%">{{ item.method || '-' }}</view>
					<view class="td" style="width: 20%">{{ item.time ? item.time.split(' ')[0] : '-' }}</view>
					<view class="td" style="width: 15%">{{ item.state }}</view>
				</view>
			</view>
		</box>
		<box title="停工记录" class="p-home__info" style="margin-top: 20rpx">
			<view class="table table2">
				<view class="th">
					<view class="td" style="width: 10%">序号</view>
					<view class="td" style="width: 20%">申请人</view>
					<view class="td" style="width: 20%">区块名称</view>
					<view class="td" style="width: 25%">停工开始日期</view>
					<view class="td" style="width: 25%">停工结束日期</view>
				</view>
				<view class="tr" v-for="(item2, index) in stopList.data" :key="index">
					<view class="td" style="width: 10%">{{ index + 1 }}</view>

					<view class="td" style="width: 20%">{{ item2.applicants }}</view>
					<view class="td" style="width: 20%">{{ item2.blockName }}</view>
					<view class="td" style="width: 25%; color: #3c9cff">
						{{ item2.startDate }}
					</view>
					<view class="td" style="width: 25%; color: #3c9cff">
						{{ item2.endDate }}
					</view>
				</view>
			</view>
		</box>
		<worker :block="selectBlock.code" v-if="showWorder" @onClose="showWorder = false"></worker>
		<projectStop v-if="showProject_stop" @onClose="showProject_stop = false"></projectStop>
		<info v-if="showInfo" @onClose="showInfo = false" :positions="positions" :positionAccuracy="positionAccuracy"></info>
		<improveDetail
			:item="selectImprove"
			:items="improvesDto"
			v-if="showDetail"
			@onClose="
				getData()
				showDetail = false
			"
		></improveDetail>
		<inspectionsDetail :items="checkDetailDto" v-if="showInspectionsDetail" @onClose="showInspectionsDetail = false"></inspectionsDetail>
		<u-picker v-if="!show" :show="showBlock" :columns="[archive.block]" keyName="name" @confirm="onSelectConfirm" @cancel="onSelectCancel"></u-picker>
		<u-modal :show="show" :title="' '" :content="' '" @cancel="onCancel" :showConfirmButton="false">
			<view class="c-info2">
				<view class="c-info2__table">
					<view class="th">
						<view class="td" style="width: 100%">工程完工</view>
					</view>
					<view class="tr">
						<view class="td" style="width: 30%">区块</view>
						<view class="td value" style="width: 70%" @click="showBlock = true">
							{{ selectBlock.name }}
							<u-icon name="arrow-down"></u-icon>
						</view>
					</view>
				</view>
				<view class="c-info2__footer" slot="confirmButton">
					<view class="btn" @click="show = false">取消</view>
					<view class="btn btn2" @click="onSubmitProjectEnd">确定</view>
				</view>
			</view>
			<u-picker v-if="show" :show="showBlock" :columns="[archive.block]" keyName="name" @confirm="onSelectConfirm" @cancel="onSelectCancel"></u-picker>
		</u-modal>
		<u-modal :show="showStartProject" :title="' '" :content="' '" @cancel="onCancel" :showConfirmButton="false">
			<view class="c-info2">
				<view class="c-info2__table">
					<view class="th">
						<view class="td" style="width: 100%">当日签到</view>
					</view>
					<view class="tr">
						<view class="td" style="width: 30%">备注</view>
						<view class="td value" style="width: 70%">
							<textarea type="text" style="text-align: left; width: 100%; height: 120rpx" v-model="startProject.node" placeholder="请输入"></textarea>
						</view>
					</view>
				</view>
				<view class="c-info2__footer" slot="confirmButton">
					<view class="btn" @click="showStartProject = false">取消</view>
					<view class="btn btn2" @click="onSubmitProjectStart">确定</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>
<script>
import box from '@/components/box.vue'
import safe from './safe.vue'
import worker from './work.vue'
import projectStop from './projectStop.vue'
import improveDetail from './improve.vue'
import inspectionsDetail from './inspectionsDetail.vue'
import info from './info.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import turf from '@/uni_modules/@turf/boolean-point-in-polygon'
import pointToLineDistance from '@/uni_modules/@turf/point-to-line-distance'
import transformCoordinate from '@/libs/transformCoordinate.js'
export default {
	components: {
		box,
		safe,
		worker,
		improveDetail,
		info,
		inspectionsDetail,
		projectStop
	},
	computed: {
		...mapState('common', ['archiveId', 'archive', 'users', 'me'])
		// ...mapState(['isScan'])
	},
	watch: {
		archive() {
			if ((this.archive || {}).category1 == '特种作业') {
				this.hasInBlock = true
			}
			if ((this.archive || {}).id) {
				if (this.positions) {
					this.init2()
				} else {
					this.getLocation()
				}

				this.getData()
			}
		}
	},
	data() {
		return {
			isScan: true,
			isNewCode: false,
			checkDetailDto: [],
			improvesDto: [],
			hasInBlock: false,
			show: false,
			showInfo: false,
			selectImprove: {},
			showDetail: false,
			showInspectionsDetail: false,
			showImprove: false,
			positionAccuracy: 100,

			positions: null,
			showBlock: false,
			selectBlock: {},
			showWorder: false,
			showProject_stop: false,
			showStartProject: false,
			startProject: {
				node: ''
			},
			info: {
				category: '场所',
				场所: [
					{
						name: '场所名称',
						value: 'name'
					},
					{
						name: '主要负责人',
						value: 'project_charge',
						name2: '检查频次要求',
						value2: 'project_charge_rate',
						value3: 'chargeIsCheck'
					},
					{
						name: '责任人',
						value: 'project_manager',
						name2: '检查频次要求',
						value2: 'project_manager_rate',
						value3: 'managerIsCheck'
					},
					{
						name: '运维人员',
						value: 'supervisor',
						name2: '检查频次要求',
						value2: 'supervisor_rate',
						value3: 'supervisorIsCheck'
					}
				],
				工程: [
					{
						name: '项目名称',
						value: 'name'
					},
					{
						// 	name: "项目标段",
						// 	value: "lot"
						// }, {
						name: '项目负责人',
						value: 'project_charge',
						name2: '检查频次要求',
						value2: 'project_charge_rate',
						value3: 'chargeIsCheck'
					},
					{
						name: '项目经理',
						value: 'project_manager',
						name2: '检查频次要求',
						value2: 'project_manager_rate',
						value3: 'managerIsCheck'
					},
					{
						name: '监理',
						value: 'supervisor',
						name2: '检查频次要求',
						value2: 'supervisor_rate',
						value3: 'supervisorIsCheck'
					}
				],
				特种作业: [
					{
						name: '作业名称',
						value: 'name'
					},
					{
						name: '作业地点',
						value: 'address'
					},
					{
						name: '计划开始时间',
						value: 'plan_stime',
						name2: '计划结束时间',
						value2: 'plan_etime'
					},
					{
						name: '安全员',
						value: 'safety',
						name2: '现场负责人',
						value2: 'site_charge'
					},
					{
						name: '施工监护人',
						value: 'caretaker',
						name2: '施工负责人',
						value2: 'worker_charge'
					}
				]
			},
			list: {
				type: '0',
				types: [
					{
						name: '未整改隐患',
						value: '0'
					},
					{
						name: '已整改隐患',
						value: '1'
					},
					{
						name: '检查记录',
						value: '2'
					}
				],
				inspections: [
					{
						time: '2022-02-02',
						company: 'sssss',
						user: '汪汪汪',
						improve_situation: '无',
						improve_state: '无'
					}
				],
				improves: []
			},
			stopList: {
				data: []
			},
			charts: {
				types: [
					{
						name: '月',
						value: 'month'
					},
					{
						name: '年',
						value: 'year'
					}
				],
				loading: false,
				loading2: false,
				type: 'month',
				index: 1,
				1: {
					color: '#0db0f4',
					month: 11,
					year: 21,
					name: '主要负责人'
				},
				2: {
					color: '#f59a23',
					month: 11,
					year: 21,
					name: '责任人'
				},
				3: {
					color: '#8cc63f',
					month: 11,
					year: 21,
					name: '运维人员'
				},
				4: {
					color: '#a30014',
					value: 11
				}
			},
			projects: [
				{
					name: '当日签到',
					icon: require('@/static/img/qiandao.png'),
					path: '../safe/safe',
					id: 'project_start'
				},
				{
					name: '工程停工',
					icon: require('@/static/img/stop.png'),
					path: '../safe/safe',
					id: 'project_stop'
				},
				{
					name: '工程完工',
					icon: require('@/static/img/end.png'),
					path: '../improve/improve',
					id: 'project_end'
				}
			],
			actions: [
				{
					name: '作业签到',
					icon: require('@/static/img/qiandao.png'),
					// path: '../safe/safe',
					id: 'worker_start'
				},
				{
					name: '作业审批',
					icon: require('@/static/img/shenpi.png'),
					// path: '../improve/improve',
					id: 'worker'
				},
				{
					name: '作业签退',
					icon: require('@/static/img/qiantui.png'),
					// path: '../improve/improve',
					id: 'worker_end'
				}
			]
		}
	},
	methods: {
		...mapActions('common', ['init']),
		...mapMutations('common', ['set_archiveId']),
		onSelectImprove(item) {
			this.selectImprove = item
			this.improvesDto = [item]
			this.showDetail = true
		},
		onSelectInspection(item) {
			if (item.improve_situation == '有' && ((item || {}).improvesDto || []).length) {
				this.improvesDto = item.improvesDto
				this.selectImprove = item.improvesDto[0]
				this.showDetail = true
			}
		},
		onSelectInspections(item) {
			if (((item || {}).checkDetailDto || []).length) {
				this.checkDetailDto = []
				let checkDetailDto = []
				item.checkDetailDto.forEach((i, index) => {
					if (index == 0 || i.project == checkDetailDto[0].project) {
						checkDetailDto.push(i)
					} else {
						this.checkDetailDto.push(checkDetailDto)
						checkDetailDto = [i]
					}
				})
				this.checkDetailDto.push(checkDetailDto)
				this.showInspectionsDetail = true
			}
		},
		getHasInBlock() {
			if (this.archive.category1 == '特种作业') {
				this.hasInBlock = true
			} else {
				if (this.positions && this.selectBlock.position) {
					let hasInBlock = false
					;((JSON.parse(this.selectBlock.position) || {}).features || []).forEach((i) => {
						hasInBlock =
							hasInBlock ||
							turf(this.positions, i.geometry) ||
							parseInt(pointToLineDistance(this.positions, i.geometry.coordinates[0], { units: 'meters' })) < this.positionAccuracy * 2 + 100
					})
					this.hasInBlock = hasInBlock
				} else {
					this.hasInBlock = false
				}
			}
		},
		getDistance(lng1, lat1, lng2, lat2) {
			let f = (((lat1 + lat2) / 2) * Math.PI) / 180.0
			let g = (((lat1 - lat2) / 2) * Math.PI) / 180.0
			let l = (((lng1 - lng2) / 2) * Math.PI) / 180.0

			let sg = Math.sin(g)
			let sl = Math.sin(l)
			let sf = Math.sin(f)

			let s, c, w, r, d, h1, h2
			let a = 6378137.0
			let fl = 1 / 298.257

			sg = sg * sg
			sl = sl * sl
			sf = sf * sf

			s = sg * (1 - sl) + (1 - sf) * sl
			c = (1 - sg) * (1 - sl) + sf * sl

			w = Math.atan(Math.sqrt(s / c))
			r = Math.sqrt(s * c) / w
			d = 2 * w * a
			h1 = (3 * r - 1) / 2 / c
			h2 = (3 * r + 1) / 2 / s

			return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
		},
		onSelectConfirm(e) {
			this.selectBlock = e.value[0]
			this.showBlock = false
			this.getHasInBlock()
		},
		onSelectCancel() {
			this.showBlock = false
		},
		init2() {
			if ((this.archive || {}).block && this.isNewCode == true) {
				this.isNewCode = false
				if (this.positions) {
					let length = null
					let lengthIndex = 0
					;(this.archive || {}).block.map((i, index) => {
						if (i.position) {
							;((JSON.parse(i.position) || {}).features || []).forEach((p) => {
								lengthIndex =
									turf(this.positions, p.geometry) ||
									parseInt(pointToLineDistance(this.positions, p.geometry.coordinates[0], { units: 'meters' })) < this.positionAccuracy * 2 + 100
										? index
										: lengthIndex
							})
						}
					})
					this.selectBlock = this.archive.block[lengthIndex]
					this.getHasInBlock()
				} else {
					this.selectBlock = this.archive.block[0]
				}
			}
		},
		go(item) {
			if (item.id == 'worker_start') {
				this.onSubmitWorkStart()
			} else if (item.id == 'worker_end') {
				this.onSubmitWorkEnd()
			} else if (item.id == 'worker') {
				this.showWorder = true
			} else if (item.id == 'project_stop') {
				if (this.users.find((i) => i == this.me.id) || this.archive.project_charge_id.indexOf(this.me.id) > -1) {
					this.showProject_stop = true
				} else {
					uni.showModal({
						title: '您不是该工程监理/负责人员！',
						showCancel: false,
						success: () => {}
					})
				}
			} else if (item.id == 'project_end') {
				if (this.users.find((i) => i == this.me.id)) {
					this.show = true
				} else {
					uni.showModal({
						title: '您不是该工程监理人员！',
						showCancel: false,
						success: () => {}
					})
				}
			} else if (item.id == 'project_start') {
				if (this.hasInBlock) {
					this.showStartProject = true
				} else {
					uni.showModal({
						title: '请前往该工程区域！',
						showCancel: false,
						success: () => {}
					})
				}
			}
		},
		selectChart(item) {
			this.charts.loading = true
			this.charts.index = item
			this.$nextTick(() => {
				this.charts.loading = false
			})
		},
		selectChartType(item) {
			this.charts.loading = true
			this.charts.type = item.value
			this.$nextTick(() => {
				this.charts.loading = false
			})
		},
		selectListType(item) {
			this.list.type = item.value
		},
		onSubmitProjectStart() {
			uni.showModal({
				title: '提示',
				content: '确定当日签到吗？',
				success: (e) => {
					if (e.confirm) {
						uni.showLoading({
							title: '提交中...'
						})
						this.$request
							.post(`signin`, {
								code: this.archive.code,
								lbs_longitude: this.positions[0],
								lbs_latitude: this.positions[1],
								note: this.startProject.node
							})
							.then((res) => {
								uni.hideLoading()
								this.showStartProject = false
								uni.showModal({
									title: '操作成功！',
									showCancel: false,
									success: () => {}
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
				}
			})
		},
		// onSubmitProjectStop() {
		// 	if (this.users.find(i => i == this.me.id)) {
		// 		uni.showModal({
		// 			title: "提示",
		// 			content: "确定提交当日停工吗？",
		// 			success: e => {
		// 				if (e.confirm) {
		// 					uni.showLoading({
		// 						title: "提交中..."
		// 					});
		// 					this.$request.post(`project/daystop`, {
		// 						code: this.archive.code
		// 					}).then(res => {
		// 						uni.hideLoading();
		// 						uni.showModal({
		// 							title: "操作成功！",
		// 							showCancel: false,
		// 							success: () => {}
		// 						});
		// 					}).catch(err=>{
		// 								uni.hideLoading();
		// 								uni.showModal({
		// 									title: "提示",
		// 									content: ((err||{}).data||{}).error,
		// 									showCancel: false,
		// 								})
		// 					});
		// 				}
		// 			}
		// 		});
		// 	} else {
		// 		uni.showModal({
		// 			title: "您不是该工程监理人员！",
		// 			showCancel: false,
		// 			success: () => {}
		// 		});
		// 	}

		// },
		onSubmitProjectEnd() {
			if (this.users.find((i) => i == this.me.id)) {
				uni.showModal({
					title: '提示',
					content: '确定提交工程完工吗？',
					success: (e) => {
						if (e.confirm) {
							uni.showLoading({
								title: '提交中...'
							})
							this.$request
								.post(`project/end`, {
									code: this.archive.code,
									blockCode: this.selectBlock.code
								})
								.then((res) => {
									uni.hideLoading()
									uni.showModal({
										title: '操作成功！',
										showCancel: false,
										success: () => {}
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
					}
				})
			} else {
				uni.showModal({
					title: '您不是该工程监理人员！',
					showCancel: false,
					success: () => {}
				})
			}
		},
		onSubmitWorkEnd() {
			uni.showModal({
				title: '提示',
				content: '确定特种作业签退吗？',
				success: (e) => {
					if (e.confirm) {
						uni.showLoading({
							title: '提交中...'
						})
						this.$request
							.get(`worker/signOut/${this.archive.code}`)
							.then((res) => {
								uni.hideLoading()

								if (res.data.code == '200') {
									uni.showModal({
										title: '签退成功！',
										showCancel: false,
										success: () => {}
									})
								} else {
									uni.showModal({
										title: res.data.message || '未进行作业签到！',
										showCancel: false,
										success: () => {}
									})
								}
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
				}
			})
		},
		onSubmitWorkStart() {
			uni.showModal({
				title: '提示',
				content: '确定特种作业签到吗？',
				success: (e) => {
					if (e.confirm) {
						uni.showLoading({
							title: '提交中...'
						})
						this.$request
							.get(`worker/signIn/${this.archive.code}`)
							.then((res) => {
								uni.hideLoading()
								uni.showModal({
									title: '签到成功！',
									showCancel: false,
									success: () => {}
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
				}
			})
		},
		getLocation() {
			if ((this.me || {}).id) {
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					success: (e) => {
						if (e.errMsg == 'getLocation:ok') {
							console.log(e)

							this.positions = transformCoordinate.gcj02towgs84(e.longitude, e.latitude)
							// this.positions = [e.longitude,e.latitude]
							this.positionAccuracy = e.accuracy || 0
							this.init2()
						}
					},
					fail: (e) => {}
				})
			}
		},

		getData() {
			this.charts.loading = true
			if ((this.archive || {}).code) {
				this.$request.get(`${(this.archive || {}).code}/inspections`).then((res) => {
					this.list.inspections = res.data.data || []
				})
				this.$request.get(`new/improves?code=${(this.archive || {}).code}`).then((res) => {
					this.list.improves = res.data.data || []
				})
				this.$request.get(`/stop/records?code=${(this.archive || {}).code}`).then((res) => {
					this.stopList.data = res.data.data || []
				})
				this.$request.get(`stat/${(this.archive || {}).code}`).then((res) => {
					let data = res.data.data || {}
					this.charts = {
						...this.charts,
						1: {
							color: '#0db0f4',
							month: data.charge_month || '0',
							year: data.charge_year || '0',
							name: this.archive.category1 == '场所' ? '主要负责人' : '项目负责人'
						},
						2: {
							color: '#f59a23',
							month: data.manager_month || '0',
							year: data.manager_year || '0',
							name: this.archive.category1 == '场所' ? '责任人' : '项目经理'
						},
						3: {
							color: '#8cc63f',
							month: data.supervisor_month || 0,
							year: data.supervisor_year || '0',
							name: this.archive.category1 == '场所' ? '运维人员' : '监理'
						},
						4: {
							color: '#a30014',
							value: data.improves || '0'
						}
					}
					this.charts.loading = false
				})
			}
		},
		getUrlParam(url) {
			let params = url.split('?')[1].split('&')
			let obj = {}
			params.map((v) => (obj[v.split('=')[0]] = v.split('=')[1]))
			return obj
		},
		searchCode() {
			uni.scanCode({
				success: (res) => {
					//小程序扫描二维码进来的
					const code = (res.result.split('=') || [])[1]
					if (code) {
						this.set_archiveId(code)
						this.init()
						this.getData()
						this.getLocation()
					} else {
						this.searchCode()
					}
				}
			})
		}
	},

	onReady() {
		this.isScan = false

		this.isNewCode = true
	},

	onShow() {
		// if (this.archiveId) return false
		let pages = getCurrentPages()
		let currentPages = pages[pages.length - 1]
		let p = currentPages.options

		if (p.q) {
			//微信扫描扫描二维码进来的
			let url = decodeURIComponent(p.q)
			let obj = this.getUrlParam(url)
			this.set_archiveId(obj.code)

			this.init()
			this.getData()
			this.getLocation()
		} else if (pages.length == 1) {
			//http://oa.hnswjt.com:8828/safe?code=A202300010
			//A202300010
			//A202300023
			//ZYBA2023020010

			// if (this.archiveId) return false

			// this.set_archiveId("ZYBA2023070022");
			// this.init();
			if (this.isScan) {
				this.isNewCode = true
				this.isScan = false
				this.set_archiveId({})

				uni.showModal({
					title: '请扫描二维码进入！',
					showCancel: false,
					success: () => {
						this.isScan = false

						this.searchCode()
					}
				})
			}
		} else if (p.scene == '1065') {
			this.isNewCode = true
			this.set_archiveId({})
			uni.showModal({
				title: '请扫描二维码进入！',
				showCancel: false,
				success: () => {
					this.searchCode()
				}
			})
		}
	},

	onLoad(p) {
		const token = uni.getStorageSync('token')
		if (!token) {
			uni.reLaunch({
				url: 'pages/login/login'
			})
		} else {
		}
	}
}
</script>
<style lang="scss">
.p-home {
	min-height: 100vh;
	background-color: rgb(237, 240, 246);
	font-size: 24rpx;
	padding-bottom: 20rpx;

	.block {
		position: absolute;
		right: 20rpx;
		top: 0;
		font-weight: normal;
		display: flex;
	}

	.btns {
		margin: 0 auto 20rpx;
		width: 560rpx;

		display: flex;

		.btn {
			flex: 1;
			text-align: center;
			height: 50rpx;
			line-height: 50rpx;
			background-color: #f2f2f2;
			color: #000;
			margin-right: 4rpx;
		}

		.btned {
			background-color: #0db0f4;
			color: #fff;
		}

		.btn:first-child {
			border-radius: 25rpx 0 0 25rpx;
		}

		.btn:last-child {
			border-radius: 0 25rpx 25rpx 0;
		}
	}

	&__header {
		background: linear-gradient(rgba(178, 224, 245, 1), rgba(2, 165, 238, 1));
		text-align: center;
		padding: 80rpx 0 70rpx;

		.img {
			width: 60rpx;
			height: 40rpx;
		}

		.name {
			margin-top: 6rpx;
			text-align: center;
			font-size: 36rpx;
			color: #fff;
			font-weight: bold;
		}

		.info {
			color: '#333';
			padding-right: 10px;
			text-align: right;
		}
	}

	&__info {
		margin-top: 20rpx;

		.desc {
			text-align: center;
		}
	}

	.items {
		display: flex;
		padding: 0rpx 20rpx 20rpx 40rpx;

		.item {
			margin-right: 20rpx;
			flex: 1;
			background-color: rgb(234, 243, 254);
			display: flex;
			flex-direction: column;
			padding: 40rpx 0 20rpx;
			justify-content: center;
			align-items: center;
			border-radius: 4rpx;

			.img {
				width: 100rpx;
				height: 100rpx;
			}

			.name {
				margin-top: 20rpx;
			}
		}
	}

	.charts {
		padding: 0 20rpx;
		display: flex;

		.select {
			.name {
				font-size: 24rpx;
				border-bottom: 4rpx solid #ccc;
				margin-bottom: 20rpx;
				line-height: 40rpx;
				text-align: center;
				color: #ccc;
			}
		}

		.chart {
			position: relative;

			.content {
				// padding-top: 32rpx;
				text-align: center;
			}

			.value {
				font-size: 52rpx;
				font-weight: bold;
				text-align: center;
			}

			.name {
				font-size: 24rpx;
			}
		}
	}

	.table {
		background-color: #fff;
		display: flex;
		flex-direction: column;
		border-top: 1px solid #f2f2f2;
		border-left: 1px solid #f2f2f2;
		margin: 0 20rpx;
		// font-size: 28rpx;

		.th {
			background-color: rgba(234, 243, 254, 1);
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
			}

			.name {
				width: 26%;
			}

			.value {
				flex: 1;
			}

			.line {
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden; //溢出内容隐藏
				text-overflow: ellipsis; //文本溢出部分用省略号表示
				display: -webkit-box; //特别显示模式
				-webkit-line-clamp: 2; //行数
				line-clamp: 2;
				-webkit-box-orient: vertical; //盒子中内容竖直排列
			}
		}
	}

	.table2 {
		margin: 0;
	}
}

.c-info2 {
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
