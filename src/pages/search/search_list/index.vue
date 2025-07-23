<template>
	<view :style="colorStyle">
		<view class='searchGood'>
			<view class='search acea-row row-between-wrapper'>
					<view class='input acea-row row-between-wrapper'>
						<text class='iconfont icon-sousuo'></text>
						<input type='text'  focus placeholder='请输入搜索内容' placeholder-class='placeholder' v-model="keyword"  @input="change"></input>
					</view>
					<view class='bnt' @tap='searchBut'>搜索</view>
				</view>
		</view>
		<view class='main'>
			<view class='history' v-if="isShow">
				<view class='title'>
					<view class='left'>
						历史搜索
					</view>
					<view class='left' @click="clear">
						<text class="ymfont ym-del"></text>
					</view>
				</view>
				<view class='tags'>
					<view class='tag' @click="searchHot(item)" v-for="(item,index) in searchHistory" :key="index">
						{{item}}
					</view>
					<view class='empty' v-if="searchHistory.length<=0">暂无搜索记录</view>
				</view>
			</view>
			<view class='listWrap' v-if="!isShow">
				<view class='list' v-if="courses.length>0">
					<view class='header'>
						{{courseTotal}}个相关课程
					</view>
					<view class='row  item' v-for="(item,index) in courses" :key="index" @click="goDetail(item)">
						<view class='img'>
							<view class='liveStatus'>
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
							<img mode="widthFix" :src="item.imageUrl">	
						</view>
						<view class='content'>
							<view class='p___3'>{{item.name}}</view>
							<view class='footer'>
								<view class='priceBox'>
									 <text class="dollar" v-if="item.price>0">￥</text>
									<text class="decimal" v-if="item.price>0">{{item.price}}</text>
									<text class="decimal" v-if="item.price==0">免费</text>
								</view>
								<view class='info'>{{item.virtualNum+item.actualNum}}人</view>
							</view>
						</view>
					</view>
					<view class='footerbtm' @tap="goDetailList">
						查看更多<text class="ymfont ym-arrow-rightjiantou-you2"></text>
					</view>
				</view>
				<view class='list' v-if="lives.length>0">
					<view class='header'>
						{{liveTotal}}个相关课程
					</view>
					<view class='row  item' v-for="(item,index) in lives" :key="index" @click="goDetail(item)">
						<view class='img'>
							<view class='liveStatus'>
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
							<img mode="widthFix" :src="item.imageUrl">	
						</view>
						<view class='content'>
							<view class='p___3'>{{item.name}}</view>
							<view class='footer'>
								<view class='priceBox'>
									 <text class="dollar" v-if="item.price>0">￥</text>
									<text class="decimal" v-if="item.price>0">{{item.price}}</text>
									<text class="decimal" v-if="item.price==0">免费</text>
								</view>
								<view class='info'> {{item.virtualNum+item.actualNum}}人</view>
							</view>
						</view>
					</view>
					<view class='footerbtm' @tap="goDetailList">
						查看更多<text class="ymfont ym-arrow-rightjiantou-you2"></text>
					</view>
				</view>
				<view class='list' v-if="packages.length>0">
					<view class='header'>
						{{packageTotal}}个相关课程
					</view>
					<view class='row  item' v-for="(item,index) in packages" :key="index" @click="goDetail(item)">
						<view class='img'>
							<view class='liveStatus'>
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
							<img mode="widthFix" :src="item.imageUrl">	
						</view>
						<view class='content'>
							<view class='p___3'>{{item.name}}</view>
							<view class='footer'>
								<view class='priceBox'>
									 <text class="dollar" v-if="item.price>0">￥</text>
									<text class="decimal" v-if="item.price>0">{{item.price}}</text>
									<text class="decimal" v-if="item.price==0">免费</text>
								</view>
								<view class='info'> {{item.virtualNum+item.actualNum}}人</view>
							</view>
						</view>
					</view>
					<view class='footerbtm' @tap="goDetailList">
						查看更多<text class="ymfont ym-arrow-rightjiantou-you2"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import colors from '@/mixins/color.js';
import {
  getCourseSearch,
} from '@/api/course.js'
export default {
	name: 'Search',
	props: {
	
	},
	mixins: [colors],
	data() {
		return {
			isShow:true,
			keyword:"",
			pageSize: 10,
			courses:[],
			courseTotal:0,
			lives:[],
			liveTotal:0,
			packages:[],
			packageTotal:0,
			pageNum: 1,
        	pageSize: 4,
			searchHistory:[],
		};
	},
	created() {
		let his=uni.getStorageSync('searchHistory')
		if(his!=""){
			this.searchHistory=his
		}
	},
	mounted() {
		
	},
	methods: {
		clear() {
			let that=this
			uni.showModal({
					content: "清空记录",
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							uni.removeStorageSync("searchHistory"); 
							that.searchHistory=[]
						} else if (res.cancel) {

						}
					}
				})
			
		},
		change(){
			if(this.keyword==""){
				this.isShow=true
			}
		},
		 moveOrAddToFrontSingleCorrect(arr, value) {  
			let index = arr.indexOf(value);  
			if (index === -1) {  
				// 值不存在，添加到开头  
				return [value, ...arr];  
			} else {  
				// 值存在，移除一个实例（通过 slice 忽略它），然后将其添加到开头  
				return [value, ...arr.slice(0, index), ...arr.slice(index + 1)];  
			}  
		},   
		searchHot(val){
			this.keyword=val;
			this.searchBut();
		},
		searchBut: function() {
			if(this.keyword!=''){
				let res=this.moveOrAddToFrontSingleCorrect(this.searchHistory,this.keyword)
				this.searchHistory=res
				uni.setStorageSync('searchHistory', res);	
			}
			this.isShow=false
			let that=this
			let keys={name:this.keyword,pageNum:this.pageNum,pageSize:this.pageSize}
			getCourseSearch(keys).then(res => {
					that.loading = false;
					// that.loaded = res.rows.length < that.pageSize;
					// that.content.push.apply(that.content, res.rows);
					// that.pageNum++;
					
					that.courseTotal=res.data.courseTotal
					that.courses=res.data.courses
					that.liveTotal=res.data.liveTotal
					that.lives=res.data.lives
					that.packageTotal=res.data.packageTotal
					that.packages=res.data.packages
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
			},	
		
		goDetailList: function() {
			uni.navigateTo({
				url: `/pages/search/search_detail/index`
			})
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
				.empty{
					margin:20rpx 0rpx 40rpx 0rpx;
				}
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
						flex:1;
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
