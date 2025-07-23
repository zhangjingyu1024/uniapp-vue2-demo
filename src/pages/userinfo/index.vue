<template>
  <view class="memberBox">
    <view class="header"
          :style="colorStyle">
      <view class="headerInfo"
            v-if="!userInfo.id">
        <view class="headerInfoLeft">
          <view class="imgBox"><img mode="widthFix"
                 src="https://biaopin.grazy.cn/wechat/static/default-head.b86421c7.png"
                 alt=""></view>
          <view class="infoBox">
            <view class="titleF oneline">游客</view>
            <view class="titleF status">未登录</view>
          </view>
        </view>
        <view class="headerInfoRight"
              @tap="openAuto">
          <view class="loginBox">{{isWeixin ? '授权' : '登录'}}</view>
        </view>
      </view>
      <view class="headerInfo"
            v-if="userInfo.id">
        <view class="headerInfoLeft">
          <view class="imgBox"><img mode="widthFix"
                 :src="userInfo.imageUrl"
                 alt=""></view>
          <view class="infoBox">
            <view class="titleF oneline">{{userInfo.name}}</view>
            <view class="titleF status">{{userInfo.phone}}</view>
          </view>
        </view>
        <view class="headerInfoRight"></view>
      </view>
      <view class="headerVip"
            @tap="goVip">
        <view class="headerVipLeft">
          <text class="ymfont ym-vip"></text>
          <view class="title">我的会员</view>
        </view>
        <view class="time"
              v-if="userInfo.isVip==1">{{userInfo.expireTime}} 到期</view>
        <view class="time"
              v-else></view>
        <view class="headerVipRight">
          <view class="title">去开通</view>
          <text class="ymfont ym-arrow-rightjiantou-you2"></text>
        </view>
      </view>
    </view>
    <view class="study"
          v-show="isLogin">
      <view class="studyHead"
            @tap="goPage('/pages/recent_learning/index')">
        <view class="title">最近学习</view>
        <text class="ymfont ym-arrow-rightjiantou-you2"></text>
      </view>
      <view class="studyList">

        <view class="ymProduct">
          <scroll-view scroll-x="true"
                       style="white-space: nowrap; vertical-align: middle;"
                       show-scrollbar="false">
            <view class="list-box">
              <view class="item"
                    @click="goStudyRecord(item)"
                    style="margin-right: 20rpx;"
                    v-for="(item,index) in studyRecords"
                    :key="index">
                <view class="imgBox">
                  <img :src="item.imageUrl" />
                  <view class="liveStatu ">
                    <span>{{detailTypeMail(item.courseType)}}</span>
                  </view>
                </view>
                <view class="infoBox">
                  <view class="title">{{item.courseName}}</view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>

      </view>
    </view>
    <view class="tab">
      <view class="tabItem"
            @tap="goPage('/pages/live_schedule/index')">
        <text class="ymfont ym-zhibo"></text>
        <view style="font-size: 26rpx; margin-top: 6px;">直播课表</view>
      </view>
      <view class="tabItem">
        <text class="ymfont ym-bishitiku"></text>
        <view style="font-size: 26rpx; margin-top: 6px;">我的题库</view>
      </view>
      <view class="tabItem"
            @tap="goPage('/pages/order/order_list/index')">
        <text class="ymfont ym-dingdan"></text>
        <view style="font-size: 26rpx; margin-top: 6px;">我的订单</view>
      </view>
      <view class="tabItem"
            @tap="goPage('/pages/integral/index')">
        <text class="ymfont ym-jifen2"></text>
        <view style="font-size: 26rpx; margin-top: 6px;">我的积分</view>
      </view>
      <view class="tabItem"
            @tap="goPage('/pages/message/index')">
        <text class="ymfont ym-xiaoxi"></text>
        <view style="font-size: 26rpx; margin-top: 6px;">消息中心</view>
      </view>
      <view class="tabItem"
            @tap="openkefu">
        <text class="ymfont ym-kefu"></text>
        <view style="font-size: 26rpx; margin-top: 6px;">咨询客服</view>
      </view>
      <view class="tabItem"
            @tap="goPage('/pages/setting/index')">
        <text class="ymfont ym-shezhi"></text>
        <view style="font-size: 26rpx; margin-top: 6px;">设置</view>
      </view>
    </view>

    <ymRight />
    <pageFoot />
    <kefu style="position: relative; z-index: 10000"
          :window="isCouponShow"
          @onColse="couponClose"
          :couponImage="couponObj.image"
          :couponList="couponObj.list"></kefu>

  </view>
</template>

<script>
import kefu from "@/components/kefu/index";
import colors from '@/mixins/color.js';
import pageFoot from '@/components/pageFooter/index.vue';//底部导航
import ymRight from '@/pages/index/start/components/ymRight';
let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
import { getUserInfo } from '@/api/user';
import {
  getCourseStudyRecent
} from '@/api/course.js'
// #ifdef H5
import Auth from '@/libs/wechat';
// #endif
import { toLogin } from '@/libs/login.js';
import {
  mapGetters
} from "vuex";
const app = getApp();
export default {
  computed: mapGetters(['isLogin']),
  name: 'Userinfo',
  props: {

  },
  mixins: [colors],
  components: {
    ymRight,
    kefu,
    pageFoot
  },
  data () {
    return {
      isCouponShow: false,
      couponObj: {},
      studyRecords: [],
      sysHeight: sysHeight,
      userInfo: {},
      // #ifdef H5
      isWeixin: Auth.isWeixin(),
      //#endif
    };
  },
  created () { },
  mounted () {

  },
  onShow: function () {
    let that = this;
    console.log(this.isLogin)
    if (this.isLogin) {
      getUserInfo().then(res => {
        that.userInfo = res.data;
      });
      this.loadCourseStudy()
    };
  },
  methods: {
    loadCourseStudy () {
      console.log(111)
      let that = this
      let data = {
        pageNum: 1,
        pageSize: 10,
      }
      getCourseStudyRecent(data).then(res => {
        that.studyRecords = res.rows
      }).catch((error) => {
        uni.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        });
      });
    },
    goPage (link) {
      uni.navigateTo({
        url: link
      })
    },
    couponClose () {
      this.isCouponShow = false;
    },
    openkefu () {
      this.isCouponShow = true;
    },
    // 打开授权
    openAuto () {
      toLogin();
    },
    goVip: function () {
      uni.navigateTo({
        url: `/pages/vip/index`
      })
    },
    goStudyRecord (item) {
      if (item.courseType == "series") {
        uni.navigateTo({
          url: `/pages/product/product_series/index?number=${item.courseNumber}`
        })
      } else if (item.courseType == "video") {
        uni.navigateTo({
          url: `/pages/product/product_video/index?number=${item.courseNumber}`
        })
      } else if (item.courseType == "audio") {
        uni.navigateTo({
          url: `/pages/product/product_audio/index?number=${item.courseNumber}`
        })
      } else if (item.courseType == "live") {
        uni.navigateTo({
          url: `/pages/product/product_live/index?number=${item.courseNumber}`
        })
      } else if (item.courseType == "setmeal") {
        uni.navigateTo({
          url: `/pages/product/product_setmeal/index?number=${item.courseNumber}`
        })
      } else {
        uni.navigateTo({
          url: `/pages/product/product_video/index?number=${item.courseNumber}`
        })
      }
    },
    detailTypeMail (type) {
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
    }
  }
};
</script>

<style lang="scss">
.sys-head {
  position: relative;
  width: 100%;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f6d365, #fda085);
    background-size: 100% auto;
    background-position: left bottom;
  }

  .sys-title {
    z-index: 10;
    position: relative;
    height: 43px;
    text-align: center;
    line-height: 43px;
    font-size: 36rpx;
    color: #333;
  }
}
.header {
  background-color: #fff;
  padding: 8.533vw 4.267vw 4.267vw;
  margin-bottom: 1.6vw;
  .headerInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6.4vw;
    .headerInfoLeft {
      display: flex;
      align-items: center;
      .imgBox {
        width: 16vw;
        height: 16vw;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .infoBox {
        margin-left: 1.6vw;
        .titleF {
          display: flex;
          align-items: center;
          margin-bottom: 1.6vw;
          max-width: 42.667vw;
        }
        .oneline {
          font-size: 4.8vw;
          font-weight: 700;
          color: #333;
          margin-right: 1.067vw;
          flex: 1 1;
        }
        .status {
          font-size: 3.2vw;
          color: #999;
        }
      }
    }
    .headerInfoRight {
      .loginBox {
        width: 16vw;
        height: 5.867vw;
        background: var(--view-theme);
        border-radius: 2.933vw;
        font-size: 3.2vw;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .headerVip {
    height: 11.733vw;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 4.267vw;
    background: url("https://biaopin.grazy.cn/wechat/static/vip-bg.0d09f58c.png")
      no-repeat 50% / cover;
    .headerVipLeft {
      display: flex;
      align-items: center;
      .title {
        font-size: 3.733vw;
        font-weight: 700;
        color: #493418;
        margin-left: 1.6vw;
      }
      .ym-vip {
        font-size: 42rpx;
      }
    }
    .time {
      font-size: 2.933vw;
      color: rgba(73, 52, 24, 0.65);
      margin-left: 1.6vw;
      flex: 1;
    }
    .headerVipRight {
      display: flex;
      align-items: center;
      .title {
        font-size: 3.2vw;
        color: #493418;
      }
      .iconfont {
        font-size: 22rpx;
      }
    }
  }
}
.study {
  background-color: #fff;
  .studyHead {
    padding: 4.267vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 4.267vw;
      font-weight: 700;
      color: #303133;
    }
  }
}
.tab {
  display: flex;
  font-size: 3.2vw;
  background: #fff;
  margin: 1.6vw 0;
  color: #333;
  flex-wrap: wrap;
  .tabItem {
    text-align: center;
    width: 33.333333%;
    padding: 5.333vw 0;
    .ymfont {
      font-size: 55rpx;
    }
  }
}

.ymProduct {
  padding: 10rpx 30rpx;
  background: #fff;
  .itemHeadTitle {
    font-size: 34rpx;
    font-weight: 700;
    color: #282828;
    margin-bottom: 30rpx;
  }
  .list-box {
    display: flex;

    // padding: 20rpx 20rpx 0;
    .item {
      width: 215rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      position: relative;
      display: inline-block;
      flex-shrink: 0;

      .imgBox {
        position: relative;
        height: 133rpx;
        .liveStatu {
          position: absolute;
          right: 10rpx;
          bottom: 10rpx;
          padding: 5rpx 10rpx;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8rpx;
          color: #fff;
          text-align: center;
          font-size: 24rpx;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          .dot {
            background: #fff;
            width: 10rpx;
            height: 10rpx;
            border-radius: 50%;
            margin-right: 5rpx;
          }
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 16rpx;
        }
      }

      .infoBox {
        padding: 10rpx 0rpx;
        .title {
          color: #222222;
          line-height: 34rpx;
          font-size: 25rpx;
          height: 68rpx;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: -moz-box;
          -moz-line-clamp: 2;
          -moz-box-orient: vertical;
          word-wrap: break-word;
          word-break: break-all;
          white-space: normal;
          overflow: hidden;
          margin-bottom: 10rpx;
        }
        .about {
          font-size: 22rpx;
          color: #999;
          font-weight: normal;
          .money {
            font-size: 24rpx;
            color: var(--view-theme);
            font-weight: bold;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
