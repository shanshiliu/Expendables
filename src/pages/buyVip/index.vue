<template>
    <div class="vip_page">
        <div class="card clearfix">
				<div class="w70 fl">
					<div>购买会员卡</div>
					<div class="f12">享受海量题库，让考试更简单，成绩更优秀。</div>
				</div>
				<div class="w30 fl">
					<div>VIP</div>
				</div>
		</div>
		<div class="content">
			<!-- <div :class="{lis:true, line_height: current===1}" @click="selectHandle(1)">
				<div class="fl">
					<div>卡密兑换</div>
					<div class="slogin">享受独家最高题库权限，考试无忧。</div>
				</div>
			</div> -->
			<div :class="{lis:true, line_height: current===2}" @click="selectHandle(2)">
				<div class="fl">
					<div>VIP购买</div>
					<div class="slogin">海量题库随意做，助力考试。</div>
				</div>
				<div class="fr"> ￥30 </div>
			</div>
			<div :class="{lis:true, line_height: current===3}" @click="selectHandle(3)">
				<div class="fl">
					<div>考试次数购买（5次）</div>
					<div class="slogin">模拟考试，提升自己</div>
				</div>
				<div class="fr"> ￥5 </div>
			</div>
		</div>
		<div class="btn clearfix">
			<div class="fl" v-if="current!=1">{{money}}元</div>
			<button class="fr"  @click="buyHandle">{{text}}</button>
		</div>

		<i-modal title="会员开通" :visible="visible" @ok="handleOk" @cancel="handleCancel">
			<div class="card_txt">
				<div>
					<view class="section">
						<!-- <view class="section__title">多列选择器</view> -->
						<picker
							mode="multiSelector"
							@change="bindMultiPickerChange($event)"
							@columnchange="bindMultiPickerColumnChange($event)"
							:value="multiIndex"
							:range="multiArray"
							:range-key="'styleName'"
						>
							<view class="picker">
							工种选择：<span>{{selectWork.styleName}}</span>
							</view>
						</picker>
					</view>
				</div>
				<div class="error_txt">工种一旦绑定不可修改，请确认无误</div>
			</div>
		</i-modal>
		
    </div>
</template>
<script>
import {formatTime} from '../../utils/common.js'
	export default {
	  	data () {
			return {
				current: 2,
				text: '购买',
				money: '30.00',
				visible: false,
				cardNumber: '',
				multiArray: [[{}],[{}],[{}]],
				multiIndex: [0, 0, 0],
				selectWork: {},
			}
		},
		mounted() {
			const that = this
			this.$ajax({url: '/wxUser/getStyle'}, function(res) {
				const arr = []
				const arr1 = res.result
				const arr2 = res.result[0].workStyleChildArray
				const arr3 = res.result[0].workStyleChildArray[0].styleArray
				arr.push(arr1,arr2,arr3)
				that.multiArray = arr
				console.log(that.multiArray[0][that.multiIndex[0]].styleName)
			})
		},
		methods: {
			bindMultiPickerChange(e) {
				// console.log(e)
				this.selectWork = this.multiArray[2][this.multiIndex[2]]
			},
			bindMultiPickerColumnChange(e) {
				// console.log(e)
				const column = e.mp.detail.column
				const value = e.mp.detail.value
				console.log(value)
				if (column === 0) {
					console.log(this.multiArray[column][value])
					this.multiIndex = [value,0,0]
					this.multiArray[1] = this.multiArray[column][value].workStyleChildArray
					this.multiArray[2] = this.multiArray[1][0].styleArray
					console.log(this.multiArray[1])
				} else if (column === 1) {
					this.multiIndex = [this.multiIndex[0],value,0]
					this.multiArray[2] = this.multiArray[column][value].styleArray
					// console.log(this.multiArray[column][value],999)
				} else {
					this.multiIndex[2] = value
				}
				this.multiArray = [this.multiArray[0],this.multiArray[1],this.multiArray[2]]
				this.selectWork = this.multiArray[2][this.multiIndex[2]]
				// const index = this.multiIndex[]
				console.log(this.multiArray[2][this.multiIndex[2]])
				
			},
			selectHandle(num) {
				this.current = num
				if(num===1) {
					this.text = '兑换'
				} else if (num === 2) {
					this.text = '开通'
					this.money = '30.00'
				} else {
					this.text = '购买'
					this.money = '5.00'
					this.payExam()
				}
			},
			payMoney() {
				const that = this
				const data = {
					code: wx.getStorageSync('code'),
                    styleCode: this.selectWork.styleCode
				}
				this.$ajax({url: '/order/createUnifiedOrder', method: 'POST' , data: data}, function(res) {
					if (res.status === 'error') {
						wx.showToast({
							title: res.error.reason,
							icon: 'none',
							duration: 2000
						})
					} else if(res.status === 'success') {
						const data = res.result
						wx.requestPayment({
							'appId' :res.result.appId,
							'timeStamp': res.result.timeStamp,
							'nonceStr': res.result.nonceStr,
							'package': res.result.packageStr,
							'signType': 'MD5',
							'paySign': res.result.paySign,
							'success':function(res){
								that.orderSuccess({
									orderId:data.nonceStr,
									payType: 0,
								})
							},
							'fail':function(res){
								console.log(res);
								console.log('fail');
							},
							'complete': function(res){
								console.log(res);console.log('complete');
							}
						})
					}
				})
			},
			payExam() {
				const that = this
				const data = {
					code: wx.getStorageSync('code'),
				}
				this.$ajax({url: '/order/createExamUnifiedOrder', method: 'POST' , data: data}, function(res) {
					if (res.status === 'error') {
						wx.showToast({
							title: res.reason,
							icon: 'none',
							duration: 2000
						})
					} else if(res.status === 'success') {
						const data = res.result
						wx.requestPayment({
							'appId' :res.result.appId,
							'timeStamp': res.result.timeStamp,
							'nonceStr': res.result.nonceStr,
							'package': res.result.packageStr,
							'signType': 'MD5',
							'paySign': res.result.paySign,
							'success':function(res){
								that.orderSuccess({
									orderId:data.nonceStr,
									payType: 1,
								})
							},
							'fail':function(res){
								console.log(res);
								console.log('fail');
							},
							'complete': function(res){
								console.log(res);console.log('complete');
							}
						})
					}
				})
			},
			orderSuccess(data) {
				const that = this
				this.$ajax({url: '/order/payDone  ', method: 'POST' , data: data}, function(res) {
					if(res.status === 'success') {
						that.updateUserInfo()
					}
				})
			},
			updateUserInfo() {
				this.$ajax({url: '/wxUser/getUserInfo  ', method: 'GET'}, function(res) {
					if(res.status === 'success') {
						wx.setStorageSync('accountInfo', res.result)
						wx.setStorageSync('work', res.result.work)
						wx.showToast({
							title: '购买成功，快去做题吧',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			buyHandle() {
				console.log(8888888888)
				if(this.current === 2) {
					this.visible = true
					return
				}
			},
			handleOk(index) {
				if(!this.selectWork.styleCode) {
					wx.showToast({
						title: '请选择工种',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.visible = false
				this.payMoney()
			},
			handleCancel(index) {
				this.visible = false
			},
		}
	}
</script>
<style scoped>
	.card {
		margin: 20px;
		height: 100px;
		/* background: #c89; */
		width: calc(100% - 40px);
		border-radius: 10px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		box-shadow:2px 2px 15px #333333;
	}
	.card .w70 {
		padding: 15px 0 0 15px;
		color:#fff;
	}
	.f12 {
		font-size: 12px;
	}
	.w30 {
		text-align:center;
		border:1px solid yellow;
		width:60px;
		height:60px;
		border-radius:50%;
		line-height:60px;
		margin-top:15px;
		color: yellow;
		margin-left: 10px;
	}
	.content {
		width: calc(100% - 40px);
		margin: 20px;
	}
	.content .lis{
		margin: 20px 0;
		height: 100px;
		border: 2px solid #999999;
		border-radius: 10px;
		
	}
	.content .lis .fl {
		font-size: 14px;
		margin-top:20px;
        margin-left:20px;

	}
	.content .lis .fr {
		padding-right: 20px;
		line-height: 100px;
	}
	.line_height {
		border: 2px solid #667eea !important;
	}
	.slogin {
		font-size:12px;
        line-height:40px;
	}
	.btn {
		position: fixed;
		bottom: 0px;
		width: calc(100% - 60px);
		height: 100px;
		padding: 0 30px;
		box-shadow:2px 2px 15px #333333;
		line-height: 100px;
		background: #fff;
		z-index: 11;
	}
	.btn button {
		width: 120px;
		height: 40px;
		margin-top: 30px;
		background: #667eea;
		color: #fff;
		border-radius: 20px;
		line-height: 40px;
	}
	.section .picker {
		text-align: left;
		margin: 0 20px;
		border: 1px solid #ccc;
		line-height: 40px;
	}
	.picker .input {
		display: inline-block;
	}
	 label {
		width: 4em;
		text-align: center;
		display: inline-block;
		color: #fff;
		vertical-align: 6px;
		line-height: 40px;
	}
	.error_txt {
		color: #e65757;
		font-size: 14px;
		text-align: center;
		margin-bottom: 15px;
	}
</style>