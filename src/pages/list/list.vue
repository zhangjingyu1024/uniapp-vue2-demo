<template>
	<view class="list-area">
		<view class="item" v-for="item in content" :key="item.id" @click="goProduct(item.number, item.type)">
			<view class="left">
				<img mode="widthFix" :src="item.imageUrl" />
			</view>
			<view class="right">
				<view class="item-title">
					{{item.name}}
				</view>
				<view class="item-theme">
					{{title}}
				</view>
				<view class="item-name">
					<text class="line" v-if="item.teacherName">{{item.teacherName}}</text> <text>{{item.publisher}}</text>
				</view>
				<view class="item-views">
					<text class="iconfont icon-liulan"></text> {{item.actualVisit}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '',
			},
			listType: {
				type: String,
				default: '',
			},
			content: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {

			};
		},
		created() {},
		methods: {
			goProduct(number, type) {
				if (type == "series") {
					uni.navigateTo({
						url: `/pages/product/product_series/index?number=${number}&listType=${this.listType}`
					})
				} else if (type == "video") {
					uni.navigateTo({
						url: `/pages/product/product_video/index?number=${number}&listType=${this.listType}`
					})
				} else if (type == "audio") {
					uni.navigateTo({
						url: `/pages/product/product_audio/index?number=${number}&listType=${this.listType}`
					})
				} else if (type == "live") {
					uni.navigateTo({
						url: `/pages/product/product_live/index?number=${number}&listType=${this.listType}`
					})
				} else if (type == "setmeal") {
					uni.navigateTo({
						url: `/pages/product/product_setmeal/index?number=${number}&listType=${this.listType}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/product/product_video/index?number=${number}&listType=${this.listType}`
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.list-area {
		padding: 0 24rpx;

		.item {
			width: 100%;
			height: 264rpx;
			background-color: #fff;
			border-radius: 16rpx;
			padding: 16rpx 24rpx;
			margin-bottom: 24rpx;
			display: flex;

			.left {
				width: 300rpx;
				display: flex;
				background: #EEEEEE;
				border-radius: 16rpx;
				overflow: hidden;
				margin-right: 36rpx;

				img {
					width: 100%;
					object-position: top;
					object-fit: cover;
				}
			}

			.right {
				font-family: PingFangSC, PingFang SC;
				color: #333333;
				font-style: normal;
				width: 318rpx;

				.item-title {
					overflow: hidden;
					height: 44rpx;
					font-weight: 500;
					font-size: 32rpx;
					line-height: 44rpx;
					margin-top: 18rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.item-theme {
					height: 40rpx;
					font-weight: 400;
					font-size: 28rpx;
					line-height: 40rpx;
					margin-top: 8rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.item-name {
					margin-top: 16rpx;
					height: 40rpx;
					font-weight: 400;
					font-size: 28rpx;
					line-height: 40rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					.line {
						margin-right: 10rpx
					}
				}

				.item-views {
					margin-top: 8rpx;
					height: 40rpx;
					font-weight: 400;
					font-size: 28rpx;

					.iconfont {
						font-size: 32rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
</style>