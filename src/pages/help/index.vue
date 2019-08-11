<template>
    <div class="exam">
        <div class="exam_header">
			<div>帮助反馈</div>
		</div>
		<div class="textarea">
			<textarea class="detailText"
			    autofocus
				placeholder="请输入您所遇到的问题或对我们的建议，我们会及时为您解答或回复。"
				v-model="value">
			</textarea>
			<!-- <input :type="textarea" v-model="value"  placeholder=""> -->
		</div>
		<div>
			<i-button i-class="btn_question" size="small" type="primary" @click="submitHandle">提交</i-button>
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
			wx.setNavigationBarTitle({title: '帮助反馈'})
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
						wx.showToast({
							title: '反馈成功，感谢您的使用！',
							icon: 'none',
							duration: 2000
						})
						setTimeout(function() {
						   that.$backBeaforWin()
						}, 2000)
				})
			}
		}
	}
</script>
<style scoped>
	.exam_header {
		text-align: center;
		height: 50px;
		line-height: 50px;
		color: #666;
	}
	.textarea textarea{
		height: 300px;
		border-radius: 5px;
		text-align: left;
		width: calc(100% - 20px);
		margin: 0 10px;
		border: 1px solid #999;
	}
</style>