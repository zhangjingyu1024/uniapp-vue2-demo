<template>
  <view class="productDetail"
        :style="colorStyle">
    <view class="headerBody audio"
          v-if="val.type=='audio'">
      <img :src="val.imageUrl">
    </view>
    <audiod @uploadCourseStudy="uploadCourseStudy"
            @loginCheck="loginCheck"
            :musicList="musicList"
            :oldCurrentTime="oldCurrentTime"
            :totalTime="totalTime"
            ref="adres"
            v-if="musicList.length>0" />
    <detail :val="val"
            type="audio"></detail>
    <ymRight />
    <buyMenu :val="val"
             type="video"></buyMenu>
  </view>
</template>

<script>
import audiod from '@/pages/product/product_audio/audio';
import colors from '@/mixins/color.js';
import ymRight from '@/pages/index/start/components/ymRight';
import detail from '@/pages/product/components/detail'
import buyMenu from '@/pages/product/components/buyMenu';
import { toLogin } from '@/libs/login.js';
import {
  getCourseInfo,
  courseStudy,
  loginCheck
} from '@/api/course.js'
import {
  mapGetters
} from "vuex"
export default {
  name: 'ProductDetail',
  computed: mapGetters(['isLogin']),
  props: {

  },
  mixins: [colors],
  data () {
    return {
      number: 0,
      oldCurrentTime: 0,
      totalTime: 0,
      val: {
        type: "",
      },
      musicList: [],
      canPlay: 0
      //  url: "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/audio.mp3",
    }
  },
  components: {
    ymRight,
    detail,
    buyMenu,
    audiod
  },
  created () {

  },
  onLoad (options) {
    if (options.number) {
      this.number = options.number
    }
    this.loadInit()
  },
  onReady: function (res) {

  },
  onShow () {

  },
  mounted () { },
  methods: {
    loginCheck (flag) {
      loginCheck().then(res => {
        if (res.data == '0') {
          if (flag) {
            toLogin()
            // 关闭当前页面，返回上一页面，如果没有上一页面则返回首页
            uni.navigateBack({
              delta: 1 // 默认值是1，表示返回的页面层数
            });
          } else {
            uni.showModal({
              title: '提示',
              content: '试听已结束，解锁完整内容需要登录!',
              showCancel: true,
              confirmText: "去登录",
              success: function (res) {
                if (res.confirm) {
                  // 关闭当前页面，返回上一页面，如果没有上一页面则返回首页
                  uni.navigateBack({
                    delta: 1 // 默认值是1，表示返回的页面层数
                  });
                  toLogin()
                }
              }
            });
          }

        }
      }).catch((error) => {

      });
    },
    uploadCourseStudy (studyTime, currentTime) {
      console.log(111)
      let that = this;
      let data = {
        number: this.number,
        studyTime: studyTime,
        currentTime: currentTime,
      }
      return new Promise((resolve, reject) => {
        courseStudy(data).then(res => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      })
    },
    async loadInit () {
      uni.showLoading({ title: '加载中' })
      this.val = await this.loadDate()
      this.totalTime = this.val.canPlay == 1 ? this.val.totalTime : this.val.trialDuration
      if (this.val.current) {
        if (this.val.current < this.val.totalTime) {
          this.oldCurrentTime = this.val.current
        }
      }
      this.loadAudioView(this.val)
      uni.hideLoading()
    },
    loadAudioView (val) {
      if (val.type == "audio") {
        this.canPlay = val.canPlay
        if (val.canPlay == 1) {
          this.musicList.push(val.attachmentUrl)
        } else {
          if (!val.trialUrl) {
            this.loginCheck(true)
          }
          this.musicList.push(val.trialUrl);
        }
      }
    },
    loadDate () {
      let that = this;
      return new Promise((resolve, reject) => {
        getCourseInfo(that.number).then(res => {
          let data = res.data
          if (data.type != "live") {
          } else {
            //直播
          }
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      })
    },
    tabSelect (idx) {
      this.active = idx
    },
    goCat: function () {
      uni.navigateTo({
        url: `/pages/order/order_confirm/index`
      })
    },
    goExam: function () {
      uni.navigateTo({
        url: `/pages/exam/exam_list/index`
      })
    },
    goTeacher: function () {
      uni.navigateTo({
        url: `/pages/product/teacher_detail/index`
      })
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
// .xgplayer-mobile{
// 	video{
// 		width:100% !important;
// 		height:100% !important;
// 	}
// }
.audio {
  height: 100%;
  width: 100%;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center left;
  position: relative;
}
</style>
