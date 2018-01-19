import Zan from '../../utils/toast/index.js'
import {sendRequest} from '../../utils/util.js'

Page({

  ...Zan,
 
  /**
   * 页面的初始数据\
   * 
   * 
   */
  data: {
    banner: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
    phoneNumber: '18252701959',
    indicatorDots: true,
  },

  goCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = '/card/getProductInfo',
        token = wx.getStorageSync('token'),
        productId = options.productId,
        
        self = this
    console.log(options),
    sendRequest(url, {
      token,
      productId
    }, (res)=>{
      res = res.data
      if(res.status == '1'){
        console.log(res.result.listBanner)
        if (res.result.listBanner.length == 1){
          self.setData({
            indicatorDots: false
          })
        }
        self.setData({
          banner: res.result.listBanner[0].picUrl,
          detail: res.result,
          phoneNumber: res.result.appointmentPhone,
        })
        // WxParse.wxParse('detailDesc', 'html', res.result.descText, self)
      }else{
        self.showZanToast(res.errorMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})