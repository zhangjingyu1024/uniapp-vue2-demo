<template>
  <view>
    <web-view :src="liveUrl"></web-view>
  </view>
</template>

<script>
import colors from '@/mixins/color.js';
import {
  getH5Live
} from '@/api/course.js'
// import {
//   HTTP_H5_LIVE_URL
// } from '@/config/app';
export default {
  name: 'ProductDetail',
  props: {

  },
  mixins: [colors],
  data () {
    return {
      number: "",
      liveUrl: ""
    }
  },
  // http://luowen.youmi-china.com:8012?recordId=42&token=eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjdiNGE4ZTgxLTIwM2MtNGIxZC1iMWE3LWYyNWQ0ZWZjNzBlNSJ9.DkRg1YO3-oJBAHaJj78LD_3N_9T5DZJCcHYqNM1qCr3ak1dTdgUooWBISxCfKz7Z0P3UqHx9645wiopQpDeEUw
  components: {
  },
  created () { },
  mounted () {

  },
  onLoad (options) {
    let that = this
    if (options.number) {
      getH5Live({ "number": options.number }).then(res => {
        let url = 'https://' + res.data.prefixName + ".at.baijiayun.com/web/room/enter?room_id=" + res.data.roomId + '&user_number=' + res.data.userNumber + '&user_name=' + res.data.userName + '&user_role=0' + '&user_avatar=' + res.data.userAvatar + '&sign=' + res.data.sign
        that.liveUrl = url
      })
      // this.number = options.number
      // this.liveUrl = HTTP_H5_LIVE_URL + "?number=" + this.number + "&token=" + uni.getStorageSync('LOGIN_STATUS_TOKEN')
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
