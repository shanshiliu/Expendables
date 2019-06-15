<template>
  <div class="container ub-box ub-col">
    <dl class="ub-box z-padding-all-10-px" style="background:#fff">
      <dd :class="{'ub-box':true, 'ub-ver':true, 'img_l':true, 'vip_item':isLogin===true}">
         <image src="../../../../../static/images/icon.jpg" class="head-img" mode="aspectFill" v-if="isLogin===true"></image>
      </dd>
      <dd class="ub-flex-1 z-font-size-18 z-color-333 ub-box ub-ver-v z-padding-h-10-px">
        <!-- <button v-if="isLogin===false" class="loginBtn" lang="zh_CN" open-type="getUserInfo" @getuserinfo="onGetUserInfo">登录</button> -->
        <button v-if="isLogin===false" class="loginBtn" @getphonenumber="getPhoneNumber" open-type="getPhoneNumber">登录</button>
        <ul v-if="isLogin===true" class="ub-box z-margin-left-10-px ub-col">
          <li class="z-font-size-16 z-color-333 z-margin-bottom-5-px">{{userInfo.phone}}</li>
          <li class="z-font-size-14 z-color-888" v-if="userInfo.useingEndTime">到期时间：{{userInfo.useingEndTime}}</li>
          <!-- <li class="z-font-size-14 z-color-888">{{userInfo.province}} {{userInfo.city}} {{userInfo.gender}}</li> -->
        </ul>
      </dd>
      <dd class="z-font-size-18 z-color-333 ub-box ub-ver-v" v-if="isLogin===true">
        <div @click.stop="exitLogin()" class="exitBtn ub-box ub-ver z-font-size-14">退出</div>
      </dd>
    </dl>
    <dl class="ub-box ub-col z-margin-top-10-px" style="background:#fff;">
      <dd @click.stop="handleJump('/pages/buyVip/main')" class="z-padding-all-10-px ub-box ub-between" style="border-bottom:1px solid #eee" v-if="!isApple">
        <p class="ub-box ub-ver">
        <i class="iconfont icon-huiyuan" style="color:#2d8cf0;font-size:20px"></i>
        <span class="z-font-size-15 z-color-666 z-padding-h-10-px">购买会员</span>
        </p>
        <p class="ub-box ub-ver">
        <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888"></i>
        </p>
      </dd>
      <dd @click.stop="handleJump('/pages/account/main')" class="z-padding-all-10-px ub-box ub-between" style="border-bottom:1px solid #eee">
        <p class="ub-box ub-ver">
        <i class="iconfont icon-huiyuan" style="color:#2d8cf0;font-size:20px"></i>
        <span class="z-font-size-15 z-color-666 z-padding-h-10-px">卡密激活</span>
        </p>
        <p class="ub-box ub-ver">
        <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888"></i>
        </p>
      </dd>
      <dd @click.stop="handleJump('/pages/citySelect/main?id=1')" class="z-padding-all-10-px ub-box ub-between" style="border-bottom:1px solid #eee">
        <p class="ub-box ub-ver">
        <i class="iconfont icon-renyuanxuanzetubiao" style="color:#2d8cf0;font-size:20px"></i>
        <span class="z-font-size-15 z-color-666 z-padding-h-10-px">我的工种 (切换)</span>
        </p>
        <p class="ub-box ub-ver">
        <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888"></i>
        </p>
      </dd>
      <dd @click.stop="handleJump('/pages/citySelect/main?id=2')" class="z-padding-all-10-px ub-box ub-between" style="border-bottom:1px solid #eee">
        <p class="ub-box ub-ver">
        <i class="iconfont icon-xuanzetubiao" style="color:#2d8cf0;font-size:20px"></i>
        <span class="z-font-size-15 z-color-666 z-padding-h-10-px">选择 (添加) 工种</span>
        </p>
        <p class="ub-box ub-ver">
        <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888"></i>
        </p>
      </dd>
      <dd @click.stop="handleJump('/pages/message/main')" class="z-padding-all-10-px ub-box ub-between" style="border-bottom:1px solid #eee">
        <p class="ub-box ub-ver">
        <i class="iconfont icon-bangzhufankui1" style="color:#2d8cf0;font-size:20px"></i>
        <span class="z-font-size-15 z-color-666 z-padding-h-10-px">我的留言反馈</span>
        </p>
        <p class="ub-box ub-ver">
        <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888"></i>
        </p>
      </dd>
       <dd @click.stop="clickCall()" class="z-padding-all-10-px ub-box ub-between">
        <p class="ub-box ub-ver">
        <i class="iconfont icon-dianhua" style="color:#2d8cf0;font-size:20px"></i>
        <span class="z-font-size-15 z-color-666 z-padding-h-10-px">客服电话：10107888</span>
        </p>
      </dd>
    </dl>
  </div>
</template>
<script>
export default {
  computed: {
    isLogin() {
      return this.accountInfo.token ? true : false
    },
    userInfo () {
      console.log(this.accountInfo)
      return this.accountInfo
    },
  },
  data () {
    return {
      visible: false,
      accountInfo: {},
      isApple: false,
      sessionKey: ''
    }
  },
  onload() {
    // 微信登录
    const that = this
    const token = wx.getStorageSync('token') || ''
    if (!token) {
      wx.login({
        success(res) {
          if (res.code) {
            // 后台登录获取token
            console.log(res.code)
            wx.setStorageSync('code', res.code)
            that.$ajax({url: `/wxUser/wxLogin/${res.code}`, method: 'POST'},function(res) {
              if (res.status === 'success') {
                // 登录成功
                wx.setStorageSync('sessionId', res.result)
              } else {
                wx.showToast({
									title: '获取登录异常',
									icon: 'none',
									duration: 2000
								})
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
            wx.showToast({
              title: '请退出小程序重新登录',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },
  onShow() {
    this.accountInfo = wx.getStorageSync('accountInfo')
    this.isApple = wx.getStorageSync('isApple')
  },
  methods: {
    getPhoneNumber: function (e) {
      const that = this
      console.log(e.mp.detail)
      if (e.mp.detail.errMsg !== 'getPhoneNumber:ok') {
        wx.showModal({
        title: '提示',
        showCancel:false,
        content: '未授权',
        success:function(res) {
          that.$backBeaforWin()
        }
        })
      }else {
          that.$ajax({
          url: '/wxUser/wxLoginChecked',
          data: {
            //7微信 8普通 6卡密
            "userMobile": "15721305936",
            "password": "123",
            "userOpenid": "1",
            sessionId: wx.getStorageSync('sessionId'),
            iv: e.mp.detail.iv,
            encryptedData: e.mp.detail.encryptedData
          },
          method: 'POST'
          }, function(res) {
            if (res.status === 'success') {
              const info = res.result
								wx.setStorageSync('token',res.result.token)
								wx.setStorageSync('accountInfo', info)
                wx.setStorageSync('work', res.result.work)
                that.accountInfo = info
            }
          })
      }
		},
    onGetUserInfo (e) {
      //登录授权
      const that = this
      if (e.mp.detail.rawData){
				console.log('用户允许授权')
			} else {
        console.log('用户拒绝按钮')
        return
      }
      const info = e.mp.detail.userInfo
      info['encryptedData'] = e.mp.detail.encryptedData
      info['iv'] = e.mp.detail.iv
      info['signature'] = e.mp.detail.signature
      info['rawData'] = e.mp.detail.rawData
      // info['sessionId'] = that.sessionKey
            //请求后台登录
            that.$ajax({
              url: '/wxUser/wxLoginChecked',
              data: {
                //7微信 8普通 6卡密
                "userMobile": "15721305936",
                "password": "123",
                "userOpenid": "1",
                userInfo: info,
                sessionId: that.sessionKey
              },
              method: 'POST'
            }, function(res) {
              if (res.status === 'success') {
                const info = Object.assign(data, res.result)
                wx.setStorageSync('token',res.result.token)
                wx.setStorageSync('accountInfo', info)
                that.accountInfo = info
              } else {
                wx.showToast({
									title: '获取登录异常',
									icon: 'none',
									duration: 2000
								})
              }
            })
    },
    handleJump(url) {
      if (!this.isLogin) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.$openWin(url)
    },
    exitLogin() {
      const that = this
      wx.removeStorage({
        key: 'token',
        success(res) {
          console.log(res)
        }
      })
      wx.removeStorage({
        key: 'accountInfo',
        success(res) {
          that.accountInfo = {}
        }
      })
      wx.showToast({
        title: '已退出',
        icon: 'none',
        duration: 2000
      })
    },
    clickCall() {
      wx.showActionSheet({
        itemList: ['客服电话：10107888'],
        success(res) {
          switch(res.tapIndex) {
            case 0:
              wx.makePhoneCall({phoneNumber: '10107888'})
              break
          }
        }
      })
    }
  }
}
</script>
<style scoped>
  .container{width:100%;height:100vh;background:#e8e8e8;object-fit: cover}
  .head-img{width:70px;height:70px;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,.2);background:#eee}
  .loginBtn{font-size:14px;color:#fff;padding:0px 20px;margin-left: 10px;background: #2d8cf0}
  .exitBtn{border: 1px solid #2d8cf0;padding:7px 15px;color:#2d8cf0;border-radius: 3px}
  .vip_item {
    position: relative;
  }
  .img_l {
    width:70px;height:70px;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,.2);background:#eee
  }
  .vip_item:after {
    content: 'v';
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    color: #fff;
    background-image: linear-gradient(to right, #f83600 0%, #f9d423 100%);
    border-radius: 50%;
    top: 0px;
    right: 0px;
    position: absolute;
  }
</style>
