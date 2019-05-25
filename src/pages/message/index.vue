<template>
    <div class="mes_box">
        <div class="one_mes">
			<div class="mine">
				阿色发色发呃沙发色发色发阿尔色粉爱上法恩莎啊啊色发色发
			</div>	
			<div class="you">
				燃烧法是否萨尔阿尔法色法色发色
			</div>
		</div>
		<div class="one_mes">
			<div class="mine">
				阿色发色发呃沙发色发色发阿尔色粉爱上法恩莎啊啊色发色发
			</div>	
			<div class="you">
				燃烧法是否萨尔阿尔法色法色发色
			</div>
		</div>
		<div class="one_mes">
			<div class="mine">
				阿色发色发呃沙发色发色发阿尔色粉爱上法恩莎啊啊色发色发
			</div>	
			<div class="you">
				燃烧法是否萨尔阿尔法色法色发色
			</div>
		</div>
    </div>
</template>
<script>
	export default {
	  	data () {
			return {
				value: '',
			}
		},
		onShow() {
			wx.setNavigationBarTitle({title: '留言反馈'})
		},
		mounted() {
			this.value = ''
		},
		methods: {
			submitHandle() {
				const that = this
				this.$ajax({url: '/msg/feedMsg', method: 'POST', data: {
						message: that.value,
					}}, function(res) {
					console.log('成功')
					that.$backBeaforWin()
				})
			}
		}
	}
</script>
<style scoped>
	.mes_box {
		background: #e8e8e8;
		padding: 20px 0px;
		width: calc(100% -40px);
		height: 100%;
	}
	.one_mes {
		margin-bottom: 20px;
		background: #fff;
		padding: 10px;
	}
	.mine {
		color:#333;
		font-size:14px;
		margin-bottom: 20px;

	}
	.you {
		font-size:14px;
		color:#888;
	}
</style>