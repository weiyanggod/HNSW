<template>
	<view class="f-upload">
		<view class="add-btn" v-if="pics.length < 4 && upload" @tap="addImg()">
			<!-- <text class="grace-icons icon-photograph"></text> -->
			<view class="text">+ 添加文件</view>
		</view>
		<view class="grace-border pics" v-for="(p, index) in pics" :key="index">
		
			文件{{index+1}} <text style="float: right;" @tap="removeImg(index)">X</text>
			<hr>
			<!-- <view class="remove">
				<u-icon v-if="upload" name="close" style="color: #fff;" color="#fff"  @tap="removeImg(index)"></u-icon>
			</view> -->
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
			wx.chooseMessageFile({
				count: 1,
				// type: 'all',
				// sourceType: ['camera','album'],
				success: res => {
					console.log(res)
					const tempFilePaths = res.tempFiles;
					uni.showLoading({
						title: '上传中...'
					});
					uni.uploadFile({
						url: config.baseURL + '/upload',
						filePath: tempFilePaths[0].path,
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
		showImgs(index) {
			const lst = this.pics.map(p => {
				return this.picsList[p];
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
.f-upload {
	
	.add-btn {
		width: 150rpx;
	
		background-color: #169bd5;
		align-items: center;
		justify-content: center;
		display: flex;
		color: #fff;

		border: 1px border #ccc;
		flex-direction: column;
		border-radius: 8rpx;
		padding: 0 8rpx;
	
		.text {
			font-size: 22upx;
			color: #fff;
		}
	}

	.pics {
		width: 300rpx;
		// height: 100rpx;
		margin-right: 12upx;
		position: relative;
		border-bottom: 1px solid #f2f2f2;
		color: #666;
	}
}
</style>
