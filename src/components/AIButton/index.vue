<template>
	<view class="AI-btn" @click="handleToAI">
		<view class="AI-rect">
			AI问答
		</view>
	</view>
</template>

<script>
	export default {
		name: 'AIButton',
		data() {
			return {

			}
		},
		methods: {
			handleToAI() {
				uni.navigateTo({
					url: `/pages/AIQA/index`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.AI-btn {
		position: fixed;
		right: 10rpx;
		top: 70vh;
		width: 138rpx;
		height: 144rpx;
		z-index: 999;
		background-image: url('/static/images/AI_Icon.png');
		border-radius: 50%;
		background-size: cover;
		font-family: PingFang-SC, PingFang-SC;
		font-weight: 500;
		font-size: 30rpx;
		color: #ffffff;
		line-height: 88rpx;
		text-align: center;
		cursor: pointer;

		.AI-rect {
			width: 156rpx;
			height: 78rpx;
			position: absolute;
			border-radius: 32rpx;
			bottom: -30rpx;
			left: 50%;
			transform: translateX(-50%);
			font-family: PingFangSC, PingFang SC;
			font-weight: 600;
			font-size: 30rpx;
			color: #333333;
			line-height: 82rpx;
			background-image: url('/static/images/AI_Rect.png');
			background-size: cover;
			font-style: normal;
			white-space: nowrap;
			text-align: center;
			overflow: hidden;

		}
	}
</style>