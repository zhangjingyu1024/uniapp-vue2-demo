<template>
  <view class="ymProduct">
    <view class="itemHeadTitle skeleton-rect">{{title}}</view>
    <view class="list-box ">
      <view class="item"
            v-for="(item,index) in dateList"
            @click="goProduct(item.number,item.type)" :key="index">
        <view class="imgBox skeleton-rect">
          <img mode="scaleToFill "
               :src="item.imageUrl" />
          <view class="liveStatu ">
            <view class="dot"
                  style="background: rgb(255, 255, 255);"></view>
            <span v-if="item.type && item.type === 'video'">视频课</span>
            <span v-if="item.type && item.type === 'audio'">音频课</span>
            <span v-if="item.type && item.type === 'graphic'">图文课</span>
            <span v-if="item.type && item.type === 'series'">系列课</span>
            <span v-if="item.type && item.type === 'setmeal'">套餐</span>
            <span v-if="item.type && item.type === 'live' && item.liveStatus!=3">直播</span>
            <span v-if="item.type && item.type === 'live' && item.liveStatus===3 && item.playBackStatus==4">回放</span>
            <span v-if="item.type && item.type === 'live' && item.liveStatus===3 && item.playBackStatus!=4">暂无回放</span>
          </view>
        </view>
        <view class="infoBox ">
          <view class="title skeleton-rect">{{item.name}}</view>
          <view class="about acea-row row-between-wrapper skeleton-rect">
            <view class="money">
              <text class="dollar"
                    v-if="item.price>0">￥</text>
              <text class="decimal"
                    v-if="item.price>0">{{item.price}}</text>
              <text class="decimal"
                    v-if="item.price==0">免费</text>
            </view>
            <view>已售 {{item.virtualNum+item.actualNum}}个</view>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    dateList: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {

    };
  },
  created () {
  },
  mounted () {
  },
  methods: {

    goProduct (number, type) {
      if (type == "series") {
        uni.navigateTo({
          url: `/pages/product/product_series/index?number=${number}`
        })
      } else if (type == "video") {
        uni.navigateTo({
          url: `/pages/product/product_video/index?number=${number}`
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

  }
};
</script>

<style lang="scss">
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
    flex-wrap: wrap;
    justify-content: space-between;
    // padding: 20rpx 20rpx 0;
    .item {
      width: 335rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      overflow: hidden;
      position: relative;

      .imgBox {
        position: relative;
        height: 206rpx;
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
          object-fit: cover;
          border-radius: 16rpx;
        }
      }

      .infoBox {
        padding: 10rpx 0rpx;
        .title {
          color: #222222;
          line-height: 34rpx;
          font-size: 30rpx;
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
            display: flex;
            align-items: baseline;
            color: var(--view-theme);
            .dollar {
              font-size: 2.667vw;
            }
            .decimal {
              font-size: 3.733vw;
              font-weight: 700 !important;
            }
          }
        }
      }
    }
  }
}
</style>
