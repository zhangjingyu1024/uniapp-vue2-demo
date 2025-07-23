<template>
	<view :style="colorStyle">
		<view class='kefu-window' :class='window==true?"on":""'>
			<view class='couponWinList'>
				<img src="https://data.youmi-china.com/source/20240507190808.png"></img>
			</view>
			<view class='lid'>
					<view class='iconfont icon-guanbi3' @click="close"></view>
			</view>
		</view>
	
		<view class='mask' catchtouchmove="true" :hidden="window==false"></view>
	</view>
</template>

<script>
	import colors from "@/mixins/color";
	import {HTTP_REQUEST_URL} from '@/config/app';
	export default {
		props: {
			window: {
				type: Boolean | String | Number,
				default: false,
			},
			couponList: {
				type: Array,
				default: function() {
					return []
				},
			},
			couponImage: {
				type: String,
				default: '',
			},
		},
		mixins: [colors],
		data() {
			return {
				imgHost:HTTP_REQUEST_URL
			};
		},
		methods: {
			close: function() {
				this.$emit('onColse');
			}
		}
	}
</script>


<style scoped lang="scss">
	.mask {
		z-index: 9999;
	}

	.kefu-window {
		width: 572rpx;
		height: 760rpx;
		position: fixed;
		top: 20%;
		z-index: 10000;
		left: 50%;
		margin-left: -286rpx;
		transform: translate3d(0, -200%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
		border-radius: 30rpx 30rpx 0 0;
		overflow-x: hidden;
	}

	.co-bag {
		width: 100%;
		height: 250rpx;
		z-index: 33333;
		top: -40rpx;
		position: absolute;
	}

	.couponWinList img{
		width:100%;
		height:100%;
		border-radius: 5px;
	}
	.kefu-window.on {
		transform: translate3d(0, 0, 0);
	}

	.kefu-window .couponWinList {
		width: 480rpx;
		margin: 157rpx 0 0 50rpx;
		height: 480rpx;
	}

	.kefu-window .couponWinList .item {
		width: 100%;
		height: 120rpx;
		background-color: #fff;
		position: relative;
		margin-bottom: 17rpx;
		position: relative;
		z-index: 99999;
	}
	.kefu-window .lid {
		width: 582rpx;
		position: fixed;
		z-index: 22222;
		left: 50%;
		top: 25%;
		margin: 424rpx 0 0 -296rpx;
	}


	.kefu-window .lid .bnt {
		font-size: 29rpx;
		width: 440rpx;
		height: 80rpx;
		border-radius: 40rpx;
		background: linear-gradient(90deg, #FFCA52 0%, #FE960F 100%);
		text-align: center;
		line-height: 80rpx;
		font-weight: bold;
		margin: 98rpx auto 0 auto;
		color: #fff;
	}

	.kefu-window .lid .iconfont {
		color: #fff;
		font-size: 60rpx;
		text-align: center;
		margin-top: 87rpx;
	}
</style>
