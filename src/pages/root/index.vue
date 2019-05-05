<template>
    <div class="login_section">
			<div class="login">
				<div class="welcome">
					特易过
				</div>
				<div class="login-form">
					<button class="login-inp" id="getphone" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfo1">获取权限快速登录</button>
				</div>
				<div class="login-txt" >
				<span @click.stop="$openWin('/pages/register/main')">手机注册</span>|
				<span @click.stop="$openWin('/pages/login/main')">手机登录</span></div>
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
		onShow() {
			wx.setNavigationBarTitle({title: '登录'})
		},
		methods: {
			getUserInfo1(){
				console.log('click事件首先触发')
				// 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
				// console.log(wx.canIUse('button.open-type.getUserInfo'))
				if(wx.canIUse('button.open-type.getUserInfo')){
				// 用户版本可用
				}else{
				console.log('请升级微信版本')
				}
			},
			bindGetUserInfo(e) {
				// console.log(e.mp.detail.rawData)
				if (e.mp.detail.rawData){
				//用户按了允许授权按钮
				console.log('用户按了允许授权按钮')
				console.log(e.mp.detail.iv)
				console.log(e.mp.detail.encryptedData)
					
				} else {
				//用户按了拒绝按钮
				console.log('用户按了拒绝按钮')
				}
			},
			submitForm() {
				// if (!this.phoneNumber) {
				// 	this.$toast({
				// 		content: '请输入手机号',
				// 		type: 'error'
				// 	});
				// 	return
				// }
				// if (!this.password) {
				// 	this.$toast({
				// 		content: '请输入密码',
				// 		type: 'error'
				// 	});
				// 	return
				// }
				this.$toast({
					content: '手机或密码输入错误',
					type: 'error'
				});
				this.$store.commit('updateIsLogin', true)
				// this.$store.commit('updateUser', e.mp.detail.userInfo)
				// console.log(e.mp.detail)
				// const options = {
				// 	url: 'http://192.168.235.1:1234/expendables/api/wxUser/loginChecked',
				// 	method: 'POST',
				// 	data: {
				// 		"userMobile": "15721305936",
				// 		"password": "123",
				// 		"userOpenid": "1"
				// 	}
				// }
				// this.$ajax()
			},
			onGetUserInfo (e) {
				this.$store.commit('updateIsLogin', true)
				this.$store.commit('updateUser', e.mp.detail.userInfo)
				console.log(e.mp.detail)
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
    width: 50px;
    text-align: center;
    display: inline-block;
	color: #fff;
	vertical-align: 6px;
	line-height: 40px;
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
.login-inp button {
	display: block;
    width: 100%;
    text-align: center;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
    letter-spacing: 5px;
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