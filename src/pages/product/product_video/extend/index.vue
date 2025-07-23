<template>
	<view class="productDetail" :style="colorStyle">
		<view class="headerBody" v-show="val.type == 'video'">
			<img :src="val.imageUrl" v-if="playUrl == '' || playUrl == null">
			<!-- #ifdef H5  -->
			<block v-if="playUrl != '' && playUrl != null" class="video-container">
				<div id="mse" class="video-player">
				</div>
			</block>
			<!-- #endif -->
			<!-- #ifdef MP || APP-PLUS -->
			<block v-if="playUrl != '' && playUrl != null">
				<video id="myVideo" v-if="loaded" vslide-gesture="true" :src="playUrl" @error="videoErrorCallback"
					:poster="val.coverImage" @play="onPlay" @pause="onPause" @end="onEnd" :initial-time="currentTime"
					@timeupdate="onTimeUpdate">
				</video>
			</block>
			<!-- #endif -->
		</view>
		<view>
			<view class="detailsInfo">
				<view class="contentWrap">
					<view class="title">
						{{ val.name }}
					</view>
					<view class="content">
						{{ val.note }}
					</view>
					<view class="footer">
						<view class="leftFooter"></view>
						<view class="rightFoote">
							{{ val.virtualNum + val.actualNum }}人
						</view>
					</view>
				</view>
			</view>
		</view>
		<ymRight />
	</view>
</template>

<script>
//#ifdef H5
import Player from 'xgplayer';
import HlsPlugin from 'xgplayer-hls';
import 'xgplayer/dist/index.min.css';
import 'xgplayer/es/plugins/danmu/index.css'
//#endif
import buyMenu from '@/pages/product/components/buyMenu';
import colors from '@/mixins/color.js';
import ymRight from '@/pages/index/start/components/ymRight';
import detail from '@/pages/product/components/detail'
import {
	getCourseInfo,
	courseStudy
} from '@/api/course.js'
export default {
	name: 'ProductDetail',
	props: {

	},
	mixins: [colors],
	data() {
		return {
			number: 0,
			chapterNumber: 0,
			val: {
				type: "",
			},
			teacher: {
				nickName: "",
				avatar: "",
				remark: "",
				teacherId: 0,
			},
			playUrl: "",
			isPlay: false,
			currentTime: 0,
			studyTime: 0,
			upIndex: 0,
			player: null,
			loaded: false,
			constRequestFullscreenTimes: 0,
		}
	},
	components: {
		detail,
		buyMenu,
		ymRight,
	},
	created() {
	},
	onUnload() {
		this.isPlay = false
	},
	onLoad(options) {
		if (options.number) {
			this.number = options.number
		}
		if (options.chapterNumber) {
			this.chapterNumber = options.chapterNumber
		}

	},
	onReady: function (res) {

	},
	onShow() {
		//#ifdef H5
		this.loadh5()
		// #endif
		//#ifndef H5
		this.loadInit()
		// #endif
	},
	mounted() { },
	methods: {
		onPlay(event) {
			if (!this.isPlay) {
				this.isPlay = true;
				this.upIndex = this.upIndex + 1
				setTimeout(() => {
					this.upStudy(this.upIndex, 1)
				}, 1000);
				// console.log('视频开始播放', event);
			}
		},
		onPause(event) {
			this.isPlay = false;
			// console.log('视频暂停播放', event);
		},
		onEnd(event) {
			this.isPlay = false;
			this.uploadCourseStudy()
			this.currentTime = 0
			// console.log('视频播放结束', event);
		},
		onTimeUpdate(event) {
			this.currentTime = Math.floor(event.detail.currentTime)
			// console.log('视频播放时间更新', event);
		},
		async loadh5() {
			let that = this;
			uni.showLoading({
				title: '加载中'
			})
			this.val = await this.loadDate()
			if (this.val.current) {
				this.currentTime = this.val.current
			}
			if (this.val.type == "video") {
				if (that.playUrl == "" || that.playUrl == null) {
					uni.hideLoading()
					return
				}
				that.player = new Player({
					id: 'mse',
					url: that.playUrl,
					poster: that.val.coverImage,
					width: '100%',
					height: '100%',
					videoFillMode: 'contain',
					playsinline: true,
					controls: {
						autoHide: false,
						mode: 'flex',
					},
					cssfullscreen: {
						target: document.querySelector('.headerBody')
					},
					'x5-video-player-type': 'h5',
					'x5-video-player-fullscreen': false,
					'x5-video-orientation': 'portraint',
					startTime: that.currentTime,
					plugins: [HlsPlugin],
				});

				that.player.once('ready', () => {
					const fullScrBtn = document.querySelector('#mse video');
					fullScrBtn.style = "width:100%;height:100%";
					that.player.getCssFullscreen()
				})
				that.player.on('play', () => {
					// console.log('play')
					this.isPlay = true;
					this.upIndex = this.upIndex + 1
					setTimeout(() => {
						this.upStudy(this.upIndex, 1)
					}, 1000);
				})
				that.player.on('pause', () => {
					// console.log('pause')
					this.isPlay = false;
				})
				that.player.on('ended', () => {
					// console.log('ended')
					this.isPlay = false;
					this.uploadCourseStudy()
					this.currentTime = 0
				})
				that.player.on('timeupdate', (event) => {
					that.currentTime = Math.floor(event.currentTime)
					// console.log('视频播放时间更新', event);
				})

			}
			uni.hideLoading()
		},
		async loadInit() {
			uni.showLoading({
				title: '加载中'
			})
			this.val = await this.loadDate()
			uni.hideLoading()
			if (this.val.current) {
				this.currentTime = this.val.current
			}
			this.loaded = true
		},
		upStudy(index, time) {
			if (index == this.upIndex && this.isPlay) {
				this.studyTime += time
				// console.log(this.studyTime)
				this.uploadCourseStudy()
				// this.currentTime = Math.round(this.player.currentTime)
				setTimeout(() => {
					this.upStudy(index, 10)
				}, 10000);
			}
		},
		uploadCourseStudy() {
			let that = this;
			let data = {
				number: this.number,
				studyTime: this.studyTime,
				currentTime: this.currentTime,
			}
			if (this.chapterNumber) {
				data['chapterNumber'] = this.chapterNumber
			}
			return new Promise((resolve, reject) => {
				courseStudy(data).then(res => {
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			})
		},
		loadDate() {
			let that = this;
			return new Promise((resolve, reject) => {
				getCourseInfo(that.number).then(res => {
					let data = res.data

					if (data.type == "video") {
						if (data.canPlay == 1) {
							that.playUrl = data.attachmentUrl
						} else {
							that.playUrl = data.trialUrl
						}
						// if(that.playUrl==''|| that.playUrl===null){
						//   that.$util.Tips({
						//     title: "未加载到视频源"
						//   });
						// }
					}

					if (data.type != "live") { } else {
						//直播
					}
					resolve(data);
				}).catch((error) => {
					reject(error);
				});
			})
		},
		tabSelect(idx) {
			this.active = idx
		},
		videoErrorCallback: function (e) {
			console.log(e)
			uni.showModal({
				content: e.target.errMsg,
				showCancel: false
			})
		},
	}
};
</script>
<style lang="scss">
.productDetail {
	.headerBody {
		width: 100vw;
		height: 420rpx;
		position: relative;

		#vs {
			position: absolute;
			bottom: 0;
		}

		#myVideo {
			width: 100%;
			height: 100%;
		}

		img {
			width: 100%;
			height: 100%;
		}

		.playerWarp {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 420rpx;
		}

		.videoPlayBtn {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 120rpx;

			.ym-bofang1 {
				font-size: 120rpx;
				color: #fff;
				background-color: rgba(0, 0, 0, 0.5);
				border-radius: 50%;
			}

			img {
				width: 100;
				height: auto;
			}
		}

		.icon-24gf-play {
			font-size: 70rpx;
			color: #fff;
		}
	}

	.detailsInfo {
		background: #fff;
		width: 100%;
		padding-top: 10px;

		.contentWrap {
			width: 100%;
			padding: 16px 30rpx;
			box-sizing: border-box;

			.title {
				font-size: 38rpx;
				color: #333;
				line-height: 6.667vw;
				font-weight: 700;
				word-break: break-all;
			}

			.content {
				font-size: 26rpx;
				color: #999;
				line-height: 4.533vw;
				margin-top: 2.133vw;
				margin-bottom: 4.267vw;
				word-break: break-all;
			}

			.footer {
				width: 100%;
				padding: 0rpx 0rpx 40rpx 0rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 26rpx;
				color: #999;

				.leftFooter {
					color: var(--view-theme);

					.num {
						font-size: 33rpx;
						font-weight: 700 !important;
					}
				}
			}
		}
	}

	.listLineWrap {
		width: 100%;
		height: 10.667vw;
		box-sizing: border-box;
		background: #fff;
		padding: 0rpx 20rpx;

		.content {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			border-top: 1px solid #f6f6f6;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				color: rgb(206, 168, 120);
				display: flex;
				align-items: center;

				.ym-f-vip {
					font-size: 52rpx;
				}
			}
		}
	}

	.author {
		padding: 28rpx 20rpx;
		background: #fff;

		.content {
			border-radius: 12rpx;
			background: #f7f8fa;
			display: flex;
			flex-direction: column;

			.info {
				display: flex;
				flex-direction: row;
				border-bottom: 2px solid #edeef0;
				padding: 24rpx;
				box-sizing: border-box;

				.avatar {
					width: 98rpx;
					height: 98rpx;
					border-radius: 50%;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.display {
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;
					font-weight: 400;
					margin-left: 16rpx;

					.courses {
						font-size: 24rpx;
						color: #818999;
					}
				}

				.home {
					width: 162rpx;
					height: 48rpx;
					border-radius: 28rpx;
					background: #e3ebfb;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-left: auto;
					align-self: center;
					padding-left: 6rpx;
					box-sizing: border-box;
					font-size: 24rpx;
					font-weight: 400;
					line-height: 24rpx;
					color: #2f74ff;
				}
			}

			.intro {
				padding: 16rpx 24rpx;
				box-sizing: border-box;
				font-size: 24rpx;
				font-weight: 400;
				line-height: 40rpx;
				color: #818999;
			}
		}
	}

	.pageDividinLine {
		height: 15rpx;
	}

	.tabsWrap {
		width: 100%;
		height: 13.333vw;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-around;

		.tab {
			position: relative;
			width: 18.667vw;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 3.733vw;
			color: #999;

			.tabsWrap {
				font-size: 4.267vw;
				font-weight: 700;
			}

			.tabsWrap {
				font-size: 4.267vw;
				font-weight: 700;
			}

			.underline {
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

			.tabName {
				font-size: 3.733vw;

				.badge {
					font-size: 2.667vw !important;
				}
			}
		}

		.activeTab {
			color: #333;

			.tabName {
				font-size: 4.267vw !important;
				font-weight: 700 !important;
			}
		}
	}

	.contentWrap2 {

		// display: none;
		.detailWrap {
			width: 100%;
			background: #fff;
			padding-top: 20rpx;

			.recommendWrap {
				width: 100%;
				padding-left: 4.267vw;
				margin-bottom: 4.267vw;
				box-sizing: border-box;
				overflow: hidden;

				.itemContent {
					padding: 0 3.2vw 3.2vw 0;
					border-bottom: 1px solid #f6f6f6;

					.orderItem {
						display: flex;
						align-items: center;
						justify-content: space-between;
						background: #f6f6f6;
						border-radius: 1.067vw;
						height: 17.6vw;
						padding: 2.133vw;
						position: relative;

						.tag {
							width: 13.867vw;
							height: 5.867vw;
							background: hsla(0, 0%, 40%, 0.9);
							border-radius: 1.067vw 0 1.067vw 0;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 3.2vw;
							color: #fff;
							position: absolute;
							top: 0;
							left: 0;
						}

						.left {
							.img {
								width: 23.733vw;
								height: 13.333vw;
								border-radius: 0.533vw;
								overflow: hidden;

								img {
									width: 100%;
									height: 100%;
									object-fit: cover;
								}
							}
						}

						.right {
							margin-left: 2.133vw;
							flex: 1 1;
							overflow: hidden;
							display: flex;
							flex-direction: column;
							justify-content: space-between;

							.title {
								color: #333;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								-o-text-overflow: ellipsis;
								-webkit-text-overflow: ellipsis;
								-moz-text-overflow: ellipsis;
								font-weight: 700;
							}

							.ordermsg {
								display: flex;
								align-items: flex-end;
								justify-content: flex-start;

								.price {
									font-size: 3.2vw;
									color: #999;
								}
							}
						}
					}

					.orderTime {
						font-size: 3.2vw;
						color: #333;
						display: inline-block;
						margin-top: 3.2vw;
					}
				}
			}

			img {
				width: 100%;
				height: 100%;
			}
		}

		.catalogWrap {
			background: #fff;

			.header {
				width: 100%;
				height: 13.333vw;
				padding: 0 4.267vw;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.leftHeader {
					display: flex;
					align-items: center;

					.sectionNum {
						font-size: 3.2vw;
						color: #909399;
						line-height: 4.533vw;
					}
				}
			}
		}

		.content {
			width: 100%;

			.sectionWrap {
				background: #ffffff;
				padding-left: 3.2vw;

				.section {
					width: 100%;
					padding: 4.267vw 4.267vw 4.267vw 1.067vw;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.section_left {
						display: flex;

						.iconWrapsss {
							.ym-bofang {
								font-size: 40rpx;
								color: #636262;
							}

							padding: 0.533vw;
							width: 5.333vw;
							height: 5.333vw;
							position: relative;
							z-index: 6;
						}

						.sectionContent {
							flex: 1 1;
							margin-left: 2.133vw;

							.sectionName {
								font-size: 4vw;
								color: #333;
								margin-bottom: 1.6vw;
							}

							.sectionInfo {
								display: flex;
								align-items: center;
								font-size: 2.933vw;
								color: #999;
								line-height: 4.267vw;
							}
						}
					}

					.icon_box {
						.icon-suozi {
							font-size: 40rpx;
							color: #636262;
						}
					}
				}
			}
		}

		.commentWrap {
			padding-left: 4.267vw;
			box-sizing: border-box;
			background: #fff;

			.commentItem {
				width: 100%;
				padding: 4.267vw 4.267vw 4.267vw 0;
				display: flex;

				.portrait {
					height: 10.667vw;
					width: 10.667vw;
					margin-right: 2.133vw;
					border-radius: 100%;
				}

				.commentInfo {
					.header {
						width: 100%;
						height: 10.667vw;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.headerLeft {
							.nickName {
								width: 53.333vw;
								font-size: 3.733vw;
								color: #333;
								font-weight: 700;
								line-height: 5.333vw;
								margin-bottom: 1.067vw;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}

							.commentTime {
								font-size: 2.933vw;
								color: #999;
								line-height: 4.267vw;
							}
						}

						.headerRight {
							display: flex;
							align-items: center;
						}
					}

					.commentContent {
						width: 100%;
						font-size: 3.733vw;
						color: #666;
						line-height: 5.333vw;
						margin: 4.267vw 0 2.133vw;
					}
				}
			}
		}
	}

	.showContent {
		display: block;
	}

	.pageFooter {
		padding: 0 20rpx 0 30rpx;
		position: fixed;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(10px);
		z-index: 277;
		border-top: 1rpx solid #f0f0f0;
		height: 100rpx;
		display: flex;
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/

		// height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		// height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		// transform: translate3d(0, 100%, 0);
		// transition: all .3s cubic-bezier(.25, .5, .5, .9);
		.item {
			font-size: 18rpx;
			color: #666;
			width: 110rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.iconfont {
				font-size: 40rpx;
				color: #666;
			}
		}

		.bnt {
			flex: 1;

			.bnts {
				text-align: center;
				line-height: 76rpx;
				color: #fff;
				font-size: 28rpx;
				border-radius: 50rpx;
				background-color: var(--view-theme);
				flex: 1;
			}
		}
	}
}

uni-video {
	width: 100%;
	height: 100%;
}
</style>
