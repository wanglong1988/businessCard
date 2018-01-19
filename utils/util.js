const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const url = require('../config').url

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const requestUrl = url

const payServer = 'https://app.sanqimei.com'

const sendRequest = (url = requestUrl, data = {}, successp, error) => {
  wx.request({
    url: requestUrl + url,
    success: function (res) {
      if (res.data.status == '0' && res.data.errorCode == '10000') {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      } else {
        successp(res)
      }
    },
    error,
    data
  })
}


module.exports = {
  formatTime: formatTime,
  requestUrl,
  sendRequest,
  payServer
}
