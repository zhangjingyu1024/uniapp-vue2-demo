<template>
	<view class="nav acea-row">
		<view class="item">
			<view class="pictrue skeleton-rect">
				<image src="https://data.youmi-china.com/source/image_0.4404606870779424.png" mode="aspectFill"></image>
			</view>
			<view class="menu-txt">精品课程</view>
		</view>
		<view class="item">
			<view class="pictrue skeleton-rect">
				<image src="https://data.youmi-china.com/source/image_0.30095439486817366.png" mode="aspectFill"></image>
			</view>
			<view class="menu-txt">大咖直播</view>
		</view>
		<view class="item">
			<view class="pictrue skeleton-rect">
				<image src="https://data.youmi-china.com/source/image_0.2143458505722542.png" mode="aspectFill"></image>
			</view>
			<view class="menu-txt">名师荟萃</view>
		</view>
		<view class="item">
			<view class="pictrue skeleton-rect">
				<image src="https://data.youmi-china.com/source/image_0.01580071413635431.png" mode="aspectFill"></image>
			</view>
			<view class="menu-txt">会员中心</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ymMenus',
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
	.nav {
		padding:20rpx;
		background:#fff;
		.item {
			margin-top: 30rpx;
			width: 25%;
			text-align: center;
			font-size: 24rpx;
			display: inline-block;

			.pictrue {
				width: 90rpx;
				height: 90rpx;
				margin: 0 auto;

				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.menu-txt {
				margin-top: 15rpx;
			}
		}
	}
</style>
