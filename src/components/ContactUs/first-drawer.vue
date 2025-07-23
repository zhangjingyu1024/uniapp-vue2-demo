<template>
	<view>
		<view class="drawer-mask" v-if="visible" @click="close"></view>
		<view class="drawer" :class="{'drawer-open': visible}">
			<view class="drawer-content">
				<view class="h3">联系我们</view>
				<view class="close-ico" @click="close">×</view>
				<view class="list">
					<view class="item" @click="handleChooseType(1)">
						<view class="img-box">
							<image src="/static/images/视频制作.png" class="img"></image>
						</view>
						<view class="text">视频制作</view>
					</view>
					<view class="item" @click="handleChooseType(2)">
						<view class="img-box">
							<image src="/static/images/企业合作.png" class="img"></image>
						</view>
						<view class="text">企业合作</view>
					</view>
					<view class="item" @click="handleChooseType(3)">
						<view class="img-box">
							<image src="/static/images/意见反馈.png" class="img"></image>
						</view>
						<view class="text">意见反馈</view>
					</view>
				</view>
				<view class="zixun" @click="handleCall">
					<image src="/static/images/zixun-icon.png" class="img"></image>
					<view class="fuwurexian">
						服务热线
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
		},
		methods: {
			close() {
				this.$emit('update:visible', false);
			},
			handleChooseType(type) {
				this.$emit('choose', type);
			},
			handleCall() {
				// 创建一个临时的<a>元素
				const tempLink = document.createElement('a');
				tempLink.href = 'tel:4009019606';
				tempLink.style.display = 'none'; // 隐藏元素，不显示在页面上
				document.body.appendChild(tempLink); // 将元素添加到body中
			
				tempLink.click(); // 模拟点击以拨打电话
			
				// 设置一个短暂的延迟来移除元素，确保点击事件已经触发
				setTimeout(() => {
					document.body.removeChild(tempLink); // 移除元素
				}, 100);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.drawer-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		z-index: 50;
	}

	.drawer {
		width: 100%;
		overflow: hidden;
		transition: transform 0.3s ease;
		transform: translateY(100vh);
		height: 50vh;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 51;
		width: 100vw;
		border-radius: 32rpx 32rpx 0rpx 0rpx;
		background: url('/static/images/content-drawer-bg.png');
		background-size: 100% 100%;
	}

	.drawer-open {
		transform: translateY(50vh);
	}

	.drawer-content {
		position: relative;
		width: 100%;
		height: 100%;
		box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
		transform: translateY(0);

		.h3 {
			padding-left: 64rpx;
			padding-top: 64rpx;
			height: 146rpx;
			font-family: SourceHanSansCN, SourceHanSansCN;
			font-weight: bold;
			font-size: 34rpx;
			color: #333333;
			line-height: 52rpx;
			padding-bottom: 48rpx;
		}

		.close-ico {
			position: absolute;
			width: 40rpx;
			height: 40rpx;
			right: 48rpx;
			top: 48rpx;
			font-size: 30rpx;
			text-align: center;
			color: #8891A1;
		}

		.list {
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;

			.item {
				position: relative;
				background: #FFFFFF;
				border-radius: 16rpx;
				height: 220rpx;

				.img-box {
					width: 80rpx;
					height: 80rpx;
					margin: 48rpx 70rpx 24rpx 70rpx;
					background-color: #FF952B;
					border-radius: 24rpx;
					overflow: hidden;

					.img {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					text-align: center;
					font-size: 30rpx;
					color: #333333;
				}
			}
		}

		.zixun {
			width: 686rpx;
			height: 144rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			color: #333333;
			line-height: 36rpx;
			font-size: 30rpx;
			position: relative;
			margin: 16rpx auto;
			font-family: SourceHanSansCN, SourceHanSansCN;
			font-weight: 400;

			.img {
				width: 56rpx;
				height: 56rpx;
				position: absolute;
				top: 50%;
				left: 248rpx;
				transform: translateY(-50%);
			}

			.fuwurexian {
				height: 40rpx;
				position: absolute;
				line-height: 40rpx;
				top: 50%;
				left: 324rpx;
				transform: translateY(-50%);
				white-space: nowrap;
			}
		}
	}
</style>