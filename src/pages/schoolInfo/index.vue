<template>
	<div>
    <scroll-view scroll-y style="height:calc(100vh);" scroll-top="0" :scroll-into-view="currView">
      <div class="info_main"> 
        <div class="title">{{schoolInfo.organizationName}}</div>
        <div>
          学校简介：{{schoolInfo.organizationDesc}}
        </div>
        <div>
          联系电话： {{schoolInfo.organizationMobile}}
        </div>
        <div>
          学校地址：{{schoolInfo.organizationAddress}}
        </div>
      </div>
    </scroll-view>
	</div>
</template>
<script>
  export default {
    data () {
      return {
        schoolInfo: {}
      }
    },
    computed: {
      accountInfo() {
        return this.$store.state.accountInfo
      }
    },
    onLoad(options) {
      const that = this
      this.$ajax({url: `/organization/getOrganization/${options.id}`}, function(res) {
        if (res.status === 'success') {
          that.schoolInfo = res.result
        }
      })
    },
    methods: {
      handleOk() {
        if (!this.card) {
          this.errorTxt = '请输入卡号'
          return
        }
        if (!this.password) {
          this.errorTxt = '请输入密码'
          return
        }
        this.errorTxt = ''
        const data  = {
          cardCode: this.card,
					cardPassword: this.password,
          styleCode: this.tempWork.styleCode,
          realName:  '',
					schoolName: '',
          
        }
        const that = this
        that.$ajax({url: '/wxUser/activeCard', method: 'POST', data: data}, function(res) {
          if (res.status === 'success') {
            wx.showToast({
              title: '卡密激活成功',
              icon: 'success',
              duration: 2000
            })
            that.visible = false
            wx.setStorageSync('workId', 1)
            that.$reLaunch('/pages/index/main')
          } else if (res.status === 'error') {
            wx.showToast({
              title: res.error.reason,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      updateUserInfo() {
        const that = this
				this.$ajax({url: '/wxUser/getUserInfo  ', method: 'GET'}, function(res) {
					if(res.status === 'success') {
						wx.setStorageSync('accountInfo', res.result)
            wx.setStorageSync('work', res.result.work)
            wx.setStorageSync('workId', 1)
						wx.showToast({
              title: '选择工种成功，赶紧做题吧',
              icon: 'success',
              duration: 2000
            })
            that.$reLaunch('/pages/index/main')
					}
				})
			},
      handleCancel() {
        this.visible = false
      },
      clickCity(city) {
          this.$openWin('/schoolInfo/main?id=3')
      }
    },
  }
</script>
<style scoped>
  .info_main {
    padding: 20px;
    color: #333;
    font-size: 16px;
    line-height: 32px;
  }
  .title {
    text-align: center;
    font-size: 18px;
    margin-top: 30px;
    margin-bottom: 20px;
  }
</style>