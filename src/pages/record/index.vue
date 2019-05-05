<template>
	<div class="z-width-100-percent">
    <scroll-view scroll-y style="height:calc(100vh);" scroll-top="0" :scroll-into-view="currView">
      <dl class="ub-box ub-col">
        <div class="exam_title">暂无考试记录</div>
        <dd class="ub-box ub-col">
          <div class="z-width-100-percent z-bg-color-fff ub-box ub-col exam_box">
            <!-- <span :id="val.initial" class="ub-flex-1 z-padding-all-8-px z-font-size-14 z-color-888 codeBK">{{val.initial}}</span> -->
            <ul class="ub-box ub-col">
              <li @click.stop="clickCity(city)" v-for="(city, i) in totalQuestion" :key="i" class="city ub-flex-1 z-font-size-14 z-color-666">
                <div>{{city.examCode}}</div>
                <div>考试时间：{{city.examEndTime}}</div>
                <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888 "></i>
              </li>
            </ul>
          </div>
        </dd>
      </dl>
    </scroll-view>
    <!--fixed部分-->
    <!-- <dl class="fixList ub-box ub-col ub-ver-v">
      <dt class="z-font-size-12 z-margin-bottom-3-px" style="color:#06c1ae">最近热门</dt>
      <dd @click.stop="clickCode(val)" v-for="(val, idx) in cityList" :key="idx" class="z-font-size-12" style="margin-bottom:2px;color:#06c1ae;padding:0 50px;">{{val.initial}}</dd>
    </dl> -->
	</div>
</template>
<script>
  export default {
    data () {
      return {
        currView: 1,
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
          {zip: "025", name: "南京"},
          {zip: "025", name: "南京"},
          {zip: "025", name: "南京"},
          {zip: "025", name: "南京"},
          {zip: "025", name: "南京"},
        ],
        cityList: [],
        selectCity: {},
        totalQuestion: [],
        total: 0,
      }
    },
    onLoad() {
			const that = this
			wx.request({
				url: 'http://192.168.0.101:1234/expendables/api/question/getExamHistory',
				method: 'GET',
				header: {
                    "content-type": "application/json", 
                    'token': '080BA57DAE3D546AD585AF1255B64B177480C34EBA07E445AFE96F1557D8FE3741E9BBC9B7FD181F413F6E095DF769C770DDD3B3E8B6BEF0FBF7A5D6FB3E192616C348D6E386C53E351845E6B8B6D5FC'
                },
				success(res) {
					that.totalQuestion = res.data.result.list
					// that.currentQuestion = that.totalQuestion[0]
					// that.total = that.totalQuestion.length
					// that.totalArr = new Array(that.total)
			    }
        })
		},
    onShow() {
			wx.setNavigationBarTitle({title: '考试记录'})
		},
    methods: {
      initCityList() {
        this.cityList = this.visitCityList
      },
      clickCode(obj){
        if (obj.list.length < 1) return
        this.currView = obj.initial
      },
      clickCity(city) {
        var that = this
        console.log(city.examCode)
        this.$openWin('/pages/examRecord/main?code=' + city.examCode)
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
  .exam_box {
    border-top:1px solid #f5f5f5;
    border-bottom:1px solid #f5f5f5;
  }
  .exam_title {
    margin: 0 20px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #666;
  }
</style>