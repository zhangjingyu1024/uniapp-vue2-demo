<template>
  <view class="productDetail"
        :style="colorStyle">
    <view class="headerBody">
      <img :src="val.imageUrl">
    </view>
    <detail :val="val"
            type="live"></detail>
    <ymRight />
    <buyMenu :val="val"
             type="video"
             @onChangeFun="onChangeFun"></buyMenu>
    
  </view>
</template>

<script>
//#ifdef H5
import Player from 'xgplayer';
import HlsPlugin from 'xgplayer-hls';
import Danmu from 'xgplayer/es/plugins/danmu'
import 'xgplayer/dist/index.min.css';
import 'xgplayer/es/plugins/danmu/index.css'
//#endif
import colors from '@/mixins/color.js';
import ymRight from '@/pages/index/start/components/ymRight';
import parser from '@/components/jyf-parser/jyf-parser';
import detail from '@/pages/product/components/detail';
import buyMenu from '@/pages/product/components/buyMenu';
import {
  getCourseInfo,
  getLiveData,
  getLiveBackData
} from '@/api/course.js'
export default {
  name: 'ProductDetail',
  props: {

  },
  mixins: [colors],
  data () {
    return {
      number: 0,
      val: {
        type: "",
      },
      teacher: {
        nickName: "",
        avatar: "",
        remark: "",
        teacherId: 0,
      },
      musicList: [],
      dataInfo: {}
      //  url: "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/audio.mp3",

    }
  },
  components: {
    ymRight,
    parser,
    buyMenu,
    detail
  },
  created () {

  },
  onLoad (options) {
    if (options.number) {
      this.number = options.number
    }

  },
  onReady: function (res) {

  },
  mounted () {
    this.loadInit()
  },
  methods: {
    async loadInit () {
      uni.showLoading({ title: '加载中' })
      this.val = await this.loadDate()
	  // 俺设计稿要求修改
	  this.val.isVip = false
	  this.val.canPlay = 1
	  console.log(this.val, '----val')
      uni.hideLoading()
    },
    goH5Live: function () {
      uni.navigateTo({
        url: `/pages/live/h5Live/index?number=` + this.dataInfo.number
      })
    },
    goH5Back: function () {
      uni.navigateTo({
        url: `/pages/live/h5Back/index?number=` + this.dataInfo.number
      })
    },
    goAppBack: function () {
      const playback = uni.requireNativePlugin("BJY-VideoPlayer-PlaybackUI")
      let that = this;
      return new Promise((resolve, reject) => {
        getLiveBackData(that.number).then(res => {
          let data = res.data
          // 这里如果不传配置数据，也需要传一个空的map结构，不然iOS平台会崩溃
          playback.startPlayback(data.roomId,
            data.token, {
            // 用户唯一标识
            "userId": data.userNumber,
            // 用户昵称
            "userName": data.userName
          })
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      })

    },
    goAppLive: function () {
      const live = uni.requireNativePlugin("BJY-LiveUI-Module")
      let that = this;
      return new Promise((resolve, reject) => {
        getLiveData(that.number).then(res => {
          let data = res.data
          // live.startLiveEETemplateWithCode(data.studentCode, data.userName)
          live.startLiveEETemplateWithSign(data.roomId, data.sign, {
            "name": data.userName,
            "number": data.userNumber,
            "type": 0,
            "avatar": data.userAvatar
          })
          // live.startLiveEETemplateWithSign(data.roomId, "sign", {
          //   "name": "yjm",
          //   "number": "12345",
          //   "type": 0,
          //   "avatar": "",
          //   "groupId": 0
          // })
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      })
      // let port = uni.getSystemInfoSync().platform
      // live.startLiveEETemplateWithCode("er3gs2", "测试" + port)
      // live.startLiveEETemplateWithSign("roomId", "sign", {
      //   "name": "yjm",
      //   "number": "12345",
      //   "type": 0,
      //   "avatar": "",
      //   "groupId": 0
      // })
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
          that.dataInfo = data
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
    min-height: 420rpx;
    position: relative;
	background-color: rgb(39, 33, 59);
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
	  object-fit: cover;
	  object-position: 0 0;
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
</style>
