import request from "../../apollo.js";
import Vue from 'vue';
export default {
	namespaced: true,
	state: {
		archivesId:null,
		archive:{},
		dicts:{},
		inspections:[],
		users:[],
		companys:[],
		me: {},
	},
	actions: {
		async init({
			commit,
			state
		}) {
			if(!uni.getStorageSync('token')){
				commit("set_init", {
					user:{},
					dicts:{},
					archive:{},
					inspections:[],
					users:[],
				});
			}
			try {
				if(!state.archiveId) return false;
				// uni.showModal({
				// 		title: JSON.stringify(state.archiveId),
				// 		showCancel: false,
				// 		success: () => {}
				// 	});
				const user = await request.get(`userInfo`);
				const dicts = await request.get(`dicts`);
				const archive = await request.get(`archives/${state.archiveId}`);
				const inspections = await request.get(`archives/${state.archiveId}/inspections`);
				const users = await request.get(`archives/${state.archiveId}/users`)
				const companys = await request.get(`companys`);
	
				
				commit("set_init", {
					user:user.data.data,
					dicts:dicts.data,
					archive:archive.data.data,
					inspections:inspections.data.data||[],
					users:(((users.data||{}).data||[])[0]||{}).name_id?users.data.data[0].name_id.split(','):[],
					companys:(companys.data||{}).data
				});
			
				Vue.prototype.$eventBus.$emit('onLoad');
			} catch (e) {
				uni.removeStorageSync("token");
				uni.reLaunch({
					url: 'pages/login/login'
				});

				throw e;
			}
		}
	},
	mutations: {
		set_init(state, data) {
			state.archive = data.archive;
			state.dicts = data.dicts;
			state.inspections = data.inspections;
			state.users = data.users;
			state.me = data.user;
			state.companys = data.companys;
		},
		set_archiveId(state,data){
			state.archive = {};
			state.archiveId = data
			
		}
	},
	getters: {
	}
};
