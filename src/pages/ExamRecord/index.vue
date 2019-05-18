<template>
    <div class="exam">
		<scroll-view scroll-y scroll-top="0" class="scroll_100">
        <div class="exam_header">
			<div>{{currentSubject}}/{{total}}
				<span v-if="collectionIcon==='collection'" class="fr" @click="collectionHandle"><i-icon type="collection" 
					size="24" color="#f9e409"/></span>
					<span v-else class="fr" @click="collectionHandle"><i-icon type="collection_fill" 
					size="24" color="#f9e409"/></span>
			</div>
		</div>
		<div class="subject">
			<span class="icon_choose" v-if="questionStyle==='单选'">单选题</span>
			<span class="icon_choose" v-if="questionStyle==='多选'">多选题</span>
			<div class="title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				{{currentQuestion.question}}
			</div>
			<div class="select_group">
				<div
				 :key="index" v-for="(item,index) in currentQuestion.answerMapList">
				 <span class="inline_icon"><i :class="{'iconfont':true,'icon-xuanze':true,
					'icon-unif060':item.status==='error','icon-ShapeCopy':item.status==='correct','icon-xuanzhong':item.status==='select'}"
					style="color:#2d8cf0;font-size:20px"></i></span>{{item.key}}{{item.value}}
				</div>
			</div>
		</div>
		<div>
			<span>{{descText}}</span>
			正确答案： <span v-for="(item,index) in currentQuestion.rightAnswerList" :key="String(index)">{{item}}</span>
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
				isSelect: false,
				visible: false,
				totalArr: [],
				tabActive: 'tab1',
				actions: [],
				collectionIcon: 'collection',
				totalQuestion: [],
				currentQuestion: {},
				showAnswer: false,
				descText: '',
				questionStyle: '单选',
				answerArr: [],
				rightAnswer: [],
			}
		},
		onLoad(options) {
			this.currentSubject = 1
			const that = this
			this.$ajax({url: '/examRecord/getExamRecord?examCode=' + options.code, method: 'GET'}, function(res) {
				that.totalQuestion = res.result
				that.currentQuestion = that.totalQuestion[0]
				that.total = that.totalQuestion.length
				that.totalArr = new Array(that.total)
				that.questionStyle = that.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
				that.changeStyle()
			})
		},
		mounted() {
		},
		onShow() {
		    wx.setNavigationBarTitle({title: '考试记录'})
		},
		methods: {
			changeStyle() {
				// 改变样式
				const that = this
				if(that.questionStyle === '多选') {
					that.currentQuestion.answerMapList = that.currentQuestion.answerMapList.map(subs => {
						let str = that.currentQuestion.answer
						if (str.indexOf(subs.key)>-1) {
							subs['status'] = 'select'
						}
						return subs
					})
					if(that.currentQuestion.rightAnswerList.toString() === that.currentQuestion.answer.replace(/,/g,'')) {
						that.descText = '您做对了！'
					} else {
						that.descText = '您做错了！'
					}
				} else if(that.questionStyle === '单选') {
					that.currentQuestion.answerMapList = that.currentQuestion.answerMapList.map(subs => {
						if (that.currentQuestion.rightAnswerList.toString() === that.currentQuestion.answer) {
							that.descText = '您做对了！'
						}
						if (that.currentQuestion.rightAnswerList.toString() === subs.key) {
							subs['status'] = 'correct'
						}
						if(that.currentQuestion.rightAnswerList.toString() != that.currentQuestion.answer && that.currentQuestion.answer === subs.key) {
							subs['status'] = 'error'
							that.descText = '您做错了！'
						}
						return subs
					})
					
				}
			},
			handleChange(e) {
				this.tabActive = e.mp.detail.key
			},
			prevHandle() {
				if(this.currentSubject === 1) {
					return
				}
				this.currentSubject --
				this.currentQuestion = this.totalQuestion[this.currentSubject-1]
				this.isSelect = false
				this.questionStyle = this.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
				this.changeStyle()
			},
			nextHandle() {
				if(this.currentSubject === this.total) {
					return
				}
				this.currentSubject ++
				this.currentQuestion = this.totalQuestion[this.currentSubject-1]
				this.questionStyle = this.currentQuestion.rightAnswerList.length === 1 ? '单选' : '多选'
				this.isSelect = false
				this.changeStyle()
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
			collectionHandle() {
				if (this.collectionIcon === 'collection') {
					this.collectionIcon = 'collection_fill'
					this.$toast({
						content: '已收藏此题'
					});
				} else {
					this.collectionIcon = 'collection'
					this.$toast({
						content: '已取消收藏此题'
					});
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