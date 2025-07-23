<template>
	<view :style="colorStyle">
		<view class='main'>
			<view class='listWrap'>
				<view class='list'>
					<view class='row  item' v-for="(item,index) in 4" :key="index">
						<view class='img'>
							<view class='liveStatus'>
								<view class="dot" style="background: rgb(255, 255, 255);"></view>
								<text>系列课</text>
							</view>
							<img mode="widthFix" src="https://data.youmi-china.com/source/image_0.2125375374241547.png">	
						</view>
						<view class='content'>
							<view class='p___3'>【演示数据】运营数据能力进阶：客户画像数据分析</view>
							<view class='footer'>
								<view class='priceBox'>
									<text class="dollar">￥</text>
									<text class="decimal">9.90</text>
								</view>
								<view class='info'>300人</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import colors from '@/mixins/color.js';
export default {
	name: 'SearchDetail',
	props: {
	
	},
	mixins: [colors],
	data() {
		return {
		};
	},
	created() {},
	mounted() {
		
	},
	methods: {
		searchBut: function() {
			this.isShow=!this.isShow
		},
	}
};
</script>

<style lang="scss">

	.searchGood{
		background:#fff;
	}
	.searchGood .search {
		padding-left: 30rpx;
	}

	.searchGood .search {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.searchGood .search .input {
		width: 598rpx;
		background-color: #f7f7f7;
		border-radius: 33rpx;
		padding: 0 35rpx;
		box-sizing: border-box;
		height: 66rpx;
	}

	.searchGood .search .input input {
		width: 472rpx;
		font-size: 28rpx;
	}

	.searchGood .search .input .placeholder {
		color: #999;
	}

	.searchGood .search .input .iconfont {
		color: #555;
		font-size: 35rpx;
	}

	.searchGood .search .bnt {
		width: 120rpx;
		text-align: center;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 30rpx;
		color: #282828;
	}

	.searchGood .title {
		font-size: 28rpx;
		color: #999;
		margin: 50rpx 30rpx 25rpx 30rpx;
	}

	.main{
		background-color: #fff;
		padding-top: 7.2vw;
		.history{
			.title {
				padding-left: 4.267vw;
				padding-right: 4.267vw;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.left {
						height: 5.867vw;
						font-size: 4.267vw;
						font-family: PingFangSC-Semibold,PingFang SC;
						font-weight: 600;
						color: #333;
						line-height: 5.867vw;
				}
			}
			.tags {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				flex-wrap: wrap;
				padding-top: 4.267vw;
				padding-left: 4.267vw;
				padding-right: 1.067vw;
				align-content: flex-start;
				.tag {
					margin-bottom: 5.333vw;
					max-width: 40%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-word;
					background: #f6f6f6;
					border-radius: 5.333vw;
					height: 7.467vw;
					line-height: 7.467vw;
					padding-left: 3.2vw;
					padding-right: 3.2vw;
					margin-right: 3.2vw;
				}
			}

		}

		.listWrap{
			background-color: #fff;		
			.list {
				padding-left: 4.267vw;
				padding-right: 4.267vw;
				flex-shrink: 0;
				background-color: #fff;
				width: 100vw;
				padding-bottom: 8.533vw;
				.header {
					font-size: 3.733vw;
					color: #999;
				}
				.row {
					width: 100%;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					img {
						object-fit: cover;
						width: 33.333vw;
						height: 18.667vw;
						border-radius: 1.067vw;
					}
					.img {
						flex-shrink: 0;
						width: 33.333vw;
						height: 155rpx;
						border-radius: 1.067vw;
						position: relative;
						.liveStatus {
							padding: 0.8vw 1.6vw;
							position: absolute;
							right: 1.067vw;
							bottom: 20rpx;
							background: rgba(0,0,0,.5);
							border-radius: 0.8vw;
							color: #fff;
							text-align: center;
							font-size: 3.2vw;
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							.dot {
									content: "";
									background-color: #fff;
									width: 1.067vw;
									height: 1.067vw;
									border-radius: 50%;
									margin-right: 0.533vw;
									vertical-align: middle;
							}
						}
						
					}
					 .content {
						margin-left: 2.133vw;
						.p___3 {
							width: 100%;
							height: 11.733vw;
							font-size: 4.267vw;
							line-height: 5.867vw;
							color: #000;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							text-overflow: ellipsis;
							word-break: break-word;
							color: #333;
						}
						.footer{
							height: 5.333vw;
							width: 100%;
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
						     .priceBox {
								display: flex;
								align-items: baseline;
								color: var(--view-theme);
								.dollar {
									font-size: 3.2vw;
								}
								.decimal {
									font-size: 4.8vw;
									font-weight: 700 !important;
								}
							}
							.info {
								font-size: 2.933vw;
								font-family: PingFangSC-Regular,PingFang SC;
								font-weight: 400;
								color: #999;
								line-height: 4.267vw;
							}
						}
					}
				}

				.footerbtm {
					padding-left: 2.133vw;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					width: 27.2vw;
					height: 8.533vw;
					background: #f6f6f6;
					border-radius: 4.267vw;
					margin: 8.533vw auto 0;
				}
				.item:not(:first-child) {
					margin-top: 4.267vw;
				}
			}
		}
	}

</style>
