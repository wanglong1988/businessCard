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
    productNum:"",
    swiperCurrent: 0,
    sellerName:""
  },
  bindVerifyCodeInput: function (e) {
    this.setData({
      inputVerifyCodeValue: e.detail.value
    })
  },
  //show
  onShow:function(){
    let _this = this;
    wx.request({
      url: url + "/login/islogin",
      data: {
        token: wx.getStorageSync('token'),
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == '0' && res.data.errorCode == '10000') {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
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
          console.log(res.data)
          _this.setData({
            sellerName: res.data.result.sellerName
          })
          wx.request({
            url: url + "/product/listPageSellerProduct",
            data: {
              token: wx.getStorageSync('token'),
              pageNumber:1,
              pageSize:10
            },
            success: function (res) {
              console.log(res.data)
              _this.setData({
                productList: res.data.list,
                swiperCurrent:0
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
        } else{
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    })
  },
  //核销
  // actionSheetTap: function () {
  //   let _this = this;
  //   if (!this.data.inputVerifyCodeValue) {
  //     _this.showZanToast("核销码不能为空");
  //     return false
  //   }
    
  //   wx.request({
  //     url: url + "/order/updateVerificationCodeState",
  //     data: {
  //       verificationCode: this.data.inputVerifyCodeValue,
  //       token: wx.getStorageSync('token'),
  //     },
  //     success: function (res) {
  //       console.log(res)
  //       if (res.data.status == 1) {
  //         _this.showZanToast(res.data.errorMsg);
  //         _this.onLoad();
          
  //       } else {
  //         _this.showZanToast(res.data.errorMsg);
          
  //       }
  //     }
  //   })
  // },
 //退出
  loginOut: function () {
    let _this = this;
    wx.request({
      url: url + "/login/loginOut",
      data: {
        token: wx.getStorageSync('token'),
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.reLaunch({
            url: '../index/index'
          })
          wx.setStorageSync("token", "")
        }
      }
    })

   
  },
  //扫描二维码
  scanCode: function () {
    let _this = this;

    wx.scanCode({
      success: (res) => {
        wx.request({
          url: url + "/order/updateVerificationCodeState",
          data: {
            verificationCode: res.result,
            token: wx.getStorageSync('token'),
          },
          success: function (res) {
            console.log("123",res.data.result)
            // wx.showModal({
            //   title: "提示",
            //   content: "核销码成功，核销手机号\r\n" + res.data.result,
            //   showCancel: false,
            //   confirmText: "确定"
            // })
            if (res.data.status == 1) {
              wx.showModal({
                  title: "提示",
                  content: "核销码成功，核销手机号\r\n" + res.data.result.slice(0, 3) + "-"+res.data.result.slice(3, 7) + "-"+res.data.result.slice(7, 11),
                  showCancel: false,
                  confirmText: "确定"
                })
              _this.onLoad();

            } else {
              // _this.showZanToast(res.data.errorMsg);
              wx.showModal({
                title: "提示",
                content: res.data.errorMsg,
                showCancel: false,
                confirmText: "确定"
              })
            }
          }
        })
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
  setWebviewurl: function (e){
    let _this = this;
    let productId = e.target.dataset.src;
    console.log(productId);
    wx.navigateTo({
      url: "../../pages/productdetail/detail?productId=" + productId,
    })
  }
})