<template>
	<view class="goback" @click="handleGoback" v-if="isWX">
		<image src="/static/images/goback.png" class="img" mode="widthFix" />
	</view>
</template>

<script>
	export default {
		name: 'BackBtn',
		data() {
			return {
				isWX: false,
			}
		},
		mounted() {
			const ua = navigator.userAgent.toLowerCase();
			if (ua.match(/micromessenger/i)) {
				console.log('当前环境是微信扫码');
				this.isWX = true
			}
		},
		methods: {
			handleGoback() {
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.goback {
		width: 20rpx;
		height: 40rpx;

		.img {
			width: 100%;
			height: 100%;
		}

		position: absolute;
		left: 32rpx;
		top: calc(env(safe-area-inset-top) + 50rpx);
		/* 适配 iPhone X 等设备的刘海屏 */
		top: calc(constant(safe-area-inset-top) + 50rpx);
		z-index: 50
	}
</style>