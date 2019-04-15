<template>
    <div class="exam">
        <div class="exam_header">
			<div>全真题库
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
			<button type="default" size="mini" :disabled="currentSubject===1"
			 bindtap="mini"  @click="prevHandle">上一题</button>
			 <button type="primary" size="mini" :disabled="currentSubject===total"
			 bindtap="mini" @click="nextHandle">下一题</button>
		</div>
		<div class="float_menu icon-item" @click="openModal">
			<dd class="icon ub-box ub-ver iconfont icon-liebiaoshitucaidan"></dd>
		</div>
		<i-modal id="menu_modal" :visible="visible" bind:ok="handleClose" 
		:show-ok="false" :show-cancel="false" bind:cancel="handleClose">
			<div>
				<span :class="{'select_box': (index+1)!==currentSubject,'current_box':(index+1)===currentSubject}" :key="index" v-for="(item,index) in totalArr" 
				@click="selectHandle(index+1)">
					<span>{{index+1}}</span>
				</span>
			</div>
		</i-modal>

		<i-toast id="toast" />
    </div>
</template>
<script>
import {formatTime} from '../../utils/common.js'
const { $Toast } = require('../../../static/iview/base/index');

	export default {
	  	data () {
			return {
				currentDate: '',
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
		mounted() {
			this.currentDate = formatTime(new Date())
			this.totalArr = new Array(100)
			this.targetTime = new Date().getTime() + 6430000
			console.log(this.targetTime)
		},
		methods: {
			prevHandle() {
				this.currentSubject --
				this.isSelect = false
			},
			nextHandle() {
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
		border-left: 3px solid #06c1ae;
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
		border: 1px solid #06c1ae;
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
		color: #06c1ae;
		border: 1px solid #06c1ae;
	}
	.select_box span:click {
		color: #06c1ae;
		border: 1px solid #06c1ae;
	}
	.current_box span {
		width: 25px;
		height: 25px;
		line-height: 25px;
		border-radius: 25px;
		float: left;
		margin: 5px;
		color: #06c1ae;
		border: 1px solid #06c1ae;
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
		color: #06c1ae;
		font-size: 24px
	}
</style>