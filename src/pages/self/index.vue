<template>
  <div class="container ub-box ub-col">
    <dl class="ub-box z-padding-all-10-px" style="background:#fff">
      <dd :class="{'ub-box':true, 'ub-ver':true, 'vip_item':isLogin===true}">
         <image :src="userInfo.avatarUrl" class="head-img" mode="aspectFill"></image>
      </dd>
      <dd class="ub-flex-1 z-font-size-18 z-color-333 ub-box ub-ver-v z-padding-h-10-px">
        <button v-if="isLogin===false" class="loginBtn" lang="zh_CN" open-type="getUserInfo" @getuserinfo="onGetUserInfo">登录</button>
        <ul v-if="isLogin===true" class="ub-box z-margin-left-10-px ub-col">
          <li class="z-font-size-16 z-color-333 z-margin-bottom-5-px">{{userInfo.nickName}}</li>
          <li class="z-font-size-14 z-color-888">累计学习时长：1小时23分</li>
          <!-- <li class="z-font-size-14 z-color-888">{{userInfo.province}} {{userInfo.city}} {{userInfo.gender}}</li> -->
        </ul>
      </dd>
      <dd class="z-font-size-18 z-color-333 ub-box ub-ver-v" v-if="isLogin===true">
        <div @click.stop="exitLogin()" class="exitBtn ub-box ub-ver z-font-size-14">退出</div>
      </dd>
    </dl>
    <dl class="ub-box ub-col z-margin-top-10-px" style="background:#fff;">
      <dd @click.stop="$openWin('/pages/buyVip/main')" class="z-padding-all-10-px ub-box ub-between" style="border-bottom:1px solid #eee">
        <p class="ub-box ub-ver">
        <i class="iconfont icon-huiyuan" style="color:#2d8cf0;font-size:20px"></i>
        <span class="z-font-size-15 z-color-666 z-padding-h-10-px">购买会员</span>
        </p>
        <p class="ub-box ub-ver">
        <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888"></i>
        </p>
      </dd>
      <dd @click.stop="$openWin('/pages/citySelect/main')" class="z-padding-all-10-px ub-box ub-between" style="border-bottom:1px solid #eee">
        <p class="ub-box ub-ver">
        <i class="iconfont icon-renyuanxuanzetubiao" style="color:#2d8cf0;font-size:20px"></i>
        <span class="z-font-size-15 z-color-666 z-padding-h-10-px">我的工种 (切换)</span>
        </p>
        <p class="ub-box ub-ver">
        <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888"></i>
        </p>
      </dd>
      <dd @click.stop="$openWin('/pages/citySelect/main')" class="z-padding-all-10-px ub-box ub-between" style="border-bottom:1px solid #eee">
        <p class="ub-box ub-ver">
        <i class="iconfont icon-xuanzetubiao" style="color:#2d8cf0;font-size:20px"></i>
        <span class="z-font-size-15 z-color-666 z-padding-h-10-px">选择工种</span>
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

    <i-modal title="注册成功" :visible="visible"  @ok="handleOk" @cancel="handleCancel">
      <div class="card_txt">
        <div>如有卡密号，请输入卡密号登录获得更多会员权限</div>
          <input class="card_input" v-model="cardNumber" type="text" autofocus>
      </div>
    </i-modal>
  </div>
</template>
<script>
export default {
  computed: {
    isLogin() {
      return this.$store.state.isLogin
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    onGetUserInfo (e) {
      const that = this
      if (e.mp.detail.rawData){
				console.log('用户按了允许授权按钮')
				console.log(e.mp.detail.iv)
        console.log(e.mp.detail.encryptedData)
        console.log(e.mp.detail)
			} else {
				//用户按了拒绝按钮
				console.log('用户按了拒绝按钮')
      }
      const info = e.mp.detail.userInfo
      info['encryptedData'] = e.mp.detail.encryptedData
      info['iv'] = e.mp.detail.iv
      this.$store.commit('updateIsLogin', true)
      this.$store.commit('updateUser', info)
      wx.login({
        success(res) {
          if (res.code) {
            // 发起网络请求
            const data = e.mp.detail.userInfo
            info['code'] = res.code
            console.log(info)
            that.$store.commit('updateUser', info)
            that.visible = true
            //请求后台登录
            that.$ajax({
              url: '/wxUser/loginChecked',
              data: {
                "userMobile": "15721305936",
                "password": "123",
                "userOpenid": "1"
              },
              method: 'POST'
            }, function(res) {
              console.log('登录成功了')
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
      // const options = {
				// 	url: 'http://192.168.235.1:1234/expendables/api/wxUser/loginChecked',
				// 	method: 'POST',
				// 	data: {
				// 		"userMobile": "15721305936",
				// 		"password": "123",
				// 		"userOpenid": "1"
				// 	} 
				// }
				// this.$ajax()
    },
    handleOk(index) {
      this.visible = false
      const that = this
      this.$toast({
        content: '超级会员权限开通成功，祝您做题顺利',
        type: 'success'
      });
    },
    handleCancel(index) {
      this.visible = false
    },
    exitLogin() {
      this.$store.commit('updateIsLogin', false)
      this.$store.commit('cleanUserInfo')
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
  },
  onShow () {
    // wx.setNavigationBarTitle({title: '特易过'})
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
