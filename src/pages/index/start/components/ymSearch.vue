<template>
	<view>
		<!-- #ifdef H5  -->
		<view class="header" @tap="goSearch">
			<view class="input acea-row row-middle fillet skeleton-rect" hover-class="none" >
			<text class="iconfont icon-sousuo"></text>
				搜索
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP || APP-PLUS -->
		<view class="mp-header skeleton-rect">
				<view class="sys-head" :style="{ height: statusBarHeight }"></view>
				<view class="serch-box skeleton-rect" style="height: 43px;">
					<view class="serch-wrapper acea-row row-middle">
						<navigator url="/pages/search/search_list/index" class="fillet on input acea-row row-middle skeleton-rect" hover-class="none">
							<text class="iconfont icon-sousuo"></text>
							搜索
						</navigator>
					</view>
				</view>
		</view>
		<view :style="'height:'+marTop+'px;'"></view>
		<!-- #endif -->
	</view>
</template>

<script>
	let app = getApp();
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + 'rpx';
	let headHeight = uni.getSystemInfoSync().statusBarHeight * 2 + 170 + 'rpx';

	export default {
		name: 'ymSearch',
		data() {
			return {
				sysHeight: statusBarHeight,
				statusBarHeight: statusBarHeight,
				mbConfig: 0,
				marTop:0,
			};
		},

		mounted() {
			let that = this;
			// #ifdef MP || APP-PLUS
			this.$nextTick(function() {
				// 获取小程序头部高度
				let info = uni.createSelectorQuery().in(this).select(".mp-header");
				info.boundingClientRect(function(data) {
						that.marTop = data.height
				}).exec()
			})
			// #endif
		},
		methods: {
			goSearch: function() {
				uni.navigateTo({
					url: `/pages/search/search_list/index`
				})
			},
		}
	}
</script>

<style lang="scss">
	.header {
		 padding: 10rpx 30rpx;
		 background: #fff;
		.input {
				display: flex;
				height: 60rpx;
				padding: 0 0 0 30rpx;
				background: rgba(247, 247, 247, 1);
				border: 1px solid rgba(241, 241, 241, 1);
				color: #999;
				font-size: 28rpx;
				flex: 1;
				z-index: 99;
				margin: 14rpx 0;
				.iconfont {
					margin-right: 20rpx;
					color: #555555;
				}
				// 设置圆角
				&.fillet {
					border-radius: 40rpx;
				}
			}
	}

		/* #ifdef MP || APP-PLUS */
	.mp-header {
		z-index: 101;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		background: #fff;

		.serch-wrapper {
			height: 100%;
			/* #ifdef MP */
			padding: 0 230rpx 0 53rpx;
			/* #endif */
			/* #ifdef APP-PLUS */
			padding: 0 50rpx 0 40rpx;
      		/* #endif */
			.logo {
				height: 60rpx;
				margin-right: 30rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}

			.input {
				flex: 1;
				height: 50rpx;
				padding: 0 0 0 30rpx;
				background: rgba(247, 247, 247, 1);
				border: 1px solid rgba(241, 241, 241, 1);
				color: #BBBBBB;
				font-size: 28rpx;

				.iconfont {
					margin-right: 20rpx;
				}

				// 没有logo，直接搜索框
				&.on {
					/* #ifdef MP */
					width: 70%;
					/* #endif */
					/* #ifdef APP-PLUS */
					width: 100%;
					/* #endif */
				}

				// 设置圆角
				&.fillet {
					border-radius: 29rpx;
				}

				// 文本框文字居中
				&.row-center {
					padding: 0;
				}
			}
		}
	}

	/* #endif */

</style>
