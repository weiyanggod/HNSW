<template>
	<view class="p-info">
		<u-cell-group>
			<u-cell title="姓名" :value="me.name" :arrow="false"></u-cell>
			<u-cell title="组织" :value="me.o_corp.name" :arrow="false"></u-cell>
			<u-cell title="统一社会信用代码" :value="company.code" :arrow="false"></u-cell>
			<u-cell title="企业名称" :value="company.name" :arrow="false"></u-cell>
			<u-cell title="联系人" :value="company.mobile" :arrow="false"></u-cell>
			<u-cell title="联系电话" :value="company.linkman" :arrow="false"></u-cell>
		</u-cell-group>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState('common', ['me', 'company'])
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="scss">
page {
	background-color: #f3f4f8;
}
.p-info {
	background-color: #fff;
}
</style>
