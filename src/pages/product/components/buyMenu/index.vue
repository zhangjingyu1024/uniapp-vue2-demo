<template>
	<view>
		<view class='pageFooter acea-row row-between-wrapper'>
			<navigator hover-class="none" open-type="switchTab" class="item" url="/pages/index/index">
				<view class="iconfont icon-shouye6"></view>
				<view class="p_center">首页</view>
			</navigator>
			<!-- <view class="bnt acea-row" v-if="val.canPlay==1"> -->
			<view class="bnt acea-row">
				<view class="comment bnts" @tap="reply">写评论</view>
			</view>
			<!-- <view class="bnt acea-row" v-if="val.canPlay==0">
					<view class="buy bnts" @tap="goCat(val)">立即购买</view>
				</view> -->
			<view class="bnt acea-row">
				<view class="concern bnts" @tap="concern">关心问题投票</view>
			</view>
			<block v-if="val.type=='live'">
				<view class="bnt acea-row" v-if="val.liveStatus==1 || val.liveStatus==2 && val.canPlay==1">
					<view class="buy bnts" @click="goH5Live"> 直播 </view>
				</view>
				<view class="bnt acea-row" v-if="val.liveStatus==3 && val.playBackStatus==4 && val.canPlay==1">
					<view class="buy bnts" @tap="goAppBack"> 回放 </view>
				</view>
			</block>
		</view>
		<reply :pay_close="pay_close" :is-call="false" @onChangeFun="onChangeFun" :order_id="val.id"></reply>
	</view>
</template>

<script>
	import reply from '@/components/reply';
	import {
		orderConfirm
	} from '@/api/order.js'
	export default {
		props: {
			val: {
				type: Object,
				default: () => {}
			},
			type: {
				type: String,
				default: "video"
			},
		},
		components: {
			reply
		},
		data() {
			return {
				pay_close: false,
				listType: '',
			};
		},
		created() {
			const params = this.$route.query
			if (params) {
				this.listType = params.listType
			}
		},
		mounted() {

		},
		onLoad(opt) {
			console.log(opt, 'optttt')
		},
		methods: {
			onChangeFun: function(e) {
				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				this.pay_close = false
				action && this[action] && this[action](value);
			},
			reply: function() {
				// this.$emit('onChangeFun', {
				// 	action: 'replyOpen'
				// });
				this.pay_close = true
			},
			concern() {
				uni.$emit('concern', {val: this.val, type: this.listType})
			},
			goH5Live: function() {
				//小程序没有直播
				// #ifdef H5 || MP-WEIXIN
				uni.navigateTo({
					url: `/pages/live/h5Live/index?number=` + this.val.number
				})
				// #endif
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: `/pages/live/h5Back/index?number=` + this.val.number
				})
				// #endif
			},


			goAppBack: function() {
				//小程序没有直播
				// #ifdef H5 || MP-WEIXIN
				uni.navigateTo({
					url: `/pages/live/h5Back/index?number=` + this.val.number
				})
				// #endif
				// #ifdef APP-PLUS
				const playback = uni.requireNativePlugin("BJY-VideoPlayer-PlaybackUI")
				let that = this;
				return new Promise((resolve, reject) => {
					getLiveBackData(that.number).then(res => {
						let data = res.data
						// 这里如果不传配置数据，也需要传一个空的map结构，不然iOS平台会崩溃
						playback.startPlayback(data.roomId,
							data.token, {
								// 用户唯一标识
								"userId": data.userNumber,
								// 用户昵称
								"userName": data.userName
							})
						resolve(data);
					}).catch((error) => {
						reject(error);
					});
				})
				// #endif

			},

			goCat: function(val) {
				let that = this;
				let data = {
					useItegral: 0,
					goodsNumber: val.number,
					goodsType: "course", //（course-课程，card-VIP）
				}
				orderConfirm(data).then(res => {
					let content = res.data
					if (content.orderStatus == 1) {
						//提示需要完成以前的订单
						uni.showModal({
							title: "提示",
							cancelText: "再想想",
							confirmText: "去支付",
							content: "已有未支付的订单",
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: `/pages/order/order_detail/index?number=${content.orderNumber}`
									})
								} else if (res.cancel) {

								}
							}
						});
					} else {
						uni.navigateTo({
							url: `/pages/order/order_confirm/index?number=${val.number}`
						})
					}
				}).catch((error) => {
					uni.showToast({
						title: error,
						icon: 'none',
						duration: 2000
					});
				});

			},
		}
	};
</script>

<style lang="scss">
	.pageFooter {
		padding: 0 20rpx 0 30rpx;
		position: fixed;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: #f5f5f5;
		backdrop-filter: blur(10px);
		z-index: 277;
		height: 100rpx;
		display: flex;
		height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/

		// height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		// height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		// transform: translate3d(0, 100%, 0);
		// transition: all .3s cubic-bezier(.25, .5, .5, .9);
		.iconfont {
			color: #999 !important;
		}

		.p_center {
			color: #999;
		}

		.item {
			font-size: 18rpx;
			color: #666;
			width: 110rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.iconfont {
				font-size: 40rpx;
				color: #666;
			}
		}

		.bnt {
			flex: 1;
			margin: 0 10rpx;
			display: block;

			.bnts {
				text-align: center;
				line-height: 80rpx;
				color: #fff;
				font-size: 30rpx;
				border-radius: 40rpx;
				background-color: var(--view-theme);
				white-space: nowrap;
				font-style: normal;
				font-weight: 400;
				overflow: hidden;
				text-overflow: ellipsis;
				padding: 0 32rpx;
				display: block;
			}

			.comment {
				background-color: #61D563;
			}

			.concern {
				background-color: #FFA002;
			}
		}
	}
</style>