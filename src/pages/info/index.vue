<template>
    <div class="exam">
        <div class="info_header">
			<image src="../../../../../static/images/icon.jpg" class="head-img"></image>
			<!-- <div style="text-align:center;">特易过特种作业考试平台</div> -->
		</div>
		<div>
			<button @getphonenumber="getPhoneNumber" open-type="getPhoneNumber" class="loginBtn">微信手机号登录</button>
		</div>
    </div>
</template>
<script>
	export default {
	  	data () {
			return {
			}
		},
		onLoad() {
			// 是否为苹果用户
			const systemInfo =  wx.getSystemInfoSync()
			console.log(systemInfo)
			let isApple
			if(systemInfo.model.indexOf('iPhone') > -1) {
			isApple = true
			} else {
			isApple = false
			}
			wx.setStorageSync('isApple', isApple)
			// 微信登录
			const that = this
			const token = wx.getStorageSync('token') || ''
			if (!token) {
				wx.login({
					success(res) {
						if (res.code) {
							// 后台登录获取token
							wx.setStorageSync('code', res.code)
							that.$ajax({url: `/wxUser/wxLogin/${res.code}`, method: 'POST'},function(res) {
								if (res.status === 'success') {
									// 登录成功
									wx.setStorageSync('sessionId', res.result)
								} else {
									wx.showToast({
										title: '获取登录异常',
										icon: 'none',
										duration: 2000
									})
								}
							})
						} else {
							console.log('登录失败！' + res.errMsg)
							wx.showToast({
								title: '请退出小程序重新登录',
								icon: 'none',
								duration: 2000
							})
						}
					}
				})
			}
		},
		onShow() {
			wx.setNavigationBarTitle({title: '授权登陆'})
		},
		methods: {
			getPhoneNumber: function (e) {
				const that = this
				console.log(e.mp.detail)
				if (e.mp.detail.errMsg !== 'getPhoneNumber:ok') {
					wx.showModal({
						title: '提示',
						showCancel:false,
						content: '未授权',
						success:function(res) {
							that.$backBeaforWin()
						}
					})
				}else {
						that.$ajax({
						url: '/wxUser/wxLoginChecked',
						data: {
							sessionId: wx.getStorageSync('sessionId'),
							iv: e.mp.detail.iv,
							encryptedData: e.mp.detail.encryptedData
						},
						method: 'POST'
						}, function(res) {
							console.log(res.result)
							const info = res.result
							if (res.status === 'success') {
								wx.setStorageSync('token',res.result.token)
								wx.setStorageSync('accountInfo', info)
								wx.setStorageSync('work', res.result.work)
								// 首页
								wx.reLaunch({
									url: '/pages/index/main'
								})
							} else {
								wx.showToast({
									title: '获取登录异常',
									icon: 'none',
									duration: 2000
								})
							}
						})
				}
			},
		}	
	}
</script>
<style scoped>
	.head-img{
		width:70px;
		height:70px;
		border-radius:50%;
		box-shadow:0 0 5px rgba(0,0,0,.2);
		background:#eee;
		position: relative;
		left: -35px;
		margin: 30% 50%;
	}
	.loginBtn{
		font-size:14px;
		color:#fff;
		padding:0px 20px;
		margin: 0 20px;
		background: #2d8cf0;
	}
</style>