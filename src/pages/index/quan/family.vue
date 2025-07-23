<!--
 * @Author: zhangjingyu
 * @Date: 2024-11-18
 * @LastEditors: zhangjingyu
 * @FilePath: \lixue-psych-uniapp\pages\index\quan\family.vue
 * @Description: quan首页(家庭关系篇)
-->
<template>
	<view class="rpage" :style="'min-height:' + windowHeight + 'px;'">
		<BackBtn/>
		<view class="top-bg">
			<view class="box_1">
				<view class="box_2">
					<view class="save_to_phone" @click="saveToPhone">
						<text class="iconfont icon-mingxi" style="margin-right: 16rpx"></text>
						保存到手机桌面
					</view>
				</view>
			</view>
			<TabNav :navList="navList" @itemClick="navItemClick" />
			<view class="banner">
				<image src="/static/images/banner-family@3x.png" class="img" mode="widthFix" />
			</view>
		</view>
		<view class="care-box">
			<view class="care-title">大数据统计-大家都在关心什么</view>
			<view class="main">
				<RectTreeMap :treeData="cardData" :windowWidth="windowWidth" />
			</view>
			<view class="vote-line">
				关心问题<span class="vote-btn" @click="handleVote">投票</span>
			</view>
		</view>
		<view class="bottom-box">
			<view class="bottom-box-title">专家的提醒-养娃中悔不当初的事有哪些</view>
			<view class="bottom-main">
				<view v-for="(line, index) in bottomCardData" :key="index" class="line">
					<view v-for="item in line" :key="item.name"
						:style="{ flex: item.flex, height: item.height, background: item.color }" class="bottom-cards"
						@click="handleBottomCardClick(item)">
						{{ item.name }}
					</view>
				</view>
			</view>
			<ContactUs/>
		</view>
		<view class="bottom-placeholder"></view>
		<Partners />
		<FamilyVotePopup ref="votePopup" v-model="isVoteShow" />
		<!-- <AIButton /> -->
	</view>
</template>
<script>
	import colors from "@/mixins/color.js";
	import TabNav from "./components/TabNav.vue";
	import FamilyVotePopup from "@/components/familyVotePopup.vue";
	import RectTreeMap from "./components/RectTreeMap.vue";
	import Partners from "./components/Partners.vue";
	import {
		getBottomTags,
		getCategory,
		getCartCards,
	} from "@/api/quan/home.js";
	import {
		checkZHBAndLogin
	} from '@/api/quan/auth.js'
	import {
		colorList,
		cardDatas
	} from "./mockData";
	import store from '@/store'
	import {
		treeToList
	} from '@/libs/util.js'
	import ContactUs from '@/components/ContactUs/index.vue'

	export default {
		data() {
			return {
				showSkeleton: true, //骨架屏显示隐藏
				windowHeight: 0,
				windowWidth: 0,
				cardData: [],
				bottomCardData: [],
				navList: [],
				isVoteShow: false,
			};
		},
		mixins: [colors],
		components: {
			RectTreeMap,
			TabNav,
			FamilyVotePopup,
			Partners,
			ContactUs,
		},
		mounted() {
			this.$nextTick(async () => {

				uni.getSystemInfo({
					success: (res) => {
						this.windowWidth = res.windowWidth
						this.windowHeight = res.windowHeight;
					},
				});
				this.loadInit();
				// await checkZHBAndLogin()
			});

		},
		computed: {},
		methods: {
			loadInit() {
				this.getNav();
				this.getBottomCards();
			},
			saveToPhone() {
				const isZHB = store.state.app.isZHB
				if (!isZHB) {
					const ua = navigator.userAgent;
					let os = '';
					if (/iPhone|iPad|iPod/i.test(ua)) {
						os = 'IOS系统，请在Safari浏览器中点击分享按钮，然后选择“添加到主屏幕”。';
					} else {
						os = '请在浏览器菜单中查找“添加到桌面”选项。';
					}
					uni.showToast({
						title: os,
						icon: 'none',
						duration: 3000
					});
					return
				}
				uni.showModal({
					title: '添加到桌面',
					content: '您可以将本应用添加到手机桌面，方便下次打开。',
					confirmText: '如何添加？',
					success: (res) => {
						if (res.confirm) {
							// 这里可以根据不同的操作系统，给出相应的添加步骤说明
							const ua = navigator.userAgent;
							let os = '';
							if (/iPhone|iPad|iPod/i.test(ua)) {
								os = '点击复制地址，IOS系统，请在Safari浏览器中点击分享按钮，然后选择“添加到主屏幕”。';
							} else if (/Android/i.test(ua)) {
								os = '点击复制地址，Android系统，请在浏览器菜单中查找“添加到桌面”选项。';
							}
							uni.setClipboardData({
								data: window.location.href,
								success: function() {
									console.log('success');
								}
							});
							uni.showModal({
								title: '复制地址，到浏览器打开',
								content: os,
								confirmText: '复制地址',
								success: (res) => {
									if (res.confirm) {
										uni.showToast({
											title: '复制成功！',
											icon: 'none',
										});
									}
								}
							})

						}
					}
				});
			},

			getNav(list) {
				getCategory().then((res) => {
					const list = treeToList(res.data[0].children)
					this.navList = list;
					this.navItemClick(this.navList[0], 0);
				});
			},
			getBottomCards() {
				const colorBases = [
					"linear-gradient(270deg, #FF6262, #FF2331)",
					"linear-gradient(270deg, #FFA02A, #FF712E)",
					"linear-gradient(90deg, #87CA00, #A4DB36)",
					"linear-gradient( 90deg, #2FC48C 0%, #4FE0A8 100%)",
					"linear-gradient( 270deg, #FFB946 0%, #F59D02 100%)",
					"linear-gradient( 90deg, #00B7F1 0%, #2ECDFF 100%)",
					"linear-gradient( 90deg, #A876FF 0%, #C5A4FF 100%)",
				]; // 卡片颜色
				const widthPercentage = [
					[31.25, 39.88, 14.43, 14.43],
					[38.54, 38.54, 22.92],
				]; // 每一行每一个卡片宽度占比
				const itemLineHeight = [218, 180]; // 每一行的元素高度
				const cards = [];
				getBottomTags({
						size: 4, // 需要的数据，固定一行四个不动
					})
					.then((res) => {
						const list = res.data;
						let num = 0;
						if (list.length) {
							list.forEach((ITEM, I) => {
								if (ITEM.length) {
									const line = [];
									ITEM.forEach((item, i) => {
										const itemObj = {
											...item,
											color: colorBases[num % colorBases.length],
											// 2是 widthPercentage的长度, 
											flex: widthPercentage[I % 2][i % widthPercentage[I % 2]
												.length
											],
											height: itemLineHeight[I % 2] + "rpx",
										};
										line.push(itemObj);
										num++;
									});
									cards.push(line);
								}
							});
						}
						this.bottomCardData = cards;
					})
					.finally(() => {
						this.showSkeleton = false;
					});
			},
			handleBottomCardClick(item) {
				uni.navigateTo({
					url: `/pages/list/index?color=${item.color}&id=${item.id}&name=${item.name}&type=bottomTag`
				})
			},
			handleVote() {
				this.isVoteShow = true;
			},
			navItemClick(item, indx) {
				getCartCards({
					categoryId: item.id
				}).then(res => {
					let summation = 0
					res.data.forEach(item => {
						summation += item.orderCount
					})
					this.cardData = res.data.sort((a, b) => b.orderCount - a.orderCount).map((item, index) => ({
						...item,
						color: item.color ?? colorList[index],
						value: item.orderCount,
					})).filter(v => v.orderCountPercentage >= 5)
				})
			},
		},
		onReachBottom: function() {},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit("scroll");
		},
		// #ifdef MP
		//发送给朋友
		onShareAppMessage(res) {},
		//分享到朋友圈
		onShareTimeline() {},
		// #endif
	};
</script>

<style lang="scss" scoped>
	.rpage {
		background: #f5f5f5;
		padding-top: env(safe-area-inset-top);
		/* 适配 iPhone X 等设备的刘海屏 */
		padding-top: constant(safe-area-inset-top);
		/* 适配部分安卓设备的刘海屏 */
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-size: 100%;
		width: 100vw;
	}

	.top-bg {
		background: url('/static/images/family_bg@2x.png');
		background-size: cover;
	}

	.box_2 {
		background-color: f5f5f5;
		position: relative;
		height: 126rpx;

		.save_to_phone {
			width: 288rpx;
			height: 66rpx;
			// background: #F0F0F0;
			border-radius: 16rpx;
			font-family: PingFang-SC, PingFang-SC;
			font-weight: 500;
			font-size: 30rpx;
			color: #333333;
			line-height: 42rpx;
			text-align: center;
			font-style: normal;
			line-height: 66px;
			position: absolute;
			right: 0;
			top: 36rpx;

			.iconfont {
				font-size: 30rpx;
				color: #333333;
			}
		}
	}

	.banner {
		width: 100%;
		padding: 30rpx;

		.img {
			width: 100%;
			height: auto;
			display: block;
			box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(76, 14, 0, 0.35);
			border-radius: 24rpx;
		}
	}

	.care-box {
		height: 994rpx;
		width: 100%;
		position: relative;
		padding: 0 20rpx;
		background-color: #ffffff;
		border-radius: 24rpx;
		padding-top: 32rpx;

		.care-title {
			padding-left: 12rpx;
			height: 46rpx;
			font-family: PingFang-SC, PingFang-SC;
			font-size: 34rpx;
			color: #333333;
			line-height: 46rpx;
			text-align: left;
			margin-bottom: 16rpx;
			font-weight: bold;
		}

		.main {
			width: 100%;
			height: 744rpx;
		}

		.vote-line {
			width: 312rpx;
			height: 100rpx;
			border-radius: 16rpx;
			color: #333333;
			position: absolute;
			bottom: 40rpx;
			right: 26rpx;
			line-height: 92rpx;
			padding-left: 56rpx;
			border: 4rpx solid #FF762E;
			background: linear-gradient(180deg, #FFFCFB 0%, #FFF4E8 100%);
			font-size: 32rpx;
			text-align: left;

			.vote-btn {
				font-family: PingFang-SC, PingFang-SC;
				font-weight: 700;
				color: #FF762E;
				font-weight: 500;
				font-size: 32rpx;
				line-height: 92rpx;
				text-align: center;
				cursor: pointer;
				padding-left: 16rpx;
			}
		}
	}

	.bottom-box {
		position: relative;
		background-color: rgba(255, 238, 238, 0.05);
		margin: 16rpx 0 0 0;
		padding: 32rpx 30rpx 30rpx 16rpx;
		background: #FFFFFF;
		border-radius: 16rpx;

		.bottom-box-title {
			height: 48rpx;
			font-family: PingFang-SC, PingFang-SC;
			font-weight: bold;
			font-size: 34rpx;
			color: #333333;
			line-height: 48rpx;
			text-align: left;
			font-style: normal;
			padding-left: 8rpx;
			margin-bottom: 24rpx;
		}

		.line {
			display: flex;
			justify-content: space-between;
			padding-bottom: 16rpx;

			.bottom-cards {
				border-radius: 24rpx;
				font-family: PingFang-SC, PingFang-SC;
				font-size: 36rpx;
				color: #fff;
				line-height: 40rpx;
				text-align: center;
				font-style: normal;
				margin-left: 14rpx;
				font-weight: 500;
				display: flex;
				justify-content: center;
				white-space: pre-wrap;
				align-items: center;
				padding: 10;
				cursor: pointer;
				overflow: hidden;
				box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(76, 14, 0, 0.35);
				&:nth-child(1) {
					margin-left: 0;
				}
			}
		}
	}

	.bottom-placeholder {
		height: 0;
	}
</style>