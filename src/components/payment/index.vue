<template>
	<view :style="colorStyle">
		<view class="payment" :class="pay_close ? 'on' : ''">
			<view class="title acea-row row-center-wrapper">
				选择付款方式<text class="iconfont icon-guanbi" @click='close'></text>
			</view>
			<view class="item acea-row row-between-wrapper" v-for="(item,index) in payMode" :key="index"
				v-show='item.payStatus' @click="payType(item.number || 0 , item.value,index)">
				<view class="left acea-row row-between-wrapper">
					<view class="iconfont" :class="item.icon"></view>
					<view class="text">
						<view class="name">{{item.name}}</view>
						<view class="info" v-if="item.value == 'yue'">
							{{item.title}} <span class="money">￥{{ item.number }}</span>
						</view>
						<view class="info" v-else>{{item.title}}</view>
					</view>
				</view>
				<view class="iconfont" :class="active==index?'icon-xuanzhong11 font-num':'icon-weixuan'"></view>
			</view>
			<view class="payMoney">支付<span class="font-color">￥<span
						class="money">{{totalPrice}}</span></span></view>
			<view class="button bg-color acea-row row-center-wrapper" @click='goPay(number, paytype)'>去付款
			</view>
		</view>
		<view class="mask" @click='close' v-if="pay_close"></view>
		<view v-show="false" v-html="formContent"></view>
	</view>
</template>

<script>
	import {
		orderCreate
	} from '@/api/order.js';
	import colors from '@/mixins/color.js';
	export default {
		props: {
			payMode: {
				type: Array,
				default: function() {
					return [];
				}
			},
			pay_close: {
				type: Boolean,
				default: false,
			},
			order_id: {
				type: String,
				default: ''
			},
			totalPrice: {
				type: String,
				default: '0'
			},
			isCall: {
				type: Boolean,
				default: false
			},
			friendPay: {
				type: Boolean,
				default: false
			}
		},
		mixins: [colors],
		data() {
			return {
				formContent: '',
				active: 0,
				paytype: '',
				source:'',
				number: 0
			};
		},
		watch: {
			payMode: {
				handler(newV, oldValue) {
					let newPayList = [];
					newV.forEach((item, index) => {
						if (item.payStatus) {
							item.index = index;
							newPayList.push(item)
						}
					});
					this.active = newPayList[0].index;
					this.paytype = newPayList[0].value;
					this.number = newPayList[0].number || 0;
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			payType(number, paytype, index) {
				this.active = index;
				this.paytype = paytype;
				this.number = number;
				this.$emit('changePayType', paytype)
			},
			formpost(url, postData) {
				let tempform = document.createElement("form");
				tempform.action = url;
				tempform.method = "post";
				tempform.target = "_self";
				tempform.style.display = "none";
				for (let x in postData) {
					let opt = document.createElement("input");
					opt.name = x;
					opt.value = postData[x];
					tempform.appendChild(opt);
				}
				document.body.appendChild(tempform);
				this.$nextTick(e => {
					tempform.submit();
				})
			},
			close: function() {
				this.$emit('onChangeFun', {
					action: 'payClose'
				});
			},
			goPay: function(number, paytype) {
				console.log("123")
				if (this.isCall) {
					return this.$emit('onChangeFun', {
						action: 'payCheck',
						value: paytype
					});
				}
				let that = this;
				if (!that.order_id) return that.$util.Tips({
					title: "请选择要支付的订单"
				});
				uni.showLoading({
					title: "支付中"
				});
				//1-公众号，2-小程序，3-H5，4-PC端,5-IOS,6-安卓
				// #ifdef H5
				let isWeixin = this.$wechat.isWeixin();
				this.source=isWeixin ? '1' : '3';
				// #endif
				// #ifdef MP
				this.source=2;
				// #endif
				// #ifdef APP-PLUS
				if(uni.getSystemInfoSync().platform=="ios"){
					this.source='5';
				}else{
					this.source='6';
				}
				// #endif

				orderCreate({
					orderNo: that.order_id,
					payType: paytype,
					source:this.source,
					goodsType:"course",
					// #ifdef H5
					quitUrl: location.port ? location.protocol + '//' + location.hostname + ':' + location
						.port +
						'/pages/goods/order_details/index?order_id=' + this.order_id : location.protocol +
						'//' + location.hostname +
						'/pages/goods/order_details/index?order_id=' + this.order_id
					// #endif
					// #ifdef APP-PLUS
					quitUrl: '/pages/goods/order_details/index?order_id=' + this.order_id
					// #endif
				}).then(res => {
					let jsConfig = res.data.jsConfig;
					if (res.data.status == 'ALLINPAY_PAY') {
						uni.hideLoading();
						// #ifdef MP
						wx.openEmbeddedMiniProgram({
							appId: 'wxef277996acc166c3',
							extraData: {
								cusid: jsConfig.cusid,
								appid: jsConfig.appid,
								version: jsConfig.version,
								trxamt: jsConfig.trxamt,
								reqsn: jsConfig.reqsn,
								notify_url: jsConfig.notify_url,
								body: jsConfig.body,
								remark: jsConfig.remark,
								validtime: jsConfig.validtime,
								randomstr: jsConfig.randomstr,
								paytype: jsConfig.paytype,
								sign: jsConfig.sign,
								signtype: jsConfig.signtype
							}
						})
						this.jumpData = {
							orderId: res.data.orderId,
							msg: res.msg,
						}
						// #endif
						// #ifdef APP-PLUS
						plus.runtime.openURL(jsConfig.payinfo);
						// #endif
						// #ifdef H5
						this.formpost(res.data.pay_url, jsConfig)
						// #endif
					} else {
						switch (paytype) {
							case 'wechat':
								if (res.data === undefined) return that.$util.Tips({
									title:"缺少支付参数"
								});
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
									success: function(res) {
										uni.hideLoading();
										return that.$util.Tips({
											title: res.msg,
											icon: 'success'
										}, () => {
											that.$emit('onChangeFun', {
												action: 'pay_complete'
											});
										});
									},
									fail: function(e) {
										uni.hideLoading();
										return that.$util.Tips({
											title: "取消支付"
										}, () => {
											that.$emit('onChangeFun', {
												action: 'pay_fail'
											});
										});
									},
									complete: function(e) {
										uni.hideLoading();
										if (e.errMsg == 'requestPayment:cancel' || e.errMsg ==
											'requestOrderPayment:cancel') return that.$util
											.Tips({
												title: "取消支付"
											}, () => {
												that.$emit('onChangeFun', {
													action: 'pay_fail'
												});
											});
									},
								});
								// #endif
								// #ifdef H5
								let data = res.data;
								if (data.status == "WECHAT_H5_PAY") {
									uni.hideLoading();
									location.replace(data.jsConfig.h5_url);
									return that.$util.Tips({
										title: "支付成功",
										icon: 'success'
									}, () => {
										that.$emit('onChangeFun', {
											action: 'pay_complete'
										});
									});
								} else {
									let jsData = {
										timestamp:jsConfig.timeStamp,
										nonceStr:jsConfig.nonceStr,
										package:jsConfig.packages,
										signType:jsConfig.signType,
										paySign:jsConfig.paySign
									};
									that.$wechat.pay(jsData)
										.then(() => {
											return that.$util.Tips({
												title: "支付成功",
												icon: 'success'
											}, () => {
												that.$emit('onChangeFun', {
													action: 'pay_complete'
												});
											});
										})
										.catch(() => {
											return that.$util.Tips({
												title: "支付失败",
											}, () => {
												that.$emit('onChangeFun', {
													action: 'pay_fail'
												});
											});
										});
								}
								// #endif
								// #ifdef APP-PLUS
								uni.requestPayment({
									provider: 'wxpay',
									orderInfo: jsConfig,
									success: (e) => {
										let url = '/pages/goods/order_pay_status/index?order_id=' +
											orderId +
											'&msg=支付成功';
										uni.showToast({
											title: "支付成功"
										})
										setTimeout(res => {
											that.$emit('onChangeFun', {
												action: 'pay_complete'
											});
										}, 2000)
									},
									fail: (e) => {
										uni.showModal({
											content: "支付失败",
											showCancel: false,
											success: function(res) {
												if (res.confirm) {
													that.$emit('onChangeFun', {
														action: 'pay_fail'
													});
												} else if (res.cancel) {}
											}
										})
									},
									complete: () => {
										uni.hideLoading();
									},
								});
								// #endif
								break;
							case 'yue':
								uni.hideLoading();
								return that.$util.Tips({
									title: res.msg,
									icon: 'success'
								}, () => {
									that.$emit('onChangeFun', {
										action: 'pay_complete'
									});
								});
								break;
							case 'offline':
								uni.hideLoading();
								return that.$util.Tips({
									title: res.msg,
									icon: 'success'
								}, () => {
									that.$emit('onChangeFun', {
										action: 'pay_complete'
									});
								});
								break;
							case 'friend':
								uni.hideLoading();
								return that.$util.Tips({
									title: res.msg,
									icon: 'success'
								}, () => {
									that.$emit('onChangeFun', {
										action: 'pay_complete'
									});
								});
								break;

							case 'alipay':
								uni.hideLoading();
								//#ifdef H5
								if (this.$wechat.isWeixin()) {
									uni.redirectTo({
										url: `/pages/users/alipay_invoke/index?id=${res.data.order_id}&pay_key=${res.data.pay_key}`
									});
								} else {
									uni.hideLoading();
									that.formContent = res.data.jsConfig;
									that.$nextTick(() => {
										document.getElementById('alipaysubmit').submit();
									});
								}
								//#endif
								// #ifdef MP
								uni.navigateTo({
									url: `/pages/users/alipay_invoke/index?id=${res.data.order_id}&link=${res.data.jsConfig.qrCode}`
								});
								// #endif
								// #ifdef APP-PLUS
								uni.requestPayment({
									provider: 'alipay',
									orderInfo: jsConfig,
									success: (e) => {
										uni.showToast({
											title:"支付成功"
										})
										setTimeout(res => {
											that.$emit('onChangeFun', {
												action: 'pay_complete'
											});
										}, 2000)
									},
									fail: (e) => {
										uni.showModal({
											content:"支付失败",
											showCancel: false,
											success: function(res) {
												if (res.confirm) {
													that.$emit('onChangeFun', {
														action: 'pay_fail'
													});
												} else if (res.cancel) {}
											}
										})
									},
									complete: () => {
										uni.hideLoading();
									},
								});
								// #endif
								break;
						}
					}

				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					}, () => {
						that.$emit('onChangeFun', {
							action: 'pay_fail'
						});
					});
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.bgcolor {
		background-color: var(--view-theme)
	}

	.payment {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		border-radius: 16rpx 16rpx 0 0;
		background-color: #fff;
		padding-bottom: 60rpx;
		z-index: 999;
		transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		transform: translate3d(0, 100%, 0);

		.payMoney {
			font-size: 28rpx;
			color: #333333;
			text-align: center;
			margin-top: 50rpx;

			.font-color {
				margin-left: 10rpx;

				.money {
					font-size: 40rpx;
				}
			}
		}

		.button {
			width: 690rpx;
			height: 90rpx;
			border-radius: 45rpx;
			color: #FFFFFF;
			margin: 20rpx auto 0 auto;
		}
	}

	.payment.on {
		transform: translate3d(0, 0, 0);
	}

	.payment .title {
		text-align: center;
		height: 123rpx;
		font-size: 32rpx;
		color: #282828;
		font-weight: bold;
		padding-right: 30rpx;
		margin-left: 30rpx;
		position: relative;
		border-bottom: 1rpx solid #eee;
	}

	.payment .title .iconfont {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 38rpx;
		color: #8a8a8a;
		font-weight: normal;
	}

	.payment .item {
		border-bottom: 1rpx solid #eee;
		height: 130rpx;
		margin-left: 30rpx;
		padding-right: 30rpx;
	}

	.payment .item .left {
		width: 610rpx;
	}

	.payment .item .left .text {
		width: 540rpx;
	}

	.payment .item .left .text .name {
		font-size: 32rpx;
		color: #282828;
	}

	.payment .item .left .text .info {
		font-size: 24rpx;
		color: #999;
	}

	.payment .item .left .text .info .money {
		color: #ff9900;
	}

	.payment .item .left .iconfont {
		font-size: 45rpx;
		color: #09bb07;
	}

	.payment .item .left .iconfont.icon-zhifubao {
		color: #00aaea;
	}

	.payment .item .left .iconfont.icon-yuezhifu {
		color: #ff9900;
	}

	.payment .item .left .iconfont.icon-yuezhifu1 {
		color: #eb6623;
	}

	.payment .item .left .iconfont.icon-tonglianzhifu1 {
		color: #305fd8;
	}

	.payment .item .iconfont {
		font-size: 40rpx;
		color: #ccc;
	}

	.icon-haoyoudaizhifu {
		color: #F34C3E !important;
	}
</style>
