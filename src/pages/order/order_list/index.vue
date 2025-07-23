<template>
	<view :style="colorStyle">
		<view class="tabsWrap">
				<view class="tab"  @click='tabSelect(-1)' :class="active==-1?'activeTab':''">
					<view class="tabName">全部</view>
					<view class="underline" v-if="active==-1"></view>
				</view>
				<view class="tab"  @click='tabSelect(0)' :class="active==0?'activeTab':''">
					<view class="tabName">待付款</view>
					<view class="underline" v-if="active==0"></view>
				</view>
				<view class="tab"  @click='tabSelect(1)' :class="active==1?'activeTab':''">
					<view class="tabName">已付款</view>
					<view class="underline" v-if="active==1"></view>
				</view>
				<view class="tab"  @click='tabSelect(2)' :class="active==2?'activeTab':''">
					<view class="tabName">已关闭</view>
					<view class="underline" v-if="active==2"></view>
				</view>
		</view>
		<view class="list" v-if="content.length>0">
			<view class="item" v-for="(item,index) in content" @click="goDetail(item)" :key="index">
				<view class="itemHead">
					<view class="itemHeadNum">订单号{{item.number}}</view>
					<view class="itemHeadStatus">
					<countDown
						tipText="剩余"
						hourText="时"
						minuteText="分"
						:datatime="item.payExpireTime"
						:isDay="false"
						v-if="item.orderState==0"
					></countDown>
						<text class="status">{{orderStateMain(item.orderState)}}</text>
					</view>
				</view>
				<view class="itemContent">
					<view class="orderItem">
						<div class="tag">{{detailTypeMail(item.goodsDetailType)}}</div>
						<view class="left">
							<view class="img"><img mode="widthFix" :src="item.goodsImage"></view>
						</view>
						<view class="right">
							<view class="title">{{item.goodsName}}</view>
							<view class="ordermsg"><view class="price">￥{{item.price}}</view></view>
						</view>
					</view>
				</view>
				<view class="itemPrice">
					<view class="">实付金额</view>
					<view class="price">
							<text class="dollar">￥</text>
							<text class="decimal">{{item.payPrice}}</text>
					</view>
				</view>
				<view class="itemFooter"  v-if="item.orderState==0">
					<view class="bnt cancelBnt" @click.stop="cancel(item)">取消订单</view>
					<view class="bnt"  @click.stop="pay(item)">去付款</view>
				</view>
			</view>
			<div class="am-list-footer">
				<div style="padding: 30px; text-align: center;">没有更多了</div>
			</div>
		</view>
		<view v-else class="nothing" style="text-align: center;margin-top:20rpx;">
			<image v-if="!loading" :src="'https://data.youmi-china.com/source/empty.png'" alt="" style="width:352rpx;height:280rpx">
				<view v-if="!loading" style="font-size:25rpx;color: #979cb3;">暂无记录</view>
		</view>
		<Loading :loaded="loaded" :loading="loading"></Loading>
		<payment :payMode="payMode" :pay_close="pay_close" :is-call="false" @onChangeFun="onChangeFun"
			:order_id="pay_order_id" :totalPrice="totalPrice"></payment>
	</view>
</template>

<script>
import payment from '@/components/payment';
import colors from '@/mixins/color.js';
import countDown from '@/components/countDown';
import Loading from '@/components/Loading/index';
import {
		HTTP_REQUEST_URL
} from '@/config/app'
import {
	getOrderList,
	orderQueryPayResult,
	getOrderCancel
} from '@/api/order.js'
export default {
	name: 'OrderList',
	props: {
	
	},
	mixins: [colors],
	components: {
		Loading,
		countDown,
		payment
	},
	data() {
		return {
			imgHost: HTTP_REQUEST_URL,
			loaded: false,
			loading: false,
			active:-1,
			content:[],
			totalPrice: '0',
			pay_close: false,
			pay_order_id: '',
			pageNum:1,
			pageSize:10,
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
	onLoad: function() {
		this.loadInit()
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
				that.content=[]
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
		tabSelect(idx){
				this.active=idx
				this.loaded = false;
				this.pageNum = 1;
				this.content=[]
				this.loadInit()
		},
		pay(item) {
				this.pay_order_id=item.number
				this.totalPrice=item.payPrice.toString();
				this.pay_close = true;
		},
		loadInit(){
			console.log("asdasd")
			let that=this
			if (that.loading || that.loaded) return;
				that.loading = true;
			let data={
				orderState:this.active,
				pageNum:this.pageNum,
				pageSize:this.pageSize,
			}
			getOrderList(data).then(res => {
				that.loading = false;
				that.loaded = res.rows.length < that.pageSize;
				that.content.push.apply(that.content, res.rows);
				that.pageNum++;
				uni.hideLoading();
			}).catch((error) => {
					uni.hideLoading();
					uni.showToast({
							title: error,
							icon: 'none',
							duration: 2000
					});
			});
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
					that.content=[]
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
		goDetail(item) {
			uni.navigateTo({
							url: `/pages/order/order_detail/index?number=${item.number}`
			})
		},
		orderStateMain(type){
			if(type==0){
				return "待付款"
			}
			if(type==1){
				return "已付款"
			}
			if(type==2){
				return "已关闭"
			}
			if(type==4){
				return "已退款"
			}
		},
		detailTypeMail(type){
			if(type=='video'){
				return "视频课"
			}
			if(type=='audio'){
				return "音频课"
			}
			if(type=='graphic'){
				return "图文课"
			}
			if(type=='series'){
				return "系列课"
			}
			if(type=='setmeal'){
				return "套餐"
			}
			if(type=='card'){
				return "会员卡"
			}
			
		}
	},
	onReachBottom() {
		this.loadInit()
	}
};
</script>

<style lang="scss">
	.tabsWrap{
			    width: 100%;
				height: 13.333vw;
				display: flex;
				align-items: center;
				justify-content: space-around;
				.tab{
					position: relative;
					width: 18.667vw;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 3.733vw;
					color: #999;

					.tabsWrap{
							font-size: 4.267vw;
							font-weight: 700;
					}

					.tabsWrap{
							font-size: 4.267vw;
							font-weight: 700;
					}

					.underline{
						position: absolute;
						left: 0;
						right: 0;
						bottom: 0;
						margin: auto;
						width: 3.2vw;
						height: 0.8vw;
						background: var(--view-theme) !important;
						border-radius: 0.533vw;
					}
					.tabName{
						font-size: 3.733vw;
						.badge{
							font-size: 2.667vw !important;
						}
					}	
				}
				
				.activeTab{
					color: #333;
					.tabName{
						font-size: 4.267vw !important;
    					font-weight: 700 !important;
					}	
				}
		}
		.list{
			padding: 2.133vw 4.267vw 0;
			.item{
				background: #fff;
				border-radius: 1.067vw;
				margin-bottom: 2.133vw;
				position: relative;
				.itemHead{
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 3.2vw;
					.itemHeadNum{
						font-size: 2.933vw;
    					color: #999;
					}
					.itemHeadStatus{
						display:flex;
						font-size: 2.933vw;
						.status{
							font-size: 3.2vw;
						}
						.time{
							margin-right:10rpx;
							.timeRed{
								color: #f35959;
							}
						}
					}
				}
				.itemContent{
					padding: 0 3.2vw 3.2vw 0;
					margin-left: 3.2vw;
					border-bottom: 1px solid #f6f6f6;

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
				.itemPrice {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 3.2vw;
					height: 12.267vw;
					border-bottom: 1px solid #f6f6f6;
					.price{
				    	color: var(--view-theme);
						.dollar{
								font-size: 3.2vw;
						}
						.decimal{
							font-size: 3.2vw;
							font-size: 4.8vw;
							font-weight: 700!important;
						}
					}
				}

				.itemFooter {
					display: flex;
					justify-content: flex-end;
					padding: 3.2vw;
					.bnt {
							width: 176rpx;
							height: 60rpx;
							text-align: center;
							line-height: 59rpx;
							color: #fff;
							border-radius: 50rpx;
							font-size: 27rpx;
							background-color: var(--view-theme) !important;
   							 color: #fff;
							
					}
					.cancelBnt {
								border: 1rpx solid #ddd;
								color: #aaa;
								margin-right: 4.267vw;
								background-color: #fff !important;
					}
				}	
			}

			.am-list-footer {
				font-size: 3.733vw;
				color: #888;
			}
		}
</style>
