//index.js
const url = require('../../config').url
const Zan = require('../../utils/toast/index.js')

Page({
  ...Zan,
  data: {
    inputPhoneValue:"",
    inputCodeValue: "",
    canClick:true,
    time:30,
    hzphone:""
  },
  //申请合作
  actionSheetTap: function () {
    wx.request({
      url: url +"/login/getCooperation",
      data: "",
      success: function (res) {
        console.log(res.data.result.phone)
        if (res.data.status ==1) {       
          wx.makePhoneCall({
            phoneNumber: res.data.result.phone,
            success: function () {
              console.log("成功拨打电话")
            }
          })
        }
      }
    })       
  },
  bindPhoneInput: function (e) {
    this.setData({
      inputPhoneValue: e.detail.value
    })
  },
  bindCodeInput: function (e) {
    this.setData({
      inputCodeValue: e.detail.value
    })
  },

  //发送验证码
  setcode:function(e){
    let _this=this;
    let rep = /^1[3|4|5|7|8][0-9]\d{8}$/;
    if (!this.data.inputPhoneValue) {
      _this.showZanToast("手机号不能为空");
      return false
    } else if (!rep.test(this.data.inputPhoneValue)) {
      _this.showZanToast("请输入正确的手机号");
      return false
    }
    wx.request({
      url: url +"/login/getSmsCode",
      data:{
        phone: this.data.inputPhoneValue
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          _this.setData({
            canClick: false
          })
          this.inter = setInterval(function () {
            _this.setData({
              time: _this.data.time - 1
            })
            if (_this.data.time <= 0) {
              _this.setData({
                time: 30,
                canClick: true
              })
              clearInterval(_this.inter);
            }
          }, 1000)
        } else{
          console.log(res.data.errorMsg)
          _this.showZanToast(res.data.errorMsg)
        }
      }
    })
    

  },
    //登录
  logIn: function () {
    let _this=this;
    wx.request({
      url: url + "/login/islogin",
      data: {
        token: wx.getStorageSync('token'),
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.navigateTo({
            url: '../details/details'
          })
        } else if(res.data.status == 0){
          let rep = /^1[3|4|5|7|8][0-9]\d{8}$/;
          if (!_this.data.inputPhoneValue) {
            _this.showZanToast("手机号不能为空");
            return false
          } else if (!rep.test(_this.data.inputPhoneValue)) {
            _this.showZanToast("请输入正确的手机号");
            return false
          }
          if (!_this.data.inputCodeValue) {
            _this.showZanToast("请输入验证码");
            return false
          }

          wx.request({
            url: url + "/login/login",
            data: {
              phone: _this.data.inputPhoneValue,
              smsCode: _this.data.inputCodeValue
            },
            success: function (res) {
              if (res.data.status == 1) {
                wx.setStorageSync("token", res.data.result.token)
                wx.navigateTo({
                  url: '../details/details'
                })
              }
              else {
                _this.showZanToast(res.data.errorMsg);
              }
            }

          })
        }
      }
    })

    
    
  }
})

