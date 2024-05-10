import Vue from "vue";
import App from "./App";
import config from "./config.js";
// Vue.config.productionTip = false;
import store from "./store";
Vue.prototype.$store = store;
import uView from 'uni_modules/uview-ui';
import "@/libs/crc";
Vue.use(uView);


import "./filter";
App.mpType = "app";
import { uniStorage } from "@/libs/storage.js"
uniStorage();
import request from "./apollo.js";	
Vue.prototype.$request = request;
Vue.prototype.$eventBus = new Vue();
// Vue.prototype.$apollo = apollo;
Vue.prototype.$onLoad = function (fn) {
	// if (store.state.common.me) {
	if (store.state.common) {
		return fn.call();
	} else {
		this.$eventBus.$once('onLoad', fn);
	}
}

const app = new Vue({
	store,
	...App
});
app.$mount();