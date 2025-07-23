<template>
  <view :style="colorStyle">
    <view class="acea-row row-between row-middle grazy-ques-core-header">
      <view style="font-size: 36rpx;line-height: 36rpx;vertical-align: middle;">
        <text class="ymfont ym-shijian"></text>{{time}}
      </view>
      <view @tap='confirmExam'
            v-if="paperId">
        交卷查看结果<text class="iconfont icon-xiangyou"></text>
      </view>
    </view>
    <view class="grazy-ques-core-item">
      <view class="title">
        <view class="tag">{{getTypeName(examItem)}}</view>
        <parser :html="examItem.content"
                ref="article"
                :tag-style="tagStyle"></parser>
        <!-- <text>下列关于火灾自动报警系统组件的说法正确的是（ ）</text> || item.option==examItem.correctAnswer-->
      </view>
      <view class="content"
            v-if="examItem.type==1">
        <radio-group class="section-bd"
                     name="method"
                     @change="radioChange">
          <view class="select-item frss"
                v-for="(item,index) in examItem.options"
                :key="index">
            <label class="acea-row row-left">
              <view class="vrdo">
                <radio class="radio"
                       :value="item.option"
                       :disabled="isDone && !isPaper"
                       :checked="item.checked?true:false"></radio>
              </view>
              <view class="detail">{{item.option}}.</view>
              <!-- #ifndef APP-PLUS -->
              <parser :html="item.content"
                      ref="article"
                      :tag-style="tagStyle"></parser>
              <!-- #endif -->
              <!-- #ifdef APP-PLUS -->
              <div class="description"
                    v-html="item.content"></div>
              <!-- #endif -->

            </label>
          </view>
        </radio-group>
      </view>
      <view class="content"
            v-if="examItem.type==4">
        <radio-group class="section-bd"
                     name="method"
                     @change="pdChange">
          <view class="select-item frss">
            <label class="acea-row row-left">
              <view class="vrdo">
                <radio class="radio"
                       value="1"
                       :disabled="isDone  && !isPaper"
                       :checked="examItem.value=='1'"></radio>
              </view>
              <view>正确</view>
            </label>
          </view>
          <view class="select-item frss">
            <label class="acea-row row-left">
              <view class="vrdo">
                <radio class="radio"
                       value="0"
                       :disabled="isDone  && !isPaper"
                       :checked="examItem.value=='0'"></radio>
              </view>
              <view>错误</view>
            </label>
          </view>
        </radio-group>
      </view>
      <view class="content"
            v-if="examItem.type==2 || examItem.type==3">
        <checkbox-group class="section-bd"
                        name="method"
                        @change="checkboxChange">
          <view class="select-item frss"
                v-for="(item,index) in examItem.options"
                :key="index">
            <label class="acea-row row-left">
              <view class="vrdo">
                <checkbox class="checkbox"
                          :value="item.option"
                          :disabled="isDone  && !isPaper"
                          :checked="item.checked?true:false"></checkbox>
              </view>
              <view class="detail">{{item.option}}.</view>
              <!-- #ifndef APP-PLUS -->
              <parser :html="item.content"
                      ref="article"
					  style="display: inline;"
                      :tag-style="tagStyle"></parser>
              <!-- #endif -->
              <!-- #ifdef APP-PLUS -->
              <div class="description"
                    v-html="item.content"></div>
              <!-- #endif -->

            </label>
          </view>
        </checkbox-group>
        <button v-if="!examItem.done"
                type="primary"
                class="confirm-btn"
                plain="true"
                @click="checkBoxConfirm">确认</button>
      </view>
      <view class="content"
            v-if="examItem.type==5">

        <view class="select-item frss tk-v"
              v-for="(item,index) in examItem.options"
              :key="index">
          <span class="tk-r">{{index+1}}</span>
          <input type='text'
                 placeholder-class='placeholder'
                 class="codeIput"
                 :disabled="isDone  && !isPaper"
                 v-model="item.value" />
        </view>
        <button v-if="!examItem.done"
                type="primary"
                class="confirm-btn"
                plain="true"
                @click="tkConfirm">确认</button>
      </view>
      <view class="content"
            v-if="examItem.type==6">

        <view class="select-item frss">
          <textarea placeholder="请填写答案"
                    class="textarea"
                    v-model="examItem.value"
                    :disabled="isDone && !isPaper" />
          <!-- <input type='text'
                 placeholder-class='placeholder'
                 class="codeIput"
                 :disabled="isDone"
                 v-model="item.value" /> -->
        </view>
        <view class="p12g">此类型题目系统暂不支持判断对错，默认得分</view>
        <button v-if="!examItem.done"
                type="primary"
                class="confirm-btn"
                plain="true"
                @click="jdConfirm">确认</button>
      </view>
      <view class="answer"
            v-if="isDone && !isPaper">
        <view class="frss">
          <view class="label error"
                v-if="!examItem.isSuccess">回答错误</view>
          <view class="label success"
                v-if="examItem.isSuccess">回答正确</view>
        </view>
        <view class="frss mt15"
              v-if="examItem.type==1 || examItem.type==2 || examItem.type==3|| examItem.type==4">
          <view class="frss">
            <view class="label">正确答案：</view>
            <view style="color: rgb(0, 175, 99);" v-if="examItem.type!=4">{{examItem.correctAnswer}}</view>
            <view style="color: rgb(0, 175, 99);" v-if="examItem.type==4">{{examItem.correctAnswerStr}}</view>
          </view>
          <view class="frss mr15" v-if="examItem.type!=4">
            <view class="label">我的答案：</view>
            <view>{{examItem.selectVal}}</view>
          </view>
        </view>
        <view class="frss mt15"
              v-if="examItem.type==5">
          <view class="frss">
            <view class="label">正确答案：</view>
          </view>
          <view>
            <view style="color: rgb(0, 175, 99);"
                  v-for="(item,index) in examItem.answers"
                  :key="index">{{index+1}}：{{item}}</view>
          </view>
        </view>
        <view class="frss mt15">
          <view class="label">难易程度：</view>
          <view class="start"
                :class="'star' + examItem.difficulty"></view>
        </view>
        <view class="frss mt15">
          <view class="label mr2">解析：</view>
          <!-- #ifndef APP-PLUS -->
          <parser :html="examItem.analysis"
                  ref="article"
                  :tag-style="tagStyle"></parser>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <div class="description"
                v-html="examItem.analysis"></div>
          <!-- #endif -->
          <!-- <view>手动火灾报警按钮是通过手动操作报警按钮向火灾报警控制器发出火灾报警信号，是火灾自动报警系统中不可缺少的一种手动触发器件，故A错误。火灾报警控制器是在火灾自动报警系统中，用以接收、显示和传递火灾报警信号，并能发出控制信号和具有其他辅助功能的控制指示设备，故B正确。火灾自动报警系统主要由火灾探测报警系统、消防联动控制系统、可燃气体探测报警系统（预警）、电气火灾监控系统（预警）组成，故C错误。火灾自动报警系统应设置交流电源和蓄电池备用电源，火灾自动报警系统的交流电源应采用消防电源，备用电源可采用火灾报警控制器和消防联动控制器自带的蓄电池电源或消防设备应急电源，故D错误。答案选B。</view> -->
        </view>
      </view>
    </view>
    <view class='pageFooter acea-row row-between-wrapper e'>
      <view class="acea-row row-middl"
            @click="examUp"><text class="ymfont ym-arrow-left-aquarefangjiantou-zuo"></text>上一题</view>
      <view class="acea-row row-middl"
            @tap='couponTap'><text class="ymfont ym-yingyong"></text>{{examIndex+1}}/{{examList.length}}</view>
      <view class="acea-row row-middl"
            @click="examNext">下一题<text class="ymfont ym-arrow-right-aquarefangjiantou-you2"></text></view>
    </view>
    <ymRight />
    <examWindow :coupon='coupon'
                :changeIndex="examIndex"
                :isPaper="isPaper"
                @CouponChange="CouponChange"
                @ChangCouponsClone="ChangCouponsClone"></examWindow>
  </view>
</template>

<script>
import colors from '@/mixins/color.js';
import ymRight from '@/pages/index/start/components/ymRight';
import examWindow from '@/components/examWindow';
import parser from '@/components/jyf-parser/jyf-parser';
import {
  getQuestionList,
  answerBegin,
  questionAnswer,
  getExamBankPaperInfo
} from '@/api/exam.js'
export default {
  name: 'ExamDetail',
  props: {

  },
  options: {
    styleIsolation: 'shared', // 解除样式隔离
  },
  mixins: [colors],
  components: {
    ymRight,
    examWindow,
    parser
  },
  data () {
    return {
      time: '00:00:00', // 初始时间设置为00:00:00
      timer: null, // 存储定时器
      windowChange: 0,
      examIndex: 0,
      coupon: {
        coupon: false,
        list: [],
      },
      isDone: false,
      examItem: {
        isSuccess: false,
        selectVal: '',
        options: [],
        done: false
      },
      examList: [],
      tagStyle: {
        img: 'width:100%;display:block;',
        table: 'width:100%',
        video: 'width:100%;height:100%;'
      },
      id: 0,
      recordId: 0,
      isPaper: false,
      paperId: 0
    };
  },
  onLoad (options) {
    if (options.id) {
      this.id = options.id
    }
    if (options.paperId) {
      this.paperId = options.paperId
      this.isPaper = true
    }
    let that = this
    let data = {
      bankId: this.id
    }
    if (this.isPaper) {
      getExamBankPaperInfo({ id: this.paperId }).then(res => {
        let examList = []
        let structureList = res.data.structureList
        structureList.map((item, i) => {
          if (item.questionList) {
            item.questionList.map((item2, i2) => {
              item2['score'] = item.score
              examList.push(item2)
            })
          }
        })
        that.examList.push.apply(that.examList, examList);
        that.coupon.list = that.examList
        that.examItem = that.examList[0]
        //
        answerBegin({ bankId: that.id, paperId: that.paperId }).then(res2 => {
          that.recordId = res2.data.id
        })
      })
    } else {
      getQuestionList(data).then(res => {
        // that.examList = res.rows
        that.examList.push.apply(that.examList, res.rows);
        that.coupon.list = that.examList
        that.examItem = that.examList[0]
        console.log(that.examItem)
        //
        answerBegin({ bankId: that.id }).then(res2 => {
          that.recordId = res2.data.id
        })

        // that.loading = false;
        // that.loaded = res.rows.length < that.pageSize;
        // that.content.push.apply(that.content, res.rows);
        // that.pageNum++;
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


  },
  created () {
    // let that = this
    // let data = {
    //   bankId: 7
    // }
    // getExamBankPaperInfo({ id: 7 }).then(res => {

    // })
    // getQuestionList(data).then(res => {
    //   // that.examList = res.rows
    //   that.examList.push.apply(that.examList, res.rows);
    //   that.coupon.list = that.examList
    //   that.examItem = that.examList[0]
    //   console.log(that.examItem)
    //   // that.loading = false;
    //   // that.loaded = res.rows.length < that.pageSize;
    //   // that.content.push.apply(that.content, res.rows);
    //   // that.pageNum++;
    //   uni.hideLoading();
    // }).catch((error) => {
    //   uni.hideLoading();
    //   uni.showToast({
    //     title: error,
    //     icon: 'none',
    //     duration: 2000
    //   });
    // });
  },
  mounted () {

  },
  onShow () {
    this.startTimer(); // 页面显示时开始定时器
  },
  onHide () {
    this.stopTimer(); // 页面隐藏时停止定时器
  },
  onUnload () {
    this.stopTimer(); // 页面卸载时清理定时器
  },
  methods: {
    pad (num) {
      return num < 10 ? '0' + num : num.toString();
    },
    startTimer () {
      this.timer = setInterval(() => {
        let [hours, minutes, seconds] = this.time.split(':').map(Number);
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
        }
        if (minutes >= 60) {
          minutes = 0;
          hours++;
        }
        this.time = this.pad(hours) + ':' + this.pad(minutes) + ':' + this.pad(seconds);
      }, 1000);
    },
    stopTimer () {
      clearInterval(this.timer);
      this.timer = null;
    },
    getTypeName (item) {
      let name = ''
      switch (item.type) {
        case 1:
          name = '单选'
          break
        case 2:
          name = '多选'
          break
        case 3:
          name = '不定'
          break
        case 4:
          name = '判断'
          break
        case 5:
          name = '填空'
          break
        case 6:
          name = '简答'
          break
      }
      return name
    },
    examNext: function () {
      if (this.examIndex == this.examList.length - 1) {
        uni.showToast({
          title: '已是最后一题',
          icon: 'none',
          duration: 2000
        });
        return
      }
      this.examIndex += 1
      this.examItem = this.examList[this.examIndex]
      this.isDone = false
      if (this.examItem.done) {
        this.isDone = true
      }
      if (this.examItem.type == 5) {
        this.setFillOptions()
      }
    },
    examUp: function () {
      if (this.examIndex == 0) {
        uni.showToast({
          title: '已是第一题',
          icon: 'none',
          duration: 2000
        });
        return
      }
      this.examIndex -= 1
      this.examItem = this.examList[this.examIndex]
      this.isDone = false
      if (this.examItem.done) {
        this.isDone = true
      }
      if (this.examItem.type == 5) {
        this.setFillOptions()
      }
    },
    setFillOptions: function () {
      if (!this.examItem.options) {
        let answers = this.examItem.correctAnswer.split(',')
        let opList = []
        let answersNew = []
        answers.map((item, i) => {
          if (item) {
            opList.push({ value: '' })
            answersNew.push(item)
          }
        })
        this.examItem.options = opList
        this.examItem.answers = answersNew
      }
    },
    jdConfirm: function () {
      if (!this.examItem.value) {
        uni.showToast({
          title: '未完成作答',
          icon: 'none',
          duration: 2000
        });
        return false
      }
      this.isDone = true
      this.examItem.done = true
      this.examItem.isSuccess = true
      this.toAnswer({ bankId: this.id, questionId: this.examItem.id, recordId: this.recordId, answer: this.examItem.value, isCorrect: 1 })
    },
    tkConfirm: function () {
      let answers = this.examItem.answers//this.examItem.correctAnswer.split(',')
      let answer = []
      // let answersList = []
      // answers.map((item, i) => {
      //   let valus = item.split('_')
      //   valus.map((item2, i2) => {
      //     answersList.push(item2)
      //   })
      // })
      let successList = []
      let isHave = false
      this.examItem.options.map((item, i) => {
        if (item.value) {
          isHave = true
          answers.map((item2, i2) => {
            let valus = item2.split('_')
            valus.map((item3, i3) => {
              if (item.value == item3) {
                successList.push(true)
              }
            })
          })
        }
        answer.push(item.value)
      })
      if (!isHave) {
        uni.showToast({
          title: '未完成作答',
          icon: 'none',
          duration: 2000
        });
        return false
      }
      this.isDone = true
      this.examItem.done = true
      if (successList.length >= answers.length) {
        this.examItem.isSuccess = true
      } else {
        this.examItem.isSuccess = false
      }
      this.toAnswer({ bankId: this.id, questionId: this.examItem.id, recordId: this.recordId, answer: answer.join(','), isCorrect: this.examItem.isSuccess ? 1 : 0 })
    },
    checkBoxConfirm: function () {
      this.isDone = true
      this.examItem.done = true
      if (this.selectVal == this.examItem.correctAnswer) {
        this.examItem.isSuccess = true
      } else {
        this.examItem.isSuccess = false
      }
      this.toAnswer({ bankId: this.id, questionId: this.examItem.id, recordId: this.recordId, answer: this.selectVal, isCorrect: this.examItem.isSuccess ? 1 : 0 })
    },
    checkboxChange: function (e) {
      this.examItem.options.map((item, i) => {
        let isCheck = false
        e.detail.value.map((item2, i2) => {
          if (item2 == item.option) {
            isCheck = true
          }
        })
        item['checked'] = isCheck
      })
      this.selectVal = e.detail.value.join(',')
      this.examItem.selectVal = e.detail.value.join(',')
    },
    pdChange: function (e) {
      this.isDone = true
      this.examItem.done = true
      this.selectVal = e.detail.value
      this.examItem.value = e.detail.value
      if (this.examItem.correctAnswer == '1') {
        this.examItem.correctAnswerStr = '正确'
      } else {
        this.examItem.correctAnswerStr = '错误'
      }
      if (this.selectVal == this.examItem.correctAnswer) {
        this.examItem.isSuccess = true
      } else {
        this.examItem.isSuccess = false
      }
      this.toAnswer({ bankId: this.id, questionId: this.examItem.id, recordId: this.recordId, answer: this.examItem.selectVal, isCorrect: this.examItem.isSuccess ? 1 : 0 })
    },
    radioChange: function (e) {
      this.isDone = true
      this.examItem.done = true
      // if (e.detail.value != this.examItem.correctAnswer) {
      //   this.examItem.options.map((item, i) => {
      //     if (this.examItem.correctAnswer == item.option) {
      //       item['checked'] = true
      //     }
      //     if (e.detail.value == item.option) {
      //       item['checked'] = true
      //     }
      //   })
      // } else {
      //   this.examItem.options.map((item, i) => {

      //     if (e.detail.value == item.option) {
      //       item['checked'] = true
      //     }
      //   })
      // }
      this.examItem.options.map((item, i) => {

        if (e.detail.value == item.option) {
          item['checked'] = true
        }
      })
      this.selectVal = e.detail.value
      this.examItem.selectVal = e.detail.value
      if (this.selectVal == this.examItem.correctAnswer) {
        this.examItem.isSuccess = true
      } else {
        this.examItem.isSuccess = false
      }
      this.toAnswer({ bankId: this.id, questionId: this.examItem.id, recordId: this.recordId, answer: this.examItem.selectVal, isCorrect: this.examItem.isSuccess ? 1 : 0 })
    },
    toAnswer: function (data) {
      if (this.paperId) {
        data['paperId'] = this.paperId
      }
      questionAnswer(data).then(res => {
      })
    },
    getRadioClass: function (item) {
      console.log(111)
      let className = ""
      if (this.selectVal) {
        if (item.checked && item.option == this.examItem.correctAnswer) {
          className = "radio-correct"
        }
        if (item.checked && item.option != this.examItem.correctAnswer) {
          className = "radio-error"
        }
        // if ((item.option == this.selectVal && this.selectVal == this.examItem.correctAnswer)) {
        //   className = "radio-correct"
        // }
        // if (item.option == this.selectVal && this.selectVal != this.examItem.correctAnswer) {
        //   className = "radio-error"
        // }
      }
      return className;
    },
    confirmExam: function () {
      let that = this;
      uni.showModal({
        title: "提示",
        content: "确定要交卷吗",
        success: (res) => {
          if (res.confirm) {
            let totalScore = 0
            let totalAnswer = 0
            let totalAnswerScore = 0
            let totalIncorrectly = 0
            let resultData = {
              number: that.examList.length
            }
            let examData = {
              1: { answer: 0, incorrectly: 0, answerScore: 0, totalScore: 0 },
              2: { answer: 0, incorrectly: 0, answerScore: 0, totalScore: 0 },
              3: { answer: 0, incorrectly: 0, answerScore: 0, totalScore: 0 },
              4: { answer: 0, incorrectly: 0, answerScore: 0, totalScore: 0 },
              5: { answer: 0, incorrectly: 0, answerScore: 0, totalScore: 0 },
              6: { answer: 0, incorrectly: 0, answerScore: 0, totalScore: 0 },
            }
            that.examList.map((item, i) => {
              let ed = examData[item.type]
              ed.totalScore = ed.totalScore + item.score
              totalScore = totalScore + item.score
              if (item.isSuccess) {
                ed.answer = ed.answer + 1
                totalAnswer = totalAnswer + 1
                ed.answerScore = ed.answerScore + item.score
                totalAnswerScore = totalAnswerScore + item.score
              } else {
                ed.incorrectly = ed.incorrectly + 1
                totalIncorrectly = totalIncorrectly + 1
              }
            })
            resultData['totalScore'] = totalScore
            resultData['totalAnswer'] = totalAnswer
            resultData['totalAnswerScore'] = totalAnswerScore
            resultData['totalIncorrectly'] = totalIncorrectly
            resultData['time'] = that.time
            resultData['examData'] = examData
            uni.navigateTo({
              url: `/pages/exam/exam_result/index?result=${encodeURIComponent(JSON.stringify(resultData))}`
            })
          }
        }
      })
    },
    couponTap: function () {
      console.log(this.examItem)
      this.coupon.coupon = true;
      // this.windowChange += 1;
    },
    ChangCouponsClone: function () {
      this.$set(this.coupon, 'coupon', false);
    },
    CouponChange: function (index) {
      this.examIndex = index
      this.examItem = this.examList[this.examIndex]
      this.isDone = false
      if (this.examItem.done) {
        this.isDone = true
      }
      if (this.examItem.type == 5) {
        this.setFillOptions()
      }
      this.coupon.coupon = false;
    }
  }
};
</script>
<style scoped lang="scss">
::v-deep .wx-radio-input-disabled:before {
  color: #ffffff !important;
}
::v-deep .wx-radio-input-disabled {
  background-color: #ffffff !important;
}
::v-deep .wx-checkbox-input-disabled {
  background-color: #ffffff !important;
}
::v-deep .wx-checkbox-input-disabled:before {
  color: #ffffff !important;
}
::v-deep .uni-radio-input-disabled:before {
  color: #ffffff !important;
}
::v-deep .uni-radio-input-disabled {
  background-color: #ffffff !important;
}
::v-deep uni-checkbox .uni-checkbox-input.uni-checkbox-input-disabled {
  background-color: #ffffff !important;
}
::v-deep .uni-checkbox-input-disabled:before {
  color: #ffffff !important;
}
::v-deep uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
  /*#ifndef APP-NVUE*/
  border: 1px solid var(--view-theme) !important;
  background-color: var(--view-theme) !important;
  /*#endif*/
}
.tk-r {
  margin-right: 3.2vw;
  font-size: 18px;
}
.tk-v {
  align-items: center;
}
.p12g {
  font-size: 3.2vw;
  color: #999;
}
.ymfont.ym-shijian {
	color: #000;
	font-size: 40rpx;
	line-height: 36rpx;
}
.confirm-btn {
  margin-top: 40rpx;
  width: 160rpx;
  height: 64rpx;
  background: #fff;
  /*#ifndef APP-NVUE*/
  border: 1rpx solid var(--view-theme) !important;
  color: var(--view-theme) !important;
  /*#endif*/
  border-radius: 32rpx;
  line-height: 64rpx;
  font-size: 28rpx;
}
.grazy-ques-core-header {
  background-color: #fff;
  padding: 3.2vw 4.267vw;
  height: 12.8vw;
  border-bottom: 1px solid #eee;
  .ym-shijian {
    margin-right: 10rpx;
  }
  .icon-xiangyou {
    margin-left: 10rpx;
  }
}
.grazy-ques-core-item {
  background-color: #fff;
  padding: 3.2vw 4.267vw;
  .title {
    padding-bottom: 2.667vw;
    font-size: 4.267vw;
    color: #333;
    line-height: 7.467vw;
    max-width: 100%;
    .tag {
      padding-left: 1.6vw;
      padding-right: 1.6vw;
      margin-top: 1.067vw;
      float: left;
      background: var(--view-minorColor);
      border-radius: 0.533vw;
      margin-right: 1.6vw;
      font-size: 32rpx;
      line-height: 5.333vw;
      height: 5.333vw;
      font-weight: 500;
      /*#ifndef APP-NVUE*/
      color: var(--view-theme);
      /*#endif*/
    }
  }
  .content {
    margin-top: 5.333vw;
    .select-item {
      width: 100%;
      background: #fafafa;
      border-radius: 1.067vw;
      margin-bottom: 3.2vw;
      overflow: hidden;
      padding: 30rpx;
      border: 0.533vw solid var(--selectBorderColor);
	  position:relative;
      .vrdo {
        width: 50rpx;
		position:absolute;
		left: 40rpx;
		top: 30rpx;
      }
      .detail {
        margin-right: 20rpx;
        margin-left: 20rpx;
        width: 20rpx;
        text-align: center;
		position:absolute;
		left: 70rpx;
		top: 33rpx;
      }
      .des {
        // width:90%;
        flex: 1;
      }
    }
    .frss {
      // display: flex;
      // justify-content: flex-start;
      // flex-direction: row;
      // align-items: flex-start;
	  padding-left: 120rpx;
	 
    }
    .radio-error {
      border: 0.533vw solid #ff5a5f; //var(--selectBorderColor);
    }
    .radio-correct {
      border: 0.533vw solid #00af63; //var(--selectBorderColor);
    }
  }
}
.answer {
  margin-top: 5.333vw;
  .frss {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: flex-start;
    .label {
      flex-shrink: 0;
    }
    .error {
      color: #ff4747;
    }
    .success {
      color: rgb(0, 175, 99);
    }
  }
  .mt15 {
    margin-top: 4vw;
  }
  .mr15 {
    margin-left: 50rpx;
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
  height: calc(100rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
  height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
  display: flex;
  .ymfont {
    font-size: 36rpx;
  }
  .ym-arrow-left-aquarefangjiantou-zuo {
    margin-right: 10rpx;
  }
  .ym-arrow-right-aquarefangjiantou-you2 {
    margin-left: 10rpx;
  }
  .ym-yingyong {
    margin-right: 10rpx;
  }
}

::v-deep uni-radio .uni-radio-input {
  flex-shrink: 0;
}

::v-deep uni-radio .uni-radio-input.uni-radio-input-checked {
  /*#ifndef APP-NVUE*/
  border: 1px solid var(--view-theme) !important;
  background-color: var(--view-theme) !important;
  /*#endif*/
}

::v-deep uni-radio .uni-radio-wrapper {
  display: flex !important;
  align-items: flex-start !important;
}
</style>
