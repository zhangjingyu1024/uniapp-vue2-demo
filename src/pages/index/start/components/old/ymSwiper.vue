<template>
	<view class="ymSwiper">
	<view class="swiper square">
		<swiper class="skeleton-rect" :style="'height:'+ (imageH) +'rpx;'" indicator-dots="true"
					:autoplay="true" :circular="circular" :interval="interval" :duration="duration"
					indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff" :current="swiperCur">
					<swiper-item  class="" >
						<view class='slide-navigator acea-row row-between-wrapper'>
							<image src="https://data.youmi-china.com/source/image_0.6699026150627687.png" class="slide-image" mode="widthFix" :style="'height:'+ (imageH) +'rpx;'">
							</image>
						</view>
					</swiper-item>
					<swiper-item  class="" >
						<view class='slide-navigator acea-row row-between-wrapper'>
							<image src="https://data.youmi-china.com/source/image_0.8180551891220311.png" class="slide-image" mode="widthFix" :style="'height:'+ (imageH) +'rpx;'">
							</image>
						</view>
					</swiper-item>
				

		</swiper>
		</view>
	</view>
</template>

<script>
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	let app = getApp();
	export default {
		name: 'ymSwiper',
		watch: {
			dataConfig: {
				immediate: true,
				handler(nVal, oVal) {
					if (nVal) {
						uni.getImageInfo({
							src: this.imgUrls.length ? this.imgUrls[0].img : '',
							success: (res) => {
								this.$set(this, 'imageH', 320);
							},
							fail: (error) => {
								this.$set(this, 'imageH', 320);
							}
						})
					}
				}
			},
			imageH(nVal, oVal) {
				let self = this
			},
		},
		data() {
			return {
				indicatorDots: false,
				circular: true,
				autoplay: true,
				interval: 4000,
				duration: 500,
				imgUrls: [], //图片轮播数据
				name: this.$options.name,
				isIframe: false,
				mt: -55,
				isShow: true,
				imageH: 250,
				marginTop:0,
				swiperCur: 0,
			};
		},
		created() {
			// #ifdef MP || APP-PLUS
				this.marginTop=120
			// #endif
		},
		mounted() {},
		methods: {

		}
	}
</script>

<style lang="scss">
	

	.ymSwiper {
		background-color: #fff;
		position: relative;
		padding-top: 4rpx;

		.swiper {
			z-index: 100;
			position: relative;
			min-height: 200rpx;
			padding: 0 $uni-index-margin-col;
			overflow: hidden;
			swiper,
			.swiper-item,
			image {
				width: 100%;
				overflow: hidden;
				border-radius: 10rpx;
			}
			&.square {
				::v-deep .uni-swiper-dot {
					width: 20rpx !important;
					height: 5rpx !important;
					border-radius: 3rpx;
					background: rgba(0, 0, 0, .4) !important
				}

				::v-deep .uni-swiper-dot-active {
					background: #fff !important
				}

			}

			::v-deep uni-swiper .uni-swiper-dots-horizontal {
					bottom: 20rpx;
			}


		}
	}



</style>
