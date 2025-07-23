<template>
	<view :style="colorStyle">
		<view class="teacherDetailsWrap">
			<view class="header detailShow">
				<img :src="vals.avatar"  class="face">
				<view class="teacherInfo">
					<view class="teacherName">
					{{vals.nickName}}
					</view>
					<view class="summary">
					{{vals.remark}}
					</view>
				</view>
			</view>
			<div class="pageDividinLine"></div>
			<view class="tabsWrap">
					<view class="tab activeTab">
						<view class="tabName">相关课程</view>
					</view>
			</view>
			<view class='listWrap'>
				<view class='list'>
					<view class='row  item' v-for="(item,index) in list" @tap="goVideo(item.number)" :key="index">
						<view class='img'>
							<view class='liveStatus'>
								<view class="dot" style="background: rgb(255, 255, 255);"></view>
								<text>视频课</text>
							</view>
							<img mode="widthFix" :src="item.imageUrl">	
						</view>
						<view class='content'>
							<view class='p___3'>{{item.name}}</view>
							<view class='footer'>
								<view class='priceBox' v-if="item.price!=0">
									<text class="dollar">￥</text>
									<text class="decimal">{{item.price}}</text>
								</view>
								<view class='priceBox' v-if="item.price==0">
									<text class="decimal">免费</text>
								</view>
								<view class='info'>{{item.virtualNum+item.actualNum}}人</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	teacherInfo,
	getCourseList
} from '@/api/course.js'
import colors from '@/mixins/color.js';
export default {
		name: 'TeacherDetail',
		props: {
		
		},
		mixins: [colors],
		data() {
			return {
				tid:0,
				vals:{},
				list:[]
			};
		},
		onLoad(options) {
			if(options.tid){
				this.tid=options.tid
			}
		},
		created() {},
		mounted() {
			this.loadTeacher()
			this.loadCourseList()
		},
		methods: {
			goVideo(number){
				uni.navigateTo({
					url: `/pages/product/product_video/index?number=${number}`
				})	
			},
			loadTeacher(){
				let that=this;
				teacherInfo(this.tid).then(res => {
					that.vals=res.data
				}).catch((error) => {
					uni.showToast({
								title: error,
								icon: 'none',
								duration: 2000
					});
				});
				
			},
			loadCourseList(){
				let that=this;
				getCourseList({pageNum:1,pageSize:10,type:"video",teacherId:this.tid}).then(res => {
					that.list=res.rows
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
	.teacherDetailsWrap {
		width: 100vw;
		min-height: 100vh;
		background: #fff;
		.detailShow {
			padding: 6.4vw 13.867vw;
			flex-direction: column;
			align-items: center;
			.teacherInfo {
				align-items: center;
				display: flex;
    			flex-direction: column;
				.teacherName {
					font-size: 4.8vw;
					color: #333;
					font-weight: 700;
					line-height: 6.667vw;
					margin-bottom: 2.133vw;
				}
				.summary {
					text-align: center;
					font-size: 3.2vw;
					color: #999;
					line-height: 4.533vw;
				}
			}
		}
		.header {
			width: 100%;
			box-sizing: border-box;
			display: flex;
			.face {
				width: 16vw;
				height: 16vw;
				border-radius: 100%;
				margin-bottom: 2.133vw;
			}
		}
		.pageDividinLine {
				width: 100%;
				height: 1.6vw;
				background: #f6f6f6;
				border-radius: 1px;
		}
		.listWrap{
			background-color: #fff;		
			.list {
				padding: 2.133vw 4.267vw 0;
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
							align-items: baseline;
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
		.tabsWrap{
			    width: 100%;
				height: 13.333vw;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				padding-left:4.267vw;
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
	}
</style>
