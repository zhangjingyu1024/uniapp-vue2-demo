<template>
  <view :style="colorStyle">
    <view class="main_content">
      <view class="integralWrap">
        <view class="header">
          <img src="https://biaopin.grazy.cn/wechat/static/integral-bg2.70cf0460.png"
               alt=" "
               class="headerBg">
          <view class="result-top">
            <view class="top-left">
              <view class="left-t">本次题量：{{examData.number}}</view>
              <view class="left-t">答对：{{examData.totalAnswer}}</view>
              <view class="left-t">答错：{{examData.totalIncorrectly}}</view>
              <view class="left-t">共耗时：{{examData.time}}</view>
            </view>
            <view class="top-right">
              <view class="r-one">
                <view class="r-one-t">{{examData.totalAnswerScore}}</view>
                <view>分</view>
              </view>
              <view>总分{{examData.totalScore}}分</view>
            </view>
          </view>
          <!-- <view class="integralTotal">总积分：{{userData.integral + userData.useIntegral}}</view>
          <view class="rule">积分规则</view>
          <view class="integralSurplus">{{userData.integral}}</view>
          <view class="tips">剩余积分</view> -->
        </view>
        <view class="content-m">
          <view class="c-one"
                v-if="examData.examData[1].totalScore>0">
            <view class="c-left">
              单选题
            </view>
            <view class="c-right">
              <view class="r-one">
                <view class="r-t">{{examData.examData[1].answerScore}}分</view>
                <view class="r-t1">/{{examData.examData[1].totalScore}}分</view>
              </view>
              <view class="r-two">答对{{examData.examData[1].answer}}道，答错{{examData.examData[1].incorrectly}}道</view>
            </view>
          </view>
          <view class="c-one c-top"
                v-if="examData.examData[2].totalScore>0">
            <view class="c-left">
              多选题
            </view>
            <view class="c-right">
              <view class="r-one">
                <view class="r-t">{{examData.examData[2].answerScore}}分</view>
                <view class="r-t1">/{{examData.examData[2].totalScore}}分</view>
              </view>
              <view class="r-two">答对{{examData.examData[2].answer}}道，答错{{examData.examData[2].incorrectly}}道</view>
            </view>
          </view>
          <view class="c-one c-top"
                v-if="examData.examData[3].totalScore>0">
            <view class="c-left">
              不定项选择题
            </view>
            <view class="c-right">
              <view class="r-one">
                <view class="r-t">{{examData.examData[3].answerScore}}分</view>
                <view class="r-t1">/{{examData.examData[3].totalScore}}分</view>
              </view>
              <view class="r-two">答对{{examData.examData[3].answer}}道，答错{{examData.examData[3].incorrectly}}道</view>
            </view>
          </view>
          <view class="c-one c-top"
                v-if="examData.examData[4].totalScore>0">
            <view class="c-left">
              判断题
            </view>
            <view class="c-right">
              <view class="r-one">
                <view class="r-t">{{examData.examData[4].answerScore}}分</view>
                <view class="r-t1">/{{examData.examData[4].totalScore}}分</view>
              </view>
              <view class="r-two">答对{{examData.examData[4].answer}}道，答错{{examData.examData[4].incorrectly}}道</view>
            </view>
          </view>
          <view class="c-one c-top"
                v-if="examData.examData[5].totalScore>0">
            <view class="c-left">
              填空题
            </view>
            <view class="c-right">
              <view class="r-one">
                <view class="r-t">{{examData.examData[5].answerScore}}分</view>
                <view class="r-t1">/{{examData.examData[5].totalScore}}分</view>
              </view>
              <view class="r-two">答对{{examData.examData[5].answer}}道，答错{{examData.examData[5].incorrectly}}道</view>
            </view>
          </view>
          <view class="c-one c-top"
                v-if="examData.examData[6].totalScore>0">
            <view class="c-left">
              简答题
            </view>
            <view class="c-right">
              <view class="r-one">
                <view class="r-t">{{examData.examData[6].answerScore}}分</view>
                <view class="r-t1">/{{examData.examData[6].totalScore}}分</view>
              </view>
              <view class="r-two">答对{{examData.examData[6].answer}}道，答错{{examData.examData[6].incorrectly}}道</view>
            </view>
          </view>
        </view>
        <!-- <view style="height: 13.333vw;">
          <view class="tabsWrap">
            <view class="tab"
                  @click='tabSelect(0)'
                  :class="active==0?'activeTab':''">
              <text class="tabName">全部</text>
              <view class="underline"
                    v-if="active==0"></view>
            </view>
            <view class="tab"
                  @click='tabSelect(1)'
                  :class="active==1?'activeTab':''">
              <text class="tabName">获取</text>
              <view class="underline"
                    v-if="active==1"></view>
            </view>
            <view class="tab"
                  @click='tabSelect(2)'
                  :class="active==2?'activeTab':''">
              <text class="tabName">使用</text>
              <view class="underline"
                    v-if="active==2"></view>
            </view>
          </view>
        </view> -->
        <!-- <Loading :loaded="loaded"
                 :loading="loading"></Loading> -->
      </view>
    </view>
  </view>
</template>

<script>
import colors from '@/mixins/color.js';
import Loading from '@/components/Loading/index';
export default {
  name: 'examResult',
  props: {

  },
  mixins: [colors],
  components: {
    Loading
  },
  data () {
    return {
      examData: {},
      loaded: false,
      loading: false,
    };
  },
  created () {
  },
  mounted () {
  },
  onLoad: function (options) {
    this.examData = JSON.parse(decodeURIComponent(options.result))
  },
  methods: {

  },
  onReachBottom () {
  }
};
</script>

<style lang="scss">
.result-top {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  padding: 20rpx 50rpx;
  width: 100%;
  height: 100%;
  font-size: 30rpx;
  color: #fff;
}
.left-t {
  margin-top: 18rpx;
}
.top-left {
  flex: 2;
  display: flex;
  flex-direction: column;
}
.top-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.r-one {
  display: flex;
  margin-bottom: 10rpx;
  align-items: center;
}
.r-one-t {
  font-weight: 800;
  font-size: 50rpx;
}
.content-m {
  background: #fff;
  padding: 30rpx 20rpx;
  border-radius: 0 0 5.333vw 5.333vw;
}
.c-top {
  margin-top: 30rpx;
}
.c-one {
  display: flex;
  align-items: center;
}
.c-left {
  flex: 1;
  font-size: 4.267vw;
  font-weight: 700;
  color: #333;
}
.c-right {
  display: flex;
  flex-direction: column;
}
.r-t {
  color: var(--view-theme);
  font-size: 4.267vw;
  font-weight: 700;
}
.r-t1 {
  font-size: 3.2vw;
  color: #999;
}
.r-two {
  font-size: 2.667vw;
  font-weight: 500;
  color: #999;
}
.main_content {
  // min-height: calc(100vh - 29.333vw);
  margin: 20rpx;
  .integralWrap {
    width: 100%;
    // background: #fff;
    .header {
      position: relative;
      width: 100%;
      height: 37.333vw;
      border-radius: 5.333vw 5.333vw 0 0;
      /*#ifndef APP-NVUE*/
      background: var(--view-theme);
      /*#endif*/
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .headerBg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }
      .integralTotal {
        position: absolute;
        top: 4.267vw;
        left: 6.4vw;
        font-size: 3.2vw;
        color: #fff;
        line-height: 4.533vw;
        z-index: 10;
      }
      .rule {
        position: absolute;
        right: 4.267vw;
        top: 4.267vw;
        width: 17.067vw;
        height: 4.8vw;
        background: hsla(0, 0%, 100%, 0.24);
        border-radius: 2.4vw;
        font-size: 3.2vw;
        color: #fff;
        line-height: 4.8vw;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }
      .integralSurplus {
        font-size: 8vw;
        color: #fff;
        line-height: 11.2vw;
        font-weight: 600;
        z-index: 10;
      }
      .tips {
        font-size: 3.2vw;
        color: #fff;
        line-height: 4.533vw;
        z-index: 10;
      }
    }
    .tabsWrap {
      width: 100vw;
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
        .tabName {
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
      }
      .activeTab {
        color: #333;
        font-size: 4.267vw;
        font-weight: 700;
      }
    }
    .integralList {
      width: 100%;
      .integralItem {
        width: 100%;
        height: 20vw;
        padding: 4.267vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .integralItemLeft {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .integralName {
            font-size: 4.267vw;
            color: #333;
            line-height: 5.867vw;
            font-weight: 700;
          }
          .integralTime {
            font-size: 3.2vw;
            color: #999;
            line-height: 4.533vw;
          }
        }
        .integralItemRight {
          font-size: 4.267vw;
          line-height: 5.067vw;
          font-weight: 700;
        }
        .just {
          /*#ifndef APP-NVUE*/
          color: var(--view-theme) !important;
          /*#endif*/
        }
      }
    }
  }
}
</style>
