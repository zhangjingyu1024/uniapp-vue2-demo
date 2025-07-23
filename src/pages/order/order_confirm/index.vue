<template>
	<view :style="colorStyle">
		<view class="head">
			<view class="orderItem">
				<div class="tag" v-if="content.goodsDetailType && content.goodsDetailType == 'video'">视频课</div>
				<div class="tag" v-if="content.goodsDetailType && content.goodsDetailType == 'audio'">音频课</div>
				<div class="tag" v-if="content.goodsDetailType && content.goodsDetailType == 'graphic'">图文课</div>
				<div class="tag" v-if="content.goodsDetailType && content.goodsDetailType == 'series'">系列课</div>
				<div class="tag" v-if="content.goodsDetailType && content.goodsDetailType == 'setmeal'">套餐</div>
				<div class="tag" v-if="content.goodsDetailType && content.goodsDetailType == 'live'">直播</div>
				<div class="tag" v-if="content.goodsDetailType && content.goodsDetailType == 'card'">会员卡</div>
				<view class="left">
					<view class="img"><img mode="widthFix" :src="content.goodsImage"></view>
				</view>
				<view class="right">
					<view class="title">{{ content.goodsName }}</view>
					<view class="ordermsg">
						<view class="price">￥{{ content.goodsOldPrice }}</view>
					</view>
				</view>
			</view>
			<view class="orderTime">{{ content.msgOverTime }}</view>
		</view>
		<view class="content">
			<view class="item">
				<view class="title">
					<text class="ymfont ym-jifen"></text>
					<view class="des">满1积分抵扣12元</view>
				</view>
				<view class="about">不可用</view>
			</view>
		</view>
		<view class="content">
			<view class="item method">
				支付方式
			</view>
			<radio-group class="section-bd" name="method">
				<view class="item" v-for="(item, index) in payMode" :key="index">
					<view class="title">
						<text class="ymfont" :class="item.icon"></text>
						<view class="des">{{ item.name }}</view>
					</view>
					<view class="about">
						<radio class="radio" :checked="payType === item.value">
						</radio>
					</view>
				</view>
			</radio-group>
		</view>
		<ymRight />
		<view class='pageFooter acea-row row-between-wrapper'>

			<view class="acea-row row-column">
				<view class="acea-row  row-center-wrapper ">
					<view>实付金额：</view>
					<view class="price">
						<text class="dollar">￥</text>
						<text class="decimal">￥{{ content.goodsNewPrice }}</text>
					</view>
				</view>
				<view class="tips">可得{{ content.buyItegral }}积分</view>
			</view>

			<view class="bnt acea-row">
				<view class="buy bnts" @tap="goPay">确认支付</view>
			</view>
		</view>
	</view>
</template>

<script>
import colors from '@/mixins/color.js';
import ymRight from '@/pages/index/start/components/ymRight';
import {
	orderCreate, orderConfirm, orderQueryPayResult
} from '@/api/order.js'
export default {
	name: 'Order',
	props: {

	},
	mixins: [colors],
	data() {
		return {
			payType: 'wechat',
			number: 0,
			content: {},
			order_on: "",
			goodsType: "course",
			payMode: [{
				name: '微信支付',
				icon: ' ym-weixinzhifu',
				value: 'wechat',

			},
			// #ifdef H5 ||APP-PLUS
			{
				name: '支付宝支付',
				icon: 'ym-zhifubaozhifu',
				value: 'alipay',
			},
				// #endif
			],
			source: 0
		};
	},
	onLoad(options) {
		if (options.number) {
			this.number = options.number
		}
		if (options.goodsType) {
			this.goodsType = options.goodsType
		}
	},
	components: {
		ymRight
	},
	created() {

	},
	mounted() {
		//1-公众号，2-小程序，3-H5，4-PC端,5-IOS,6-安卓
		// #ifdef H5
		let isWeixin = this.$wechat.isWeixin();
		this.source = isWeixin ? '1' : '3';
		// #endif
		// #ifdef MP
		this.source = 2;
		// #endif
		// #ifdef APP-PLUS
		if (uni.getSystemInfoSync().platform == "ios") {
			this.source = '5';
		} else {
			this.source = '6';
		}
		// #endif
		this.loadInit();
	},
	methods: {

		loadInit() {
			console.log(this.goodsType)
			let that = this;
			let data = {
				goodsNumber: this.number,
				goodsType: this.goodsType,//（course-课程，card-VIP）
				payType: this.payType,//付款方式(wechat-微信,alipay-支付宝)
				useItegral: 0,//是否用积分，1-用，0-不用
				source: this.source//来源 1-公众号，2-小程序，4-PC端，3-H5,5-IOS,6-安卓，7-导入
			}
			orderConfirm(data).then(res => {
				that.content = res.data
				if (res.data.orderStatus == 1) {
					//提示需要完成以前的订单
				}
			}).catch((error) => {
				uni.showToast({
					title: error,
					icon: 'none',
					duration: 2000
				});
			});
		},
		pay_complete: function () {
			let data = {
				orderNo: this.order_on
			}
			let that = this;
			uni.showLoading({
				title: '正在加载中'
			});
			orderQueryPayResult(data).then(res => {
				uni.hideLoading();
				that.goOrderDetail(that.order_on)
			}).catch(err => {
				uni.hideLoading();
				// that.$util.Tips({
				// 	title: err
				// }, '/pages/points_mall/exchange_record');
			});

		},
		goOrderDetail(orderOn) {
			uni.navigateTo({
				url: `/pages/order/order_detail/index?number=${orderOn}`
			})
		},
		goPay() {
			let that = this;
			let data = {
				goodsNumber: this.number,
				goodsType: this.goodsType,//（course-课程，card-VIP）
				payType: this.payType,//付款方式(wechat-微信,alipay-支付宝)
				useItegral: 0,//是否用积分，1-用，0-不用
				source: this.source//来源 1-公众号，2-小程序，3-PC端，4-H5,5-IOS,6-安卓，7-导入
			}
			orderCreate(data).then(res => {
				console.log("da", res)
				that.order_on = res.data.orderNo
				let jsConfig = res.data.jsConfig;
				// #ifdef MP
				let mp_pay_name = ''
				if (uni.requestOrderPayment) {
					mp_pay_name = 'requestOrderPayment'
				} else {
					mp_pay_name = 'requestPayment'
				}
				uni[mp_pay_name]({
					timeStamp: jsConfig.timeStamp,
					nonceStr: jsConfig.nonceStr,
					package: jsConfig.packages,
					signType: jsConfig.signType,
					paySign: jsConfig.paySign,
					success: function (res) {
						uni.hideLoading();
						return that.$util.Tips({
							title: res.msg,
							icon: 'success'
						}, () => {
							that.pay_complete();
							// that.$emit('onChangeFun', {
							// 	action: 'pay_complete'
							// });
						});
					},
					fail: function (e) {
						uni.hideLoading();
						console.log(e)
						return that.$util.Tips({
							title: '取消支付'
						}, () => {
							// that.$emit('onChangeFun', {
							// 	action: 'pay_fail'
							// });
						});
					},
					complete: function (e) {
						console.log(e)
						uni.hideLoading();
						if (e.errMsg == 'requestPayment:cancel' || e.errMsg ==
							'requestOrderPayment:cancel') return that.$util
								.Tips({
									title: '取消支付'
								}, () => {
									// that.$emit('onChangeFun', {
									// 	action: 'pay_fail'
									// });
								});
					},
				});
				// #endif
				// #ifdef H5
				let data = {
					timestamp: jsConfig.timeStamp,
					nonceStr: jsConfig.nonceStr,
					package: jsConfig.packages,
					signType: jsConfig.signType,
					paySign: jsConfig.paySign
				};
				if (that.source == 3) {
					//h5
				} else {
					//公众号
					that.$wechat.pay(data)
						.then(() => {
							return that.$util.Tips({
								title: '支付成功',
								icon: 'success'
							}, () => {
								that.pay_complete();
							});
						}).catch(() => {
							return that.$util.Tips({
								title: '支付失败',
							}, () => {
								that.$emit('onChangeFun', {
									action: 'pay_fail'
								});
							});
						});
				}


				// #endif

			}).catch((error) => {
				uni.showToast({
					title: error,
					icon: 'none',
					duration: 2000
				});
			});
		}
	}
};
</script>

<style lang="scss">
.head {
	padding: 4.267vw;
	background-color: #fff;

	.orderItem {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #f6f6f6;
		border-radius: 1.067vw;
		height: 17.6vw;
		padding: 2.133vw;
		position: relative;

		.tag {
			width: 13.867vw;
			height: 5.867vw;
			background: hsla(0, 0%, 40%, .9);
			border-radius: 1.067vw 0 1.067vw 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 3.2vw;
			color: #fff;
			position: absolute;
			top: 0;
			left: 0;
		}

		.left {
			.img {
				width: 23.733vw;
				height: 13.333vw;
				border-radius: 0.533vw;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}

		.right {
			margin-left: 2.133vw;
			flex: 1 1;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;

			.title {
				color: #333;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				-o-text-overflow: ellipsis;
				-webkit-text-overflow: ellipsis;
				-moz-text-overflow: ellipsis;
			}

			.ordermsg {
				display: flex;
				align-items: flex-end;
				justify-content: flex-start;

				.price {
					font-size: 3.2vw;
					color: #999;
				}
			}
		}
	}

	.orderTime {
		font-size: 3.2vw;
		color: #333;
		display: inline-block;
		margin-top: 3.2vw;
	}
}

.content {
	margin-top: 3.2vw;
	background-color: #fff;

	.title {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 4.267vw;
		font-weight: 700;
	}

	.method {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 4.267vw;
		font-weight: 700;
	}

	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 14.4vw;
		padding-right: 4.267vw;
		margin-left: 4.267vw;
		border-bottom: 1px solid #f6f6f6;

		.title {
			margin-left: 1.6vw;
			color: #333;
			font-size: 3.733vw;
			font-weight: 400;
			display: flex;

			.des {
				margin-left: 1.6vw;
				color: #333;
				font-size: 3.733vw;
				font-weight: 400;
			}

			.ym-jifen {
				font-size: 40rpx;
				color: var(--view-theme);
			}

			.ym-weixinzhifu {
				font-size: 40rpx;
				color: #09bb07;
			}

			.ym-zhifubaozhifu {
				font-size: 40rpx;
				color: #09a8f1;
			}


		}

		.about {
			color: #999;
		}
	}
}


.pageFooter {
	padding: 0 20rpx 0 30rpx;
	position: fixed;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	background-color: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(10px);
	z-index: 277;
	border-top: 1rpx solid #f0f0f0;
	height: 100rpx;
	display: flex;
	color: #666;
	// padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
	// padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
	height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
	height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	// transform: translate3d(0, 100%, 0);
	// transition: all .3s cubic-bezier(.25, .5, .5, .9);

	.tips {
		font-size: 3.2vw;
		color: #999;
		padding-top: 1.067vw;
	}

	.price {
		color: var(--view-theme);

		.dollar {
			font-size: 3.2vw;
		}

		.decimal {
			font-size: 3.2vw;
			font-size: 4.8vw;
			font-weight: 700 !important;
		}
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
		width: 250rpx;

		.bnts {
			text-align: center;
			line-height: 76rpx;
			color: #fff;
			font-size: 34rpx;
			border-radius: 50rpx;
			background-color: var(--view-theme);
			flex: 1;
		}
	}

}


::v-deep uni-radio .uni-radio-input.uni-radio-input-checked {
	border: 1px solid var(--view-theme) !important;
	background-color: var(--view-theme) !important;
}
</style>
