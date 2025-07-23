<template>
	<view class="partners-main">
		<view class="title"> 合作单位名单 </view>
		<view class="item" v-for="item in data" :key="item">
			<view class="index"></view> {{ item }}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Array,
				default: () => ([
					"郑州大数据发展有限公司",
					"中国医药教育协会科普委员会",
					"河南省儿童医院",
					"360集团",
					"郑州立雪智能科技研究院",
				])
			}
		},
		data() {
			return {
			};
		},
	};
</script>

<style scope lang="scss">
	.partners-main {
		width: 100%;
		min-height: 494rpx;
		padding-bottom: 36rpx;
		overflow: hidden;
		background: #FCF9FC;

		.title {
			font-family: PingFang-SC, PingFang-SC;
			font-weight: bold;
			font-size: 34rpx;
			color: #333333;
			line-height: 48rpx;
			text-align: center;
			font-style: normal;
			height: 48rpx;
			margin: 56rpx 0 50rpx 0;
		}

		.item {
			font-family: PingFang-SC, PingFang-SC;
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
			line-height: 40rpx;
			text-align: left;
			font-style: normal;
			width: 100%;
			height: 40rpx;
			margin-bottom: 24rpx;
			padding-left: 204rpx;
			position: relative;

			.index {
				position: absolute;
				left: 172rpx;
				top: 12rpx;
				width: 16rpx;
				height: 16rpx;
				border-radius: 50%;
				background: #BDBDBD;
			}
		}
	}
</style>