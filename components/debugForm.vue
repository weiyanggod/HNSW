<template>
	<view class="p-form">
		<u-radio-group v-model="data" :wrap="true" v-if="option.type == 'SELECT'">
			<u-radio :label-size="36" :icon-size="36" v-for="item in dict" :key="item.value" :name="item.value">{{ item.name }}</u-radio>
		</u-radio-group>
		<u-input v-else-if="getType(option.type) == 'digit'" v-model="data" :border="true" placeholder="请输入"></u-input>
		<u-input v-else type="text" v-model="data" :border="true" placeholder="请输入"></u-input>
	</view>
</template>

<script>
import { mapState } from "vuex";
export default {
	props: {
		option: {
			type: Object,
			default: () => {}
		},
		value: {
			type: [String, Number],
			default: null
		}
	},
	computed: {
		...mapState("common", ["dicts"])
	},
	data() {
		return {
			data: this.value,
			dict: []
		};
	},
	watch: {
		data(d) {
			if (this.getType(this.option.type) == "digit") {
				this.onlyNumber(d);
			}
		}
	},
	methods: {
		getType(type) {
			switch (type) {
				case "FLOAT":
				case "SHORT":
				case "INT48":
				case "LONG":
				case "FLOW":
					return "digit";
				default:
					return "text";
			}
		},
		getValue() {
			if (this.getType(this.option.type) == "digit") {
				return parseFloat(this.data);
			} else {
				return this.data;
			}
		},
		getOldValue() {
			if (this.option.dict) {
				const target = this.dicts.find(d => d.id == this.option.dict);
				this.dict = target ? target.values : [];
				if (this.dict.length > 0) {
					const v = this.dict.find(d => d.name == this.value);
					return v.value;
				}
			}
			return JSON.parse(JSON.stringify(this.value));
		},
		onlyNumber(d) {
			let value;
			var t = d.charAt(0);
			//先把非数字的都替换掉，除了数字和.
			value = d.replace(/[^\d\.]/g, "");
			//必须保证第一个为数字而不是.
			value = value.replace(/^\./g, "");
			//保证只有出现一个.而没有多个.
			value = value.replace(/\.{2,}/g, ".");
			//保证.只出现一次，而不能出现两次以上
			value = value
				.replace(".", "$#$")
				.replace(/\./g, "")
				.replace("$#$", ".");
			//如果第一位是负号，则允许添加
			if (t == "-") {
				value = "-" + value;
			}
			console.log(value);
			this.$nextTick(() => {
				this.data = value;
			});
		}
	},
	mounted() {
		if (this.option.dict) {
			const target = this.dicts.find(d => d.id == this.option.dict);
			this.dict = target ? target.values : [];
			if (this.dict.length > 0) {
				const v = this.dict.find(d => d.name == this.value);
				this.data = v.value;
			}
		}
	}
};
</script>

<style lang="scss">
.p-form {
	padding: 40rpx 20rpx;
	text-align: center;
}
</style>
