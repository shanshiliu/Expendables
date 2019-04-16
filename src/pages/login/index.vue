<template>
    <div class="login_section">
		<div class="login_info">
			<div class="welcome">
				welcome
				<input @input="doInput" @confirm="doSearch" placeholder="保利国际影院"/>
			</div>
			<div  class="login-form">
				<div class="login-inp">
					<label>登录</label>
					<i-input i-class="input_i" autofocus maxlength="11" v-model="phoneNumber"  type="number" placeholder="请输入手机号"/>
				</div>
				<div class="login-inp">
					<label>密码</label>
					<i-input i-class="input_i" v-model="password" type="password" placeholder="请输入密码"/>
				</div>
				<div class="login-inp">
					<a href="#">立即登录</a>
				</div>
				<div class="login-txt"><a href="#">立即注册</a>|<a href="#">忘记密码？</a></div>
			</div>
		</div>
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
			doInput(e) {
				console.log(e)
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
	.login_section {
		width: 100%;
		height: 100%;
		background: url('http://www.17sucai.com/preview/266121/2017-06-30/login/images/login-bg.png') no-repeat;
		background-size: cover;
		position: fixed;
		z-index: -100000;
	}
	.login_info {
		z-index: 10;
	}
	.welcome {
		width: 100%;
		margin: 25% 0;
		text-align: center;
		color:#fff;
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
	}

	.login-inp .input_i {
		line-height: 40px;
		color: #fff;
		background-color: transparent;
		border: none;
		outline: none;
		z-index: 10000000000;
	}

	.login-inp a {
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

	.login-txt a {
		color: #fff;
		padding: 0 5px;
	}
</style>