// pages/details/details.js
const url = require('../../config').url
const Zan = require('../../utils/toast/index.js')

Page({
  ...Zan,
  data: {
    inputVerifyCodeValue: "",
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    productList:[],
    productInfo:"",
    productNum:""
  },
  bindVerifyCodeInput: function (e) {
    this.setData({
      inputVerifyCodeValue: e.detail.value
    })
  },
  //是否已登录
  onLoad:function(){
    let _this=this;
    wx.request({
      url: url + "/login/islogin",
      data: {
        token: wx.getStorageSync('token'),
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.request({
            url: url + "/product/listPageSellerProduct",
            data: {
              token: wx.getStorageSync('token'),
              pageNumber:1,
              pageSize:10
            },
            success: function (res) {
              console.log(res.data.list)
              _this.setData({
                productList: res.data.list
              })
              wx.request({
                url: url + "/order/listPageVerificationCode",
                data: {
                  token: wx.getStorageSync('token'),
                  pageNumber: 1,
                  pageSize: 10,
                  productId: _this.data.productList[0].productId
                },
                success: function (res) {
                  console.log(res.data.list)
                  _this.setData({
                    productNum: res.data.totalVerificationCodeNumber,
                    productInfo: res.data.list
                  })
                }
              })  
            }
          })   
        } else {
          // wx.navigateTo({
          //   url: '../index/index'
          // })
        }
      }
    })
  },
  //核销
  actionSheetTap: function () {
    let _this = this;
    if (!this.data.inputVerifyCodeValue) {
      _this.showZanToast("核销码不能为空");
      return false
    }
    
    wx.request({
      url: url + "/order/updateVerificationCodeState",
      data: {
        verificationCode: this.data.inputVerifyCodeValue,
        token: wx.getStorageSync('token'),
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          _this.showZanToast(res.data.errorMsg);
          _this.onLoad();
          
        } else {
          _this.showZanToast(res.data.errorMsg);
        }
      }
    })
  },
  changeindex: function (event) {
    let _this=this;
    console.log(event.detail.current)
    console.log(_this.data.interval)
    wx.request({
      url: url + "/order/listPageVerificationCode",
      data: {
        token: wx.getStorageSync('token'),
        pageNumber: 1,
        pageSize: 10,
        productId: _this.data.productList[event.detail.current].productId
      },
      success: function (res) {
        console.log(res.data.list)
        _this.setData({
          productNum: res.data.totalVerificationCodeNumber,
          productInfo: res.data.list
        })
      }
    })  
  },
})