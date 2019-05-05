<template>
  <div class="container ub-box ub-col">
    <scroll-view scroll-y scroll-top="0" class="scroll_box">
      <!--轮播图-->
      <div class="ub-box ub-ver z-bg-color-fff">
        <swiper class="swiper" indicator-dots="false" autoplay="false" interval="5000" duration="500">
          <block v-for="(item, idx) in imgUrls" :key="String(idx)">
            <swiper-item>
              <image :src="item" class="z-width-100-percent" mode="widthFix"/>
            </swiper-item>
          </block>
        </swiper>
      </div>
      <!--图标九宫格入口-->
      <dl class="ub-box ub-wrap z-padding-v-5-px">
        <div
          :class="{'icon-item':true,'ub-box':true,'ub-col':true, 'ub-ver':true,vip_icon: idx.title==='全真题库'}"
          :key="String(key)" v-for="(idx, key) in iconMap" @click.stop="$openWin(idx.url)">
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
        iconMap: {
          'icon-zhiye1': {title: '选择工种', bk: '#EF8B3E', url: '/pages/citySelect/main'}, 
          'icon-tiku': {title: '全真题库', bk: '#5DC7B0', url: '/pages/Exercise/main'},
          'icon-monikaoshi': {title: '模拟考试', bk: '#8B67E5', url: '/pages/exam/main'},
          'icon-cuotiben': {title: '错  题  集', bk: '#E4463B', url: '/pages/wrongBook/main'},
          'icon-icon_kaoshijilu_normal': {title: '考试记录', bk: '#F3AE42', url: '/pages/record/main'},
          'icon-fav': {title: '我的收藏', bk: '#5DC1A9', url: '/pages/myCollection/main'},
          'icon-chaxunzhengshu': {title: '证书查询', bk: '#EC5B6E', url: '/pages/certificateInquiry/main'},
          'icon-bangzhufankui1': {title: '帮助反馈', bk: '#BED300', url: '/pages/help/main'},
        },
        visible: true,
      }
    },
    methods: {
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
  .swiper{
    height: 120px;
    width: calc(100%)
  }
  .icon-item {
    width:calc(50% - 20px);
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
    background: -webkit-gradient(linear,center top,center bottom,from( #8eaaff), to(#80cc84));
    height: calc(100vh - 1px);     
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
</style>
