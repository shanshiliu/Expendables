// 局域网
const host = 'http://192.168.0.101:1234/expendables/api'
// 远程
// const host = 'http://xinsiji.free.idcfengye.com/expendables/api'

wx.setStorage({
    key: 'toekn',
    data: '080BA57DAE3D546AD585AF1255B64B177480C34EBA07E445AFE96F1557D8FE3741E9BBC9B7FD181F413F6E095DF769C770DDD3B3E8B6BEF0FBF7A5D6FB3E192616C348D6E386C53E351845E6B8B6D5FC'
  })

let token  = ''
/* 获取token*/
wx.getStorage({
    key: 'toekn',
    success(res) {
        token = res.data
    }
})

// 封装ajax
export function Ajax (opts, cb=function(){}) {
    wx.showLoading({title: '请求中...', mask: true})
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