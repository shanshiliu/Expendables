// 局域网
// const host = 'http://192.168.0.103:1234/expendables/api'
// 远程服务器
const host = 'https://teyiguo.cn:1234/expendables/api'
//远程隧道
// const host = 'http://xinsiji.free.idcfengye.com/expendables/api'

let token  = ''
/* 获取token*/

// 封装ajax
export function Ajax (opts, cb=function(){}) {
    if(opts.url != '/questionWare/commitErrorQuestion') {
      wx.showLoading({title: '拼命加载中...', mask: true})
    }
    token = wx.getStorageSync('token')
    const {url, method='GET', data={}} = opts
    return new Promise((resolve, reject) => {
      wx.request({
        url: host + url,
        data,
        method,
        header: {
            "content-type": "application/json",
            'token': token || '',
        },
        success(res) {
          // 登录状态失效
          if(res.data.status === 'error' && res.data.error.code === 'DEV_ZUUL_200015') {
            wx.clearStorageSync('token')
            wx.showModal({
              title: '提示',
              content: '登录失效，请重新登录',
              success (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/info/main'
                  })
                } else if (res.cancel) {
                  wx.reLaunch({
                    url: '/pages/index/main'
                  })
                }
              }
            })
          }
          resolve(res)
        },
        fail(err) {
          wx.showModal({
            title: '提示',
            content: '服务异常，请退出重新登录',
            success (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 5
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 5
                })
              }
            }
          })
          reject(err)
        },
        complete(res) {
          setTimeout(() => {
            wx.hideLoading()
            cb && cb(res.data)
          }, 20)
        }
      })
    })
}