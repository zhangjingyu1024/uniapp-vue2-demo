<template>
  <view>
    <view class='coupon-list-window'
          :class='coupon.coupon==true?"on":""'>
      <view class='title acea-row row-between'>
        <view>答题卡</view>
        <view class="acea-row">
          <view class="title-content green">正确:{{getNumber(1)}}</view>
          <view class="title-content red">错误:{{getNumber(2)}}</view>
          <view class="title-content grey">未答:{{getNumber(0)}}</view>
        </view>

      </view>
      <view class='coupon-list acea-row'>
        <view class="card-item"
              :class="[getClass(item,index)]"
              v-for="(item,index) in coupon.list"
              :key="index"
              @click="couponChange(index)"> {{index+1}} </view>
      </view>
    </view>
    <view class='mask'
          catchtouchmove="true"
          :hidden='coupon.coupon==false'
          @click='close'></view>
  </view>
</template>

<script>

export default {
  props: {
    coupon: {
      type: Object,
      default: function () {
        return {};
      }
    },
    changeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      type: 0,
    };
  },
  methods: {
    close: function () {
      this.$emit('ChangCouponsClone');
      this.type = 0;
    },
    couponChange: function (index) {
      this.$emit('CouponChange', index);
    },
    getClass: function (item, index) {
      // if (this.changeIndex > 0) {
      //   console.log(111)
      // }
      let className = 'default'
      if (this.changeIndex == index) {
        className = 'select'
        return className
      }
      if (item.done) {
        if (item.isSuccess) {
          className = 'current'
        } else {
          className = 'error'
        }
      }
      return className
    },
    getNumber (flag) {
      let number = 0
      if (flag == 0) {
        this.coupon.list.map((item, i) => {
          if (!item.done) {
            number += 1
          }
        })
      }
      if (flag == 1) {
        this.coupon.list.map((item, i) => {
          if (item.done) {
            if (item.isSuccess) {
              number += 1
            }
          }
        })
      }
      if (flag == 2) {
        this.coupon.list.map((item, i) => {
          if (item.done) {
            if (!item.isSuccess) {
              number += 1
            }
          }
        })
      }
      return number
    }
  }
}
</script>

<style scoped lang="scss">
.coupon-list-window {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-radius: 16rpx 16rpx 0 0;
  z-index: 999;
  transform: translate3d(0, 100%, 0);
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
}

.coupon-list-window.on {
  transform: translate3d(0, 0, 0);
}

.coupon-list-window .title {
  height: 124rpx;
  width: 100%;
  line-height: 124rpx;
  position: relative;
  font-weight: 700;
  font-size: 30rpx;
  padding: 0rpx 40rpx;
}

.coupon-list-window .title .title-content {
  font-weight: 400;
  font-size: 25rpx;
  margin-right: 20rpx;
}

.coupon-list-window .title .green {
  color: #07c160;
}
.coupon-list-window .title .red {
  color: #ff4747;
}
.coupon-list-window .title .grey {
  color: #999;
}

.coupon-list-window .title .iconfont {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 35rpx;
  color: #8a8a8a;
  font-weight: normal;
}

.coupon-list-window .coupon-list {
  margin: 0 0 50rpx 0;
  height: 900rpx;
  padding-top: 28rpx;
  overflow: auto;
}

.coupon-list-window .pictrue {
  width: 414rpx;
  height: 336rpx;
  margin: 192rpx auto 243rpx auto;
}

.coupon-list-window .pictrue image {
  width: 100%;
  height: 100%;
}

.coupon-list-window .coupon-list .card-item {
  width: 80rpx;
  height: 80rpx;
  line-height: 70rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  text-align: center;
  cursor: pointer;
  margin-right: 21rpx;
  margin-bottom: 15rpx;
}

.coupon-list-window .coupon-list .card-item:nth-of-type(7n) {
  margin-right: 0;
}

.coupon-list-window .coupon-list .default {
  color: #ccc;
  background: #fff;
  border: 0.02rem solid #d6d6d6;
}

.coupon-list-window .coupon-list .current {
  color: #fff;
  border: 0.02rem solid #07c160;
  background: #07c160;
  // border: 0.02rem solid #1472ff;
  // background: #1472ff;
}
.coupon-list-window .coupon-list .error {
  color: #fff;
  border: 0.02rem solid #ff4747;
  background: #ff4747;
}
.coupon-list-window .coupon-list .select {
  color: #1472ff;
  border: 0.02rem solid #1472ff;
  background: #ffffff;
}
</style>
