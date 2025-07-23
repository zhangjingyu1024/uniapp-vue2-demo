<template>
	<view>
		<view class="mp-header">
			<view class="sys-head" :style="{ height: statusBarHeight }"></view>
		</view>
		<view :style="'height:'+marTop+'px;'"></view>
	</view>
</template>

<script>
let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
export default {
	name: 'ymMenus',
	props: {
	
	},
	data() {
		return {
			statusBarHeight:statusBarHeight,
			marTop:0,
		};
	},
	created() {},
	mounted() {
		let that = this;
		// #ifdef MP || APP-PLUS
		setTimeout(() => {
			// 获取小程序头部高度
			let info = uni.createSelectorQuery().in(this).select(".mp-header");
			info.boundingClientRect(function(data) {
				that.marTop = data.height
			}).exec()
		}, 100)
		// #endif
	},
	methods: {
		
	}
};
</script>

<style lang="scss">
	.mp-header {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		background:#FFF;
	}
</style>
