<template>
  <div class="container ub-box ub-col">
    <scroll-view scroll-y scroll-top="0" class="scroll_box">
      <!--轮播图-->
      <div class="ub-box ub-ver">
        <swiper class="swiper" indicator-dots="false" autoplay="false" interval="5000" duration="500">
          <block v-for="(item, idx) in imgUrls" :key="String(idx)">
            <swiper-item class="shadow">
              <image :src="item" class="z-width-100-percent" mode="widthFix"/>
            </swiper-item>
          </block>
        </swiper>
      </div>
      <div class="industry clearfix">
        <span>当前工种：</span>
        <i class="iconfont icon-youxuanze fr" style="color:#666;font-size:18px"></i>&nbsp;&nbsp;
        <span class="fr">
            <view class="section login-inp" @click="getIndustry">
							<picker @change="bindPickerChange($event)" :value="indexSch" :range-key="'styleName'" :range="arraySch">
								<view class="picker">{{selectSch.styleName?selectSch.styleName:'请选择'}}</view>
							</picker>
						</view>
          </span>
      </div>
      <div class="clearfix">
        <div class="main_tab" :key="String(key)" v-for="(idx, key) in iconMain">
          <div class="adaptive-circle" :style="{background: iconMain[key]['bk']}" @click.stop="handleJump(idx.url)">
            <div class="layout middle">
              <div>
                <!-- <dd class="icon ub-box ub-ver iconfont" :class="key"></dd> -->
                <span class="z-padding-v-8-px sytle_font">{{iconMain[key]['title']}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--图标九宫格入口-->
      <dl class="ub-box ub-wrap z-padding-v-5-px">
        <div
          :class="{'icon-item':true,'ub-box':true,'ub-col':true, 'ub-ver':true,vip_icon: idx.title==='全真题库'}"
          :key="String(key)" v-for="(idx, key) in iconMap" @click.stop="handleJump(idx.url)">
          <div>
            <dd class="icon ub-box ub-ver iconfont" :class="key" :style="{background: iconMap[key]['bk']}"></dd>
            <span class="z-padding-v-8-px z-font-size-12 z-color-333">{{iconMap[key]['title']}}</span>
          </div>
        </div>
      </dl>
    </scroll-view>
  </div>
</template>
<script>
  export default {
    computed: {
      curCity () {
        return this.$store.state.curCity
      }
    },
    data () {
      return {
        imgUrls: [
          'http://bpic.588ku.com//back_origin_min_pic/19/04/16/a8bc3098ae9dd84ae7645a8cffc12486.jpg',
          'http://p0.meituan.net/codeman/a97baf515235f4c5a2b1323a741e577185048.jpg',
          'http://p0.meituan.net/codeman/daa73310c9e57454dc97f0146640fd9f69772.jpg'
        ],
        iconMain: {
          'icon-tiku': {title: '全真题库', bk: '#4facfe', url: '/pages/Exercise/main'},
          'icon-monikaoshi': {title: '模拟考试', bk: '#03BE61', url: '/pages/exam/main'},
        },
        iconMap: {
          'icon-zhiye1': {title: '选择工种', bk: '#EF8B3E', url: '/pages/citySelect/main?id=2'},
          'icon-cuotiben': {title: '错  题  集', bk: '#EC5B6E', url: '/pages/wrongBook/main'},
          'icon-icon_kaoshijilu_normal': {title: '考试记录', bk: '#F3AE42', url: '/pages/record/main'},
          'icon-fav': {title: '我的收藏', bk: '#5DC1A9', url: '/pages/myCollection/main'},
          'icon-chaxunzhengshu': {title: '证书查询', bk: '#8a90fa', url: '/pages/certificate/main'},
          'icon-bangzhufankui1': {title: '帮助反馈', bk: '#4dc6ee', url: '/pages/help/main'},
        },
        visible: true,
        accountInfo: {},
        arraySch: [],
        indexSch: 1,
        selectSch: {},
      }
    },
    computed: {
      isLogin() {
        return this.accountInfo.token ? true : false
      },
      // accountInfo() {
      //   return this.$store.state.accountInfo
      // }
    },
    onLoad() {
      this.accountInfo = wx.getStorageSync('accountInfo')
      //我的工种
      const that = this
      this.$ajax({url: '/chooseStyle/getChooseStyle'}, function(res) {
        if (res.status === 'success') {
          res.result.map((item,i) => {
          if(item.currentUse === 1) {
              that.selectSch = item
              that.indexSch = i
            }
          })
          that.arraySch = res.result
        }
      })
    },
    onTabItemTap(e) {
      this.accountInfo = wx.getStorageSync('accountInfo')
      //我的工种
      const that = this
      this.$ajax({url: '/chooseStyle/getChooseStyle'}, function(res) {
        if (res.status === 'success') {
          res.result.map((item,i) => {
          if(item.currentUse === 1) {
              that.selectSch = item
              that.indexSch = i
            }
          })
          that.arraySch = res.result
        }
      })
    },
    methods: {
      bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.mp.detail.value)
				this.indexSch = e.mp.detail.value
				this.selectSch =  this.arraySch[this.indexSch]
			},
      handleJump(url) {
        if (!this.isLogin) {
          wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if(url === '/pages/Exercise/main') {
          console.log(this.accountInfo.isActiveCard)
          if (this.accountInfo.isActiveCard === 2 || !this.accountInfo.isActiveCard) {
            wx.showToast({
              title: '您还没有做题权限，请激活卡密',
              icon: 'none',
              duration: 2000
            })
            return
          }
        }
        if(url === '/pages/exam/main') {
          if (!this.accountInfo.styleCode) {
            wx.showToast({
              title: '请先选择工种',
              icon: 'none',
              duration: 2000
            })
            return
          }
          if (!this.accountInfo.remainingNum && this.accountInfo.isActiveCard != 1) {
            wx.showToast({
              title: '免费考试次数已用完',
              icon: 'none',
              duration: 2000
            })
            return
          }
        }  
        this.$openWin(url)
      },
    },
    mounted() {
    }
  }
</script>
<style scoped>
  .container{
    width:100%;
    background:#e8e8e8;
  }
  .btn_hide {
    display: none;
  }
  .industry {
    width: calc(100% - 20px);
    height: 30px;
    border-bottom: 1px solid #ccc;
    margin: 0 10px;
    font-size: 14px;
    color: #666;
    line-height: 30px;
  }
  .swiper{
    height: 120px;
    width: calc(100%);
    border-radius:25px;
    overflow:hidden;
    padding:5px;
  }
  .main_tab {
    width: 50%;
    /* height: 150px; */
    float: left;
    background-color: #fff;
    margin-top: 10px;
  }
  .icon-item {
    width:calc(33% - 20px);
    margin: 10px;
    padding: 10px 13px 10px 13px;
    box-sizing: border-box;
    border-radius: 10px;
    background: #fff;
  }
  .icon{
    width: 50px;
    height: 50px;
    border-radius: 20%;
    color: #fff;
    font-size: 30px
  }
  .scroll_box {
    /* background: -webkit-gradient(linear,center top,center bottom,from( #8eaaff), to(#80cc84)); */
    height: calc(100vh - 1px);     
    /* background-image: linear-gradient(to top, #9890e3 0%, #b1f4cf 100%); */
    /* background-image: linear-gradient(to top, #2d8cf0 0%, #48c6ef 100%); */
    /* background-image: linear-gradient(to top, #a3bded 0%, #6991c7 100%); */
    /* background-image: linear-gradient(to top, #4481eb 0%, #04befe 100%); */
    background-color: #fff;
  }
  .vip_icon {
    position: relative;
    overflow: hidden;
  }
  .vip_icon:before {
    content: 'VIP';
    width: 100px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    color: #fff;
    background-image: linear-gradient(to right, #f83600 0%, #f9d423 100%);
    top: 15px;
    left: -20px;
    transform: rotate(-45deg);
    position: absolute;
  }
  .shadow {
    box-shadow:2px 2px 15px #333333;
  }
  .sytle_font {
    color: #fff;
  }
  .adaptive-circle {
        /* margin: 50px auto 0; */
        width: 60%;
        height: 0;
        padding-top: 60%;
        border-radius: 100%;
        /* border: 1px solid #000; */
        box-sizing: border-box;
        position: relative;
        left: 20%;
    }
    .adaptive-circle .layout {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-align: center;
    }
    .adaptive-circle .layout.middle:before {
        display: inline-block;
        vertical-align: middle;
        content: '';
        height: 100%;
        width: 0;
        overflow: hidden;
    }
    .adaptive-circle .layout.middle div:first-child {
        display: inline-block;
        vertical-align: middle;
    }
</style>
