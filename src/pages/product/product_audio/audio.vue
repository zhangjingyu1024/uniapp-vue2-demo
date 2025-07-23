<template>
  <view class="audio-component">
    <view class="xgplayer-controls">
      <view class="time">{{currentTimeStr}}</view>
      <view class="slider-line">
        <slider block-size='14'
                :value="sliderProgressValue"
                @change="sliderChange"
                @changing="sliderChanging"
                min="0"
                :max="sliderMax"
                activeColor='var(--view-theme)'
                block-color="var(--view-theme)"
                step="1" />
      </view>
      <view class="time">{{sliderValue}}</view>
    </view>
    <view class="acea-row row-center-wrapper">
      <view class="xgplayer-btn flex1"
            @click="previousFun"><text class="ymfont ym-houtiao"></text></view>
      <view v-show="state"
            @click="playAudio"
            class="xgplayer-btn"><text class="ymfont ym-zanting2"></text></view>
      <view v-show="!state"
            @click="playAudio"
            class="xgplayer-btn"><text class="ymfont ym-bofang3"></text></view>
      <view class="xgplayer-btn flex1"
            @click="forviousFun"><text class="ymfont ym-kuaijin"></text></view>

    </view>
  </view>
</template>

<script>
export default {
  props: {
    musicList: {
      type: Array,
      default: function () {
        return [];
      }
    },
    oldCurrentTime: {
      type: Number,
      default: function () {
        return 0;
      }
    },
    totalTime: {
      type: Number,
      default: function () {
        return 0;
      }
    }
  },
  created () {
    console.log('create')
  },
  data () {
    return {
      startTime: 0,
      stopTime: 0,
      sliderMax: 1,                   //  例如30     音频总时长
      sliderProgressValue: 0,          //  例如11     实时进度
      sliderValue: '00:00',            //  例如00:30 最大值
      currentTimeStr: '00:00',         //  例如00:11 音频实时播放进度
      innerAudioContext: null,         //  实例
      curIndex: 0,
      isPlay: false,
      currentTime: 0,
      studyTime: 0,
      upIndex: 0,
      isEnd: false,
      accrual: 0,
      // musicList:[
      //     "https://web-ext-storage.dcloud.net.cn/uni-app/ForElise.mp3",
      //     "https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/audio.mp3",],
      state: false,                     //  播放状态  false暂停   true播放
      timeoutID: null,
      isChanging: false
    }
  },
  watch: {
    musicList: {
      immediate: true,
      handler (nVal, oVal) {
        this.initAudio();
      },
      deep: true
    },
  },
  mounted () { },
  onUnload () {
    this.isPlay = false
    clearTimeout(this.timeoutID)
  },
  methods: {
    // 上一首
    previousFun: function () {
      if (this.curIndex == 0) {
        wx.showToast({
          title: '这就是第一课哟~',
          icon: "none"
        })
        return;
      } else {
        this.curIndex -= 1;
        this.initAudio()
      }
    },
    // 下一首
    forviousFun: function () {
      if (this.curIndex == this.musicList.length - 1) {
        wx.showToast({
          title: '这就是第最后一课哟~',
          icon: "none"
        })
        return;
      } else {
        this.curIndex += 1;
        this.initAudio()
      }
    },

    initAudio () {
      // 重置 销毁1         
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy()
      }
      this.state = false;
      this.innerAudioContext = uni.createInnerAudioContext()
      // this.innerAudioContext.autoplay = true;//设置是否自动播放
      console.log(this.musicList[this.curIndex])
      console.log(this.oldCurrentTime)
      this.innerAudioContext.src = this.musicList[this.curIndex];//音频的url
      // this.innerAudioContext.obeyMuteSwitch = false;//设置是否自动播放
      // this.innerAudioContext.currentTime = this.oldCurrentTime
      //#ifdef H5 || MP
      this.innerAudioContext.seek(this.oldCurrentTime)
      // #endif
      this.sliderValue = this.formatSecond(this.totalTime);
      this.creatAudio();
      // this.innerAudioContext.pause()//暂停
      // // 因为拖拽后自动播放 导致实时获取播放时间的方法没有执行【坑点】
      // setTimeout(() => {
      //   //模拟点击播放
      //   this.state = false
      //   this.playAudio()
      // }, 10)
    },

    // 点击播放事件
    playAudio () {
      this.state = !this.state
      // false暂停  true播放
      if (this.state) {
        this.innerAudioContext.play() //播放

        this.creatAudio()             //获取播放时长进度
      } else {
        this.innerAudioContext.pause()//暂停
      }
    },
    //实时播放时长
    creatAudio () {
      // 播放中的实时监听 播放位置 以及时长
      this.innerAudioContext.onTimeUpdate(() => {
        const { currentTime, duration } = this.innerAudioContext;//这俩参数是这个api自带的参数, 解构
        // console.log(currentTime)
        this.currentTime = Math.floor(currentTime)
        // console.log('视频播放时间更新', this.currentTime);
        let currTimeStr = this.formatTime(currentTime);
        if (!this.isChanging) {
          // 未转化 时间格式的实时时长
          this.sliderProgressValue = currentTime//Math.floor(currentTime);
        }
        // setTimeout(() => {
        //   this.sliderProgressValue = this.sliderProgressValue + 0.1
        // }, 100)
        // let count = 5
        // let that = this
        // let timer = setInterval(function () {
        //   that.sliderProgressValue = that.sliderProgressValue + 0.1
        //   console.log(that.sliderProgressValue)
        //   if (count == 0) {
        //     clearInterval(timer)
        //   } else {
        //     count--;
        //   }
        // }, 50)
        this.sliderMax = duration;
        // console.log(duration)
        // 实时变动的时间
        this.currentTimeStr = currTimeStr;
        //音频总时长
        this.sliderValue = this.formatSecond(duration);
        // console.log('时长',this.sliderProgressValue,this.currentTimeStr,currentTime,duration)
      });

      // 监听播放结束 的处理
      this.innerAudioContext.onEnded(() => {
        this.isPlay = false;
        if (!this.isEnd) {
          this.$emit('loginCheck');
          // this.upStudy(this.upIndex + 1, 1)
          let eTime = Math.floor(Date.now() / 1000);
          if (eTime - this.startTime < 20) {
            this.$emit('uploadCourseStudy', eTime - this.startTime, this.sliderMax)
          }
          this.isPlay = false;
          this.currentTime = 0
          console.log('播放结束')
          setTimeout(() => {
            this.currentTimeStr = this.sliderValue;
            this.sliderProgressValue = this.sliderMax
            this.state = false
          }, 300)
        }
        this.isEnd = true
      })
      this.innerAudioContext.onError((error) => {
        console.log(error)
      })
      this.innerAudioContext.onPlay(() => {
        this.isEnd = false;
        if (!this.isPlay) {
          this.isPlay = true;
          this.upIndex = this.upIndex + 1
          setTimeout(() => {
            this.upStudy(this.upIndex, 1)
          }, 1000);
        }
      })
      this.innerAudioContext.onPause((error) => {
        if (this.isPlay) {
          this.accrual += Math.floor(Date.now() / 1000) - this.startTime;
          console.log("累加" + this.accrual)
        }
        this.isPlay = false;
      })
      this.innerAudioContext.onCanplay((error) => {
        //#ifdef APP-PLUS
        this.innerAudioContext.seek(this.oldCurrentTime)
        // #endif
        // this.innerAudioContext.seek(this.oldCurrentTime)
      })
    },
    upStudy (index, time) {
      let that = this
      console.log(index)
      if (index == this.upIndex && this.isPlay) {
        that.startTime = Math.floor(Date.now() / 1000);
        // this.studyTime += time
        // console.log(this.studyTime)
        //this.uploadStudy()
        if (that.accrual > 10) {
          that.accrual = 0
        } else {
          time = time + that.accrual
        }
        that.accrual = 0
        this.$emit('uploadCourseStudy', time, this.currentTime)
        // this.currentTime = Math.round(this.player.currentTime)
        this.timeoutID = setTimeout(() => {
          this.upStudy(index, 10)
        }, 10000);
      }
    },
    //格式化时间格式
    formatTime (num) {
      num = Math.floor(num)
      let second = num % 60;
      if (second < 10) second = '0' + second;
      let min = Math.floor(num / 60);
      if (min < 10) min = '0' + min;
      return min + ":" + second;
    },
    sliderChanging (e) {
      this.isChanging = true
    },
    // 拖拽音频播放位置
    sliderChange (e) {
      this.isChanging = false
      // console.log('value 发生变化：' + e.detail.value,this.state,this.innerAudioContext)
      const currTimeStr = this.formatTime(e.detail.value)
      this.currentTimeStr = currTimeStr
      // 播放进度条位置
      this.sliderProgressValue = e.detail.value
      //设置要播放的位置
      this.innerAudioContext.seek(e.detail.value);
      this.innerAudioContext.pause()//暂停
      // 因为拖拽后自动播放 导致实时获取播放时间的方法没有执行【坑点】
      setTimeout(() => {
        //模拟点击播放
        this.state = false
        this.playAudio()
      }, 10)
    },
    formatSecond (seconds) {
      var h = Math.floor(seconds / 3600) < 10 ? '0' + Math.floor(seconds / 3600) : Math.floor(seconds / 3600);
      var m = Math.floor((seconds / 60 % 60)) < 10 ? '0' + Math.floor((seconds / 60 % 60)) : Math.floor((seconds / 60 % 60));
      var s = Math.floor((seconds % 60)) < 10 ? '0' + Math.floor((seconds % 60)) : Math.floor((seconds % 60));
      // return  h + ":" + m + ":" + s;
      return m + ":" + s;
    },
  },
  // 组件销毁 同时销毁音频
  destroyed () {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
    }
    this.isPlay = false
    clearTimeout(this.timeoutID)
  },
}
</script>

<style lang="scss" scoped>
.audio-component {
  // position: absolute;
  // bottom: 0;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  background: #fff;
  padding: 0rpx 25rpx;
  opacity: 0.9;
  .xgplayer-controls {
    height: 100rpx;
    display: flex;
    align-items: center;
    .time {
      color: var(--view-theme);
    }
  }
  .xgplayer-btn {
    .ym-zanting2,
    .ym-bofang3 {
      font-size: 90rpx;
      color: var(--view-theme);
    }
    .ym-houtiao,
    .ym-kuaijin {
      font-size: 50rpx;
    }
    margin: 10rpx !important;
  }
  .flex1 {
    flex: 1;
    text-align: center;
  }
  .slider-line {
    flex: 1;
  }
}
::v-deep  uni-slider {
  margin: 10rpx 25rpx !important;
}
</style>