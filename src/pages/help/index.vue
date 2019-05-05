<template>
    <div class="exam">
        <div class="exam_header">
			<div>帮助反馈</div>
		</div>
		<div class="textarea">
			<textarea class="detailText"
			    autofocus
				placeholder="请输入您所遇到的问题或对我们的建议，我们会即使为您解答或回复。"
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
		onLoad() {
		},
		onShow() {
			wx.setNavigationBarTitle({title: '帮助反馈'})
		},
		methods: {
			submitHandle() {
				const that = this
				wx.request({
					url: 'http://192.168.0.101:1234/expendables/api/msg/feedMsg',
					method: 'POST',
					data: {
						message: that.value,
					},
					header: {
						"content-type": "application/json", 
						'token': '080BA57DAE3D546AD585AF1255B64B177480C34EBA07E445AFE96F1557D8FE3741E9BBC9B7FD181F413F6E095DF769C770DDD3B3E8B6BEF0FBF7A5D6FB3E192616C348D6E386C53E351845E6B8B6D5FC'
					},
					success(res) {
						console.log('成功')
					}
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