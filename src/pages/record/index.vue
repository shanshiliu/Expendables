<template>
	<div class="z-width-100-percent">
    <scroll-view scroll-y scroll-top="0" class="scroll_100">
      <dl class="ub-box ub-col">
        <dd class="ub-box ub-col" v-if="totalQuestion.length">
          <div class="z-width-100-percent z-bg-color-fff ub-box ub-col exam_box">
            <ul class="ub-box ub-col">
              <li @click.stop="clickRecord(item)" v-for="(item, i) in totalQuestion" :key="i" :class="{'city':true, 'ub-flex-1':true, 'z-font-size-14':true, 'z-color-666':true, 'exam_li':true, 'no_submit':item.examQuestionCount!=100}">
                <div>考试成绩：{{item.examScore}}分 <span>用时：{{item.timeline}}</span></div>
                <div>考试时间：{{item.examStartTime}}</div>
                <span class="fr" v-if="item.examQuestionCount===100">查看</span>
                <!-- <i class="iconfont icon-xiayiyeqianjinchakangengduo z-font-size-14 z-color-888 "></i> -->
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
// import timeDifference from '../../utils/common.js'

  function longTime(seconds){
  //总秒数
  //seconds=seconds/1000;
  //得到小时
  var ss = seconds/1000
  var hour = ss/3600
  var r = ss%3600
  var m = r/60 
  var s = r%60 
  parseInt(hour) > 0 ? hour = parseInt(hour)+"小时" : hour = ''
  parseInt(m) > 0? m = parseInt(m)+"分" : m = ''
  // parseInt(s) > 0 ? parseInt(s)
  // console.log(parseInt(s))
  return  hour + m + s + '秒'
}

  export default {
    data () {
      return {
        totalQuestion: [],
      }
    },
    onLoad() {
    },
    mounted() {
      const that = this
      this.$ajax({url: '/question/getExamHistory', method: 'GET'}, function(res) {
        that.totalQuestion = res.result.list.map(item => {
          item['timeline'] = longTime(Date.parse(item.examEndTime) - Date.parse(item.examStartTime))
          return item
        })
        console.log(that.totalQuestion)
			})
    },
    onShow() {
			wx.setNavigationBarTitle({title: '考试记录'})
		},
    methods: {
      clickRecord(item) {
        if (item.examQuestionCount === 100) {
          var that = this
          this.$openWin('/pages/examRecord/main?code=' + item.examCode)
        }
        
      }
    },
  }
</script>
<style scoped>
  .city{
    padding: 10px 8px;
    border-bottom: 1px solid #f5f5f5;
  }
  .no_submit:before {
    content: '未提交';
    /* width: 50px; */
    height: 20px;
    line-height: 20px;
    border: 1px solid #e65757;
    color: #e65757;
    font-weight: 700;
    padding: 0 5px;
    display: inline-block;
    top: 30px;
    right: 20px;
    position: absolute;
    border-radius: 3px;
    rotate: 30deg;
  }
  .iconfont{
    display: inline-black;
    float: right;
  }
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
  .exam_li {
    position: relative;
  }
  .exam_li div {
    line-height: 30px;
    width:calc(100% - 30px);
    position: relative;
  }
  .exam_li .fr {
    position: absolute;
    top: 20px;
    padding: 10px;
    background: #2d8cf0;
    color: white;
    border-radius: 40px;
    right: 10px;
  }
</style>