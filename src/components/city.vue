<template>
	<div class="z-width-100-percent">
    <scroll-view scroll-y style="height:calc(100vh);" scroll-top="0" :scroll-into-view="currView">
      <dl class="ub-box ub-col">
        <dd class="z-width-100-percent z-bg-color-fff ub-box z-border-bottom-1-eee">
          <span class="z-font-size-14 z-font-weight-bold z-color-333 z-padding-all-8-px">当前工种：{{current.styleName}}</span>
        </dd>
        <dd class="z-width-100-percent z-bg-color-fff ub-box">
          <span class="z-font-size-14 z-color-333 z-font-weight-bold z-padding-all-8-px" v-if="id==='1'">拥有工种</span>
          <span class="z-font-size-14 z-color-333 z-font-weight-bold z-padding-all-8-px" v-if="id==='2'">选择工种</span>
        </dd>
        <dd class="ub-box ub-col">
          <div class="z-width-100-percent z-bg-color-fff ub-box ub-col">
            <ul class="ub-box ub-col">
              <li @click.stop="clickCity(city)" v-for="(city, i) in cityList" :key="String(i)" class="city ub-flex-1 z-font-size-14 z-color-666">{{city.styleName}}
                <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888 "></i>
              </li>
            </ul>
          </div>
        </dd>
      </dl>
    </scroll-view>

    <i-modal title="购买工种" :visible="visible" @ok="handleOk" @cancel="handleCancel" class="buy">
      <div class="tip">添加或选择新的工种需要绑定新的卡密,一旦绑定不可修改</div>
			<div class="card_txt">
				<div class="info-inp"><label>工种</label><input v-model="tempWork.styleName" disabled="true"></div>
				<div class="info-inp"><label>卡号</label><input v-model="card" placeholder="请输入卡号"></div>
				<div class="info-inp"><label>密码</label><input v-model="password" type="password" placeholder="请输入密码"></div>
        <div class="error_txt">{{errorTxt}}</div>
			</div>
		</i-modal>
	</div>
</template>
<script>
  import cityData from "../utils/cityData.js"
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
      }
    },
    computed: {
      accountInfo() {
        return this.$store.state.accountInfo
      }
    },
    onLoad(options) {
      this.cityList = []
      this.current = wx.getStorageSync('work')
      this.id = options.id
      let url
      if(this.id === '1') {
         url = '/chooseStyle/getChooseStyle'
      } else {
         url = '/wxUser/getStyle'
      }
      const that = this
      this.$ajax({url: url}, function(res) {
        if(that.id === '1') {
          res.result.map(item => {
            if(item.currentUse === 1) {
              that.current = item
            }
          })
        }
        that.cityList = res.result
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
        var that = this
        let url
        if (this.id === '1') {
          url = '/chooseStyle/useingStyle'
        } else {
          url = '/chooseStyle/commitChoose'
        }
        const options = []
        if (city.workStyleChildArray || city.styleArray) {
          that.cityList = city.workStyleChildArray || city.styleArray
        } else {
          options.push(city)
          console.log(that.current)
          console.log(that.current.styleCode)
          if(that.current.styleCode === city.styleCode) {
            that.$reLaunch('/pages/index/main')
            return
          }
          // 购买工种判断
          if(that.current.styleCode && this.id === '2') {
            console.log(8888888888)
            that.visible = true
            console.log(that.visible)
            that.tempWork = city
            return false
          }
          wx.showModal({
            title: '提示',
            content: '是否确定选择此工种吗',
            success(res) {
              if (res.confirm) {
                that.$ajax({url: url, method: 'POST', data: that.id === '1'?city:options}, function(res) {
                  if (res.status === 'success') {
                    if (that.id === '1') {
                      that.current = city
                    }
                    that.updateUserInfo()
                  }
                })
              } else if (res.cancel) {
                console.log('取消')
              }
            }
          })
        }
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
</style>