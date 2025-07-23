<template>
  <view :style="colorStyle">
    <!-- <view class="hd">
      <view class="hd_top">
        <view>
          <view class="hd_title">{{examData.name}}</view>
          <view class="content">已做2题/共2题（100%）</view>
        </view>
        <view class="hd_share"><text class="ymfont ym-fenxiang"></text>分享</view>
      </view>
      <view class="hd_progress">
        <view class="done_progress"
              style="width: 74%;"></view>
      </view>
    </view> -->
    <view v-if="examData.type==1 || examData.type==3">
      <view class="mn_title">{{examData.name}}</view>
      <view class="index_item index_item-bt">
        <view v-for="(item,index) in questionTypeCountList"
              :key="index"
              class="item-v"
              :class="index>0?'item-top':''">
          <view class="flex-1">{{getTypeName(item.type)}}</view>
          <view class="item-pd-r"> {{item.count}}</view>
        </view>
      </view>
      <view class="index_item">
        <view class="flex">
          <view class="item_left"><text class="ymfont ym-sifakaoshi"></text></view>
          <view class="item_mn">
            <view>
              <view class="item_top">
                <view class="item_title">共计 {{examData.questionTotal}}题，已完成 {{examData.questionAnswerTotal}}题</view>
              </view>
              <view class="progress-box"
                    style="width: 70%;">
                <progress :percent="(examData.questionAnswerTotal/examData.questionTotal)*100"
                          stroke-width="8"
                          activeColor="var(--view-theme)" />
              </view>
            </view>
            <view class="item_top_bt_box"
                  @click="goDetail">
              <view class="loginBox">开始练习</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="examData.type==2 || examData.type==3">
      <view class="mn_title">试卷</view>
      <view class="index_item"
            v-for="(item,index) in examData.paperList"
            :key="index">
        <view class="flex">
          <view class="item_left"><text class="ymfont ym-sifakaoshi"></text></view>
          <view class="item_mn">
            <view>
              <view class="item_top">
                <view class="item_title">{{item.name}}</view>
              </view>
              <view class="item_ct">{{item.questionAnswerCount}}/{{item.questionCount}}题</view>
              <view class="progress-box item-top"
                    style="width: 70%;">
                <progress :percent="(item.questionAnswerCount/item.questionCount)*100"
                          stroke-width="8"
                          activeColor="var(--view-theme)" />
              </view>
            </view>
            <view class="item_top_bt_box"
                  @tap="goPaperDetail(item)">
              <view class="loginBox">去考试</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <ymRight />
  </view>
</template>

<script>
import colors from '@/mixins/color.js';
import ymRight from '@/pages/index/start/components/ymRight';
import {
  getExamBank
} from '@/api/exam.js'
export default {
  name: 'ExamList',
  props: {

  },
  mixins: [colors],
  components: {
    ymRight
  },
  data () {
    return {
      number: '',
      examId: '',
      examData: {},
      questionTypeCountList: []
    };
  },
  onLoad (options) {
    if (options.number) {
      this.number = options.number
    }
    if (options.examId) {
      this.examId = options.examId
    }
  },
  created () { },
  mounted () {
    this.loadInit();
  },
  methods: {
    getQProgress: function () {
      return 'width: 70%;'
    },
    getTypeName: function (type) {
      let title = ""
      switch (type) {
        case 1:
          title = "单选题"
          break
        case 2:
          title = "多选题"
          break
        case 3:
          title = "不定项选择题"
          break
        case 4:
          title = "判断题"
          break
        case 5:
          title = "填空题"
          break
        case 6:
          title = "简答题"
          break
      }
      return title
    },
    goDetail: function () {
      uni.navigateTo({
        url: `/pages/exam/exam_detail/index?id=${this.examData.id}`
      })
    },
    goPaperDetail: function (item) {
      uni.navigateTo({
        url: `/pages/exam/exam_detail/index?id=${this.examData.id}&paperId=${item.id}`
      })
    },
    loadInit: function () {
      let that = this
      getExamBank(this.examId).then(res => {
        that.examData = res.data
        that.questionTypeCountList = []
        if (that.examData.questionTypeCountList) {
          that.questionTypeCountList = that.examData.questionTypeCountList
        }
        console.log(that.questionTypeCountList)
        // // that.examList = res.rows
        // that.examList.push.apply(that.examList, res.rows);
        // that.coupon.list = that.examList
        // that.examItem = that.examList[0]
        // console.log(that.examItem)
        // // that.loading = false;
        // // that.loaded = res.rows.length < that.pageSize;
        // // that.content.push.apply(that.content, res.rows);
        // // that.pageNum++;
        uni.hideLoading();
      }).catch((error) => {
        uni.hideLoading();
        uni.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        });
      });
    }
  }
};
</script>

<style lang="scss">
.hd {
  padding: 7.467vw 4.267vw 6vw;
  background-color: #fff;
  .hd_top {
    display: flex;
    justify-content: space-between;
    .hd_title {
      font-size: 6.4vw;
      color: #333;
      margin-bottom: 3.2vw;
      display: flex;
      align-items: center;
      font-weight: 700;
    }
    .content {
      font-size: 3.2vw;
      color: #999;
    }
    .hd_share {
      display: flex;
      align-items: center;
      height: 6.4vw;
      .ym-fenxiang {
        font-size: 42rpx;
        margin-right: 10rpx;
      }
    }
  }
  .hd_progress {
    width: 53.333vw;
    height: 1.6vw;
    border-radius: 1.067vw;
    background: #eee;
    margin-top: 2.133vw;
    .done_progress {
      /*#ifndef APP-NVUE*/
      background-color: var(--view-theme);
      /*#endif*/
      border-radius: 0.8vw;
      height: 100%;
    }
  }
}
.mn_title {
  font-size: 4.8vw;
  margin-left: 4.533vw;
  margin-top: 6.4vw;
  margin-bottom: 4.267vw;
  font-weight: 700;
}
.index_item {
  width: 91.467vw;
  margin: 3.2vw auto;
  font-size: 3.733vw;
  background-color: #fff;
  border-radius: 2.133vw;
  font-size: 2.933vw;
  padding: 5.333vw 3.333vw;
  vertical-align: middle;

  .flex {
    display: flex;
    justify-content: space-between;
    .item_left {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 3.7vw;
      font-size: 6.4vw;
      margin-right: 3.2vw;
      .ym-sifakaoshi {
        font-size: 45rpx;
        /*#ifndef APP-NVUE*/
        color: var(--view-theme);
        /*#endif*/
      }
    }
    .item_mn {
      margin-bottom: 5.333vw;
      width: 80vw;
      display: flex;
      .item_top_bt_box {
        display: flex;
        align-items: center;
        margin-top: -5.333vw;
        .loginBox {
          width: 16vw;
          height: 5.867vw;
          background: var(--view-minorColor);
          border-radius: 2.933vw;
          font-size: 3.2vw;
          /*#ifndef APP-NVUE*/
          color: var(--view-theme);
          /*#endif*/
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .item_top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2.133vw;
        align-items: center;
        .item_title {
          width: 59.733vw;
          max-height: 12vw;
          font-size: 4.267vw;
          color: #333;
          line-height: 1.5;
          margin-top: -1.2vw;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-all;
          -webkit-line-clamp: 2;
        }
      }
    }

    .progress {
      width: 32vw;
      height: 1.6vw;
      border-radius: 0.8vw;
      background-color: #eee;
      margin-top: 3.2vw;
      .done_progress {
        /*#ifndef APP-NVUE*/
        background-color: var(--view-theme);
        /*#endif*/
        border-radius: 0.8vw;
        height: 100%;
      }
    }
  }
}
.item-v {
  display: flex;
  align-items: center;
  font-size: 4.267vw;
  color: #333;
}
.flex-1 {
  flex: 1;
}
.item-top {
  margin-top: 2.1vw;
}
.item-pd-r {
  margin-right: 10vw;
}
.index_item-bt {
}
::v-deep  .uni-progress-bar {
  border-radius: 15rpx !important;
}
::v-deep  .uni-progress-inner-bar {
  border-radius: 15rpx !important;
}
</style>
