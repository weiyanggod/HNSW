<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Vue from 'vue'
import { getUpdate } from 'libs/update/index.js'
export default {
	computed: {
		...mapState(['token'])
	},
	methods: {
		...mapActions('common', ['init']),
		...mapMutations(['set_token']),
		...mapMutations('common', ['set_archiveId']),
		getUrlParam(url) {
			let params = url.split('?')[1].split('&')
			let obj = {}
			params.map((v) => (obj[v.split('=')[0]] = v.split('=')[1]))
			return obj
		}
	},
	onLaunch(p) {
		// if (p.query.q) {
		// 	//微信扫描扫描二维码进来的
		// 	let url = decodeURIComponent(p.query.q)
		// 	let obj = this.getUrlParam(url)

		// 	if (obj.code) {
		// 		this.set_archiveId(obj.code)
		// 	}
		// }else{
		// 	// this.set_archiveId("A202300023");
		// 	uni.showModal({
		// 		title: "请扫描二维码进入！",
		// 		showCancel: false,
		// 		success: () => {}
		// 	});
		// }

		const token = uni.getStorageSync('token')
		if (token) {
			// this.init();
			this.set_token(token)
		} else {
			uni.reLaunch({
				url: 'pages/login/login'
			})
		}
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>
<style lang="scss">
/*每个页面公共css */
@import 'uni_modules/uview-ui/index.scss';
page {
	height: 100%;
}
</style>
