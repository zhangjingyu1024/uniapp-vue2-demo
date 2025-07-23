<template>
  <view :style="colorStyle">
    <view class="main_content">
      <view class="integralWrap">
        <view class="header">
          <img src="https://biaopin.grazy.cn/wechat/static/integral-bg2.70cf0460.png"
               alt=" "
               class="headerBg">
          <view class="integralTotal">总积分：{{userData.integral + userData.useIntegral}}</view>
          <view class="rule">积分规则</view>
          <view class="integralSurplus">{{userData.integral}}</view>
          <view class="tips">剩余积分</view>
        </view>
        <view style="height: 13.333vw;">
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
        </view>
        <view class="integralList"
              v-if="content.length>0">
          <view class="integralItem"
                v-for="(item,index) in content" :key="index">
            <view class="integralItemLeft">
              <view class="integralName">
                {{item.note? item.note:'后台修改'}}
              </view>
              <view class="integralTime">
                {{item.createTime}}
              </view>
            </view>
            <view class="integralItemRight just">
              {{item.type==1? '+':'-'}}{{item.integral}}
            </view>
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
                 style="width:352rpx;height:280rpx"/>
            <view v-if="!loading"
                  style="font-size:25rpx;color: #979cb3;">暂无记录</view>
        </view>
        <Loading :loaded="loaded"
                 :loading="loading"></Loading>
      </view>
    </view>
    <ymRight />
  </view>
</template>

<script>
import colors from '@/mixins/color.js';
import ymRight from '@/pages/index/start/components/ymRight';
import Loading from '@/components/Loading/index';
import {
  getUserInfo,
  getIntegralList
} from '@/api/user.js'
export default {
  name: 'Integral',
  props: {

  },
  mixins: [colors],
  components: {
    ymRight,
    Loading
  },
  data () {
    return {
      userData: {},
      content: [],
      loaded: false,
      loading: false,
      pageNum: 1,
      pageSize: 10,
      active: 0,
    };
  },
  created () {
    this.loadUser();
  },
  mounted () {
  },
  onLoad: function () {
    this.loadInit()
  },
  methods: {
    tabSelect (idx) {
      this.active = idx
      this.loaded = false;
      this.pageNum = 1;
      this.content = []
      this.loadInit()
    },
    loadUser: function () {
      let that = this;
      return new Promise((resolve, reject) => {
        getUserInfo({}).then(res => {
          that.userData = res.data

          resolve(that.userData);
        }).catch((error) => {
          reject(error);
        });
      })
    },
    loadInit () {
      let that = this
      if (that.loading || that.loaded) return;
      that.loading = true;
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      if (this.active > 0) {
        data['type'] = this.active
      }
      getIntegralList(data).then(res => {
        that.loading = false;
        that.loaded = res.rows.length < that.pageSize;
        that.content.push.apply(that.content, res.rows);
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
  },
  onReachBottom () {
    this.loadInit()
  }
};
</script>

<style lang="scss">
.main_content {
  min-height: calc(100vh - 29.333vw);
  .integralWrap {
    width: 100%;
    background: #fff;
    .header {
      position: relative;
      width: 100%;
      height: 37.333vw;
      border-radius: 0 0 5.333vw 0;
      background: var(--view-theme);
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
          background: var(--view-theme) !important;
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
          color: var(--view-theme) !important;
        }
      }
    }
  }
}
</style>
