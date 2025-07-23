<template>
	<view class="ymRight">
		<view class="footerBox">立雪提供技术支持</view>
		<view class="footerheight"></view>
	</view>
</template>

<script>
	export default {
		name: 'ymRight',
		props: {
		
		},
		data() {
			return {
				
			};
		},
		created() {},
		mounted() {
			
		},
		methods: {
			
		}
	};
</script>

<style lang="scss">
.ymRight{
	.footerBox{
		padding-top: 40rpx;
		padding-bottom: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #ccc;
		font-size:22rpx;
		background-color: #E7E7E7;
	}
	.footerheight{
	height: 100rpx;
	/* 兼容 IOS<11.2 */
	height: calc(100rpx + constant(safe-area-inset-bottom));
	/* 兼容 IOS>11.2 */
	height: calc(100rpx + env(safe-area-inset-bottom));
	}
}
</style>
