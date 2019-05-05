<template>
    <div class="login_section">
			<div class="login">
				<div class="welcome">
					注册页面
				</div>
				<div class="login-form">
					<div class="login-inp"><label>手机号</label><input v-model="phoneNumber" type="digit" placeholder="请输入手机号"></div>
					<div class="login-inp"><label>密码</label><input v-model="password" type="password" placeholder="请输入密码"></div>
					<div class="login-inp"><label>确认密码</label><input v-model="password" type="password" placeholder="请再次确认密码"></div>
					<div class="login-inp po"><label>验证码</label><input v-model="password" type="number">
					<button class="send" :disabled="showBtn" @click="countDown">{{content}}</button>
					</div>
					<div class="login-inp"><span @click="submitForm">立即注册</span></div>
				</div>
				<!-- <div class="login-txt"><span>立即注册</span>|<span>忘记密码？</span></div> -->
			</div>
			<i-toast id="toast" />
			<i-modal title="注册成功" :visible="visible"  @ok="handleOk" @cancel="handleCancel">
				<div class="card_txt">
					<div>如有卡密号，请输入卡密号登录获得更多会员权限</div>
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
				phoneNumber: '',
				password: '',
				passwordT: '',
				showBtn: false,
				totalTime: 60,
				content: '发送验证码',
				visible: false,
				cardNumber: '',
				actions: [
					{
						name: '无卡密登录'
					},
					{
						name: '登录',
						color: '#2d8cf0',
					}
				],
			}
		},
		mounted() {
			this.currentDate = formatTime(new Date())
			this.totalArr = new Array(100)
			this.targetTime = new Date().getTime() + 6430000
			console.log(this.targetTime)
		},
		onShow() {
			wx.setNavigationBarTitle({title: '账号注册'})
		},
		methods: {
			countDown() {
				if (this.showBtn) {
					return
				}
				this.showBtn = true;
				// console.log(88888888)
				this.content = this.totalTime + 's后重新发送' //这里解决60秒不见了的问题
				let clock = setInterval(() => {
				this.totalTime--
				this.content = this.totalTime + 's后重新发送'
				if (this.totalTime < 0) {     //当倒计时小于0时清除定时器
					clearInterval(clock)
					this.content = '发送验证码'
					this.totalTime = 60
					this.showBtn = false
					}
				},1000)
			},
			submitForm() {
				// this.$toast({
				// 	content: '注册成功，登录中',
				// 	type: 'success'
				// });
				this.visible = true

			},
			handleOk(index) {
				// console.log(index)
				this.$reLaunch('/pages/index/main')
				this.visible = false
				this.$toast({
					content: '登录成功',
					type: 'success'
				});
				
			},
			handleCancel(index) {
				console.log(index)
				this.$reLaunch('/pages/index/main')
				this.visible = false
			},
			changeNumber(value) {
				console.log('888888888888',value)
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
		}
	}
</script>
<style scoped>
	.login {
    width: 100%;
    height: 100%;
    background: url(http://www.17sucai.com/preview/266121/2017-06-30/login/images/login-bg.png) no-repeat;
    background-size: cover;
    position: fixed;
}

.welcome {
    width: 100%;
	margin: 15% 0;
	text-align: center;
	color: #fff;
	font-size: 20px;
}

.welcome img {
    width: 100%;
}

.login-inp {
    margin: 0 30px 15px 30px;
    border: 1px solid #fff;
    border-radius: 5px;
}

.login-inp label {
    width: 4em;
    text-align: center;
    display: inline-block;
	color: #fff;
	vertical-align: 6px;
	line-height: 40px;
}
.po {
	position: relative;
}
.login-inp .send {
	height:40px;
	width:120px;
	position: absolute;;
	right:0;
	top:0;
	line-height:40px;
	font-size:14px;
	border-radius:4px;
	background:#fff;
	color: #333;
	z-index: 111;
}

.login-inp input {
    height: 40px;
    color: #fff;
	display: inline-block;
    background-color: transparent;
    border: none;
	outline: none;
	vertical-align: -6px;
	line-height: 40px;
	margin-left: 10px;
}

.login-inp span {
    display: block;
    width: 100%;
    text-align: center;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
    letter-spacing: 5px;
}

.login-txt {
    text-align: center;
    color: #fff;
}

.login-txt span {
    color: #fff;
	padding: 0 5px;
	display: inline-block;
}
.card_txt {
	margin: 0 10px;
}
.card_input {
	border: 1px solid #ccc;
}
</style>