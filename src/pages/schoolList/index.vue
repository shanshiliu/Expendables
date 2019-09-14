<template>
	<div class="z-width-100-percent">
    <scroll-view scroll-y style="height:calc(100vh);" scroll-top="0" :scroll-into-view="currView">
      <dl class="ub-box ub-col">
        <dd class="z-width-100-percent z-bg-color-fff ub-box z-border-bottom-1-eee">
          <span class="z-font-size-16 z-font-weight-bold z-color-333 z-padding-all-8-px">当前城市：{{city}}</span>
        </dd>
        <dd class="z-width-100-percent z-bg-color-fff ub-box">
          <span class="z-font-size-16 z-color-333 z-font-weight-bold z-padding-all-8-px">附近学校</span>
        </dd>
        <dd class="ub-box ub-col">
          <div class="z-width-100-percent z-bg-color-fff ub-box ub-col">
            <ul class="ub-box ub-col">
             <div v-if="cityList.length===0" class="no_data">暂无数据</div>
              <li @click.stop="clickCity(city)" v-for="(city, i) in cityList" :key="String(i)" class="city ub-flex-1 z-font-size-16 z-color-666">{{city.organizationName}}
                <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-16 z-color-888 "></i>
              </li>
            </ul>
          </div>
        </dd>
      </dl>
    </scroll-view>

	</div>
</template>
<script>
  export default {
    data () {
      return {
        currView: '',
        cityList: [],
        id: '',
        current: {},
        visible: false,
        card: '',
        password: '',
        tempWork: {},
        errorTxt: '',
        city: ''
      }
    },
    computed: {
      accountInfo() {
        return this.$store.state.accountInfo
      }
    },
    onLoad(options) {
      const that = this
      that.city = options.city
      this.$ajax({url: `/organization/getNearbyOrganization/${options.adcode}`}, function(res) {
        if (res.status === 'success') {
          that.cityList = res.result || []
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
          this.$openWin('/pages/schoolInfo/main?id=' + city.id)
      }
    },
  }
</script>
<style scoped>
  .search{background: #f5f5f5;width: 90%;border-radius: 15px;padding: 0 10px}
  .codeBK{background: #f5f5f5}
  .hotcity{border:1px solid #f5f5f5;padding: 6px 12px;margin: 0 8px 8px 0}
  .city{padding: 10px 8px;border-bottom: 1px solid #f5f5f5; color: #2d8cf0 }
  .iconfont{display: inline-black;float: right;}
  .fixList{position: fixed;right:5px;top: 12%;z-index: 10;width: 30px;background: transparent;}
  .info-inp label {
    vertical-align:10px;
  }
  .info-inp input {
    display: inline-block;
  }
  .tip {
    margin-bottom: 10px;
    padding: 0 20px;
  }
  .error_txt {
    color: #e65757;
    font-size: 14px;
    text-align: center;
  }
  .no_data {
    text-align: center;
    height: 300px;
    line-height: 300px;
  }
</style>