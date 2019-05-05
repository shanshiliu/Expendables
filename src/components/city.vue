<template>
	<div class="z-width-100-percent">
    <scroll-view scroll-y style="height:calc(100vh);" scroll-top="0" :scroll-into-view="currView">
      <dl class="ub-box ub-col">
        <dd class="z-width-100-percent z-bg-color-fff ub-box z-border-bottom-1-eee">
          <span class="z-font-size-14 z-font-weight-bold z-color-333 z-padding-all-8-px">当前工种：无</span>
        </dd>
        <dd class="z-width-100-percent z-bg-color-fff ub-box">
          <span class="z-font-size-14 z-color-333 z-font-weight-bold z-padding-all-8-px">分类</span>
        </dd>
        <dd class="ub-box ub-col">
          <div class="z-width-100-percent z-bg-color-fff ub-box ub-col">
            <ul class="ub-box ub-col">
              <li @click.stop="clickCity(city)" v-for="(city, i) in cityList" :key="String(i)" class="city ub-flex-1 z-font-size-14 z-color-666">{{city.stype}}
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
        currentMenu: 1,
        visitCityList: [
          {zip: "ajj", name: "质监局"},
          {zip: "zjj", name: "安监局"},
        ],
        hotCityList: [
          {zip: "010", name: "北京"},
          {zip: "021", name: "上海"},
          {zip: "020", name: "广州"},
          {zip: "0755", name: "深圳"},
          {zip: "022", name: "天津"},
          {zip: "028", name: "成都"},
          {zip: "0571", name: "杭州"},
          {zip: "023", name: "重庆"},
          {zip: "025", name: "南京"},
        ],
        cityList: [
          {zip: "010", name: "北京"},
          {zip: "021", name: "上海"},
        ],
        selectCity: {},
      }
    },
    onLoad() {
      // this.initAjax()
      const that = this
      this.$ajax({url: '/wxUser/getStyle'}, function(res) {
        that.cityList = res.result
      })
    },
    methods: {
        async initAjax() {
          let res = await this.$ajax({url: '/wxUser/getStyle'})
          this.cityList = res.result
          console.log(res)
        },
      clickCode(obj){
        if (obj.list.length < 1) return
        this.currView = obj.initial
      },
      clickCity(city) {
        var that = this
        const options = []
        options.push(city)
          wx.showModal({
            title: '提示',
            content: '是否确定选择此工种吗',
            success(res) {
              if (res.confirm) {
                console.log('确定')
                wx.request({
                  url: 'http://192.168.0.101:1234/expendables/api/chooseStyle/commitChoose',
                  method: 'POST',
                  data: options,
                  header: {
                    "content-type": "application/json", 
                    'token': '080BA57DAE3D546AD585AF1255B64B177480C34EBA07E445AFE96F1557D8FE3741E9BBC9B7FD181F413F6E095DF769C770DDD3B3E8B6BEF0FBF7A5D6FB3E192616C348D6E386C53E351845E6B8B6D5FC'
                  },
                  success(res) {
                    console.log(res.data.status)
                    if(res.data.status === 'success') {
                      that.$reLaunch('/pages/index/main')
                    }
                  },
                })
              } else if (res.cancel) {
                console.log('取消')
              }
            }
          })

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