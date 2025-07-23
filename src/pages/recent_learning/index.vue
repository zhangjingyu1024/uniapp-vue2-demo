<template>
  <view :style="colorStyle">
    <view class="list"
          v-if="content.length>0">
      <view class="item"
            v-for="(item,index) in content"
            @click="goStudyRecord(item)"
            :key="index">
        <view class="itemHead">
          <view class="itemHeadNum">上次学习：{{item.lastTime}}</view>
          <view class="itemHeadStatus">
            <!-- <text class="status">{{orderStateMain(item.orderState)}}</text> -->
          </view>
        </view>
        <view class="itemContent">
          <view class="orderItem">
            <div class="tag">{{detailTypeMail(item.courseType)}}</div>
            <view class="left">
              <view class="img"><img mode="widthFix"
                     :src="item.imageUrl"></view>
            </view>
            <view class="right">
              <view class="title">{{item.courseName}}</view>
              <!-- <view class="ordermsg">
                <view class="price">￥{{item.price}}</view>
              </view> -->
            </view>
          </view>
        </view>
        <view class="itemPrice"
              v-if="item.courseType == 'video' || item.courseType == 'audio' || item.courseType == 'series'">
          <view class="progress-box"
                style="width: 75%;">
            <progress :percent="item.progress"
                      stroke-width="10"
                      border-radius="30"
                      activeColor="var(--view-theme)" />
          </view>
          <view class="progress-text">{{item.progressTitle}}</view>
        </view>
        <!-- <view class="itemFooter"
              v-if="item.orderState==0">
          <view class="bnt cancelBnt"
                @click.stop="cancel(item)">取消订单</view>
          <view class="bnt"
                @click.stop="pay(item)">去付款</view>
        </view> -->
      </view>
      <div class="am-list-footer">
        <div style="padding: 30px; text-align: center;">没有更多了</div>
      </div>
    </view>
    <view v-else
          class="nothing"
          style="text-align: center;margin-top:20rpx;">
      <image v-if="!loading"
             :src="'https://data.youmi-china.com/source/empty.png'"
             alt=""
             style="width:352rpx;height:280rpx">
        <view v-if="!loading"
              style="font-size:25rpx;color: #979cb3;">暂无记录</view>
    </view>
    <Loading :loaded="loaded"
             :loading="loading"></Loading>
  </view>
</template>

<script>
import payment from '@/components/payment';
import colors from '@/mixins/color.js';
import countDown from '@/components/countDown';
import Loading from '@/components/Loading/index';
import {
  HTTP_REQUEST_URL
} from '@/config/app'
import {
  getCourseStudyRecent
} from '@/api/course.js'
export default {
  name: 'OrderList',
  props: {

  },
  mixins: [colors],
  components: {
    Loading,
    countDown,
    payment
  },
  data () {
    return {
      imgHost: HTTP_REQUEST_URL,
      loaded: false,
      loading: false,
      active: -1,
      content: [],
      totalPrice: '0',
      pay_close: false,
      pay_order_id: '',
      pageNum: 1,
      pageSize: 10,
      payMode: [{
        name: "微信支付",
        icon: 'icon-weixinzhifu',
        value: 'wechat',
        title: "微信支付",
        payStatus: true
      }
        // #ifdef H5 ||APP-PLUS
        ,
      {
        name: "支付宝支付",
        icon: 'icon-zhifubao',
        value: 'alipay',
        title: "支付宝支付",
        payStatus: true
      },
        // #endif
      ],
    };
  },
  onLoad: function () {
    this.loadInit()
  },
  created () {
  },
  mounted () {

  },
  methods: {
    loadInit () {
      console.log("asdasd")
      let that = this
      if (that.loading || that.loaded) return;
      that.loading = true;
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      getCourseStudyRecent(data).then(res => {
        that.loading = false;
        that.loaded = res.rows.length < that.pageSize;
        let records = res.rows
        records.map((item, index) => {
          if (item.courseType == 'video' || item.courseType == 'audio') {
            item['progress'] = Math.floor((item.current / item.duration) * 100)
            item['progressTitle'] = '已学' + item.progress + '%'
          }
          if (item.courseType == 'series') {
            item['progress'] = 0
            if (item.coursesNum) {
              item['progress'] = Math.floor((item.learningNum / item.coursesNum) * 100)
            }
            item['progressTitle'] = item.learningNum + '/' + item.coursesNum
          }
        })
        that.content.push.apply(that.content, records);
        that.pageNum++;
        uni.hideLoading();
      }).catch((error) => {
        uni.hideLoading();
        uni.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        });
      });
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
    }
  },
  onReachBottom () {
    this.loadInit()
  }
};
</script>

<style lang="scss" scoped>
::v-deep  .uni-progress-bar {
  border-radius: 15rpx !important;
}
::v-deep  .uni-progress-inner-bar {
  border-radius: 15rpx !important;
}
.progress-text {
  margin-left: 4.8vw;
  font-size: 3.2vw;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 5.333vw;
  color: #ccc;
}
.tabsWrap {
  width: 100%;
  height: 13.333vw;
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
.list {
  padding: 2.133vw 4.267vw 0;
  .item {
    background: #fff;
    border-radius: 1.067vw;
    margin-bottom: 2.133vw;
    position: relative;
    .itemHead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 3.2vw;
      .itemHeadNum {
        font-size: 2.933vw;
        color: #999;
      }
      .itemHeadStatus {
        display: flex;
        font-size: 2.933vw;
        .status {
          font-size: 3.2vw;
        }
        .time {
          margin-right: 10rpx;
          .timeRed {
            color: #f35959;
          }
        }
      }
    }
    .itemContent {
      padding: 0 3.2vw 3.2vw 0;
      margin-left: 3.2vw;
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
          // justify-content: space-between;
          justify-content: center;
          height: 100%;
          .title {
            color: #333;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            // white-space: nowrap;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // -o-text-overflow: ellipsis;
            // -webkit-text-overflow: ellipsis;
            // -moz-text-overflow: ellipsis;
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
    .itemPrice {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 3.2vw;
      height: 12.267vw;
      border-bottom: 1px solid #f6f6f6;
      .price {
        color: var(--view-theme);
        .dollar {
          font-size: 3.2vw;
        }
        .decimal {
          font-size: 3.2vw;
          font-size: 4.8vw;
          font-weight: 700 !important;
        }
      }
    }

    .itemFooter {
      display: flex;
      justify-content: flex-end;
      padding: 3.2vw;
      .bnt {
        width: 176rpx;
        height: 60rpx;
        text-align: center;
        line-height: 59rpx;
        color: #fff;
        border-radius: 50rpx;
        font-size: 27rpx;
        background-color: var(--view-theme) !important;
        color: #fff;
      }
      .cancelBnt {
        border: 1rpx solid #ddd;
        color: #aaa;
        margin-right: 4.267vw;
        background-color: #fff !important;
      }
    }
  }

  .am-list-footer {
    font-size: 3.733vw;
    color: #888;
  }
}
</style>
