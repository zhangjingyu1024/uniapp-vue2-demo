<template>
<view :style="colorStyle">
		<ymSearch/>
		<block  v-for="(item,index) in categoryList" :key="index">
			<view class="contentList">
				<view class="title">
					<view>{{item.name}}</view>
					<view><text class="iconfont icon-xiangyou"></text></view>
				</view>
			</view>
			<view class="ymProduct">
				<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;" show-scrollbar="false">
				<view class="list-box">
					<view class="item" v-for="(item) in item.courselist" @click="goProduct(item.number,item.type)" style="margin-right: 20rpx;" :key="item.id">
						<view class="imgBox">
							<img :src="item.imageUrl" />
							<view class="liveStatu ">
								<view class="dot" style="background: rgb(255, 255, 255);"></view>
								<span v-if="item.type && item.type === 'video'">视频课</span>
								<span v-if="item.type && item.type === 'audio'">音频课</span>
								<span v-if="item.type && item.type === 'graphic'">图文课</span>
								<span v-if="item.type && item.type === 'series'">系列课</span>
								<span v-if="item.type && item.type === 'setmeal'">套餐</span>
								<span v-if="item.type && item.type === 'live'">直播</span>
							</view>
						</view>
						<view class="infoBox">
							<view class="title">{{item.name}}</view>
							<view class="about acea-row row-between-wrapper">
								<view class="money" v-if="item.price!=0">
									<text class="dollar">￥</text>
									<text class="decimal">{{item.price}}</text>
								</view>
								<view class="money" v-if="item.price==0">
									<text class="decimal">免费</text>
								</view>
								<view>已售 10个</view>
							</view>
						</view>
					</view>
				</view>
				</scroll-view>
			</view>
		</block>
		<ymRight/>
		<pageFoot/>
</view>
	
</template>

<script>

import pageFoot from '@/components/pageFooter/index.vue';//底部导航
import colors from '@/mixins/color.js';
import ymApp from '@/pages/index/start/components/ymApp';
import ymSearch from '@/pages/index/start/components/ymSearch';
import ymFooter from '@/pages/index/start/components/ymFooter';
import ymRight from '@/pages/index/start/components/ymRight';
import {
	getCourseCategoryList,getCourseList
} from '@/api/course.js'
export default {
		name: 'ymProduct',
		props: {
		
		},
		mixins: [colors],
		data() {
			return {
				categoryList:[],
			};
		},
		components: {
			ymApp,
			ymSearch,
			ymRight,
			pageFoot,
			ymFooter
		},
		created() {
			this.loadInit()
		},
		mounted() {
			
		},
		methods: {
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
			async loadInit(){
				let that=this;
				let categoryList=await this.loadCategory();
				for (let item of categoryList) {
					let column = await this.loadCourseDate(item.id)
					item["courselist"]=column
				}
				this.categoryList=categoryList
			},
			loadCategory(){
					return new Promise((resolve, reject) => {
						getCourseCategoryList().then(res => {
							resolve(res.rows)
						}).catch((error) => {
							console.log(error);
							reject(error);
						});		
					})
			},
			loadCourseDate(categoryId){
				return new Promise((resolve, reject) => {
					getCourseList({categoryId:categoryId}).then(res => {
						resolve(res.rows)
					}).catch((error) => {
						console.log(error);
						reject(error);
					});		
				})
			},
		}
};
</script>

<style lang="scss">
	.contentList{
			padding: 10rpx 30rpx;
			background: #fff;
			.title{
				font-size: 36rpx;
				font-weight: 500;
				color: #303133;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				margin:10rpx 0;
			}
	}
	.ymProduct{
		padding: 10rpx 30rpx;
		background: #fff;
		.itemHeadTitle{
			font-size: 34rpx;
			font-weight: 700;
			color: #282828;
			margin-bottom: 30rpx
		}
		.list-box {
			display: flex;

			// padding: 20rpx 20rpx 0;
				.item {
				width: 300rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				position: relative;
				display: inline-block;
				flex-shrink: 0;

				.imgBox{
					 position: relative;
					 height:186rpx;
					.liveStatu{
						position: absolute;
						right: 10rpx;
						bottom: 10rpx;
						padding: 5rpx 10rpx;
						background: rgba(0,0,0,.5);
						border-radius: 8rpx;
						color: #fff;
						text-align: center;
						font-size: 24rpx;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						.dot{
								background: #fff;
								width: 10rpx;
								height: 10rpx;
								border-radius: 50%;
								margin-right:5rpx;
						}
					}
					img{
						width: 100%;
    					height: 100%;
						object-fit: cover;
						border-radius: 16rpx;
					}
				}

				.infoBox{
					padding: 10rpx 0rpx;
					.title{
						color: #222222;
						line-height: 34rpx;
						font-size: 30rpx;
						height: 68rpx;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						display: -moz-box;
						-moz-line-clamp: 2;
						-moz-box-orient: vertical;
						word-wrap: break-word;
						word-break: break-all;
						white-space: normal;
						overflow: hidden;
						margin-bottom:10rpx;
					}
					.about{
						font-size: 22rpx;
						color: #999;
						font-weight: normal;
						.money{
							display: flex;
							align-items: baseline;
							color: var(--view-theme);
							.dollar {
								font-size: 2.667vw;
							}
							.decimal {
								font-size: 3.733vw;
								font-weight: 700 !important;
							}
						}
					}
				}
			}
		}
	}
</style>
