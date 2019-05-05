<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('app created and cache logs by setStorageSync')
    //小程序登陆
    const that = this
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              console.log('用户已经授权过')
            }
          })
        }else{
          console.log('用户还未授权过')
          // wx.switchTab({url: '/pages/self/main'})
        }
      }
    })
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
