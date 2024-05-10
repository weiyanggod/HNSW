<template>
	<view class="f-uploadShow">
		<view class="grace-border items" v-for="(p, index) in pics" :key="index">
			<image @click="showImgs(index)" :src="getSrc(p)" style="width: 100%;height: 100%;"></image>
			<!-- <view class="remove grace-icons icon-remove grace-bg-red" @tap="removeImg(index)"></view> -->
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import config from '@/config.js';
export default {
	props: {
		value: {
			type: String,
			default: null
		},
		showAlbum: {
			type: Boolean,
			default: true
		},
		upload: {
			type: Boolean,
			default: true
		}
	},
	watch:{
		value(){
			if(!this.value){
				this.pics = []
			}
		}
	},
	data() {
		return {
			picsList:{},
			pics: this.value ? this.value.split(',') : []
		};
	},
	computed: {
		...mapState(['token'])
	},
	methods: {
		addImg() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				// sourceType: ['camera','album'],
				success: res => {
					console.log(res)
					const tempFilePaths = res.tempFilePaths;
					uni.showLoading({
						title: '上传中...'
					});
					uni.uploadFile({
						url: config.baseURL + '/upload',
						filePath: tempFilePaths[0],
						name: 'file',
						header: {
							'Authorization': this.token,
							Cookie: `__auth=${this.token}`
						},
						success: uploadFileRes => {
							const result = JSON.parse(uploadFileRes.data);
							this.pics.push(result.data.fileid);
							this.picsList[''+result.data.fileid] = tempFilePaths[0]
							uni.hideLoading();
							this.$emit('input', this.pics.join(','));
							console.log(uploadFileRes)
							console.log(result)
							console.log(this.pics)
						},
						fail: e => {
							uni.hideLoading();
							uni.showModal({
								title: JSON.stringify(e),
								showCancel: false
							});
						}
					});
				}
			});
		},
		getSrc(path) {
			return config.baseURL + `/downloads/${path}`;
		},
		showImgs(index) {
			const lst = this.pics.map(p => {
				return this.getSrc(p);
			});
			uni.previewImage({
				urls: lst,
				current: lst[index]
			});
		},
		removeImg(index) {
			this.pics = this.pics.filter((p, i) => i != index);
			this.$emit('input', this.pics.join(','));
		}
	}
};
</script>

<style lang="less">
.f-uploadShow {
	display: flex;
	.add-btn {
		width: 100rpx;
		height: 100rpx;
		background-color: #fff;
		align-items: center;
		justify-content: center;
		display: flex;
		background-color: #efefef;
		border: 1px dashed #ccc;
		flex-direction: column;
		border-radius: 12rpx;
		.grace-icons {
			color: #0099cc;
			font-size: 40rpx;
		}
		.text {
			font-size: 22upx;
			color: #666;
		}
	}

	.items {
		width: 100rpx;
		height: 100rpx;
		margin-right: 12upx;
		position: relative;
		.remove {
			position: absolute;
			right: 0;
			top: 0;
			color: #fff;
			width: 32upx;
			height: 32upx;
			line-height: 36upx;
			text-align: center;
		}
	}
}
</style>
