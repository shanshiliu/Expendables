<template>
	<div class="z-width-100-percent">
    <scroll-view scroll-y style="height:calc(100vh);" scroll-top="0" :scroll-into-view="currView">
      <dl class="ub-box ub-col">
        <dd class="z-width-100-percent z-bg-color-fff ub-box z-border-bottom-1-eee">
          <span class="z-font-size-14 z-font-weight-bold z-color-333 z-padding-all-8-px">当前工种：{{current.styleName}}</span>
        </dd>
        <dd class="z-width-100-percent z-bg-color-fff ub-box">
          <span class="z-font-size-14 z-color-333 z-font-weight-bold z-padding-all-8-px">分类</span>
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
	</div>
</template>
<script>
  import cityData from "../utils/cityData.js"
  export default {
    data () {
      return {
        currView: '',
        cityList: [
          {zip: "010", name: "北京"},
          {zip: "021", name: "上海"},
        ],
        id: '',
        current: {},
      }
    },
    computed: {
      accountInfo() {
        return this.$store.state.accountInfo
      }
    },
    onLoad(options) {
      // console.log(options)
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
          wx.showModal({
            title: '提示',
            content: '是否确定选择此工种吗',
            success(res) {
              if (res.confirm) {
                console.log('确定')
                that.$ajax({url: url, method: 'POST', data: that.id === '1'?city:options}, function(res) {
                  if (res.status === 'success') {
                    if (that.id === '1') {
                      that.current = city
                    }
                    console.log(that.id)
                    console.log(that.accountInfo)
                    if(that.id === '2' && !that.accountInfo.styleCode) {
                      that.accountInfo.styleCode = city.styleCode
                      that.$store.commit('updateAccount', that.accountInfo)
                      console.log('更新工种')
                    }
                    wx.showToast({
                      title: '选择工种成功，赶紧做题吧',
                      icon: 'success',
                      duration: 2000
                    })
                    that.$reLaunch('/pages/index/main')
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
  .city{padding: 10px 8px;border-bottom: 1px solid #f5f5f5}
  .iconfont{display: inline-black;float: right;}
  .fixList{position: fixed;right:5px;top: 12%;z-index: 10;width: 30px;background: transparent;}
</style>