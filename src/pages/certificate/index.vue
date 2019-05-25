<template>
	<div class="z-width-100-percent">
    <scroll-view scroll-y style="height:calc(100vh);" scroll-top="0" :scroll-into-view="currView">
      <dl class="ub-box ub-col">
        <dd class="ub-box ub-col">
          <div class="z-width-100-percent z-bg-color-fff ub-box ub-col">
            <ul class="ub-box ub-col mar50">
              <li @click.stop="clickCity(city)" v-for="(city, i) in cityList" :key="String(i)" class="city ub-flex-1 z-font-size-14 z-color-666">
                <i class="iconfont icon-chaxunzhengshu"></i>
				<span>{{city.name}}</span>
              </li>
            </ul>
          </div>
        </dd>
      </dl>
    </scroll-view>
	</div>
</template>
<script>
  export default {
    data () {
      return {
        currView: '',
        cityList: [
          {url: "http://cx.saws.org.cn/", name: "安监局"},
          {url: "https://www.cnse.gov.cn/", name: "质监局"},
        ],
      }
    },
    computed: {
      accountInfo() {
        return this.$store.state.accountInfo
      }
    },
    onLoad(options) {
	},
	onShow() {
		wx.setNavigationBarTitle({title: '证书查询'})
	},
    methods: {
		clickCity(item) {
			console.log(item.url)
			this.$openWin('/pages/webview/main?url=' + item.url)
		}
    },
  }
</script>
<style scoped>
.city{
	margin: 100px;
	text-align: center;
	border:1px solid #999;
	color: #fff;
	background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%);
	border-radius: 10px;
	padding-bottom: 10px;
}
.city span {
	margin-bottom: 10px;
}
.iconfont {
	font-size: 50px;
}
</style>