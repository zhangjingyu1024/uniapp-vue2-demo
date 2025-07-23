<template>
	<view class="list-box">
		<BackBtn/>
		<view class="list-title" :style="{background:color}" v-if="type!=='bottomTag'">
			<view class="title-text">
				{{title}}
			</view>
			<view class="high-incidence-age" v-if="listType==='family'">
				高发年龄段
			</view>
			<view class="high-incidence-age-list">
				<view class="age-tag" v-for="(item) in highRiskAges" :key="item.id">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="list-title-bottom-tag" :style="{background:color}" v-else>
			{{title}}
		</view>
		<List :title="title" :content="content" :listType="listType"></List>
		<Loading :loaded="loaded" :loading="loading" class="loading"></Loading>
		<!-- <AIButton /> -->
	</view>
</template>

<script>
	import {
		getCourseList,
		getHighRiskAges
	} from '@/api/quan/course.js'
	import {
		HTTP_REQUEST_URL
	} from '@/config/app'
	import Loading from '@/components/Loading/index';
	import List from './list.vue';
	export default {
		data() {
			return {
				title: '',
				color: '#FF4624',
				imgHost: HTTP_REQUEST_URL,
				loaded: false,
				loading: false,
				content: [],
				pageNum: 1,
				pageSize: 10,
				labelId: '',
				highRiskAges: [],
				type: '',
				listType: ''
			};
		},
		components: {
			Loading,
			List
		},
		created() {},

		onLoad(options) {
			if (options.color) {
				this.color = options.color
			}
			if (options.id) {
				this.labelId = options.id
			}
			if (options.type) {
				this.type = options.type
				this.title = options.name
			}
			if (options.listType) {
				this.listType = options.listType
			}
		},
		mounted() {
			this.loadHighAges()
			this.loadMore()
		},
		onReachBottom() {
			this.loadMore()
		},
		methods: {
			loadHighAges() {
				if (this.type === 'bottomTag') {
					return
				}
				getHighRiskAges({
					labelId: this.labelId
				}).then((res) => {
					this.title = res.data.name
					this.highRiskAges = res.data.highIncidenceAgeVos
				})
			},
			loadMore: async function() {
				if (this.loading || this.loaded) return;
				this.loading = true;
				const data = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					labelIds: [this.labelId],
				}

				getCourseList(data).then(res => {
					this.loading = false;
					this.loaded = res.rows.length < this.pageSize;
					this.content.push.apply(this.content, res.rows);
					this.pageNum++;
					uni.hideLoading();
				}).catch((error) => {
					this.loading = false;
					this.loaded = true;
					uni.hideLoading();
					uni.showToast({
						title: error,
						icon: 'none',
						duration: 2000
					});
				});
			},
		}
	}
</script>

<style lang="scss">
	.list-box {
		width: 100%;
		min-height: 100vh;
		background: #E7E7E7;
		padding-top: env(safe-area-inset-top);
		/* 适配 iPhone X 等设备的刘海屏 */
		padding-top: constant(safe-area-inset-top);
		/* 适配部分安卓设备的刘海屏 */
		color: #ffffff;
		border-top: 110px solid transparent;

		.list-title-bottom-tag {
			width: 702rpx;
			height: 270rpx;
			border-radius: 24rpx;
			margin: 0 auto;
			padding: 40rpx 42rpx;
			margin-bottom: 32rpx;
			font-family: PingFang-SC, PingFang-SC;
			font-weight: 800;
			font-size: 48rpx;
			color: #ffffff;
			line-height: 190rpx;
			text-align: left;
			font-style: normal;
		}

		.list-title {
			width: 702rpx;
			border-radius: 24rpx;
			margin: 0 auto;
			padding: 40rpx 42rpx;
			margin-bottom: 32rpx;

			.title-text {
				height: 66rpx;
				font-family: PingFang-SC, PingFang-SC;
				font-weight: 800;
				font-size: 48rpx;
				color: #ffffff;
				line-height: 66rpx;
				text-align: left;
				font-style: normal;
			}

			.high-incidence-age {
				height: 44rpx;
				font-family: PingFang-SC, PingFang-SC;
				font-weight: 500;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 44rpx;
				text-align: left;
				font-style: normal;
				margin-top: 12rpx;
			}

			.high-incidence-age-list {
				height: 52rpx;
				margin-top: 16rpx;
				white-space: nowrap;
				overflow-x: auto;

				.age-tag {
					width: 142rpx;
					height: 52rpx;
					background: rgba(255, 255, 255, 0.2);
					border-radius: 16rpx;
					display: inline-block;
					font-family: PingFangSC, PingFang SC;
					font-weight: 400;
					font-size: 30rpx;
					color: #FFFFFF;
					line-height: 52rpx;
					text-align: center;
					margin-right: 16rpx;
				}
			}
		}
	}
</style>