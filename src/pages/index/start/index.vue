<template>
<view class="page noRepeat ysize" :style="'min-height:'+windowHeight+'px;'">
	<view v-if="!errorNetwork" :style="colorStyle">
		<skeleton :show="showSkeleton" :isNodes="isNodes" ref="skeleton" loading="chiaroscuro" selector="skeleton"
						bgcolor="#FFF"></skeleton>
			<view class="index skeleton" :style="{visibility: showSkeleton ? 'hidden' : 'visible'}">
			<!-- #ifdef H5 -->
			<view v-for="(item, index) in styleConfig" :key="index">
				<component :is="item.name" :index="index" :dataConfig="item" @changeBarg="changeBarg"
					 :tempArr="tempArr" :iSshowH="iSshowH" 
					:isSortType="isSortType"  @bindHeight="bindHeight" :isFixed="isFixed">
				</component>
			</view>
			<!-- #endif -->
			<ymRight/>
		</view>
	</view>
</view>
</template>

<script>
import headerSerch from './components/headerSerch';//搜索
import goodList from './components/goodList';//产品
import swiperBg from './components/swiperBg';//轮播
import titles from './components/titles';//标题
import menus from './components/menus';//菜单
import pictureCube from './components/pictureCube';//图片魔方
import blankPage from './components/blankPage.vue';//辅助空白
import guide from './components/guide.vue';//辅助线
import richText from './components/richText.vue';//富文本
import pageFoot from '@/components/pageFooter/index.vue';//底部导航
import ymRight from './components/ymRight.vue';//版权
import colors from '@/mixins/color.js';
import {
	getCourseList
} from '@/api/course.js'

import {
	getIndex,
	getIndexData
} from '@/api/api.js';


export default {
	data() {
		return {
			showSkeleton: true, //骨架屏显示隐藏
			isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
			windowHeight: 0,
			videoList:[],
			setmealList:[],
			liveList:[],
			audioList:[],
			seriesList:[],
			graphicList:[],
			styleConfig:[],
			bgColor: '',
			iSshowH: false,
			tempArr: [],
			isSortType: 0,
			// #ifdef APP-PLUS || MP
			isFixed: true,
			// #endif
			// #ifdef H5
			isFixed: false,
			// #endif
			errorNetwork:false
		};
	},
	mixins: [colors],
	components: {
		headerSerch,
		pageFoot,
		goodList,
		menus,
		titles,
		pictureCube,
		blankPage,
		guide,
		richText,
		ymRight,
		swiperBg
	},
	created() {
		let that = this
			this.$nextTick(function() {
				uni.getSystemInfo({
					success: function(res) {
						that.windowHeight = res.windowHeight;
					}
				});
		})

		this.loadInit();
		this.diyData();
	},
	methods: {
		async loadInit(){
				// let that=this;
				// this.videoList=await this.loadData("video")
				// this.liveList= await this.loadData("live")
				// this.audioList=await this.loadData("audio")
				// this.seriesList=await this.loadData("series")
				// this.setmealList= await this.loadData("setmeal")
				// this.graphicList= await this.loadData("graphic")
				this.isNodes++
				setTimeout(() => {
						this.showSkeleton = false	
				}, 300)
		},
		loadData(types){
			return new Promise((resolve, reject) => {
				getCourseList({pageNum:1,pageSize:4,type:types}).then(res => {
					resolve(res.rows)
				}).catch((error) => {
					console.log(error);
					reject(error);
				});		
			})
		},
		// 对象转数组
		objToArr(data) {
			let obj = Object.keys(data);
			let m = obj.map(key => data[key]);
			return m;
		},
		bindHeighta(data) {
			// #ifdef APP-PLUS
			this.sortMpTop = data.top + data.height;
			// #endif
		},
		bindHeight(data) {
			uni.hideLoading();
			this.domOffsetTop = data.top;
		},
		diyData() {
				let that = this;
				
				getIndex().then(res => {
					uni.hideLoading()
					let dateRes=res.data
					let values=JSON.parse(dateRes.value)
					dateRes.value=values
					uni.setStorageSync('DIY_DATA', dateRes)
					console.log(dateRes)
					// setTimeout(() => {
					// 	this.isNodes++;
					// }, 0);
					// this.errorNetwork = false
					// let data = res.data;
					// if (data.is_bg_color) {
					// 	this.bgColor = data.color_picker
					// }
					// if (data.is_bg_pic) {
					// 	this.bgPic = data.bg_pic
					// 	this.bgTabVal = data.bg_tab_val
					// }
					// this.pageShow = data.is_show
					// uni.setNavigationBarTitle({
					// 	title: this.$t(res.data.title)
					// });
					let temp = [];
					let lastArr = that.objToArr(dateRes.value);
					lastArr.forEach((item, index, arr) => {
						// if (item.name == 'headerSerch') {
						// 	this.isHeaderSerch = true
						// }
						// if (item.name == 'promotionList') {
						// 	that.numConfig = item.numConfig.val;
						// 	that.goodType = item.tabConfig.list[0].link.activeVal;
						// 	that.getGroomList();
						// }
						temp = arr;
					});

					function sortNumber(a, b) {
						return a.timestamp - b.timestamp;
					}
					temp.sort(sortNumber)
					that.styleConfig = temp;
					// setTimeout(() => {
					// 	this.showSkeleton = false
					// }, 300)
					uni.stopPullDownRefresh({
						success: (e) => {},
					});
				}).catch(error => {
					// #ifdef APP-PLUS
					if (error.status) {
						uni.hideLoading()
						if (that.errorNetwork) {
							uni.showToast({
								title: this.$t(`连接失败`),
								icon: 'none',
								duration: 2000
							})
						}
						this.errorNetwork = true
						// this.showSkeleton = false;
					}
					// #endif
				});

			},
			
		
	},
	onReachBottom: function () {
	},
	// 滚动监听
	onPageScroll(e) {
		// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
		uni.$emit('scroll');
	},
	// #ifdef MP
	//发送给朋友
	onShareAppMessage(res) {
	
	},
	//分享到朋友圈
	onShareTimeline() {

	}
	// #endif
};
</script>

<style>
.fullsize {
		background-size: 100% 100%;
}
.noRepeat {
		background-repeat: no-repeat;
}
.ysize {
		background-size: 100%;
}
</style>
