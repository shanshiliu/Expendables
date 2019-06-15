<template>
    <div class="exam">
		<scroll-view scroll-y scroll-top="0" class="scroll_100">
        <div class="exam_header clearfix">
			<span>模拟考试&nbsp;&nbsp;&nbsp;&nbsp;{{currentSubject}}/{{total}}</span>
			<i-button id="jiao" i-class="jiao" size="small" shape="circle" type="primary" @click="submitQ">交卷</i-button>
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
				 :key="index" v-for="(item,index) in currentQuestion.answerMapList" @click="selectAnswer(index,item)">
				 <span class="inline_icon"><i :class="{'iconfont':true,'icon-xuanze':true,
					'icon-unif060':item.status==='error','icon-ShapeCopy':item.status==='correct','icon-xuanzhong':item.status==='select'}"
					style="color:#2d8cf0;font-size:20px"></i></span>{{item.key}}.<span class="answer_l" v-html="item.value"></span>
				</div>
			</div>
		</div>
		<div>
			<view class="view-wrap">
				<text class="type-title">倒计时：</text>
				<i-count-down
						class="count_down"
						:target="targetTime"
						:clear-timer="clearTimer"
						bind:callback="myLinsterner"
				></i-count-down>
			</view>
		</div>
		<div class="box_bottom">
			 <i-button i-class="btn_question" size="small" @click="jumpHandle('prev')" :disabled="currentSubject===1">上一题</i-button>
			 <i-button i-class="btn_question" size="small" type="primary" @click="jumpHandle('next')" :disabled="currentSubject===totalArr.length">下一题</i-button>
		</div>
		</scroll-view>
		<i-action-sheet :action="actions" :visible="visible" :show-cancel="false"
		 @cancel="handleClose" i-class="action_sheets">
			<view slot="header" style="margin: 16px">
				<div style="background: red">
				    <span :class="{'select_box': (index+1)!==currentSubject,'current_box':(index+1)===currentSubject, 'blue': item==='blue'}" :key="index" v-for="(item,index) in totalArr" 
					@click="selectHandle(index)">
						<span>{{index+1}}</span>
					</span>
				</div>
			</view>
		</i-action-sheet>

		<i-modal title="交卷" :visible="visibleB" @ok="handleOk" @cancel="handleCancel">
			<div class="card_txt">
				<div v-if="submitAnswer.length===total">是否确认交卷</div>
				<div v-else>题未做完是否交卷，是否确认交卷</div>
			</div>
		</i-modal>

		<i-modal title="成绩" :visible="visibleC" @ok="handleScore($event)" @cancel="handleBack">
			<div class="scroe_txt">
				<div>恭喜您考试顺利，提交成功</div>
				<div>本次考试得分：<span>{{score}}</span>分</div>
				<div>是否前往考试记录查看</div>
			</div>
		</i-modal>
		<div class="float_menu icon-item" @click="openModal">
			<dd class="icon ub-box ub-ver iconfont icon-menu-two"></dd>
		</div>
    </div>
</template>
<script>
import { formatTime } from '../../utils/common.js'
	export default {
	  	data () {
			return {
				currentSubject: 1,
				total: 1,
				currentDate: '',
				visible: false,
				visibleB: false,
				visibleC: false,
				totalArr: [],
				tabActive: 'tab1',
				actions: [],
				collectionIcon: 'collection',
				totalQuestion: [],
				currentQuestion: {},
				showAnswer: false,
				questionStyle: '单选',
				answerArr: [],
				rightAnswer: [],
				submitAnswer: [],
				score: 0,
				actions2: [
					{
						name: '返回'
					},
					{
						name: '前往考试记录查看',
						color: '#2d8cf0'
					},
				],
				targetTime: 0,
				clearTimer: false,
			}
		},
		onLoad() {
			this.currentSubject = 1
			this.score = 0
			const that = this
			this.currentDate = formatTime(new Date())
			this.targetTime = new Date().getTime() + 5400000
		},
		onShow() {
			const that = this
			wx.setNavigationBarTitle({title: '模拟考试'})
			wx.showModal({
              title: '提示',
              content: '全真模拟考试，一旦开始中途不可退出，退出作废',
              success (res) {
                if (res.confirm) {
                  that.getQuestions()
                } else if (res.cancel) {
                  	wx.navigateBack({
						delta: 1
				  	})
                }
              }
            })
			
		},
		methods: {
			getQuestions() {
				const that = this
				this.$ajax({url: '/question/exam', method: 'POST'}, function(res) {
					if(res.status === 'success') {
						that.totalQuestion = res.result
						that.currentQuestion = that.totalQuestion[0]
						that.total = that.totalQuestion.length
						that.totalArr = new Array(that.total).fill('1')
						that.questionStyle = that.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
					} else {
						wx.showModal({
							title: '提示',
							showCancel:false,
							content: res.error.reason,
							success:function(res) {
								that.getQuestions()
							}
						})
					}
				})
			},
			submitQ() {
				this.visibleB = true
			},
			handleOk() {
				this.saveAnswer()
				const that = this
				for(var i=0; i< this.submitAnswer.length; i++) {
					if(this.submitAnswer[i].isRight === 1) {
						this.score ++
					}
				}
				const data = {
					score: this.score,
					examEndTime: formatTime(new Date()),
					questions: this.submitAnswer
				}
				this.$ajax({url: '/question/commitExam', method: 'POST' , data: data}, function(res) {
					if(res.status === 'success') {
						that.visibleB = false
						that.visibleC = true
					}
				})
			},
			handleCancel() {
				this.visibleB = false
			},
			handleScore(e) {
				console.log(e)
				this.visibleC = false
				this.$redirectTo('/pages/record/main')
			},
			handleBack() {
				this.visibleC = false
				this.$backBeaforWin()
			},
			handleChange(e) {
				this.tabActive = e.mp.detail.key
			},
			jumpHandle(value) {
				this.saveAnswer()
				this.answerArr = []
				if(value === 'prev') {
					if(this.currentSubject===1){
						return
					}
					this.currentSubject --
				} else if(value === 'next') {
					if(this.currentSubject===this.total){
						return
					}
					this.currentSubject ++
				}
				this.currentQuestion = this.totalQuestion[this.currentSubject-1]
				this.questionStyle = this.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
				if(this.submitAnswer.length) {
					// 读取记录的的答案
					this.submitAnswer.map(item => {
						if(item.code === this.currentQuestion.code) {
							this.answerArr = item.answer.split(',')
						}
					})
				}
				console.log(this.answerArr)
			},
			openModal() {
				this.visible = true
			},
			getpush(params) {
				this.submitAnswer.push(params)
			},
			handleClose() {
				this.visible = false
			},
			selectHandle(index) {
				//保存当前题答案
				this.saveAnswer()
				this.currentSubject = index+1
				this.currentQuestion = this.totalQuestion[index]
				this.visible = false
				if(this.submitAnswer.length) {
					// 读取记录的的答案
					this.submitAnswer.map(item => {
						if(item.code === this.currentQuestion.code) {
							this.answerArr = item.answer.split(',')
						}
					})
				}
			},
			myLinsterner() {
				this.handleOk()
			},
			selectAnswer(index, item) {
				if (this.currentQuestion.isSelect) {
					return false
				}
				//多选答案
				if(this.questionStyle === '多选' && !this.currentQuestion.isSelect) {
					if(item.status===undefined || item.status === '') {
						item.status = 'select'
						this.answerArr.push(item.key)
					} else {
						const index = this.answerArr.indexOf(item.key)
						if(index > -1) {
							this.answerArr.splice(index,1)
						}
						item.status = ''
					}
					this.$forceUpdate()
				} else {
					//单选答案
					this.answerArr = []
					this.answerArr.push(item.key)
					this.currentQuestion.answerMapList.map(subs => {
						if(subs.key === item.key) {
							subs.status = 'select'
						} else {
							subs.status = ''
						}
					})
					this.$forceUpdate()
				}
				//做过样式
				if(this.answerArr.length) {
					this.totalArr[this.currentSubject-1] = 'blue'
				} else {
					this.totalArr[this.currentSubject-1] = '1'
				}
				console.log(this.totalArr)
				this.$forceUpdate()
			},
			saveAnswer() {
				const that = this
				var kong
				if(this.answerArr.length === 0) {
					if(this.submitAnswer.length) {
						this.submitAnswer.map((item, i)=> {
							if(item.code === this.currentQuestion.code) {
								kong = i
								console.log(999999999999)
								this.submitAnswer.splice(kong,1)
							}
						})
					}
					return
				}
				let isRight
				if (this.answerArr.sort().toString() === this.currentQuestion.rightAnswerList.toString()) {
				   isRight = 1
				} else {
				   isRight = 2
				}
				const params = {
					code: this.currentQuestion.code,
					answer: this.answerArr.join(','),
					isRight: isRight
				}
				let ishave
				if(this.submitAnswer.length) {
					this.submitAnswer.map((item, i)=> {
						if(item.code === params.code) {
							this.submitAnswer[i] = params
							ishave = true
						} else {
							if(i === this.submitAnswer.length-1&&!ishave) {
								that.getpush(params)
							}
						}
					})
				} else {
					console.log('push')
					this.submitAnswer.push(params)					
				}
				console.log(this.submitAnswer)
			}
		},
		// onUnload() {
		// 	this.saveAnswer()
		// 	const that = this
		// 	this.submitAnswer.map(item => {
		// 		if(item.isRight) {
		// 			this.score ++
		// 		}
		// 	})
		// 	const data = {
		// 		score: this.score,
		// 		examEndTime: formatTime(new Date()),
		// 		questions: this.submitAnswer
		// 	}
		// 	this.$ajax({url: '/question/commitExam', method: 'POST' , data: data}, function(res) {
		// 		if(res.status === 'success') {
		// 			console.log('提交考试成功')
		// 		}
		// 	})
		// }
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
		height: 40px;
		margin-top: 20px;
	}
	.exam_header span {
		margin-top: 20px;
	}
	.exam_header .fr {
		line-height: 40px;
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
		right: 130px;
		border: 1px solid #2d8cf0;
		top: 25px;
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
	.blue span{
		background-color: #2d8cf0;
		color:#fff !important;
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
	.is_error {
		color:#e65757;
		padding-left: 20px;
	}
	.is_right {
		color: #2d8cf0;
		padding-left: 20px;
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
	.scroe_txt {
		text-align: center;
		line-height: 30px;
	}
	.scroe_txt span {
		color: #35db9c;
		font-size: 20px;
		padding-right: 3px;
	}
	.count_down {
		display: inline-block;
	}
</style>