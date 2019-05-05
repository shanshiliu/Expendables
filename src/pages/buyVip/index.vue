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
			<div :class="{lis:true, line_height: current===1}" @click="selectHandle(1)">
				<div class="fl">
					<div>卡密兑换</div>
					<div class="slogin">享受独家最高题库权限，考试无忧。</div>
				</div>
				
			</div>
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

		<i-modal title="卡密兑换" :visible="visible" @ok="handleOk" @cancel="handleCancel">
			<div class="card_txt">
				<div>请输入卡密号登录获得更多会员权限</div>
				<input class="card_input" v-model="cardNumber" type="text" autofocus>
			</div>
		</i-modal>
    </div>
</template>
<script>
import {formatTime} from '../../utils/common.js'
	export default {
	  	data () {
			return {
				current: 1,
				text: '兑换',
				money: 0,
				visible: false,
				cardNumber: '',
			}
		},
		mounted() {
		},
		methods: {
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
				}
			},
			buyHandle() {
				if(this.current === 1) {
					this.visible = true
				} else {
					
				}
			},
			handleOk(index) {
				wx.request({
						url: 'http://192.168.0.101:1234/expendables/api/wxUser/activeCard',
						method: 'POST',
						data: {
								"cardCode": this.cardNumber,
								"cardPassword": "98l4oR5Z1IU1F4UwZ6s7p8FNr"
							},
						header: {
							"content-type": "application/json", 
							'token': '080BA57DAE3D546AD585AF1255B64B177480C34EBA07E445AFE96F1557D8FE3741E9BBC9B7FD181F413F6E095DF769C770DDD3B3E8B6BEF0FBF7A5D6FB3E192616C348D6E386C53E351845E6B8B6D5FC'
						},
						success(res) {
							
						}
				})
				this.$reLaunch('/pages/self/main')
				this.$toast({
					content: '兑换成功',
					type: 'success'
				});
				this.visible = false
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
</style>