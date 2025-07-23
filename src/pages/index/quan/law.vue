	<!--
	 * @Author: zhangjingyu
	 * @Date: 2025-4-9
	 * @LastEditors: zhangjingyu
	 * @FilePath: \lixue-psych-uniapp\pages\index\quan\law.vue
	 * @Description: quan首页(法律科普篇)
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
				<view class="banner">
					<image src="/static/images/banner-law@3x.png" class="img" mode="widthFix" />
				</view>
			</view>
			<view class="care-box">
				<view class="care-title">大数据统计—市民关心法律问题</view>
				<view class="main">
					<RectTreeMap :treeData="cardData" :windowWidth="windowWidth" type='law' />
				</view>
				<view class="vote-line">
					关心问题<span class="vote-btn" @click="handleVote">投票</span>
				</view>
			</view>
			<view class="bottom-placeholder"></view>
			<ContactUs style="padding:24rpx 32rpx;"></ContactUs>
			<Partners :data="['郑州大数据发展有限公司','郑州立雪智能科技研究院', '郑州市中级人民法院','郑州自贸区法院(经开区法院)']" />
			<LawVotePopup ref="votePopup" v-model="isVoteShow" />
			<!-- <AIButton /> -->
		</view>
	</template>
	<script>
		import colors from "@/mixins/color.js";
		import TabNav from "./components/TabNav.vue";
		import LawVotePopup from "@/components/lawVotePopup.vue";
		import RectTreeMap from "./components/RectTreeMap.vue";
		import Partners from "./components/Partners.vue";
		import ContactUs from '@/components/ContactUs/index.vue'
		import {
			getCategory,
			getCartCards,
		} from "@/api/quan/home.js";
		import {
			checkZHBAndLogin
		} from '@/api/quan/auth.js'
		import {
			colorList2,
			cardDatas
		} from "./mockData";
		import store from '@/store'
		import {
			treeToList
		} from '@/libs/util.js'

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
				LawVotePopup,
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
						const list = treeToList(res.data[1].children)
						this.navList = list;
						this.navItemClick(this.navList[0], 0);
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
							color: item.color ?? colorList2[index],
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
			background: #FCF9FC;
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
			background: url('/static/images/law_bg@2x.png');
			background-size: cover;
		}

		.box_2 {
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
				border-radius: 24rpx
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
				bottom: 24rpx;
				right: 26rpx;
				line-height: 92rpx;
				padding-left: 24rpx;
				border: 4rpx solid #0489F0;
				font-size: 32rpx;
				background: linear-gradient(180deg, #F2F9FF 0%, #DDF0FF 100%);
				padding-left: 56rpx;

				.vote-btn {
					font-family: PingFang-SC, PingFang-SC;
					font-weight: 700;
					color: #0489F0;
					font-weight: 500;
					font-size: 32rpx;
					line-height: 92rpx;
					cursor: pointer;
					padding-left: 16rpx;
				}
			}
		}

		.bottom-placeholder {
			height: 0;
		}
	</style>