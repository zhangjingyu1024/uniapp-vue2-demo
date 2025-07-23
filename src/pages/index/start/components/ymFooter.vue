<template>
	
	<view class="page-footer" id="target">
		<view class="foot-item" v-for="(item, index) in route"  @click="goRouter(item)" :key="index">
				<block v-if="item.link == activityTab">
					<image :src="item.imgList[0]" class="active"></image>
					<view class="txt" style="color:rgb(252,107,6,1)">{{ item.name }}</view>
				</block>
				<block v-else>
					<image :src="item.imgList[1]"></image>
					<view class="txt" style="color:#606266">{{ item.name }}</view>
				</block>
		</view>
	</view>
	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getNavigation } from '@/api/public.js';
import { getCartCounts } from '@/api/order.js';
export default {
	name: 'ymFooter',
	props: {
		
	},
	data() {
		return {
			route:[
				{
					link:"/pages/index/index",
					name:"首页",
					imgList:["https://data.youmi-china.com/source/h1.png","https://data.youmi-china.com/source/h.png"],

				},
				{
					link:"/pages/product/product_category/index",
					name:"课程",
					imgList:["https://data.youmi-china.com/source/ke1.png","https://data.youmi-china.com/source/ke.png"],

				},
				{
					link:"/pages/userinfo/index",
					name:"我的",
					imgList:["https://data.youmi-china.com/source/us1.png","https://data.youmi-china.com/source/us.png"],

				}
			]
		};
	},
	computed: mapGetters(['activityTab']),

	watch: {
		activityTab: {
			handler(nVal, oVal) {},
			deep: true
		},
	},
	created() {
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		let curRoute = routes[routes.length - 1].route; //获取当前页面路由
		this.$store.commit('ACTIVITYTAB', '/' + curRoute);
		uni.$on('uploadFooter', () => {
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let curRoute = routes[routes.length - 1].route; //获取当前页面路由
			this.$store.commit('ACTIVITYTAB', '/' + curRoute);
		});
	},
	onShow() {},
	mounted() {
		uni.hideTabBar();
	},
	onHide() {
		
	},
	methods: {
		goRouter(item) {
			var pages = getCurrentPages();
			var page = pages[pages.length - 1].route;
			this.$store.commit('ACTIVITYTAB', item.link);
			uni.switchTab({
				url: item.link,
				fail(err) {
					uni.redirectTo({
						url: item.link
					});
				}
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.page-footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: space-around;
	flex-wrap: nowrap;
	width: 100%;
	height: 98rpx;
	height: calc(98rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
	height: calc(98rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	box-sizing: border-box;
	border-top: solid 1rpx #f3f3f3;
	backdrop-filter: blur(10px);
	background-color: #fff;
	box-shadow: 0px 0px 17rpx 1rpx rgba(206, 206, 206, 0.32);
	padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
	padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
	// transform: translate3d(0, 100%, 0);
	// transition: all .3s cubic-bezier(.25, .5, .5, .9);

	.foot-item {
		display: flex;
		width: max-content;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		width: 100%;
		height: 100%;

		.active {
			animation: mymove 1s 1;
		}

		@keyframes mymove {
			0% {
				transform: scale(1);
				/*开始为原始大小*/
			}

			10% {
				transform: scale(0.8);
			}

			30% {
				transform: scale(1.1);
				/*放大1.1倍*/
			}

			50% {
				transform: scale(0.9);
				/*放大1.1倍*/
			}

			70% {
				transform: scale(1.05);
			}

			90% {
				transform: scale(1);
			}
		}
	}

	.foot-item image {
		height: 40rpx;
		width: 40rpx;
		text-align: center;
		margin-bottom: 10rpx;
	}

	.foot-item .txt {
		font-size: 24rpx;
	}
}
</style>
