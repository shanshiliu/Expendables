<template>
    <div class="exam">
		<scroll-view scroll-y scroll-top="0" class="scroll_100">
        <div class="exam_header">
			<div>模拟考试 <span class="fr">{{currentSubject}}/{{total}}</span></div>
			<div class="date">考试时间:{{currentDate}}</div>
		</div>
		<div class="subject">
			<span class="icon_choose" v-if="questionStyle==='单选'">单选题</span>
			<span class="icon_choose" v-if="questionStyle==='多选'">多选题</span>
			<div class="title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				{{currentQuestion.question}}
			</div>
			<div class="select_group">
				<div
				 :key="index" v-for="(item,index) in currentQuestion.answerList" @click="selectAnswer(index, questionStyle,item)">
				 <span class="inline_icon"><i :class="{'iconfont':true,'icon-xuanze':true,
					'icon-unif060':item.status==='error','icon-ShapeCopy':item.status==='correct','icon-xuanzhong':item.status==='select'}"
					style="color:#2d8cf0;font-size:20px"></i></span>{{item}}
				</div>
			</div>
		</div>
		<div>
			<i-button i-class="btn_question" size="small" shape="circle" type="primary" v-if="questionStyle==='多选'"  @click="submitAnswer">提交</i-button>
		</div>
		<div v-if="showAnswer">
			<span>{{descText}}</span>
			正确答案： a b c
		</div>
		<div>
			<view class="view-wrap">
				<text class="type-title">剩余时间：</text>
				<i-count-down
						:target="targetTime"
						:clear-timer="clearTimer"
                        :format="myFormat"
				></i-count-down>
			</view>
		</div>
		<div class="box_bottom">
			 <i-button i-class="btn_question" size="small" @click="prevHandle" :disabled="currentSubject===1">上一题</i-button>
			 <i-button i-class="btn_question" size="small" type="primary" @click="nextHandle" :disabled="currentSubject===total">下一题</i-button>
		</div>
		<div class="float_menu icon-item" @click="openModal">
			<dd class="icon ub-box ub-ver iconfont icon-menu-two"></dd>
		</div>

		
		<i-action-sheet :action="actions" :visible="visible" :show-cancel="false"
		 @cancel="handleClose" i-class="action_sheets">
			<view slot="header" style="margin: 16px">
				<!-- <view style="color: #444;font-size: 16px">确定吗？</view> -->
				<div style="background: red">
				    <span :class="{'select_box': (index+1)!==currentSubject,'current_box':(index+1)===currentSubject}" :key="index" v-for="(item,index) in totalArr" 
					@click="selectHandle(index+1)">
						<span>{{index+1}}</span>
					</span>
				</div>
			</view>
		</i-action-sheet>
		</scroll-view>
    </div>
</template>
<script>
import {formatTime} from '../../utils/common.js'
	export default {
	  	data () {
			return {
				currentDate: '',
				currentSubject: 1,
				total: 100,
				isSelect: false,
				visible: false,
				totalArr: [],
				items: [
					{name: 'USA', value: 'A.美国', status: 'normal'},
					{name: 'CHN', value: 'B.中国', status: 'normal', 'answer': 'true'},
					{name: 'BRA', value: 'c.巴西', status: 'normal'},
					{name: 'JPN', value: 'd.日本', status: 'normal'},
				],
				actions: [
					{
						name: '删除',
						color: '#ed3f14'
					}
				],
				targetTime: 0,
				clearTimer: false,
				myFormat: ['时', '分', '秒'],

				totalQuestion: [],
				currentQuestion: {},
				showAnswer: false,
				descText: '',
				questionStyle: '单选',
				answerArr: [],
				rightAnswer: [],
			}
		},
		onLoad() {
			const that = this
			this.$ajax({url: '/question/exam', method: 'POST'}, function(res) {
				that.totalQuestion = res.result
				that.currentQuestion = that.totalQuestion[0]
				that.total = that.totalQuestion.length
				that.totalArr = new Array(that.total)
				that.targetTime = new Date().getTime() + 6430000
				that.questionStyle = that.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
			})
		// 	wx.request({
		// 		url: 'http://192.168.0.101:1234/expendables/api/question/exam',
		// 		method: 'POST',
		// 		header: {
        //             "content-type": "application/json", 
        //             'token': '080BA57DAE3D546AD585AF1255B64B177480C34EBA07E445AFE96F1557D8FE3741E9BBC9B7FD181F413F6E095DF769C770DDD3B3E8B6BEF0FBF7A5D6FB3E192616C348D6E386C53E351845E6B8B6D5FC'
        //         },
		// 		success(res) {
		// 			that.totalQuestion = res.data.result
		// 			that.currentQuestion = that.totalQuestion[0]
		// 			that.total = that.totalQuestion.length
		// 			that.totalArr = new Array(that.total)
		// 			that.targetTime = new Date().getTime() + 6430000
		// 	    }
        //    })
		},
		mounted() {
			this.currentDate = formatTime(new Date())
			
			// console.log(this.targetTime)
		},
		onShow() {
		    wx.setNavigationBarTitle({title: '模拟考试'})
		},
		methods: {
			prevHandle() {
				if(this.currentSubject === 1) {
					return
				}
				this.currentSubject --
				this.currentQuestion = this.totalQuestion[this.currentSubject]
				this.isSelect = false
				this.questionStyle = this.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
			},
			nextHandle() {
				if(this.currentSubject === this.total) {
					return
				}
				this.currentSubject ++
				this.currentQuestion = this.totalQuestion[this.currentSubject]
				this.questionStyle = this.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
				this.isSelect = false
			},
			openModal() {
				console.log(this.visible)
				this.visible = true
			},
			handleClose() {
				this.visible = false
			},
			selectHandle(value) {
				this.currentSubject = value
				this.currentQuestion = this.totalQuestion[this.currentSubject]
				this.visible = false
			},
			selectAnswer(index, params, item) {
				if (this.isSelect) {
					return false
				}
				//多选答案
				if (params === '多选' && !this.currentQuestion[index].status) {
					this.answerArr.push(this.currentQuestion[index].value)
					this.currentQuestion[index].status = 'select'
					return false
				} else {
					//单选答案
					this.currentQuestion.answerList.map((item,index) => {
						if (item.value === this.rightAnswer.toString()) {
							item.status = 'correct'
						} else if(index ===value && !item.answer) {
							this.items[index].status = 'error'
						}
					})

					if (this.currentQuestion.rightAnswerList.toString() === item) {
						console.log()
						this.currentQuestion[index].status = 'correct'
					} else {
						this.currentQuestion[index].status = 'error'
					}
				}
				this.isSelect = true
			},
			// selectAnswer(value) {
			// 	wx.request({
			// 		url: 'http://192.168.0.101:1234/expendables/api/question/commitExam',
			// 		method: 'POST',
			// 		data: [
			// 			{
			// 			"code":"11ZJ8478734",
			// 			"answer":"A,B",
			// 			"isRight":1
			// 			},
			// 			{
			// 			"code":"53ZJ8492731",
			// 			"answer":"A,B",
			// 			"isRight":0
			// 			}
			// 		],
			// 		header: {
			// 			"content-type": "application/json", 
			// 			'token': '080BA57DAE3D546AD585AF1255B64B177480C34EBA07E445AFE96F1557D8FE3741E9BBC9B7FD181F413F6E095DF769C770DDD3B3E8B6BEF0FBF7A5D6FB3E192616C348D6E386C53E351845E6B8B6D5FC'
			// 		},
			// 		success(res) {
			// 			console.log(res.data.result)
			// 			that.cityList = res.data.result
			// 		}
			// 	})
			// 	if (this.isSelect) {
			// 		return false
			// 	}
			// 	this.items.map((item,index) => {
			// 		if (item.answer) {
			// 			item.status = 'correct'
			// 		} else if(index ===value && !item.answer) {
			// 			this.items[index].status = 'error'
			// 		}
			// 	})
			// 	this.isSelect = true
			// },
		}
	}
</script>
<style scoped>

	.exam {
		padding: 0 20px;
		font-size: 14px;
	}
	.exam_header {
		font-size: 16px;
		color:#333;
		margin-top: 20px;
	}
	.date {
		font-size: 12px;
		color: #999;
	}
	.fr {
		float: right;
	}
	.subject {
		margin: 10px 0;
		border-left: 3px solid #2d8cf0;
		padding-left: 5px;
		position: relative;
	}
	.title {
		padding-bottom: 10px;
		line-height: 24px;
		font-size: 14px;
	}
	.radio {
		display: block;
		width: 100%;
		line-height: 40px;
	}
	.box_bottom button {
		width: 30%;
		margin: 10%;
		display: inline-block;
		margin-top: 50px;
	}
	.float_menu {
		width: 30px;
		height: 30px;
		position: fixed;
		right: 5px;
		border: 1px solid #2d8cf0;
		bottom: 40px;
	}
	#menu_modal  .i-modal-main {
		width: 100%;
		bottom: 0px;
		position: fixed;
	}
	.select_box span {
		width: 25px;
		height: 25px;
		line-height: 25px;
		border: 1px solid #ccc;
		border-radius: 25px;
		float: left;
		margin: 5px;
	}
	.select_box span:hover {
		color: #2d8cf0;
		border: 1px solid #2d8cf0;
	}
	.select_box span:click {
		color: #2d8cf0;
		border: 1px solid #2d8cf0;
	}
	.current_box span {
		width: 25px;
		height: 25px;
		line-height: 25px;
		border-radius: 25px;
		float: left;
		margin: 5px;
		color: #2d8cf0;
		border: 1px solid #2d8cf0;
	}
	.select_group div{
		border-radius: 5px;
		padding:5px;
		margin:5px;
		font-size: 14px;
		/* background: rgb(219, 216, 216); */
	}
	.icon-unif060 {
		color: #e65757 !important;
	}
	.sub_error {
		background: #e65757 !important;
	}
	.sub_correct {
		background: #35db9c !important;
	}
	.type-title {
		display: inline-block;
	}
	.inline_icon {
		display: inline-block;
		vertical-align: -1px;
		margin-right: 10px;
	}
    .icon{
		width: 30px;
		height: 30px;
		border-radius: 50%;
		color: #2d8cf0;
		font-size: 24px
	}
	.icon_choose {
		background: #2d8cf0;
		width: 50px;
		text-align: center;
		font-size: 14px;
		color: #fff;
		height: 25px;
		line-height: 25px;
		display: inline-block;
		position: absolute;
		left: -2px;
		top: -1px;
	}
</style>