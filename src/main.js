import Vue from 'vue'
import App from './App'
import { openWin, redirectTo, backBeaforWin, reLaunch } from './utils/common'
import { $Toast } from '../static/iview/base/index';
import { Ajax } from './utils/request'
import store from './utils/store'
import './css/common.css'
import './css/index.css'
import './css/iconfont.css'
Vue.config.productionTip = false
App.mpType = 'app'

// 把通用方法挂载到Vue原型上
Vue.prototype.$openWin = openWin
Vue.prototype.$reLaunch = reLaunch
Vue.prototype.$redirectTo = redirectTo
Vue.prototype.$backBeaforWin = backBeaforWin
Vue.prototype.$ajax = Ajax

// 把store挂载到Vue原型上
Vue.prototype.$store = store
Vue.prototype.$toast = $Toast

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/index/main',
      'pages/self/main',
      'pages/citySelect/main',
      'pages/exam/main',
      'pages/error/main',
      'pages/login/main',
      'pages/register/main',
      'pages/forgetPassword/main',
      'pages/buyVip/main',
      'pages/wrongBook/main',
      'pages/myCollection/main',
      'pages/examRecord/main',
      'pages/record/main',
      'pages/help/main',
      'pages/certificateInquiry/main',
      'pages/root/main',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#2d8cf0',
      navigationBarTitleText: '考易过',
      navigationBarTextStyle: 'white',
      // enablePullDownRefresh: true
    },
    tabBar: {
      borderStyle: 'black',
      backgroundColor: '#fff',
      selectedColor: '#2d8cf0',
      color: '#666',
      list: [{
        pagePath: "pages/index/main",
        iconPath: 'static/images/tab1.png',
        selectedIconPath: 'static/images/tab1-s.png',
        text: "首页"
      },{
        pagePath: "pages/self/main",
        selectedIconPath: 'static/images/tab3-s.png',
        iconPath: 'static/images/tab3.png',
        text: "我的"
      }]
    },
    usingComponents: {
      'i-button': '/static/iview/button/index',
      "i-modal": "/static/iview/modal/index",
      "i-count-down": "/static/iview/count-down/index",
      "i-icon": "/static/iview/icon/index",
      "i-toast": "/static/iview/toast/index",
      "i-action-sheet": "/static/iview/action-sheet/index",
      "i-input": "/static/iview/input/index",
      "i-toast": "/static/iview/toast/index",
      "i-tabs": "/static/iview/tabs/index",
      "i-tab": "/static/iview/tab/index"
    }
  }
}
