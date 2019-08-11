<template>
	<div class="z-width-100-percent">
    <scroll-view scroll-y style="height:calc(100vh);" scroll-top="0" :scroll-into-view="currView">
      <dl class="ub-box ub-col">
        <dd class="z-width-100-percent z-bg-color-fff ub-box">
          <span class="z-font-size-14 z-color-333 z-font-weight-bold z-padding-all-8-px">题库分类</span>
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
  export default {
    data () {
      return {
        cityList: [],
        id: '',
      }
    },
    onLoad(options) {
      this.cityList = []
      this.id = options.id || ''
      const that = this
      this.$ajax({url: '/wxUser/checkIsChildStyle'}, function(res) {
        if(res.status === 'success') {
          that.cityList = res.result.array
        }
      })
    },
    methods: {
      clickCity(city) {
        if (this.id === '1') {
          this.$openWin('/pages/exam/main?styleCode=' + city.styleCode)
        } else {
          this.$openWin('/pages/Exercise/main?styleCode=' + city.styleCode)
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