<template>
    <div class="exam">
		<scroll-view scroll-y scroll-top="0" class="scroll_100">
			<div v-if="totalQuestion.length">
				<i-tabs :current="tabActive" @change="handleChange($event)">
					<i-tab key="tab1" title="答题模式"></i-tab>
					<i-tab key="tab2" title="背题模式"></i-tab>
				</i-tabs>
				<div class="exam_header">
					<div>{{currentTotal}}/{{total}}
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
						<img :src="item" v-for="(item, i) in currentQuestion.imageList" :key="String(i)">
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
					<div v-if="currentQuestion.questionType===2&&currentQuestion.isDoIt===2">
						<i-button i-class="btn_question" size="small" shape="circle" type="primary" @click="submitHandle">提交</i-button>
					</div>
				</div>
				<div v-if="tabActive==='tab1'">	
					<div v-if="currentQuestion.isDoIt!=2" :class="{'is_error':currentQuestion.isDoIt===0,'is_right':currentQuestion.isDoIt===1}">
						<span v-if="currentQuestion.isDoIt===1">您最对了！</span>
						<span v-if="currentQuestion.isDoIt===0">您做错了</span>
						正确答案：<span v-for="(item,index) in currentQuestion.rightAnswerList" :key="String(index)">{{item}}</span>
					</div>
				</div>
				<div v-if="tabActive==='tab2'">
					正确答案：<span v-for="(item,index) in currentQuestion.rightAnswerList" :key="String(index)">{{item}}</span>
				</div>
				<div class="box_bottom">
					<i-button i-class="btn_question" size="small" @click="jumpHandle('prev')" :disabled="currentTotal===1">上一题</i-button>
					<i-button i-class="btn_question" size="small" type="primary" @click="jumpHandle('next')" :disabled="currentTotal==total">下一题</i-button>
				</div>
			</div>
		</scroll-view>

		<div class="float_menu icon-item" @click="openModal">
				<dd class="icon ub-box ub-ver iconfont icon-menu-two"></dd>
			</div>
			<!-- 答题卡 -->
			<i-action-sheet :action="actions" :visible="visible" :show-cancel="false"
			@cancel="handleClose" i-class="action_sheets">
				<view slot="header" style="margin: 16px">
					<div class="page_style" @click="scrolltoupper">上一页</div>
					<!-- <scroll-view scroll-y scroll-top="0" :style="{'height': '300px'}" @scrolltoupper="scrolltoupper" @scrolltolower="scrolltolower" @scroll="scroll"> -->
					<div class="clearfix">
						<span :class="{'select_box': (index+1)!==currentSubject,'current_box':(index+1)===currentSubject,'blue':styleArr[index]===1, 'red': styleArr[index]===0}" :key="index" v-for="(item,index) in totalArr" 
						@click="selectHandle(index)">
							<span>{{index+1+(pageNo-1)*pageLength}}</span>
						</span>
					</div>
					<div class="page_bottom" @click="scrolltolower">下一页</div>
					<!-- </scroll-view> -->
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
				visible: false,
				totalArr: [],
				styleArr: [],
				total: '',
				tabActive: 'tab1',
				actions: [],
				totalQuestion: [],
				currentQuestion: {
					isDoIt: 1
				},
				answerArr: [],
				rightAnswer: [],
				currentCode: 0,
				pageNum: 1,
				pageSize:10,
				pageNo:1,
				pageLength:200,
				childStyleCode: '',
				currentTotal: 1,
			}
		},
		onLoad(options) {
			this.pageNo = 1
			this.totalArr = []
			this.totalQuestion = []
			this.currentQuestion = {}
			this.childStyleCode = options.styleCode || ''
			this.currentTotal = this.currentSubject = options.id ? this.currentSubject : 1
			const that = this
			this.$ajax({url: `/questionWare/getQuestionCodes?childStyleCode=${this.childStyleCode}&pageNum=${this.pageNo}&pageSize=${this.pageLength}`, method: 'GET'}, function(res) {
				if(res.status === 'success') {
					that.total = res.result.total
					that.totalArr = res.result.codes
					that.currentCode = that.totalArr[that.currentSubject-1]
					that.styleArr = res.result.isRights
					that.getQuestions()
				} else {
					wx.showToast({
						title: res.error.reason,
						icon: 'none',
						duration: 2000
					})
				}
			})
		},
		onShow() {
			wx.setNavigationBarTitle({title: '全真题库'})
		},
		onUnload() {
			wx.setStorageSync('workId', this.currentSubject)
		},
		methods: {
			scrolltoupper() {
				const that = this
				if(that.pageNo <=1) {
					return
				}
				that.pageNo --
				this.$ajax({url: `/questionWare/getQuestionCodes?childStyleCode=${this.childStyleCode}&pageNum=${this.pageNo}&pageSize=${this.pageLength}`, method: 'GET'}, function(res) {
					if(res.status === 'success') {
						that.totalArr = res.result.codes
						that.styleArr = res.result.isRights
					} else {
						wx.showToast({
							title: res.error.reason,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			scrolltolower() {
				const that = this
				if(that.pageNo*that.pageLength >= that.total) {
					return
				}
				that.pageNo ++
				this.$ajax({url: `/questionWare/getQuestionCodes?childStyleCode=${this.childStyleCode}&pageNum=${this.pageNo}&pageSize=${this.pageLength}`, method: 'GET'}, function(res) {
					if(res.status === 'success') {
						that.totalArr = res.result.codes
						that.styleArr = res.result.isRights
					} else {
						wx.showToast({
							title: res.error.reason,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			getQuestions() {
				// 获取题
				const that = this
				let data
				if (that.pageNum*that.pageSize >200) {
					const end = (that.pageNum*that.pageSize%200) === 0 ? 200 : (that.pageNum*that.pageSize%200)
					data = that.totalArr.slice(((that.pageNum*that.pageSize-that.pageSize)%200),end)
				} else {
					const end = (that.pageNum*that.pageSize%200) === 0 ? 200 : (that.pageNum*that.pageSize%200)
					data = that.totalArr.slice(that.pageNum*that.pageSize-that.pageSize,end)
				}
				that.$ajax({url: `/questionWare/getQuestionWare`, method: 'POST', data: data}, function(res) {
					if(res.error && res.error.code == 'DEV_BS_200014') {
						wx.showToast({
							title: res.error.reason,
							icon: 'none',
							duration: 2000
						})
						return
					}
					that.totalQuestion = res.result.list
					that.currentQuestion = res.result.list[Math.abs((that.currentSubject-1)%10)]
					// that.currentQuestion.questionType = that.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
					that.changeStyle()
					// that.totalQuestion = that.totalQuestion.concat(res.result.list)
					// that.totalQuestion.map(item => {
					// 	if (item.code === that.currentCode) {
					// 		// 当前题
					// 		// item.isDoIt = 1
					// 		that.currentQuestion = item
							
					// 		that.changeStyle(item)
					// 	}
					// })
				})
			},
			changeStyle() {
				// 做过改变样式
				const that = this
				if(that.currentQuestion.questionType === 2 && that.currentQuestion.isDoIt != 2) {
					that.currentQuestion.answerMapList = that.currentQuestion.answerMapList.map(subs => {
						let str = (that.currentQuestion.isDoIt === 1 ? that.currentQuestion.rightAnswerList.toString() : that.currentQuestion.errorAnswerList.toString())
						if (str.indexOf(subs.key)>-1) {
							subs['status'] = 'select'
						}
						return subs
					})
				} else if((that.currentQuestion.questionType === 1||that.currentQuestion.questionType === 3) && that.currentQuestion.isDoIt != 2) {
					that.currentQuestion.answerMapList = that.currentQuestion.answerMapList.map(subs => {
						if (that.currentQuestion.rightAnswerList.toString() === subs.key) {
							subs['status'] = 'correct'
						}
						if(that.currentQuestion.isDoIt === 0 && that.currentQuestion.errorAnswerList.toString() === subs.key) {
							subs['status'] = 'error'
						}
						return subs
					})
				}
			},
			handleChange(e) {
				this.tabActive = e.mp.detail.key
			},
			jumpHandle(value) {
				const that = this
				this.answerArr = []
				if(value === 'prev') {
					if(this.currentTotal===1){
						return
					}
					this.currentSubject --
					this.currentTotal --
				} else if(value === 'next') {
					if(this.currentTotal===this.total){
						return
					}
					this.currentSubject ++
					this.currentTotal ++
				}
				if(this.currentTotal-(this.pageLength*this.pageNo)>=1 || this.currentTotal-(this.pageLength*this.pageNo)<=-200) {
					//total要翻页了
					this.pageNo = Math.ceil(this.currentTotal/this.pageLength)
					this.$ajax({url: `/questionWare/getQuestionCodes?childStyleCode=${this.childStyleCode}&pageNum=${this.pageNo}&pageSize=${this.pageLength}`, method: 'GET'}, function(res) {
						if(res.status === 'success') {
							that.totalArr = res.result.codes
							that.styleArr = res.result.isRights
							//判断请求题
							if(that.currentSubject-(that.pageSize*that.pageNum)>=1 || that.currentSubject-(that.pageSize*that.pageNum)<=-10) {
								that.pageNum = Math.ceil(that.currentSubject/that.pageSize)
								that.getQuestions()
							} else {
								that.currentQuestion = that.totalQuestion[Math.abs((that.currentSubject-1)%10)]
								// that.currentQuestion.questionType = that.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
								that.changeStyle()
							}
						} else {
							wx.showToast({
								title: res.error.reason,
								icon: 'none',
								duration: 2000
							})
						}
					})
				} else {
					//判断请求题
					if(this.currentSubject-(this.pageSize*this.pageNum)>=1 || this.currentSubject-(this.pageSize*this.pageNum)<=-10) {
						this.pageNum = Math.ceil(this.currentSubject/this.pageSize)
						this.getQuestions()
					} else {
						this.currentQuestion = this.totalQuestion[Math.abs((that.currentSubject-1)%10)]
						// this.currentQuestion.questionType = this.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
						that.changeStyle()
					}
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
				this.answerArr = []
				this.currentSubject = index + 1
				this.currentTotal = this.currentSubject+(this.pageNo-1)*this.pageLength
				//判断请求题
				if(this.currentSubject-(this.pageSize*this.pageNum)>=1 || this.currentSubject-(this.pageSize*this.pageNum)<=-2) {
					this.pageNum = Math.ceil(this.currentSubject/this.pageSize)
					this.getQuestions()
				} else {
					this.currentQuestion = this.totalQuestion[Math.abs((that.currentSubject-1)%10)]
				//   this.currentQuestion.questionType = this.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
				}
				this.visible = false
			},
			selectAnswer(index, item) {
				const that = this
				if (this.currentQuestion.isDoIt != 2) {
					return false
				}
				//多选答案
				if(this.currentQuestion.questionType === 2 && this.currentQuestion.isDoIt === 2) {
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
				} else if ((that.currentQuestion.questionType === 1||that.currentQuestion.questionType === 3) && this.currentQuestion.isDoIt === 2) {
					//单选答案
					that.answerArr = []
					this.answerArr.push(item.key)
					const rightTemp = this.currentQuestion.rightAnswerList.toString()
					if(this.answerArr.toString() === rightTemp) {
						item.status = 'correct'
						this.currentQuestion.isDoIt = 1
					} else {
						this.currentQuestion.answerMapList.map(lis => {
							if(lis.key === item.key) {
								lis.status = 'error'
							}else if (lis.key === rightTemp) {
								lis.status = 'correct'
							}
						})
						this.currentQuestion.isDoIt = 0
					}
					//提交答案
					const data  = {
						code: this.currentQuestion.code,
						answer: this.answerArr.join(','),
						isRight: this.currentQuestion.isDoIt === 1 ? 1 : 2,
						childStyleCode: this.childStyleCode,
					}
					const url = this.currentQuestion.isDoIt === 1 ? '/questionWare/commitQuestionWare' : '/questionWare/commitErrorQuestion'
					this.$ajax({url: url, method: 'POST', data: data}, function(res) {
						if(res.status) {
							that.answerArr = []
						}
					})
				}
				//做过样式
				if(this.answerArr.length && (that.currentQuestion.questionType === 1||that.currentQuestion.questionType === 3)) {
					if (this.currentQuestion.isDoIt ===1) {
						this.styleArr[(this.currentSubject-1)%200] = 1
					} else {
						this.styleArr[(this.currentSubject-1)%200] = 0
					}
				} else {
					this.styleArr[(this.currentSubject-1)%200] = 2
				}
			},
			submitHandle() {
				const that = this
				if (this.answerArr.sort().toString() === this.currentQuestion.rightAnswerList.toString()) {
					this.currentQuestion.isDoIt = 1
				} else {
					this.currentQuestion.isDoIt = 0
				}
				//提交答案
				const data  = {
					code: this.currentQuestion.code,
					answer: this.answerArr.join(','),
					isRight: this.currentQuestion.isDoIt===1 ? 1 : 2,
					childStyleCode: this.childStyleCode,
				}
				const url = this.currentQuestion.isDoIt === 1 ? '/questionWare/commitQuestionWare' : '/questionWare/commitErrorQuestion'
				this.$ajax({url: url, method: 'POST', data: data}, function(res) {
					if(res.status) {
						that.answerArr = []
					}
				})
				//做过样式
				if(this.answerArr.length && this.currentQuestion.questionType === 2) {
					if (this.currentQuestion.isDoIt === 1) {
						this.styleArr[this.currentSubject-1] = 1
					} else {
						this.styleArr[this.currentSubject-1] = 0
					}
				} else {
					this.styleArr[this.currentSubject-1] = 2
				}
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
		width: 30px;
		height: 30px;
		line-height: 30px;
		border: 1px solid #ccc;
		border-radius: 30px;
		float: left;
		margin: 5px;
	}
	.blue span{
		background-color: #2d8cf0;
		color:#fff !important;
	}
	.red span {
		background: #e65757;
		color: #fff !important;
		border: 1px solid #e65757 !important;
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
		width: 30px;
		height: 30px;
		line-height: 30px;
		border-radius: 30px;
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
		height: 30px;
		line-height: 30px;
		display: inline-block;
		position: absolute;
		left: -2px;
		top: -1px;
	}
	.page_style {
		width: 100%;
		height: 40px;
		line-height: 40px;
		color: #2d8cf0;
		border-bottom: 1px solid #2d8cf0;
		margin-bottom: 10px;
		font-size: 14px;
	}
	.page_bottom {
		width: 100%;
		height: 30px;
		line-height: 30px;
		color: #2d8cf0;
		border-top: 1px solid #2d8cf0;
		margin-top: 10px;
		font-size: 14px;
	}
</style>