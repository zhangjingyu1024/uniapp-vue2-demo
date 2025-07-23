<template>
	<!-- 郑好学 -->
	<view class="index">
		<!-- <view :class="{'enter-item':true, [item.name]: true}" v-for="(item,index) in enterItems" :key="index" @click="handleJump(item.name)">
			<image :src="item.imgSrc" class="img" mode="widthFix"  />
			<view class="title">{{item.title}}</view>
			<view class="subTitle">{{item.subTitle}}</view>
			<view class="enter-btn"> 进入课堂</view>
		</view> -->

		<view class="enter-item-new">
			<image src="/static/images/banner_home@3x.png" class="img" mode="widthFix" />
		</view>
		<view class="card-box flex-column">
			<view class="line1 flex-row">
				<view class="kexueyuer" style="flex:0.5" @click="handleJump('family')">{{'科学\n育儿'}}</view>
				<view class="flex-column" style="flex:0.5">
					<view class="falvkepu" @click="handleJump('law')">{{'法律\n科普'}}</view>
					<view class="AIfuneng disabled" style="background-color: #8d6bfd;">
						<view class="title">AI赋能</view>
						<view class="jqqd">敬请期待</view>
					</view>
				</view>
			</view>
			<view class="line2 flex-row">
				<view class="flex-column" style="flex:0.5">
					<view class="zhengzainuanxin" @click="handleJump('zznx')">
						郑在暖心
					</view>
					<view class="jiaxiaoxietong disabled">
						<view class="title">家校协同</view>
						<view class="jqqd">敬请期待</view>
					</view>
				</view>
				<view class="yiliaojiankang disabled" style="flex:0.5">
					<view class="title">医疗健康</view>
					<view class="jqqd">敬请期待</view>
				</view>
			</view>
		</view>
		<!-- 联系我们 -->
		<ContactUs style="padding:0 32rpx;" />
		<Partners
			:data="['郑州大数据发展有限公司','郑州立雪智能科技研究院','中国医药教育协会科普委员会', '河南省儿童医院' , '360集团' ,'郑州市中级人民法院','郑州自贸区法院(经开区法院)'  ]" />
	</view>
</template>

<script>
	import ContactUs from '@/components/ContactUs/index.vue'
	import Partners from "./quan/components/Partners.vue";
	export default {
		data() {
			return {
				loading: false,
				enterItems: [{
						name: 'family',
						imgSrc: '/static/images/home_family@3x.png',
						title: '家庭关系篇',
						subTitle: '育优秀的孩子做更好的自己',
					},
					{
						name: 'law',
						imgSrc: '/static/images/home_law@3x.png',
						title: '法律科普篇',
						subTitle: '以法育人 以律正己',
					},
				]
			};
		},
		components: {
			ContactUs,
			Partners,
		},
		onLoad(options) {
			uni.hideTabBar();
			//扫码携带参数处理
			// #ifdef MP
			const queryData = uni.getEnterOptionsSync(); // uni-app版本 3.5.1+ 支持
			if (queryData.query.scene) {
				this.$Cache.set('agent_id', queryData.query.scene);
			}
			// #endif
			// #ifndef MP
			if (options.agent_id) {
				this.$Cache.set('agent_id', options.agent_id);
			}
			// #endif
			this.setOpenShare();

		},
		onShow() {

		},
		onHide() {},
		methods: {
			// 微信分享；
			setOpenShare: function() {

			},
			handleJump(name) {
				uni.navigateTo({
					url: `/pages/index/quan/${name}`
				})
			},
		},
		onReachBottom: function() {

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

<style lang="scss" scoped>
	.flex-column {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.flex-row {
		display: flex;
		width: 100%;
	}

	.disabled {
		&::after {
			content: "";
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	.card-box {
		padding: 40rpx 30rpx 16rpx 30rpx;
		width: 100vw;
		height: 936rpx;

		.line1,
		.line2 {
			height: 460rpx;
		}

		.line1 {
			margin-bottom: 16rpx;
		}

		.kexueyuer,
		.falvkepu,
		.AIfuneng,
		.zhengzainuanxin,
		.jiaxiaoxietong,
		.yiliaojiankang {
			box-shadow: 0rpx 0rpx 24rpx 0rpx rgba(76, 14, 0, 0.2);
			border-radius: 16rpx;
			text-align: center;
			height: 100%;
			color: #FFFFFF;
			position: relative;
			overflow: hidden;

			.title {
				font-size: 48rpx;
				margin-top: 42rpx;
				height: 48rpx;
			}

			.jqqd {
				margin-top: 24rpx;
				font-size: 28rpx;
			}
		}

		.kexueyuer {
			background: #FF946B;
			margin-right: 18rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			white-space: pre;
			font-family: SourceHanSansCN, SourceHanSansCN;
			font-weight: 400;
			font-size: 48rpx;
		}

		.falvkepu {
			background: #50ABF9;
			margin-bottom: 14rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			white-space: pre;
			font-family: SourceHanSansCN, SourceHanSansCN;
			font-weight: 400;
			font-size: 48rpx;
		}

		.AIfuneng {
			background: #896BFF;

		}

		.zhengzainuanxin {
			background: #FF6B8A;
			margin-bottom: 16rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			white-space: pre;
			font-family: SourceHanSansCN, SourceHanSansCN;
			font-weight: 400;
			font-size: 48rpx;
		}

		.jiaxiaoxietong {
			background: #FFBC6B;
		}

		.yiliaojiankang {
			background: #00CCA3;
			margin-left: 18rpx;

			.title {
				margin-top: 120rpx;
			}
		}
	}

	.index {
		display: flex;
		flex-direction: column;
		padding-top: 40rpx;
		background: #FFFFFF;
		min-height: 100vh;

		.enter-item-new {
			position: relative;
			margin: 0 auto;
			width: 100vw;
			height: 334rpx;

			.img {
				width: 100%;
				height: 100%;
			}
		}

		.enter-item {
			position: relative;
			border-radius: 40rpx;
			margin: 0 auto;
			width: 690rpx;
			height: 634rpx;
			text-align: center;
			font-family: SourceHanSansCN, SourceHanSansCN, 黑体;

			.img {
				width: 100%;
				height: 100%;
			}

			.title {
				position: absolute;
				top: 80rpx;
				left: 48rpx;
				height: 52rpx;
				font-size: 52rpx;
				line-height: 52rpx;
				color: #FFFFFF;
			}

			.subTitle {
				position: absolute;
				top: 164rpx;
				left: 48rpx;
				height: 34rpx;
				font-size: 34rpx;
				line-height: 34rpx;
				color: #FFFFFF;

			}

			.enter-btn {
				position: absolute;
				bottom: 80rpx;
				left: 48rpx;
				width: 224rpx;
				height: 80rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(156, 44, 0, 0.09);
				border-radius: 48rpx;
				font-family: SourceHanSansCN, SourceHanSansCN, 黑体;
				font-weight: 400;
				font-size: 30rpx;
				line-height: 80rpx;
				text-align: center;
			}
		}
	}
</style>