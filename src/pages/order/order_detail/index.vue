<template>
	<view :style="colorStyle">
		<view class="order-progress">
			<view class="progress-title">
				<text class="ymfont ym-weibiaoti2fuzhi04" v-if="content.orderState==0" style="color:#00b4f9"></text>
				<text class="ymfont ym-yifukuan" v-if="content.orderState==1" style="color:#33ce00"></text>
				<text class="ymfont ym-yiguanbi" v-if="content.orderState==2" style="color:red"></text>
				<text class="ymfont ym-tuikuanzhong" v-if="content.orderState==3"></text>
				<text class="ymfont ym-yituikuan" v-if="content.orderState==4"></text>
				<block v-if="content.orderState==0">待付款</block>
				<block v-if="content.orderState==1">已付款</block>
				<block v-if="content.orderState==2">已关闭</block>
				<block v-if="content.orderState==3">退款中</block>
				<block v-if="content.orderState==4">已退款</block>
			</view>
			<view class="pay-time-tit" v-if="content.orderState==0"> 
			 <countDown
						tipText="请于"
						hourText="时"
						minuteText="分"
						:datatime="content.payExpireTime"
						:isDay="false"
						v-if="content.orderState==0"
					></countDown>  内付款，超时订单将自动关闭 
			</view>
			<view class="pay-time-tit" v-if="content.orderState==1"> 
				订单已付款
			</view>
			<view class="pay-time-tit" v-if="content.orderState==2"> 
				订单超时关闭 
			</view>
			<view class="pay-time-tit" v-if="content.orderState==3"> 
				订单退款中
			</view>
			<view class="pay-time-tit" v-if="content.orderState==4"> 
				订单已退款
			</view>		
		</view>
			
		<view class="item">
			<view class="itemContent" @click="goProduct(content.goodsNumber,content.goodsDetailType)">
						<view class="orderItem">
							<div class="tag" v-if="content.goodsDetailType=='video'">视频课</div>
							<div class="tag" v-if="content.goodsDetailType=='audio'">音频课</div>
							<div class="tag" v-if="content.goodsDetailType=='graphic'">图文课</div>
							<div class="tag" v-if="content.goodsDetailType=='series'">系列课</div>
							<div class="tag" v-if="content.goodsDetailType=='setmeal'">套餐</div>
							<div class="tag" v-if="content.goodsDetailType=='card'">会员卡</div>
							<view class="left">
								<view class="img"><img mode="widthFix" :src="content.goodsImage"></view>
							</view>
							<view class="right">
								<view class="title">{{content.goodsName}}</view>
								<view class="ordermsg"><view class="price">￥{{content.price}}</view></view>
							</view>
						</view>
			</view>
		</view>
		<view class="list">
				<view class="list-ul">
					<view class="list-li">
						<view class="left">应付金额</view>
						<view class="right">￥{{content.price}}</view>
					</view>
					<view class="list-li">
						<view class="left">积分</view>
						<view class="right">-￥{{content.integralPrice?content.integralPrice:0}}</view>
					</view>
					<view class="list-li">
						<view class="left-price">实付金额</view>
						<view class="right-price">￥{{content.payPrice}}</view>
					</view>
				</view>
				<view class="list-ul">
					<view class="list-li">
						<view class="left">订单编号</view>
						<view class="right">{{content.number}}</view>
					</view>
					<view class="list-li">
						<view class="left">下单时间</view>
						<view class="right">{{content.orderTime}}</view>
					</view>
					<view class="list-li">
						<view class="left">支付方式</view>
						<view class="right"  v-if="content.payType=='wechat'">微信</view>
						<view class="right"  v-if="content.payType=='alipay'">支付宝</view>
						<view class="right"  v-if="content.payType=='other'">其它</view>
					</view>
				</view>
		</view>
		<ymRight/>
		<payment :payMode="payMode" :pay_close="pay_close" :is-call="false" @onChangeFun="onChangeFun"
			:order_id="pay_order_id" :totalPrice="totalPrice"></payment>
		<view class='pageFooter acea-row row-between-wrapper'  v-if="content.orderState==0">
				<view style="flex:1"></view>
				<view class="bnt acea-row">
					<view class="buy bnts-que" @tap="cancel(content)">取消订单</view>
				</view>
				<view class="bnt acea-row">
					<view class="buy bnts" @tap="pay(content)">去支付</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import payment from '@/components/payment';
import countDown from '@/components/countDown';
import {
	getOrderInfo,
	orderQueryPayResult,
	getOrderCancel
} from '@/api/order.js'
import colors from '@/mixins/color.js';
import ymRight from '@/pages/index/start/components/ymRight';
export default {
	name: 'orderDetail',
	props: {
	
	},
	components: {
		countDown,
		payment,
		ymRight
	},
	mixins: [colors],
	onLoad(options) {
		console.log(options.number)
		if(options.number){
			this.number=options.number
			this.loadInit()
		}
		
	},
	data() {
		return {
			totalPrice: '0',
			pay_close: false,
			pay_order_id: '',
			content:[],	
			number:"",
			payMode: [{
						name: "微信支付",
						icon: 'icon-weixinzhifu',
						value: 'wechat',
						title: "微信支付",
						payStatus: true
					}
					// #ifdef H5 ||APP-PLUS
					,
					{
						name: "支付宝支付",
						icon: 'icon-zhifubao',
						value: 'alipay',
						title: "支付宝支付",
						payStatus: true
					},
					// #endif
			],
		};
	},
	created() {
		
	},
	mounted() {
		
	},
	methods: {
		cancel(val){
			let that=this
			uni.showLoading({
				title: "正在加载中"
			});
			getOrderCancel({orderNumber:val.number}).then(res => {
				uni.hideLoading();
				that.loadInit()
				that.$util.Tips({
						title: "取消成功",
						icon: 'success'
				});
			}).catch((error) => {
					uni.hideLoading();
					uni.showToast({
							title: error,
							icon: 'none',
							duration: 2000
					});
			});
		},
		loadInit(){
			if (!this.number) return;
			let that=this
			let data={
				orderNumber:this.number
			}
			console.log(data)
			getOrderInfo(data).then(res => {
					that.content=res.data
			}).catch((error) => {
					uni.showToast({
							title: error,
							icon: 'none',
							duration: 2000
					});
			});
		},
		goProduct(number,type) {
				if(type=="series"){
					uni.navigateTo({
							url: `/pages/product/product_series/index?number=${number}`
					})
				}else if(type=="video"){
					uni.navigateTo({
							url: `/pages/product/product_video/index?number=${number}`
					})
				}else if(type=="audio"){
					uni.navigateTo({
							url: `/pages/product/product_audio/index?number=${number}`
					})
				}else if(type=="live"){
					uni.navigateTo({
							url: `/pages/product/product_live/index?number=${number}`
					})
				}else{
					uni.navigateTo({
							url: `/pages/product/product_video/index?number=${number}`
					})
				}
				
		},
		pay(item) {
				this.pay_order_id=item.number
				this.totalPrice=item.payPrice.toString();
				this.pay_close = true;
		},
		onChangeFun: function(e) {
				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				this.pay_close = false
				action && this[action] && this[action](value);
		},
		pay_complete(){
			let data={
					orderNo:this.pay_order_id
				}
				let that = this;
				uni.showLoading({
					title:'正在加载中'
				});
				orderQueryPayResult(data).then(res => {
					//刷新数据
					uni.hideLoading();
					that.loadInit()
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
								title: err,
								icon: 'none',
								duration: 2000
					});
				});	
		},
	}
};
</script>

<style lang="scss">
	.order-progress {
		background-color: #fff;
    	padding: 40rpx 0;
		.progress-title {
			font-size: 4.267vw;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			.ymfont {
				font-size:40rpx;
				margin-right:10rpx;
			}
		}
		 .pay-time-tit {
			display:flex;
			width: 100%;
			text-align: center;
			margin-top: 30rpx;
			color: #333;
			font-size: 28rpx;
			align-items: center;
    		justify-content: center;
		}
	}
	.item{
				background: #fff;
				border-radius: 1.067vw;
				margin-bottom: 2.133vw;
				position: relative;
				margin-top:20rpx;
			.itemContent{
					padding:3.2vw;
			

					.orderItem {
							display: flex;
							align-items: center;
							justify-content: space-between;
							background: #f6f6f6;
							border-radius: 1.067vw;
							height: 17.6vw;
							padding: 2.133vw;
							position: relative;
							.tag{
								width: 13.867vw;
								height: 5.867vw;
								background: hsla(0,0%,40%,.9);
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
							.left{
								.img{
									width: 23.733vw;
									height: 13.333vw;
									border-radius: 0.533vw;
									overflow: hidden;
									img{
										width: 100%;
										height: 100%;
										object-fit: cover;
									}
								}
							}
							.right{
									margin-left: 2.133vw;
									flex: 1 1;
									overflow: hidden;
									display: flex;
									flex-direction: column;
									justify-content: space-between;
									height: 100%;
									.title{
										color: #333;
										white-space: nowrap;
										overflow: hidden;
										text-overflow: ellipsis;
										-o-text-overflow: ellipsis;
										-webkit-text-overflow: ellipsis;
										-moz-text-overflow: ellipsis;
									}
									.ordermsg{
											display: flex;
											align-items: flex-end;
											justify-content: flex-start;
											.price{
												font-size: 3.2vw;
												color: #999;
											}
									}
							}
					}
					.orderTime{
						font-size: 3.2vw;
						color: #333;
						display: inline-block;
						margin-top: 3.2vw;
					}	
				}
	}

	.list-ul{
		background-color: #fff;
    	margin-bottom: 1.6vw;
		.list-li{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 12vw;
			padding-right: 3.2vw;
			margin-left: 3.2vw;
			border-bottom: 1px solid #f6f6f6;
			.left{
				font-size: 3.2vw;
				color: #999;
			}
			.right{
				font-size: 3.2vw;
				color: #999;
			}
			.left-price{
				font-size: 3.733vw;
				color: #333;
				display: flex;
				justify-content: flex-end;
			}
			.right-price{
				color: var(--view-theme);
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
			display:flex;
			height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
			// height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			// height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
			// transform: translate3d(0, 100%, 0);
			// transition: all .3s cubic-bezier(.25, .5, .5, .9);
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
			.bnt{
				 width:210rpx;
				 margin-left:20rpx;
				.bnts {
					text-align: center;
					line-height: 66rpx;
					color: #fff;
					font-size: 28rpx;
					border-radius: 50rpx;
					background-color: var(--view-theme);
					flex:1;
				}
				.bnts-que {
					text-align: center;
					line-height: 66rpx;
					color: #fff;
					font-size: 28rpx;
					border-radius: 50rpx;
					border: 1px solid #e5e5e5;
   					color: #333;
					flex:1;
				}
			}
			
			 
		}
</style>
