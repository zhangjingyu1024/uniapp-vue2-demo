<template>
	<view>
		<BackBtn/>
		<view class="detailsInfo">
			<view class="contentWrap">
				<view class="title">
					{{val.name}}
				</view>
				<view class="content">
					{{val.note}}
				</view>
				<!-- 隐藏是否付费 -->
				<view class="footer">
					<view class="leftFooter" v-if="val.price!=0">
						<!-- ￥<text class="num">{{val.price}}</text> -->
					</view>
					<view class="leftFooter" v-if="val.price==0">
						<!-- <text class="num">免费</text> -->
					</view>
					<view class="rightFoote">
						{{val.actualHits}}人
					</view>
				</view>
			</view>
		</view>
		<!-- 隐藏会员信息 -->
		<!-- <view class="listLineWrap"
          v-if="val.isVip==1">
      <view class="content"
            @tap="goVip">
        <view class="left">
          <text class="ymfont ym-f-vip"></text>会员免费
        </view>
        <view class="right">
          <text class="iconfont icon-xiangyou"></text>
        </view>
      </view>
    </view> -->
		<div class="pageDividinLine" v-if="teacher.nickName!=''"></div>
		<!-- <view class="author"
          v-if="teacher.nickName!=''">
      <view class="content"
            @tap="goTeacher(teacher.teacherId)">
        <view class="info">
          <view class="avatar"><img :src="teacher.avatar"></view>
          <view class="display">
            <view class="nickaname">{{teacher.nickName}}</view>
            <view class="courses">主讲师</view>
          </view>
          <view class="home">
            讲师主页<text class="ymfont ym-arrow-rightjiantou-you2"></text>
          </view>
        </view>
        <view class="intro">{{teacher.remark}}</view>
      </view>
    </view> -->
		<div class="pageDividinLine"></div>
		<view class="tabsWrap">
			<view class="tab" @click='tabSelect(0)' :class="active==0?'activeTab':''">
				<view class="tabName">详情</view>
				<view class="underline" v-if="active==0"></view>
			</view>
			<view class="tab" @click='tabSelect(1)' :class="active==1?'activeTab':''" v-if="type=='series'">
				<view class="tabName">目录</view>
				<view class="underline" v-if="active==1"></view>
			</view>
			<view class="tab" @click='tabSelect(3)' :class="active==3?'activeTab':''" v-if="type=='setmeal'">
				<view class="tabName">课程</view>
				<view class="underline" v-if="active==3"></view>
			</view>
			<view class="tab" @click='tabSelect(2)' :class="active==2?'activeTab':''">
				<view class="tabName">评论<text class="badge">({{replyCount}})</text></view>
				<view class="underline" v-if="active==2"></view>
			</view>
		</view>
		<!--详情-->
		<view class="contentWrap2" v-if="active==0">
			<view class="detailWrap">
				<view class="recommendWrap" v-if="val.examId">
					<view class="itemContent">
						<view class="orderItem" @tap="goExam(val)">
							<div class="tag">题库</div>
							<view class="left">
								<view class="img"><img mode="widthFix" :src="val.examImage"></view>
							</view>
							<view class="right">
								<view class="title">{{val.examName}}</view>
							</view>
							<view class="iconl">
								<text class="iconfont icon-xiangyou"></text>
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="recommendWrap">
          <view class="itemContent">
            <view class="orderItem"
                  @tap="goExam">
              <div class="tag">题库</div>
              <view class="left">
                <view class="img"><img mode="widthFix"
                       src="https://data.youmi-china.com/source/image_0.2125375374241547.png"></view>
              </view>
              <view class="right">
                <view class="title">【演示数据】运营数据能力进阶：客户画像数据分析</view>
              </view>
              <view class="iconl">
                <text class="iconfont icon-xiangyou"></text>
              </view>
            </view>
          </view>
        </view> -->
				<view class="media-wrap image-wrap">
					<!-- #ifndef APP-PLUS -->
					<parser :html="content" ref="article" :tag-style="tagStyle"></parser>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<view class="description" v-html="content"></view>
					<!-- #endif -->
					<view class="courseware" @tap="kejian" v-if="val.wareType!=0">
						<view class="acea-row row-middle"><text class="ymfont ym-kejianda"></text>课件</view>
						<view><text class="ymfont ym-fuzhi"></text></view>
					</view>
					<view class="permission" v-if="val.type=='graphic' && val.canPlay==0">
						<view><text class="ymfont ym-dingdan"></text></view>
						<view class="tip">付费后有权限阅读全文</view>
					</view>
				</view>
			</view>
		</view>
		<!--课程-->
		<view class="contentWrap2 " v-if="active==1">
			<view class="catalogWrap">
				<view class="header">
					<view class="leftHeader"><text class="sectionNum">共6节课</text></view>
				</view>
				<view class="content" v-for="(childs,index) in lableDate" :key="index">
					<view class="chapterHeader" @click="open(childs)">
						<text class="iconfont" :class="childs.open?'icon-xiangxia':'icon-xiangyou'"></text>
						<view class="chapterName">{{childs.name}}</view>
					</view>
					<view class="sectionWrap" v-if="childs.open">
						<view class="section" v-for="(item,index2) in childs.child" @click="goVideo(item)"
							:key="index2">
							<view class="section_left">
								<view class="iconWrapsss">
									<text class="ymfont ym-bofang"></text>
								</view>
								<view class="sectionContent">
									<view class="sectionName">
										{{item.name}}
									</view>
									<view class="sectionInfo">
										{{item.totalTime}}
									</view>
								</view>
							</view>
							<view class="icon_box">
								<text class="iconfont icon-suozi"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--套餐下的课程-->
		<view class="contentWrap2" v-if="active==3">
			<view class='listWrap'>
				<view class='list'>
					<view class='row  item' v-for="(item) in setmealList" @tap="goProduct(item.number,item.type)" :key="item.id">
						<view class='img'>
							<view class='liveStatus'>
								<view class="dot" style="background: rgb(255, 255, 255);"></view>
								<text>{{detailTypeMail(item.type)}}</text>
							</view>
							<img mode="widthFix" src="https://data.youmi-china.com/source/image_0.2125375374241547.png">
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
				</view>
			</view>
		</view>
		<!--评论-->
		<view class="contentWrap2" v-if="active==2">
			<view class="commentWrap">
				<view class="commentItem" v-for="(item, index) in replayList" :key="index">
					<img :src="item.userAvatar" alt=" " class="portrait">
					<view class="commentInfo">
						<view class="header">
							<view class="headerLeft">
								<view class="nickName">{{item.userName}}</view>
								<view class="commentTime">{{item.createTime}}</view>
							</view>
						</view>
						<view class="commentContent">{{item.content}}</view>
					</view>
				</view>

			</view>
		</view>
		<FamilyVotePopup ref="votePopup" v-model="isVoteShow" v-if="listType==='family'" />
		<LawVotePopup ref="votePopup" v-model="isVoteShow" v-if="listType==='law'" />
		<!-- <AIButton /> -->
	</view>
</template>

<script>
	import {
		getCourseChapterLabel,
		getCourseReplyList,
		getSetmealList,
		getCourseChapterCatalog

	} from '@/api/course.js'
	import parser from '@/components/jyf-parser/jyf-parser';
	import FamilyVotePopup from "@/components/familyVotePopup.vue";
	import LawVotePopup from "@/components/lawVotePopup.vue";
	export default {
		props: {
			val: {
				type: Object,
				default: () => {}
			},
			type: {
				type: String,
				default: "video"
			}
		},
		watch: {
			val: {
				handler(nVal, oVal) {
					//图文课控制内容显示隐藏
					this.content = nVal.content
					if (nVal.type == "graphic") {
						//立即购买
						if (nVal.canPlay == 0) {
							this.content = nVal.trialContent
						}
					}
					this.loadData();
					this.loadReplay();
					this.loadSetmeal();
				},
				deep: true
			},
		},
		data() {
			return {
				active: 0,
				replyCount: 0, //评论数
				isVoteShow: false,
				tagStyle: {
					img: 'width:100%;display:block;',
					table: 'width:100%',
					video: 'width:100%;height:100%;'
				},
				content: "",
				lableDate: [],
				replayList: [],
				setmealList: [],
				pageNum: 1,
				pageSize: 10,
				teacher: {
					nickName: "",
					avatar: "",
					remark: "",
					teacherId: 0,
				},
				listType: ''
			};
		},
		components: {
			parser,
			FamilyVotePopup,
			LawVotePopup,
		},
		created() {

		},
		mounted() {
			uni.$on('concern', this.handleVote);
		},
		methods: {
			kejian() {
				//canPlay: 1 不需要付费
				//canPlay: 0.  课件下载 wareDownload 1免费 0购买
				if (this.val.canPlay == 1) {
					this.loadDown()
				} else {
					if (this.val.wareDownload == "1") {
						this.loadDown()
					} else {
						this.$util.Tips({
							title: '课件需要购买课程后查看'
						});
					}
				}

			},
			handleVote(params) {
				this.listType = params.type
				setTimeout(() => {
					this.isVoteShow = true
				}, 300)
			},
			loadDown() {
				// #ifdef APP-PLUS
				plus.runtime.openWeb(this.val.wareAddress);
				// #endif
				// #ifndef APP-PLUS
				uni.setClipboardData({
					data: this.val.wareAddress,
					success: () =>
						uni.showToast({
							title: '链接已复制'
						})
				})
				// #endif
			},
			loadReplay() {
				let data = {
					goodsId: this.val.id,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				}
				let that = this;
				getCourseReplyList(data).then(res => {
					// that.replayList = res.rows;
					that.replayList.push.apply(that.replayList, res.rows);
					that.replyCount = res.total
					that.pageNum++;
				}).catch((error) => {
					uni.showToast({
						title: error,
						icon: 'none',
						duration: 2000
					});
				});
			},
			loadTeacher(val) {
				//其他
				if (val.teacherId != null && val.teacherId != "") {
					this.teacher.nickName = val.teacherName
					this.teacher.avatar = val.teacherAvatar
					this.teacher.teacherId = val.teacherId
					this.teacher.remark = val.teacherRemark
				} else if (val.teachers.length > 0) {
					this.teacher.nickName = val.teachers[0].nickName
					this.teacher.avatar = val.teachers[0].avatar
					this.teacher.teacherId = val.teachers[0].teacherId
					this.teacher.remark = val.teachers[0].remark
				}
			},
			tabSelect(idx) {
				if (idx == 3) {
					this.pageNum = 1;
					this.replayList = []
					this.loadReplay()
				}
				this.active = idx
			},
			open(item) {
				if (item.open == false) {
					this.loadCatalog(item)
				}
				item.open = !item.open

			},
			loadData() { //目录
				// #ifdef H5
				this.setOpenShare(this.val);
				// #endif
				let that = this
				this.loadTeacher(this.val)
				console.log(this.val.number)
				getCourseChapterLabel(this.val.number).then(res => {
					let reslist = res.rows;
					reslist.map(function(item) {
						item["open"] = false;
						item["child"] = [];
					})
					that.lableDate = reslist
				}).catch((error) => {
					uni.showToast({
						title: error,
						icon: 'none',
						duration: 2000
					});
				});
			},
			loadSetmeal() {
				let that = this
				this.loadTeacher(this.val)
				console.log(this.val.number)
				getSetmealList(this.val.number).then(res => {
					let reslist = res.rows;
					that.setmealList = reslist
				}).catch((error) => {
					uni.showToast({
						title: error,
						icon: 'none',
						duration: 2000
					});
				});
			},
			loadCatalog(item) {
				let that = this
				getCourseChapterCatalog({
					number: this.val.number,
					labelId: item.id
				}).then(res => {
					let reslist = res.rows;
					item.child = reslist
					console.log(reslist)
				}).catch((error) => {
					uni.showToast({
						title: error,
						icon: 'none',
						duration: 2000
					});
				});
			},
			goVideo(item) {
				// 1-视频课，2-音频课，3-图文课,4-大班直播，5-视频，6-音频。还没有补全
				if (item.type == "1") {
					uni.navigateTo({
						url: `/pages/product/product_video/index?number=${item.number}`
					})
				} else if (item.type == "2") {
					uni.navigateTo({
						url: `/pages/product/product_audio/index?number=${item.number}`
					})
				} else if (item.type == "4") {
					uni.navigateTo({
						url: `/pages/product/product_live/index?number=${item.number}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/product/product_video/index?number=${item.number}`
					})
				}
			},
			goTeacher: function(teacherId) {
				uni.navigateTo({
					url: `/pages/product/teacher_detail/index?tid=${teacherId}`
				})
			},
			goVip: function() {
				uni.navigateTo({
					url: `/pages/vip/index`
				})
			},
			goExam: function(val) {
				uni.navigateTo({
					url: `/pages/exam/exam_list/index?examId=${val.examId}&number=${this.val.number}`
				})
			},
			goProduct(number, type) {
				if (type == "series") {
					uni.navigateTo({
						url: `/pages/product/product_series/index?number=${number}`
					})
				} else if (type == "video") {
					uni.navigateTo({
						url: `/pages/product/product_video/index?number=${number}&chapterNumber=${this.val.number}`
					})
				} else if (type == "audio") {
					uni.navigateTo({
						url: `/pages/product/product_audio/index?number=${number}`
					})
				} else if (type == "live") {
					uni.navigateTo({
						url: `/pages/product/product_live/index?number=${number}`
					})
				} else if (type == "setmeal") {
					uni.navigateTo({
						url: `/pages/product/product_setmeal/index?number=${number}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/product/product_video/index?number=${number}`
					})
				}

			},
			detailTypeMail(type) {
				if (type == 'video') {
					return "视频课"
				}
				if (type == 'audio') {
					return "音频课"
				}
				if (type == 'graphic') {
					return "图文课"
				}
				if (type == 'series') {
					return "系列课"
				}
				if (type == 'setmeal') {
					return "套餐"
				}
				if (type == 'card') {
					return "会员卡"
				}
			},
			// #ifdef H5
			// 微信分享；
			setOpenShare: function(val) {
				let that = this;
				if (that.$wechat.isWeixin()) {
					let configAppMessage = {
						desc: val.shareDesc,
						title: val.shareTitle,
						imgUrl: val.shareUrl
					};
					that.$wechat.wechatEvevt(['updateAppMessageShareData', 'updateTimelineShareData',
							'onMenuShareAppMessage', 'onMenuShareTimeline'
						],
						configAppMessage);
				}
			}
			// #endif
		},


	};
</script>

<style lang="scss">
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
			padding: 0 30rpx;
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
				color: #666;
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
				color: #666;

				.leftFooter {
					/*#ifndef APP-NVUE*/
					color: var(--view-theme);

					/*#endif*/
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
		background-color: #E7E7E7;
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
			color: #333;

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
				/*#ifndef APP-NVUE*/
				background: var(--view-theme) !important;
				/*#endif*/
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
			color: #000;
			font-weight: 600;

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
			color: #bcbbc1;

			.recommendWrap {
				width: 100%;
				padding-left: 4.267vw;
				// margin-bottom: 4.267vw;
				box-sizing: border-box;
				overflow: hidden;

				.itemContent {
					padding: 0 3.2vw 3.2vw 0;

					// border-bottom: 1px solid #f6f6f6;
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

					/*#ifndef APP-NVUE*/
					.orderTime {
						font-size: 3.2vw;
						color: #333;
						display: inline-block;
						margin-top: 3.2vw;
					}

					/*#endif*/
				}
			}

			.media-wrap {
				padding: 4.267vw 4.2vw 8.533vw;

				.courseware {
					width: 91.467vw;
					height: 10.667vw;
					padding: 0 3.2vw 0 4.267vw;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: #f6f6f6;
					border-radius: 1.067vw;
					margin: 8.533vw 4.267vw 0;

					.ym-fuzhi {
						font-size: 30rpx;
					}

					.ym-kejianda {
						font-size: 40rpx;
						/*#ifndef APP-NVUE*/
						color: var(--view-theme);
						/*#endif*/
						margin-right: 10rpx;
					}
				}

				.permission {
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-top: 8.533vw;
					font-size: 3.733vw;
					color: #333;
					line-height: 5.333vw;

					.tip {
						margin-top: 4.267vw;
					}

					.ym-dingdan {
						font-size: 70rpx;
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

			.chapterHeader {
				width: 100vw;
				height: 14.4vw;
				padding: 0 4.267vw;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				border-bottom: 1px solid #f6f6f6;

				.chapterName {
					width: 0;
					font-size: 4.267vw;
					color: #333;
					line-height: 5.867vw;
					font-weight: 700;
					flex: 1 1;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-left: 2.133vw;
				}
			}

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
								color: #666;
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

		.listWrap {
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
							background: rgba(0, 0, 0, 0.5);
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
								/*#ifndef APP-NVUE*/
								vertical-align: middle;
								/*#endif*/
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

						.footer {
							height: 5.333vw;
							width: 100%;
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;

							.priceBox {
								display: flex;
								align-items: baseline;
								/*#ifndef APP-NVUE*/
								color: var(--view-theme);

								/*#endif*/
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
								font-family: PingFangSC-Regular, PingFang SC;
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
					background: #E7E7E7;
					border-radius: 4.267vw;
					margin: 8.533vw auto 0;
				}

				.item:not(:first-child) {
					margin-top: 4.267vw;
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
		background-color: f5f5f5;
		backdrop-filter: blur(10px);
		z-index: 277;
		border-top: 1rpx solid #f0f0f0;
		height: 100rpx;
		display: flex;
		height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/

		// height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
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
				/*#ifndef APP-NVUE*/
				background-color: var(--view-theme);
				/*#endif*/
				flex: 1;
			}
		}
	}
</style>