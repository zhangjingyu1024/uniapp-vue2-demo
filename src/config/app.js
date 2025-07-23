module.exports = {
  // 请求域名
  HTTP_REQUEST_URL: process.env.VUE_APP_API_URL, 

  // 后台版本号
  SYSTEM_VERSION: 530,

  // 以下配置在不做二开的前提下,不需要做任何的修改
  HEADER: {
    'content-type': 'application/json',
    //#ifdef H5
    'Form-type': navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? 'wechat' : 'h5',
    //#endif
    //#ifdef MP
    'Form-type': 'routine',
    //#endif
    //#ifdef APP-VUE
    'Form-type': 'app',
    //#endif
  },
  // 回话密钥名称 请勿修改此配置
  TOKENNAME: 'Authori-zation',
  // 缓存时间 0 永久
  EXPIRE: 0,
  //分页最多显示条数
  LIMIT: 10
}
