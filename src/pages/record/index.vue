<template>
	<div class="z-width-100-percent">
    <scroll-view scroll-y scroll-top="0" class="scroll_100">
      <dl class="ub-box ub-col">
        <dd class="ub-box ub-col" v-if="totalQuestion.length">
          <div class="z-width-100-percent z-bg-color-fff ub-box ub-col exam_box">
            <ul class="ub-box ub-col">
              <li @click.stop="clickRecord(city)" v-for="(city, i) in totalQuestion" :key="i" class="city ub-flex-1 z-font-size-14 z-color-666">
                <div>{{city.examCode}}</div>
                <div>考试时间：{{city.examEndTime}}</div>
                <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888 "></i>
              </li>
            </ul>
          </div>
        </dd>
        <div class="exam_title" v-else>暂无考试记录</div>
      </dl>
    </scroll-view>
	</div>
</template>
<script>
  export default {
    data () {
      return {
        totalQuestion: [],
      }
    },
    onLoad() {
      const that = this
      this.$ajax({url: '/question/getExamHistory', method: 'GET'}, function(res) {
        that.totalQuestion = res.result.list
			})
		},
    onShow() {
			wx.setNavigationBarTitle({title: '考试记录'})
		},
    methods: {
      clickRecord(city) {
        var that = this
        console.log(city.examCode)
        this.$openWin('/pages/examRecord/main?code=' + city.examCode)
      }
    },
  }
</script>
<style scoped>
  .city{padding: 10px 8px;border-bottom: 1px solid #f5f5f5}
  .iconfont{display: inline-black;float: right;}
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