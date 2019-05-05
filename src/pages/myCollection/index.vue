<template>
    <div class="exam">
        <div class="exam_header">
			<i-tabs :current="tabActive" @change="handleChange($event)">
				<i-tab key="tab1" title="答题模式"></i-tab>
				<i-tab key="tab2" title="背题模式"></i-tab>
			</i-tabs>
			<div>我的收藏
				<!-- <span class="fr">{{currentSubject}}/{{total}}</span> -->
				<span v-if="collectionIcon==='collection'" class="fr" @click="collectionHandle"><i-icon type="collection" 
				size="20" color="#f9e409"/></span>
				<span v-else class="fr" @click="collectionHandle"><i-icon type="collection_fill" 
				size="20" color="#f9e409"/></span>
				</div>
			<!-- <div class="date">考试日期:{{currentDate}}</div> -->
		</div>
		<div class="subject">
			<div class="title">
				1.挨罚给欧非付费后爱上覅欧莎阿瑟激发二佛阿瑟发而发生巨额佛萨尔of阿尔发色发色发。（）
			</div>
			<div class="select_group">
				<!-- <radio-group class="radio-group" bindchange="radioChange" color="red">
					<label class="radio" :key="index" v-for="(item,index) in items">
						<radio :value="item.name" :checked="item.checked" />
						{{item.value}}
					</label>
				</radio-group> -->
				<div :class="{'sub_error':item.status==='error','sub_correct':item.status==='correct'}"
				 :key="index" v-for="(item,index) in items" @click="selectAnswer(index)">
					{{item.value}}
				</div>
			</div>
		</div>
		<div>
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
		<!-- <i-modal id="menu_modal" :visible="visible" bind:ok="handleClose" 
		:show-ok="false" :show-cancel="false" bind:cancel="handleClose">
			<div>
				<span :class="{'select_box': (index+1)!==currentSubject,'current_box':(index+1)===currentSubject}" :key="index" v-for="(item,index) in totalArr" 
				@click="selectHandle(index+1)">
					<span>{{index+1}}</span>
				</span>
			</div>
		</i-modal>

		<i-toast id="toast" /> -->
    </div>
</template>
<script>
import {formatTime} from '../../utils/common.js'
const { $Toast } = require('../../../static/iview/base/index');

	export default {
	  	data () {
			return {
				currentDate: '',
				tabActive: 'tab1',
				currentSubject: 1,
				total: 100,
				isSelect: false,
				visible: false,
				totalArr: [],
				collectionIcon: 'collection',
				items: [
					{name: 'USA', value: 'A.美国', status: 'normal'},
					{name: 'CHN', value: 'B.中国', status: 'normal', 'answer': 'true'},
					{name: 'BRA', value: 'c.巴西', status: 'normal'},
					{name: 'JPN', value: 'd.日本', status: 'normal'},
				],
				targetTime: 0,
				clearTimer: false,
				myFormat: ['时', '分', '秒'],
			}
		},
		onShow() {
			wx.setNavigationBarTitle({title: '我的收藏'})
		},
		mounted() {
			this.currentDate = formatTime(new Date())
			this.totalArr = new Array(100)
			this.targetTime = new Date().getTime() + 6430000
			console.log(this.targetTime)
		},
		methods: {
			handleChange(e) {
				// console.log(detail)
				this.tabActive = e.mp.detail.key
			},
			prevHandle() {
				if(this.currentSubject === 1) {
					return
				}
				this.currentSubject --
				this.isSelect = false
			},
			nextHandle() {
				if(this.currentSubject === this.total) {
					return
				}
				this.currentSubject ++
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
				this.visible = false
			},
			selectAnswer(value) {
				if (this.isSelect) {
					return false
				}
				this.items.map((item,index) => {
					if (item.answer) {
						item.status = 'correct'
					} else if(index ===value && !item.answer) {
						this.items[index].status = 'error'
					}
				})
				this.isSelect = true
			},
			collectionHandle() {
				if (this.collectionIcon === 'collection') {
					this.collectionIcon = 'collection_fill'
					$Toast({
						content: '已收藏此题'
					});
				} else {
					this.collectionIcon = 'collection'
					$Toast({
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
		font-size: 14px;
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
	}
	.title {
		padding-bottom: 10px;
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
	}
	.float_menu {
		width: 30px;
		height: 30px;
		position: fixed;
		right: 5px;
		border: 1px solid #2d8cf0;
		bottom: 20px;
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
		background: rgb(219, 216, 216);
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
    .icon{
		width: 30px;
		height: 30px;
		border-radius: 50%;
		color: #2d8cf0;
		font-size: 24px
	}
</style>