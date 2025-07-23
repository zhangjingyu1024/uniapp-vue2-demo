<template>
  <view>
    <web-view :src="liveUrl"
              allow="fullscreen"></web-view>
  </view>
</template>

<script>
import colors from '@/mixins/color.js';
import {
  getBackPlayer
} from '@/api/course.js'
// import {
//   HTTP_H5_BACK_URL
// } from '@/config/app';
export default {
  name: 'ProductDetail',
  props: {

  },
  mixins: [colors],
  data () {
    return {
      number: "",
      liveUrl: ""//"http://luowen.youmi-china.com:8013?recordId=43&token=eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjdiNGE4ZTgxLTIwM2MtNGIxZC1iMWE3LWYyNWQ0ZWZjNzBlNSJ9.DkRg1YO3-oJBAHaJj78LD_3N_9T5DZJCcHYqNM1qCr3ak1dTdgUooWBISxCfKz7Z0P3UqHx9645wiopQpDeEUw"
    }
  },
  components: {
  },
  created () { },
  mounted () {

  },
  onLoad (options) {
    let that = this;
    if (options.number) {
      this.number = options.number
      getBackPlayer({ "number": options.number }).then(res => {
        let url = 'https://' + res.data.prefixName + ".at.baijiayun.com/web/playback/index?classid=" + res.data.roomId + '&token=' + res.data.token + '&user_name=' + res.data.userName + '&user_number=' + res.data.userNumber
        that.liveUrl = url
        console.log(url)
      })
      // this.liveUrl = HTTP_H5_BACK_URL + "?number=" + this.number + "&token=" + uni.getStorageSync('LOGIN_STATUS_TOKEN')
    }

  },
  methods: {
    tabSelect (idx) {
      this.active = idx
    },
  }
};
</script>

<style lang="scss">
</style>
