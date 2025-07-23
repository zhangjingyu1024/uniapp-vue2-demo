<template>
	<view v-show="!isSortType" :style="{padding:'0 '+prConfig+'px'}">
		<view class="index-product-wrapper" :class="bgStyle===0?'':'borderRadius15'"
			:style="{ marginTop: mbConfig*2 + 'rpx', background: themeColor }" v-if="tempArr.length">
			<!-- 单列 -->
			<block v-if="itemStyle == 0">
				<view class="list-box listA" :class="tempArr.length > 0 ? 'fadeIn on' : ''">
					<view class="item" :class="conStyle?'borderRadius15':''" v-for="(item, index) in tempArr"
						:key="index" @click="goDetail(item)">
						<view class="pictrue">
							<image :src="item.imageUrl" mode=""></image>
							<view class="liveStatu ">
								<view class="dot"
									style="background: rgb(255, 255, 255);"></view>
								<span v-if="item.type && item.type === 'video'">视频课</span>
								<span v-if="item.type && item.type === 'audio'">音频课</span>
								<span v-if="item.type && item.type === 'graphic'">图文课</span>
								<span v-if="item.type && item.type === 'series'">系列课</span>
								<span v-if="item.type && item.type === 'setmeal'">套餐</span>
								<span v-if="item.type && item.type === 'live' && item.liveStatus!=3">直播</span>
								<span v-if="item.type && item.type === 'live' && item.liveStatus===3 && item.playBackStatus==4">回放</span>
								<span v-if="item.type && item.type === 'live' && item.liveStatus===3 && item.playBackStatus!=4">暂无回放</span>
							</view>
						</view>
						<view class="text-info"
							style="display: flex; flex-direction: column; justify-content: space-between;">
							<view>
								<view class="title line2" v-if="titleShow">{{ item.name }}</view>
							</view>
							<view class="price" :style="'color:'+fontColor">
								<view v-if="priceShow">
									<text v-if="item.price!=0">￥</text>
									{{ item.price==0?'免费':item.price }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 两列 -->
			<block v-if="itemStyle == 1">
				<view class="list-box listC" :class="tempArr.length > 0 ? 'fadeIn on' : ''">
					<view class="item" :class="conStyle?'borderRadius15':''" v-for="(item, index) in tempArr"
						:key="index" @click="goDetail(item)">
						<view class="pictrue">
							<image :src="item.imageUrl" mode="aspectFit">
							<view class="liveStatu ">
								<view class="dot"
									style="background: rgb(255, 255, 255);"></view>
								<span v-if="item.type && item.type === 'video'">视频课</span>
								<span v-if="item.type && item.type === 'audio'">音频课</span>
								<span v-if="item.type && item.type === 'graphic'">图文课</span>
								<span v-if="item.type && item.type === 'series'">系列课</span>
								<span v-if="item.type && item.type === 'setmeal'">套餐</span>
								<span v-if="item.type && item.type === 'live' && item.liveStatus!=3">直播</span>
								<span v-if="item.type && item.type === 'live' && item.liveStatus===3 && item.playBackStatus==4">回放</span>
								<span v-if="item.type && item.type === 'live' && item.liveStatus===3 && item.playBackStatus!=4">暂无回放</span>
							</view>
						</view>
						<view class="text-info">
							<view class="title line2" v-if="titleShow">{{ item.name }}</view>
							
							<view class="price" :style="'color:'+fontColor">
								<view v-if="priceShow">
									<text v-if="item.price!=0">￥</text>
									{{ item.price==0?'免费':item.price }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 三列 -->
			<block v-if="itemStyle == 2">
				<view class="list-box listB" :class="tempArr.length > 0 ? 'fadeIn on' : ''">
					<view class="item" :class="conStyle?'borderRadius15':''" v-for="(item, index) in tempArr"
						:key="index" @click="goDetail(item)">
						<view class="pictrue">
							<image :src="item.imageUrl" mode="aspectFit"></image>
							<view class="liveStatu">
									<view class="dot"
										style="background: rgb(255, 255, 255);"></view>
									<span v-if="item.type && item.type === 'video'">视频课</span>
									<span v-if="item.type && item.type === 'audio'">音频课</span>
									<span v-if="item.type && item.type === 'graphic'">图文课</span>
									<span v-if="item.type && item.type === 'series'">系列课</span>
									<span v-if="item.type && item.type === 'setmeal'">套餐</span>
									<span v-if="item.type && item.type === 'live' && item.liveStatus!=3">直播</span>
									<span v-if="item.type && item.type === 'live' && item.liveStatus===3 && item.playBackStatus==4">回放</span>
									<span v-if="item.type && item.type === 'live' && item.liveStatus===3 && item.playBackStatus!=4">暂无回放</span>
							</view>
						</view>
						<view class="text-info"
							style="display: flex; flex-direction: column; justify-content: space-between;">
							<view>
								<view class="title line2" v-if="titleShow">{{ item.name }}</view>
							</view>
							<view class="price" :style="'color:'+fontColor">
								<view v-if="priceShow">
									<text v-if="item.price!=0">￥</text>
									{{ item.price==0?'免费':item.price }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 大图 -->
		<block v-if="itemStyle == 3 && tempArr.length" :style="{ marginTop: mbConfig + 'rpx' }">
			<view class="listBig" :class="bgStyle===0?'':'borderRadius15'" :style="{ background: themeColor }">
				<view class="itemBig" :class="conStyle?'borderRadius15':''" v-for="(item,index) in tempArr" :key="index"
					@click="goDetail(item)">
					<view class="img-box">
						<image :src="item.imageUrl" mode=""></image>
						<view class="liveStatu">
								<view class="dot"
									style="background: rgb(255, 255, 255);"></view>
								<span v-if="item.type && item.type === 'video'">视频课</span>
								<span v-if="item.type && item.type === 'audio'">音频课</span>
								<span v-if="item.type && item.type === 'graphic'">图文课</span>
								<span v-if="item.type && item.type === 'series'">系列课</span>
								<span v-if="item.type && item.type === 'setmeal'">套餐</span>
								<span v-if="item.type && item.type === 'live' && item.liveStatus!=3">直播</span>
								<span v-if="item.type && item.type === 'live' && item.liveStatus===3 && item.playBackStatus==4">回放</span>
								<span v-if="item.type && item.type === 'live' && item.liveStatus===3 && item.playBackStatus!=4">暂无回放</span>
						</view>
					</view>
					<view class="name line2"><span
							v-if="titleShow">{{item.name}}</span></view>
					<view class="price" :style="'color:'+fontColor">
					<span v-if="priceShow">
						<text v-if="item.price!=0">￥</text>
						<span class="num">{{ item.price==0?'免费':item.price }}</span>
					</span>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import {
	getCourseList
} from '@/api/course.js'
	export default {
		name: 'goodList',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			isSortType: {
				type: String | Number,
				default: 0
			}
		},
		data() {
			return {
				tempArr: [],
				mbConfig: this.dataConfig.mbConfig.val,
				numConfig: this.dataConfig.numConfig.val,
				themeColor: this.dataConfig.themeColor.color[0].item,
				itemStyle: this.dataConfig.itemStyle.type,
				sortType: this.dataConfig.goodsSort.type,
				type: this.dataConfig.tabConfig.tabVal || 0,
				selectId: this.dataConfig.selectConfig.activeValue,
				productIds: this.dataConfig.goodsList.ids || [],
				// opriceShow: this.dataConfig.opriceShow.val, //商品原价
				priceShow: this.dataConfig.priceShow.val, //商品价格
				titleShow: this.dataConfig.titleShow.val, //商品名称
				// couponShow: this.dataConfig.couponShow.val, //商品优惠券
				prConfig: this.dataConfig.prConfig.val, //左右边距
				bgStyle: this.dataConfig.bgStyle.type, //背景样式
				conStyle: this.dataConfig.conStyle.type, //内容样式
				fontColor: this.dataConfig.fontColor.color[0].item,
				labelColor: this.dataConfig.labelColor.color[0].item
			};
		},
		created() {},
		mounted() {
			this.productslist();
		},
		methods: {
			productslist() {
				let limit = this.$config.LIMIT;
				let data = {};
				if (this.type == 1) {
					data = {
						ids: this.productIds.join(','),
					};
				} else {
					data = {
						priceOrder: this.sortType == 2 ? 'desc' : '',
						salesOrder: this.sortType == 1 ? 'desc' : '',
						categoryId: this.selectId || 0,
						pageSize: this.numConfig
					};
				}
				getCourseList(data).then(res => {
					console.log(res.data)
					this.tempArr = res.rows;
				});
			},
			goDetail(item) {
				// this.$emit('detail', item);
				if (item.type == "series") {
					uni.navigateTo({
					url: `/pages/product/product_series/index?number=${item.number}`
					})
				} else if (item.type == "video") {
					uni.navigateTo({
					url: `/pages/product/product_video/index?number=${item.number}`
					})
				} else if (item.type == "audio") {
					uni.navigateTo({
					url: `/pages/product/product_audio/index?number=${item.number}`
					})
				} else if (item.type == "live") {
					uni.navigateTo({
					url: `/pages/product/product_live/index?number=${item.number}`
					})
				} else if (item.type == "setmeal") {
					uni.navigateTo({
					url: `/pages/product/product_setmeal/index?number=${item.number}`
					})
				} else {
					uni.navigateTo({
					url: `/pages/product/product_video/index?number=${item.number}`
					})
				}
			}
		}
	};
</script>

<style lang="scss">
	.listBig {
		padding: 1px 20rpx 20rpx 20rpx;

		.borderRadius15 {
			image {
				border-radius: 20rpx 20rpx 0 0;
			}
		}

		.itemBig {
			width: 100%;
			margin-top: 20rpx;
			background-color: #fff;
			padding-bottom: 15rpx;

			.img-box {
				width: 100%;
				height: 340rpx;
				position: relative;

				.pictrue_log_big {
					border-radius: 20rpx 0 20rpx 0;
				}

					
				.liveStatu {
					position: absolute;
					right: 10rpx;
					bottom: 10rpx;
					padding: 5rpx 10rpx;
					background: rgba(0, 0, 0, 0.5);
					border-radius: 8rpx;
					color: #fff;
					text-align: center;
					font-size: 24rpx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					.dot {
						background: #fff;
						width: 10rpx;
						height: 10rpx;
						border-radius: 50%;
						margin-right: 5rpx;
					}
				}

				image {
					width: 100%;
					height: 100%;
				}
			}

			.name {
				font-size: 28rpx;
				font-weight: bold;
				margin-top: 16rpx;
				padding: 0 8px;

				.coupon {
					display: inline-block;
					text-align: center;
					width: 32rpx;
					border-radius: 4rpx;
					font-size: 20rpx;
					font-weight: normal;
					margin-right: 10rpx;
				}
			}

			.price {
				font-weight: bold;
				font-size: 12px;
				margin-top: 10rpx;
				padding: 0 8px;

				.num {
					font-size: 32rpx;
					margin-right: 10rpx;
				}

				.old-price {
					color: #aaa;
					font-weight: normal;
					text-decoration: line-through;
				}
			}
		}
	}

	.index-product-wrapper {

		.list-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 20rpx 20rpx 0;

			.item {
				width: 345rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				overflow: hidden;
				position: relative;

				&.on {
					border-radius: 0;
				}

				.pictrue {
					width: 347rpx;
					height: 347rpx;
				}

				.pictrue_log {
					width: 92rpx;
					height: 44rpx;
					font-size: 26rpx;
					line-height: 44rpx;
					border-radius: 0 0 20rpx 0 !important;
				}

				image {
					// height: 346rpx;
					// width: 347rpx;
					// height: 347rpx;
					width: 100%;
					height: 100%;
					display: block;
				}

				.text-info {
					padding: 10rpx 20rpx 15rpx;

					.title {
						color: #222222;
						line-height: 34rpx;
						height: 68rpx;
					}

					.old-price {
						margin-top: 4rpx;
						font-size: 20rpx;
						color: #aaaaaa;
						text-decoration: line-through;

						text {
							margin-right: 2px;
							font-size: 20rpx;
						}
					}

					.price {
						display: flex;
						align-items: flex-end;
						font-size: 36rpx;
						font-weight: 550;
						margin-top:10rpx;
						text {
							padding-bottom: 4rpx;
							font-size: 26rpx;
							font-weight: normal;
						}

						.txt {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 28rpx;
							height: 28rpx;
							margin-left: 15rpx;
							margin-bottom: 10rpx;
							border-radius: 4rpx;
							font-size: 20rpx;
							font-weight: normal;

							&.on {
								margin-left: 0;
							}
						}
					}
				}
			}

			&.on {
				display: flex;
			}

			&.listA {
				.item {
					display: flex;
					width: 100%;

					.pictrue {
						width: 260rpx !important;
						height: 160rpx !important;
						position: relative;
						image {
							border-radius: 16rpx;
						}
						.liveStatu {
							position: absolute;
							right: 10rpx;
							bottom: 10rpx;
							padding: 5rpx 10rpx;
							background: rgba(0, 0, 0, 0.5);
							border-radius: 8rpx;
							color: #fff;
							text-align: center;
							font-size: 24rpx;
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							.dot {
								background: #fff;
								width: 10rpx;
								height: 10rpx;
								border-radius: 50%;
								margin-right: 5rpx;
							}
						}
					}

					.text-info {
						// width: 490rpx;
						flex: 1
					}
				}
			}

			&.listC {
				.item {
					width: 48.5%;
				}

				.pictrue {
					width: 100%;
					 height: 190rpx;
					 position: relative;
					 image {
						border-radius: 16rpx;
					}
					
					 .liveStatu {
						position: absolute;
						right: 10rpx;
						bottom: 10rpx;
						padding: 5rpx 10rpx;
						background: rgba(0, 0, 0, 0.5);
						border-radius: 8rpx;
						color: #fff;
						text-align: center;
						font-size: 24rpx;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						.dot {
							background: #fff;
							width: 10rpx;
							height: 10rpx;
							border-radius: 50%;
							margin-right: 5rpx;
						}
					}
				}
			}

			&.listB {
				justify-content: inherit;

				.item {
					width: 31.6%;
					margin-right: 16rpx;

					.pictrue {
						width: 100%;
						height: 120rpx;
						position: relative;
						 image {
							border-radius: 16rpx;
						}

						.liveStatu {
						position: absolute;
						right: 10rpx;
						bottom: 10rpx;
						padding: 5rpx 10rpx;
						background: rgba(0, 0, 0, 0.5);
						border-radius: 8rpx;
						color: #fff;
						text-align: center;
						font-size: 24rpx;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						.dot {
							background: #fff;
							width: 10rpx;
							height: 10rpx;
							border-radius: 50%;
							margin-right: 5rpx;
						}
					}
						
					}

					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}
	}
</style>
