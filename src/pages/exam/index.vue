<template>
    <div class="exam">
		<scroll-view scroll-y scroll-top="0" class="scroll_100">
        <div class="exam_header">
			<div>模拟考试 <span class="fr">{{currentSubject}}/{{total}}</span>
			<span class="jiao"><i-button i-class="jiao" size="small" shape="circle" type="primary" @click="submitQ">交卷</i-button></span>
			</div>
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
					style="color:#2d8cf0;font-size:20px"></i></span>{{item.key}}.{{item.value}}
				</div>
			</div>
		</div>
		<div v-if="questionStyle==='多选'&&!currentQuestion.isSelect">
			<i-button i-class="btn_question" size="small" shape="circle" type="primary" @click="submitAnswer">提交</i-button>
		</div>
		<div v-if="currentQuestion.isSelect" :class="{'is_error':currentQuestion.isSelect===2,'is_right':currentQuestion.isSelect===1}">
			<span v-if="currentQuestion.isSelect===1">您最对了！</span>
			<span v-if="currentQuestion.isSelect===2">您做错了</span>
			正确答案：<span v-for="(item,index) in currentQuestion.rightAnswerList" :key="String(index)">{{item}}</span>
		</div>
		<div class="box_bottom">
			 <i-button i-class="btn_question" size="small" @click="jumpHandle('prev')" :disabled="currentSubject===1">上一题</i-button>
			 <i-button i-class="btn_question" size="small" type="primary" @click="jumpHandle('next')" :disabled="currentSubject===total">下一题</i-button>
		</div>
		<div class="float_menu icon-item" @click="openModal">
			<dd class="icon ub-box ub-ver iconfont icon-menu-two"></dd>
		</div>
		<i-action-sheet :action="actions" :visible="visible" :show-cancel="false"
		 @cancel="handleClose" i-class="action_sheets">
			<view slot="header" style="margin: 16px">
				<div style="background: red">
				    <span :class="{'select_box': (index+1)!==currentSubject,'current_box':(index+1)===currentSubject}" :key="index" v-for="(item,index) in totalArr" 
					@click="selectHandle(index)">
						<span>{{index+1}}</span>
					</span>
				</div>
			</view>
		</i-action-sheet>
		</scroll-view>
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
				score: 0
			}
		},
		onLoad() {
			const that = this
			//  '/errorQuestion/getErrorQuestion'
			this.$ajax({url: '/question/exam', method: 'POST'}, function(res) {
				that.totalQuestion = res.result
				that.currentQuestion = that.totalQuestion[0]
				that.total = that.totalQuestion.length
				that.totalArr = new Array(that.total)
				that.questionStyle = that.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
			})
		},
		mounted() {
			this.currentDate = formatTime(new Date())
		},
		onShow() {
		    wx.setNavigationBarTitle({title: '模拟考试'})
		},
		methods: {
			submitQ() {
				const data = {
					score: this.score,
					examEndTime: formatTime(new Date()),
					questions: this.submitAnswer
				}
				this.$ajax({url: '/question/commitExam', method: 'POST' , data: data}, function(res) {
				})
			},
			handleChange(e) {
				this.tabActive = e.mp.detail.key
			},
			jumpHandle(value) {
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
			},
			openModal() {
				this.visible = true
			},
			handleClose() {
				this.visible = false
			},
			selectHandle(index) {
				this.currentSubject = index+1
				this.currentQuestion = this.totalQuestion[index]
				this.visible = false
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
					//单选答案 提交
					this.answerArr.push(item.key)
					const rightTemp = this.currentQuestion.rightAnswerList.toString()
					//正确
					if(this.answerArr.toString() === rightTemp) {
						item.status = 'correct'
						this.currentQuestion.isSelect = 1
						this.submitAnswer.push({
							code: this.currentQuestion.code,
							answer: rightTemp,
						    isRight: 1,
						})
					} else {
						//错误
						console.log(rightTemp)
						this.currentQuestion.answerMapList.map(lis => {
							if(lis.key === item.key) {
								lis.status = 'error'
							}else if (lis.key === rightTemp) {
								lis.status = 'correct'
							}
						})
						this.submitAnswer.push({
							code: this.currentQuestion.code,
							answer: rightTemp,
						    isRight: 2,
						})
						this.currentQuestion.isSelect = 2
					}
				}
				console.log(this.answerArr)
			},
			submitAnswer() {
				//多选提交答案
				console.log(this.answerArr)
				if (this.answerArr.sort().toString() === this.currentQuestion.rightAnswerList.toString()) {
					this.currentQuestion.isSelect = 1
					this.submitAnswer.push({
						code: this.currentQuestion.code,
						answer: this.answerArr.join(','),
						isRight: 2,
					})
				} else {
					this.currentQuestion.isSelect = 2
					this.submitAnswer.push({
						code: this.currentQuestion.code,
						answer: this.answerArr.join(','),
						isRight: 2,
					})
				}
			},
			collectionHandle() {
				if (this.collectionIcon === 'collection') {
					this.collectionIcon = 'collection_fill'
					wx.showToast({
						title: '已收藏此题',
						icon: 'success',
						duration: 2000
					})
				} else {
					this.collectionIcon = 'collection'
					wx.showToast({
						title: '已取消收藏此题',
						icon: 'none',
						duration: 2000
					})
				}
			}
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
	.jiao {
		width: 60px;
	}
</style>