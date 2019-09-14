<template>
    <div class="login_section">
			<div class="login">
				<div class="welcome">
					卡密激活
				</div>
				<div class="error_txt">提示： 工种已经绑定不可修改，请慎重选择</div>
				<div class="login-form">
					<div class="login-inp"><label>姓名</label><input v-model="name" placeholder="请输入真实姓名"></div>
					<div class="login-inp"><label>卡号</label><input v-model="cardNumber" type="digit" placeholder="请输入卡号"></div>
					<div class="login-inp"><label>密码</label><input v-model="password" type="password" placeholder="请输入密码"></div>
					<div class="login-inp"><label>学校</label><input v-model="selectSch" placeholder="请输入学校"></div>
					<div>
						<view class="section login-inp">
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
								工种选择：{{selectWork.styleName}}
								</view>
							</picker>
						</view>
					</div>
					<div class="error_txt">{{errorTxt}}</div>
					<div class="login-inp"><span @click="submitForm">立即激活</span></div>
				</div>
			</div>
    </div>
</template>
<script>
import {formatTime} from '../../utils/common.js'
	export default {
	  	data () {
			return {
				cardNumber: '',
				password: '',
				showBtn: false,
				totalTime: 60,
				content: '发送验证码',
				visible: false,
				visibleD: true,
				name: '',
				actions: [
					{
						name: '无卡密登录'
					},
					{
						name: '登录',
						color: '#2d8cf0',
					}
				],
				indexSch: 1,
				current: '',
				multiArray: [[{}],[{}],[{}]],
				multiIndex: [0, 0, 0],
				selectSch: '',
				selectWork: '',
				styleCode: '',
				errorTxt: '',
			}
		},
		onLoad() {
			this.name = ''
			this.cardNumber = ''
			this.password = ''
			this.selectSch = ''
			this.selectWork = ''
			// this.multiIndex = [0,0,0]
			// this.multiArray = [[{}],[{}],[{}]]
			const that = this
			this.$ajax({url: '/wxUser/getStyle'}, function(res) {
				const arr = []
				const arr1 = res.result
				const arr2 = res.result[0].styleArray
				const arr3 = res.result[0].styleArray[0].styleArray
				arr.push(arr1,arr2,arr3)
				that.multiArray = arr
			})
			this.currentDate = formatTime(new Date())
			this.totalArr = new Array(100)
			this.targetTime = new Date().getTime() + 6430000
		},
		onShow() {
			wx.setNavigationBarTitle({title: '卡密激活'})
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
				// console.log(value)
				if (column === 0) {
					console.log(this.multiArray[column][value])
					this.multiIndex = [value,0,0]
					this.multiArray[1] = this.multiArray[column][value].styleArray
					this.multiArray[2] = this.multiArray[1][0].styleArray
					// console.log(this.multiArray[1])
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
				// console.log(this.multiArray[2][this.multiIndex[2]])
				
			},
			toggleLeft1() {
				this.visibleD = false
			},
			bindPickerChange(e) {
				// console.log(e)
				// console.log('picker发送选择改变，携带值为', e.mp.detail.value)
				this.indexSch = e.mp.detail.value
				this.selectSch =  this.arraySch[this.indexSch]
				// this.setData({
				//   indexSch: e.mp.detail.value
				// })
			},
			submitForm() {
				if (!this.name) {
					this.errorTxt = '请输入姓名'
					return
				}
				if (!this.cardNumber) {
					this.errorTxt = '请输入卡号'
					return
				}
				if (!this.password) {
					this.errorTxt = '请输入密码'
					return
				}
				if (!this.selectSch) {
					this.errorTxt = '请选择学校'
					return
				}
				if (!this.selectWork.styleCode) {
					this.errorTxt = '请选择工种'
					return
				}
				this.errorTxt = ''
				const data = {
					cardCode: this.cardNumber,
					cardPassword: this.password,
					realName:  this.name,
					schoolName: this.selectSch,
					styleCode: this.selectWork.styleCode,
				}
				const that = this
				wx.showModal({
				title: '提示',
				content: '工种一旦绑定不可更改，是否确定？',
				success (res) {
					if (res.confirm) {
					    that.$ajax({url: '/wxUser/activeCard', method: 'POST', data: data}, function(res) {
							if (res.status === 'success') {
								that.updateUserInfo()
							} else if (res.status === 'error') {
								wx.showToast({
									title: res.error.reason,
									icon: 'none',
									duration: 2000
								})
							}
						})
					} else if (res.cancel) {
						// console.log('用户点击取消')
					}
				}
				})
			},
			updateUserInfo() {
				const that = this
				this.$ajax({url: '/wxUser/getUserInfo', method: 'GET'}, function(res) {
					if(res.status === 'success') {
						wx.setStorageSync('accountInfo', res.result)
						wx.setStorageSync('work', res.result.work)
						wx.showToast({
							title: '卡密激活成功',
							icon: 'success',
							duration: 2000
						})
						wx.setStorageSync('workId', 1)
						setTimeout(function() {
						   that.$reLaunch('/pages/index/main')
						}, 2000)
					}
				})
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
				// console.log(index)
				this.$reLaunch('/pages/index/main')
				this.visible = false
			},
			changeNumber(value) {
				// console.log('888888888888',value)
			},
			nextHandle() {
				if(this.currentSubject === this.total) {
					return
				}
				this.currentSubject ++
				this.isSelect = false
			},
			openModal() {
				// console.log(this.visible)
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
	/* margin: 30px 0; */
	margin-top: 30px;
	margin-bottom: 15px;
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
.section {
	line-height:40px;
	color:#fff;
	padding-left:20px;
}
.error_txt {
	color: #e65757;
	font-size: 14px;
	text-align: center;
	margin-bottom: 15px;
}
</style>