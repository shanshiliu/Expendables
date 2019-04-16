<template>
    <div class="login_section">
			<div class="login">
				<div class="welcome">
					注册页面
				</div>
				<div class="login-form">
					<div class="login-inp"><label>手机号</label><input v-model="phoneNumber" type="digit" placeholder="请输入手机号"></div>
					<div class="login-inp"><label>密码</label><input v-model="password" type="password" placeholder="请输入密码"></div>
					<div class="login-inp"><label>确认密码</label><input v-model="password" type="password" placeholder="请输入密码"></div>
					<div class="login-inp"><span @click="submitForm">立即注册</span></div>
				</div>
				<div class="login-txt"><span>立即注册</span>|<span>忘记密码？</span></div>
			</div>
			<i-toast id="toast" />
    </div>
</template>
<script>
import {formatTime} from '../../utils/common.js'
	export default {
	  	data () {
			return {
				phoneNumber: '',
				password: '',
			}
		},
		mounted() {
			this.currentDate = formatTime(new Date())
			this.totalArr = new Array(100)
			this.targetTime = new Date().getTime() + 6430000
			console.log(this.targetTime)
		},
		methods: {
			submitForm() {
				if (!this.phoneNumber) {
					this.$toast({
						content: '请输入手机号',
						type: 'error'
					});
					return
				}
				if (!this.password) {
					this.$toast({
						content: '请输入密码',
						type: 'error'
					});
					return
				}
				this.$toast({
					content: '手机或密码输入错误',
					type: 'error'
				});
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
	margin: 25% 0;
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
    border-radius: 25px;
}

.login-inp label {
    width: 4em;
    text-align: center;
    display: inline-block;
	color: #fff;
	vertical-align: 6px;
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
</style>