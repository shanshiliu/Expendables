// 局域网
const host = 'http://192.168.0.101:1234/expendables/api'
// 远程
// const host = 'http://xinsiji.free.idcfengye.com/expendables/api'

let token  = ''
/* 获取token*/


console.log(token)

// 封装ajax
export function Ajax (opts, cb=function(){}) {
    wx.showLoading({title: '请求中...', mask: true})
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
          resolve(res)
        },
        fail(err) {
          reject(err)
        },
        complete(res) {
          setTimeout(() => {
            wx.hideLoading()
            cb && cb(res.data)
          }, 1000)
        }
      })
    })
}