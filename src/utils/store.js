import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    curCity: '昆明',
    isLogin: false,
    userInfo: {
    	avatarUrl: '',
    	city: '',
    	gender: '',
    	nickName: '',
    	province: ''
    },
    accountInfo: {
      isActiveCard: '',
      isChooseStyle: '',
      useingEndTime: '',
      remainingNum: '',
      styleCode: ''
    },
  },
  mutations: {
    updateCity: (state, change) => {
      state.curCity = change
    },
    updateIsLogin: (state, change) => {
  		state.isLogin = change
    },
    updateAccount: (state, change) => {
      state.accountInfo = change
    },
    updateLogin: (state,change) => {
      state.isLogin = change
    },
    cleanAccount: (state,change) => {
      state.accountInfo = {
        isActiveCard: '',
        isChooseStyle: '',
        useingEndTime: '',
        remainingNum: '',
        styleCode: '',
        token: '',
      }
    },
  	cleanUserInfo: (state) => {
  		state.userInfo = {
  			avatarUrl: '',
	    	city: '',
	    	gender: '',
	    	nickName: '',
	    	province: ''
      }
      console.log('用户数据清空')
  	},
    updateUser: (state, change) => {
      change.gender = change.gender === 1 ? '男' : '女'
      state.userInfo = change
    }
  }
})
export default store
