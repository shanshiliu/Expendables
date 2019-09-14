<template>
    <div class="mes_box">
		<scroll-view scroll-y scroll-top="0" class="scroll_box">
			<div v-if="infoList.length===0" class="no_mes">暂无留言反馈</div>
			<div class="one_mes" v-for="(item,i) in infoList" :key="i">
				<div class="mine">
					留言：{{item.feedBackMsg}}
					<div>{{item.feedBackTime}}</div>
				</div>
				<div class="you" v-if="item.revortMsg">
					回复：{{item.revortMsg}}
					<div>{{item.revortTime}}</div>
				</div>
			</div>
		</scroll-view>
    </div>
</template>
<script>
	export default {
	  	data () {
			return {
				value: '',
				infoList: [],
			}
		},
		onShow() {
			const that = this
			wx.setNavigationBarTitle({title: '留言反馈'})
			this.$ajax({url: '/msg/getReportMsg', method: 'get'}, function(res) {
				that.infoList = res.result
			})
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
		min-height:calc(100% - 50px);
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
	.mine div {
		text-align: right;
		font-size: 12px;
	}
	.you div {
		text-align: right;
		font-size: 12px;
	}
	.no_mes {
		text-align: center;
	}
</style>