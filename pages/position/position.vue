<template>
	<map style="width: 750rpx; height: 100vh" :longitude="positions[0]" :latitude="positions[1]" :polygons="polygons" :markers="markers"></map>
</template>

<script>
import { mapState } from 'vuex'
import transformCoordinate from '@/libs/transformCoordinate.js'
export default {
	data() {
		return {
			positions: [],
			polygons: [],
			markers: []
		}
	},
	computed: {
		...mapState('common', ['archive', 'me'])
	},
	onLoad(p) {
		const positions = transformCoordinate.wgs84togcj02(Number(p.lon), Number(p.lat))

		this.positions = positions

		this.markers = [
			{
				id: 1111,
				latitude: Number(this.positions[1]),
				longitude: Number(this.positions[0]),
				callout: {
					content: '扫码时的定位',
					color: '#ffffff', //文字颜色
					fontSize: 14, //文本大小
					borderRadius: 2, //边框圆角
					padding: 10,
					bgColor: '#00c16f', //背景颜色
					display: 'ALWAYS' //常显
				}
			}
		]
		const polygons = []
		;(this.archive.block || []).forEach((i) => {
			;((JSON.parse(i.position) || {}).features || []).forEach((feature) => {
				polygons.push({
					points: feature.geometry.coordinates[0].map((p) => {
						const p2 = transformCoordinate.wgs84togcj02(p[0], p[1])
						return {
							latitude: p2[1],
							longitude: p2[0]
						}
					}),
					fillColor: '#def4ff',
					strokeWidth: 2,
					strokeColor: '#00aaff',
					zIndex: 1
				})
			})
		})
		this.polygons = polygons
	}
}
</script>

<style lang="less"></style>
