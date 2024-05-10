import Vue from "vue";
import Vuex from "vuex";
import common from "./common";

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		token: null
	},
	mutations: {
		set_token(state, payload) {
			state.token = payload;
		}
	},
	modules: {
		common
	}
});

export default store;
