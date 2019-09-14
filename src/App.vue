<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('app created and cache logs by setStorageSync')
  },
  onShow() {
    const that = this
    // 是否为苹果用户
    const systemInfo =  wx.getSystemInfoSync()
    // console.log(systemInfo)
    let isApple
    if(systemInfo.model.indexOf('iPhone') > -1) {
      isApple = true
    } else {
      isApple = false
    }
    wx.setStorageSync('isApple', isApple)
    // 微信是否登录
    const token = wx.getStorageSync('token') || ''
    if (!token) {
      that.$openWin('/pages/info/main')
    }
  },
  onHide() {
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('app hide and cache logs by setStorageSync')
  }
}
</script>
<style>
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.action_sheet .i-as-show {
    height: 50%;
    margin: 10px;
    overflow: scroll;
}
</style>
