<template>
	<view :style="colorStyle">
		<view class="payment" :class="pay_close ? 'on' : ''">
			<view class="title acea-row row-center-wrapper">
				评论<text class="iconfont icon-guanbi" @click='close'></text>
			</view>
			<view class="item acea-row row-between-wrapper">
				<textarea placeholder="请填写评论信息" class="textarea" v-model="content"/>
			</view>
			<view class="button bg-color acea-row row-center-wrapper" @click='goSubmit()'>发布
			</view>
		</view>
		<view class="mask" @click='close' v-if="pay_close"></view>
	</view>
</template>

<script>
	import {
		courseReply
	} from '@/api/course.js'
	import colors from '@/mixins/color.js';
	export default {
		props: {
			pay_close: {
				type: Boolean,
				default: false,
			},
			order_id: {
				type: Number,
				default: 0
			},
		},
		mixins: [colors],
		watch: {
			pay_close: {
				handler(newV, oldValue) {
					this.content=""
				},
				immediate: true,
				deep: true
			}
		},
		data() {
			return {
				content:"",
			};
		},
		mounted() {
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
		},
		methods: {
			close: function() {
				this.$emit('onChangeFun', {
					action: 'payClose'
				});
			},
			goSubmit: function() {
				console.log(this.order_id);
				if(!this.content || !this.content.trim()) {
					this.$util.Tips({
						title: '评论内容不能为空'
					})
					return 
				}
				let data={
					content:this.content,
					goodsId:this.order_id,
					source:this.source,
					type:1,
				}
				let that=this;
				courseReply(data).then(res => {
					return that.$util.Tips({
										title: res.msg,
									}, () => {
										that.$emit('onChangeFun', {
											action: 'pay_complete'
										});
					});
				})

			},
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
		z-index: 99999;
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
		// height: 130rpx;
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
	.textarea {
		display: block;
		min-height: 192rpx;
		padding: 30rpx;
		width: 100%;
	}
</style>
