<template>
	<view>
		<view class="drawer-mask" v-if="visible" @click="close"></view>
		<view class="drawer" :class="{'drawer-open': visible}">
			<view class="drawer-content">
				<view class="close-ico" @click="close">×</view>
				<view class="title">留下您的联系方式</view>
				<view class="subtitle">专家顾问将尽快给您回电，请注意接听</view>
				<input type="text" class="input" v-model="tel" />
				<view class="submit-btn" @click="handleSubmit">预约回电</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				tel: ''
			}
		},
		watch:{
			visible(val){
				if(val) {
					this.tel = ''
				}
			}
		},
		methods: {
			close() {
				this.$emit('update:visible', false);
			},
			handleSubmit() {
				this.$emit('submit', this.tel);
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
		background: url('/static/images/content-drawer-bg2.png');
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
		padding: 0 64rpx;

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

		.title {
			white-space: nowrap;
			height: 236rpx;
			padding: 148rpx 0 48rpx;
			text-align: center;
			font-family: SourceHanSansCN, SourceHanSansCN;
			font-weight: 600;
			font-size: 40rpx;
			color: #333333;
			line-height: 60rpx;
		}

		.subtitle {
			white-space: nowrap;
			height: 144rpx;
			text-align: center;
			font-family: SourceHanSansCN, SourceHanSansCN;
			font-weight: 400;
			font-size: 32rpx;
			color: #333333;
			line-height: 48rpx;
			padding-bottom: 64rpx;
		}

		.input {
			height: 88rpx;
			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #D9D9D9;
			padding-left: 24rpx;
			line-height: 88rpx;
		}

		.submit-btn {
			margin-top: 40rpx;
			height: 88rpx;
			background: linear-gradient(270deg, #FFA02A 0%, #FF712E 100%);
			border-radius: 8rpx;
			font-family: SourceHanSansCN, SourceHanSansCN;
			font-weight: 400;
			font-size: 30rpx;
			color: #FFFFFF;
			line-height: 88rpx;
			text-align: center;
		}
	}
</style>