<!--
 * @Author: zhangjingyu
 * @Date: 2024-11-21
 * @LastEditors: zhangjingyu
 * @FilePath: \lixue-psych-h5d:\projects\lixue-psych-uniapp\pages\index\quan\components\TabNav.vue
 * @Description: 导航栏
-->
<template>
	<view class="navbar-container">
		<scroll-view class="navbar-scroll" scroll-x :scroll-left="scrollLeft" @scroll="handleScroll">
			<view v-for="(item, index) in navList" :key="index" class="navbar-item"
				:class="{ active: currentIndex === index }" @tap="handleItemClick(item, index)">
				{{ item.name }}
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "QuanNavBar",
		props: {
			navList: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
				currentIndex: 0,
				scrollLeft: 0,
			};
		},
		methods: {
			handleItemClick(item, index) {
				this.currentIndex = index;
				this.$emit("itemClick", item, index);
				// 获取点击的导航栏按钮元素信息
				uni.createSelectorQuery()
					.selectAll('.navbar-item')
					.boundingClientRect((rects) => {
						const currentRect = rects[index];
						const scrollViewRect = uni.createSelectorQuery().select('.navbar-scroll').boundingClientRect();
						scrollViewRect.exec(([scrollView]) => {
							if (currentRect) {
								// 判断按钮是否在可视区域左侧外
								if (currentRect.left < scrollView.left) {
									this.scrollLeft -= scrollView.left - currentRect.left;
								}
								// 判断按钮是否在可视区域右侧外
								else if (currentRect.right > scrollView.right) {
									this.scrollLeft += currentRect.right - scrollView.right;
								}
							}
						});
					})
					.exec();
			},
			handleScroll(event) {
				this.scrollLeft = event.detail.scrollLeft;
			},
		},
	};
</script>

<style scoped>
	.navbar-container {
		width: 100%;
		white-space: nowrap;
		padding: 0 16rpx;
		height: 88rpx;
		padding-top: 12rpx;
	}

	.navbar-scroll {
		display: inline - block;
		height: 66rpx;
		overflow: hidden;
	}

	.navbar-item {
		display: inline-block;
		padding: 0 26rpx;
		cursor: pointer;
		min-width: 100rpx;
		height: 66rpx;
		line-height: 66rpx;
		color: #333333;
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 34rpx;
		/* background: rgba(255, 255, 255, 0.05); */
		margin: 0 8rpx;
		border-radius: 16rpx;
	}

	.navbar-item.active {
		/* background: rgba(255, 255, 255, 0.2); */
		font-size: 40rpx;
		position: relative;
	}
	
	.navbar-item.active::after{
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 32rpx;
		height:6rpx;
		background: #FF4624;
		border-radius: 5rpx;
		transform: translateX(-50%)
	}
</style>