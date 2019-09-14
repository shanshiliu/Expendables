<template>
    <div class="exam">
		<scroll-view scroll-y scroll-top="0" class="scroll_100">
			<div class="wu" v-if="totalQuestion.length===0">暂无错题，快去做题吧！</div>
			<div v-else>
				<i-tabs :current="tabActive" @change="handleChange($event)">
					<i-tab key="tab1" title="答题模式"></i-tab>
					<i-tab key="tab2" title="背题模式"></i-tab>
				</i-tabs>
				<div class="exam_header">
					<div>{{currentSubject}}/{{total}}
						<span v-if="!currentQuestion.isFavorite" class="fr" @click="collectionHandle"><i-icon type="collection" 
							size="24" color="#f9e409"/></span>
						<span v-else class="fr" @click="collectionHandle"><i-icon type="collection_fill" 
							size="24" color="#f9e409"/></span>
					</div>
				</div>
				<div class="subject">
					<span class="icon_choose" v-if="currentQuestion.questionType===1">单选题</span>
					<span class="icon_choose" v-if="currentQuestion.questionType===2">多选题</span>
					<span class="icon_choose" v-if="currentQuestion.questionType===3">判断题</span>
					<div class="title"><span class="pad30"></span>
						{{currentQuestion.question}}
					</div>
					<div class="select_group" v-if="tabActive==='tab1'">
						<div
						:key="index" v-for="(item,index) in currentQuestion.answerMapList" @click="selectAnswer(index,item)">
						<span class="inline_icon"><i :class="{'iconfont':true,'icon-xuanze':true,
							'icon-unif060':item.status==='error','icon-ShapeCopy':item.status==='correct','icon-xuanzhong':item.status==='select'}"
							style="color:#2d8cf0;font-size:20px"></i></span>{{item.key}}.<span class="answer_l" v-html="item.value"></span>
						</div>
					</div>
					<div class="select_group" v-if="tabActive==='tab2'">
						<div
						:key="index" v-for="(item,index) in currentQuestion.answerMapList">
						<span class="inline_icon"></span>{{item.key}}.<span class="answer_l" v-html="item.value"></span>
						</div>
					</div>
				</div>
				<div v-if="tabActive==='tab1'">
					<div v-if="currentQuestion.questionType===2&&!currentQuestion.isSelect">
						<i-button i-class="btn_question" size="small" shape="circle" type="primary" @click="submitHandle">提交</i-button>
					</div>
				</div>
				<div v-if="tabActive==='tab1'">	
					<div v-if="currentQuestion.isSelect" :class="{'is_error':currentQuestion.isSelect===2,'is_right':currentQuestion.isSelect===1}">
						<span v-if="currentQuestion.isSelect===1">您最对了！</span>
						<span v-if="currentQuestion.isSelect===2">您做错了</span>
						正确答案：<span v-for="(item,index) in currentQuestion.rightAnswerList" :key="String(index)">{{item}}</span>
					</div>
				</div>
				<div v-if="tabActive==='tab2'">
					正确答案：<span v-for="(item,index) in currentQuestion.rightAnswerList" :key="String(index)">{{item}}</span>
				</div>
				<div class="box_bottom">
					<i-button i-class="btn_question" size="small" @click="jumpHandle('prev')" :disabled="currentSubject===1">上一题</i-button>
					<i-button i-class="btn_question" size="small" type="primary" @click="jumpHandle('next')" :disabled="currentSubject===total">下一题</i-button>
				</div>
			</div>
		</scroll-view>
		<div class="float_menu icon-item" @click="openModal">
			<dd class="icon ub-box ub-ver iconfont icon-menu-two"></dd>
		</div>
		<i-action-sheet :action="actions" :visible="visible" :show-cancel="false"
		@cancel="handleClose" i-class="action_sheets">
			<view slot="header" style="margin: 16px">
				<div style="background: red">
					<span :class="{'select_box': (index+1)!==currentSubject,'current_box':(index+1)===currentSubject,'blue':item==='blue','red':item ==='red'}" :key="index" v-for="(item,index) in totalArr" 
					@click="selectHandle(index)">
						<span>{{index+1}}</span>
					</span>
				</div>
			</view>
		</i-action-sheet>
    </div>
</template>
<script>
import { formatTime } from '../../utils/common.js'
	export default {
	  	data () {
			return {
				currentSubject: 1,
				total: 1,
				// currentQuestion.isSelect: 0,
				visible: false,
				totalArr: [],
				tabActive: 'tab1',
				actions: [],
				collectionIcon: 'collection',
				totalQuestion: [],
				currentQuestion: {},
				showAnswer: false,
				answerArr: [],
				rightAnswer: [],
				submitAnswer:[],
				pageSize: 10,
				pageNum: 1,
			}
		},
		onLoad() {
			this.totalArr = []
			this.totalQuestion = []
			this.currentQuestion = {}
			this.getQuestions(1)
		},
		onShow() {
		    wx.setNavigationBarTitle({title: '错题集'})
		},
		methods: {
			getQuestions(init=0) {
				const that = this
				this.$ajax({url: `/errorQuestion/getErrorQuestion?pageSize=${this.pageSize}&pageNum=${this.pageNum}`, method: 'GET'}, function(res) {
					that.totalQuestion = res.result.list
					that.currentQuestion = that.totalQuestion[Math.abs(that.currentSubject%10-1)]
					that.total = res.result.total
					that.pageSize = res.result.pageSize
					that.pageNum = res.result.pageNum
					if(init) {
						that.totalArr = new Array(that.total).fill('1')
					}
				})
			},
			handleChange(e) {
				this.tabActive = e.mp.detail.key
			},
			jumpHandle(value) {
				const that = this
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
				//判断请求题
				if(this.currentSubject-(this.pageSize*this.pageNum)>=1 || this.currentSubject-(this.pageSize*this.pageNum)<=-10) {
					this.pageNum = Math.ceil(this.currentSubject/this.pageSize)
					this.getQuestions()
				} else {
					this.currentQuestion = this.totalQuestion[Math.abs(that.currentSubject%10-1)]
				}
			},
			openModal() {
				this.visible = true
			},
			handleClose() {
				this.visible = false
			},
			selectHandle(index) {
				const that = this
				this.currentSubject = index+1
				//判断请求题
				if(this.currentSubject-(this.pageSize*this.pageNum)>=1 || this.currentSubject-(this.pageSize*this.pageNum)<=-10) {
					this.pageNum = Math.ceil(this.currentSubject/this.pageSize)
					this.getQuestions()
				} else {
					this.currentQuestion = this.totalQuestion[Math.abs(that.currentSubject%10-1)]
				}
				this.visible = false
			},
			selectAnswer(index, item) {
				if (this.currentQuestion.isSelect) {
					return false
				}
				//多选答案
				if(this.currentQuestion.questionType === 2 && !this.currentQuestion.isSelect) {
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
					this.answerArr.push(item.key)
					const rightTemp = this.currentQuestion.rightAnswerList.toString()
					if(this.answerArr.toString() === rightTemp) {
						item.status = 'correct'
						this.currentQuestion.isSelect = 1
					} else {
						this.currentQuestion.answerMapList.map(lis => {
							if(lis.key === item.key) {
								lis.status = 'error'
							}else if (lis.key === rightTemp) {
								lis.status = 'correct'
							}
						})
						this.currentQuestion.isSelect = 2
					}
					//提交答案
					// const data  = {
					// 	code: this.currentQuestion.code,
					// 	answer: this.answerArr.join(','),
					// 	isRight: this.currentQuestion.isSelect
					// }
					// const url = this.currentQuestion.isSelect === 1 ? '/questionWare/commitQuestionWare' : '/questionWare/commitErrorQuestion'
					// this.$ajax({url: url, method: 'POST', data: data}, function(res) {
					// 	if(res.status) {
					// 		console.log('成功')
					// 	}
					// })
				}
				//做过样式
				if(this.currentQuestion.questionType === 1 || this.currentQuestion.questionType === 3) {
					this.totalArr[this.currentSubject-1] = this.currentQuestion.isSelect=== 2 ? 'red' : 'blue'
				}
			},
			submitHandle() {
				if (this.answerArr.sort().toString() === this.currentQuestion.rightAnswerList.toString()) {
					this.currentQuestion.isSelect = 1
				} else {
					this.currentQuestion.isSelect = 2
				}
				//提交答案
				// const data  = {
				// 	code: this.currentQuestion,
				// 	answer: this.answerArr.join(','),
				// 	isRight: this.currentQuestion.isSelect
				// }
				// const url = this.currentQuestion.isSelect === 1 ? '/questionWare/commitQuestionWare' : '/questionWare/commitErrorQuestion'
				// this.$ajax({url: url, method: 'POST', data: data}, function(res) {
				// 	if(res.status) {
				// 		console.log('成功')
				// 	}
				// })
				//做过样式
				this.totalArr[this.currentSubject-1] = this.currentQuestion.isSelect === 2 ? 'red' : 'blue'

			},
			collectionHandle() {
				const that = this
				if (!this.currentQuestion.isFavorite) {
					this.$ajax({url: `/favorite/favoriteQuestion/${this.currentQuestion.code}`, method: 'POST'}, function(res) {
						that.currentQuestion.isFavorite = 1
						if(res.status === 'success') {
							wx.showToast({
								title: '已收藏此题',
								icon: 'success',
								duration: 2000
							})
						}
					})
				} else {
					this.$ajax({url: `/favorite/cacelFavorite/${this.currentQuestion.code}`, method: 'POST'}, function(res) {
						if(res.status === 'success') {
							that.currentQuestion.isFavorite = 0
							wx.showToast({
								title: '已取消收藏此题',
								icon: 'none',
								duration: 2000
							})
						}
					})
				}
			},
		}
	}
</script>
<style scoped>
	.wu {
		margin-top: 20px;
		text-align: center;
		font-size: 14px;
		color:#333;
	}
	.exam {
		padding: 0 20px;
		font-size: 14px;
	}
	.exam_header {
		font-size: 16px;
		color:#333;
		margin-top: 10px;
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
		line-height: 30px;
		font-size: 16px;
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
	.blue span{
		background-color: #2d8cf0;
		border: 1px solid #2d8cf0 !important;
		color:#fff !important;
	}
	.red span{
		background-color: #e65757;
		border: 1px solid #e65757 !important;
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
		font-size: 16px;
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
</style>