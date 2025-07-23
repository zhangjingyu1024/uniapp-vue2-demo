<template>
  <view class="container">
    <view class="header" v-if="!isZhb">
      <i class="iconfont icon-fanhui2" @click="backLastPage"></i>
      <view class="title">AI问答</view>
    </view>
    <scroll-view scroll-y class="content" :scroll-into-view="scrollIntoId">
      <view class="avatar"></view>
      <view class="greeting">
        <text>{{ greetingMessage }}</text>
      </view>
      <view v-for="item in qAndAPairs" :key="item.id" :id="'id' + item.id">
        <view class="question" v-if="item.type === 'q'">
          <view class="text_box">
            <text>{{ item.content }}</text>
          </view>
        </view>
        <view class="answer" v-if="item.type === 'a'">
          <text>{{ item.content }}</text>
        </view>
      </view>
      <view class="answer thinking" v-show="loading">
        <span class="thinking-dot"></span>
        <span class="thinking-dot"></span>
        <span class="thinking-dot"></span
      ></view>
    </scroll-view>
    <view class="footer">
      <view class="question-mode" :style="{ visibility: isRecording ? 'hidden' : '' }">
        <view class="mode-item">
          <image src="/static/images/icon_question.png" mode=""></image>
          <view class="text"> 标准提问 </view>
        </view>
        <view class="mode-item">
          <image src="/static/images/icon_sence.png" mode=""></image>
          <view class="text"> 场景对话模式 </view>
        </view>
      </view>
      <view class="ipt-box">
        <view class="input-area" v-if="!isVice">
          <textarea
            auto-height
            maxlength="-1"
            class="textarea"
            type="text"
            v-model="textInput"
            placeholder="输入你的问题"
          />
          <image
            class="voice-icon"
            v-if="!textInput"
            @click="viceToogle"
            src="/static/images/icon_sounds.png"
          ></image>
          <image
            class="voice-icon"
            v-if="!!textInput"
            @click="send"
            src="/static/images/icon_ai_send.png"
          ></image>
        </view>
        <view class="voice-input-area" v-if="isVice">
          <view
            class="touchTolk"
            @touchstart="startVoiceInput"
            @touchmove="touchMove"
            @touchend="stopVoiceInput"
            v-show="!isRecording"
            >按住说话
          </view>
          <image
            class="voice-icon"
            v-show="!isRecording"
            @click="viceToogle"
            src="/static/images/icon_jianpan.png"
          ></image>
          <view
            class="recording"
            v-show="isRecording"
            :style="{ background: isMoveOut ? '#f1513c' : '#007aff' }"
          >
            <view
              class="volume-bar"
              v-for="(bar, index) in volumeBars"
              :key="index"
              :style="{ height: bar.height + 'rpx' }"
            ></view>
            <text :class="{ 'touch-text': true, 'touch-text-out': isMoveOut }">{{
              isMoveOut ? "上移取消" : "松手发送，上移取消"
            }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      greetingMessage:
        "你好，我是你的新伙伴小雪!很高兴遇到你，我可以回答你各种问题，为了答疑解惑，还可以陪你聊天哦~你想问点什么呢?",
      qAndAPairs: [
        {
          id: 1,
          type: "q",
          content: "青少年如何预防近视",
        },
        {
          id: 2,
          type: "a",
          content:
            "青少年预防近视可以从以下几方面入手。一是保持正确的读写姿势。身体要坐正，眼睛距离书本约一尺(约33厘米),胸口离桌沿一拳，手指离笔尖一寸。",
        },
      ],
      textInput: "",
      isRecording: false,
      isVice: false,
      inputOffsetTop: 0,
      isMoveOut: false,
      recorderManager: null,
      volumeBars: Array(50).fill({ height: 10 }), // 初始化 8 个音量条
      loading: false,
      scrollIntoId: "id2",
    };
  },
  computed: {
    isZhb() {
      return window.AlipayJSBridge;
    },
  },
  mounted() {
    // document.body.style.overflow
    this.initAudio();
  },
  watch: {
    qAndAPairs() {
      this.$nextTick(() => {
        const container = document.querySelector(
          ".content .uni-scroll-view .uni-scroll-view"
        );
        console.log(container.scrollTop, container.scrollHeight);
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
        this.scrollIntoId = "id" + this.qAndAPairs[this.qAndAPairs.length - 1].id;
      });
    },
  },
  methods: {
    // 初始化音频分析
    initAudio() {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256; // 设置 FFT 大小
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength); // 初始化音频数据数组
        console.log("音频分析初始化成功");
      } catch (error) {
        console.error("音频分析初始化失败:", error);
      }
    },
    // 更新音量条
    updateVolumeBars() {
      if (!this.isRecording) return;

      this.analyser.getByteFrequencyData(this.dataArray); // 获取音频数据

      // 将音频数据分成 50 个频率段
      const barCount = this.volumeBars.length;
      const chunkSize = Math.floor(this.dataArray.length / barCount);

      this.volumeBars = this.volumeBars.map((bar, index) => {
        const start = index * chunkSize;
        const end = start + chunkSize;
        const chunk = this.dataArray.slice(start, end); // 获取当前频率段的数据

        // 计算当前频率段的音量
        const volume = chunk.reduce((sum, value) => sum + value, 0) / chunk.length;
        const height = Math.min(20, volume); // 限制高度范围

        return { height };
      });

      requestAnimationFrame(this.updateVolumeBars); // 持续更新
    },
    backLastPage() {
      uni.navigateBack({
        delta: 1,
      });
    },
    async startVoiceInput() {
      if (!this.audioContext || !this.analyser) {
        console.error("音频分析未初始化");
        return;
      }

      try {
        this.isRecording = true;
        this.isMoveOut = false;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = this.audioContext.createMediaStreamSource(stream);
        source.connect(this.analyser);
        this.updateVolumeBars();
        console.log("开始录音");
      } catch (error) {
        console.error("无法访问麦克风:", error);
        uni.showToast({
          title: "无法访问麦克风",
          icon: "none",
        });
        this.isRecording = false;
      }
    },
    stopVoiceInput() {
      this.isRecording = false;
      // 这里可以添加停止录音并处理录音数据的逻辑
      console.log("停止录音");

      this.pushContent({
        type: "q",
        content: "&……%&%￥&？？",
      });
      this.pushContent({
        content: "情况就是这么个情况，具体什么情况，还得看情况。😂",
      });
    },
    touchMove(e) {
      // console.log(e.touches[0].pageX, e.touches[0].pageY, this.inputOffsetTop)
      // console.log('是否移出：', e.touches[0].pageY < this.inputOffsetTop)
      this.isMoveOut = e.touches[0].pageY < this.inputOffsetTop;
    },

    async viceToogle() {
      this.isVice = !this.isVice;
      if (this.isVice) {
        this.inputOffsetTop = document
          .querySelector(".ipt-box")
          .getBoundingClientRect().top;
        // 获取麦克风权限并创建音频流
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaStreamSource = this.audioContext.createMediaStreamSource(
          this.mediaStream
        );
      }
    },
    send() {
      this.pushContent({
        type: "q",
        content: this.textInput,
      });

      let str = "据我所知，我一无所知。🤦‍♀️";
      this.pushContent({ content: str });
      this.textInput = "";
    },
    pushContent({ type = "a", content }) {
      if (type === "q") {
        this.qAndAPairs.push({
          id: this.qAndAPairs[this.qAndAPairs.length - 1].id + 1,
          type: "q",
          content,
        });
        return;
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.qAndAPairs.push({
          id: this.qAndAPairs[this.qAndAPairs.length - 1].id + 1,
          type: "a",
          content,
        });
      }, 2500);
    },
  },
};
</script>
<style scope lang="scss">
.container {
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  overscroll-behavior-y: none;

  .header {
    flex: 6.6;
    padding-top: env(safe-area-inset-top);
    /* 适配 iPhone X 等设备的刘海屏 */
    padding-top: constant(safe-area-inset-top);
    position: relative;

    .iconfont {
      position: absolute;
      left: 32rpx;
      font-size: 32rpx;
      line-height: 6.6vh;
    }

    .title {
      text-align: center;
      line-height: 6.6vh;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: bold;
      font-size: 34rpx;
      color: #333333;
    }
  }

  .content {
    padding: 0 30rpx;
    box-sizing: border-box;
    overflow-y: auto;
    flex: 70;
    -webkit-overflow-scrolling: touch; /* 启用 iOS 平滑滚动 */

    /* 确保内边距不会影响宽度 */
    .avatar {
      margin: 80rpx auto 0;
      width: 300rpx;
      height: 300rpx;
      background-image: url("/static/images/AI_avatar.png");
      background-size: cover;
    }

    .greeting,
    .answer {
      padding: 25rpx;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #333333;
      line-height: 44rpx;
      text-align: left;
      font-style: normal;
      background: #f5f5f5;
      border-radius: 16rpx;
      margin: 32rpx 0;
      min-height: 88rpx;
      box-sizing: border-box;
      /* 确保内边距不会影响宽度 */
    }

    .question {
      min-height: 88rpx;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
      text-align: left;
      font-style: normal;
      display: flex;
      justify-content: flex-end;
      /* 默认值，子元素将伸展以填充容器 */
      box-sizing: border-box;
      /* 确保内边距不会影响宽度 */

      text {
        background-color: rgba(0, 183, 241, 1);
        padding: 22rpx 32rpx;
        line-height: 44rpx;
        border-radius: 16rpx;
        flex-grow: 1;
        display: inline-block;
        /* 使text成为块级元素 */
        width: 100%;
        /* 使text宽度撑开父元素 */
        word-wrap: break-word;
        /* 或者使用 overflow-wrap: break-word; */
        white-space: pre-wrap;
      }
    }
  }

  .footer {
    flex: 20;
    padding: 30rpx;
    padding-bottom: 100rpx;
    width: 100%;

    .question-mode {
      .mode-item {
        display: inline-block;
        min-width: 212rpx;
        height: 80rpx;
        background: #ffffff;
        border-radius: 16rpx;
        border: 2rpx solid #d8d8d8;
        font-family: PingFang-SC, PingFang-SC;
        font-weight: 500;
        font-size: 30rpx;
        color: #333333;
        line-height: 80rpx;
        position: relative;
        padding-left: 72rpx;
        padding-right: 24rpx;
        margin-right: 16rpx;

        image {
          position: absolute;
          left: 22rpx;
          top: 24rpx;
          width: 36rpx;
          height: 36rpx;
        }

        .text {
          display: inline-block;
        }
      }
    }

    .input-area {
      margin-bottom: 20rpx;
      min-height: 100rpx;
      background: #ffffff;
      box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(0, 0, 0, 0.2);
      border-radius: 16rpx;
      padding-left: 32rpx;
      font-size: 30rpx;
      padding: 30rpx 32rpx 28rpx 32rpx;
      margin-top: 24rpx;
      position: relative;
      width: 100%;
      input {
        width: 100%;
      }

      .voice-icon {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        bottom: 32rpx;
        right: 32rpx;
      }
    }

    .voice-input-area {
      margin-bottom: 20rpx;
      height: 100rpx;
      background: #ffffff;
      box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(0, 0, 0, 0.2);
      border-radius: 16rpx;
      font-size: 30rpx;
      margin-top: 24rpx;
      position: relative;
      width: 100%;

      .touchTolk {
        text-align: center;
        padding: 30rpx 32rpx 28rpx 32rpx;
      }
      .recording {
        border-radius: 16rpx;
        text-align: center;
        padding: 30rpx 32rpx 28rpx 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #007aff;
        height: 100%;
        width: 100%;
        position: relative;

        .volume-bar {
          width: 10rpx;
          background-color: #fff;
          height: 40rpx;
          margin: 0 2rpx;
          transition: height 0.1s ease; /* 平滑过渡 */
          border-radius: 5rpx;
        }
        .touch-text {
          position: absolute;
          left: 50%;
          top: -50rpx;
          transform: translateX(-50%);
          font-size: 24rpx;
        }
        .touch-text-out {
          color: red;
        }
      }

      .voice-icon {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        bottom: 32rpx;
        right: 32rpx;
      }
    }
  }
  .thinking {
    width: 100rpx;
  }
  /* 三个点的样式 */
  .thinking-dot {
    display: inline-block;
    width: 8rpx;
    height: 8rpx;
    background-color: #000;
    border-radius: 50%;
    margin: 0 4rpx;
    animation: bounce 1.4s infinite ease-in-out;
  }

  /* 第二个点的延迟 */
  .thinking-dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  /* 第三个点的延迟 */
  .thinking-dot:nth-child(3) {
    animation-delay: 0.4s;
  }
}

/* 定义动画 */
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
}
</style>
