<script>
export default {
  data(){
    return {
      isModelmes:false
    }
  },
  onLaunch(){
    let openid = wx.getStorageSync('openid');
    // if(openid!=''){
    //   const url = '/pages/messages/main';
    //   wx.switchTab({url:url});
    // }
  },
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
    
    wx.getSystemInfo({
        success: (res) => {
            console.log(res)
            let modelmes = res.model; //手机品牌
            console.log('手机品牌', modelmes)
            if (modelmes.indexOf('iPhone X') != -1) {　　//XS,XR,XS MAX均可以适配,因为indexOf()会将包含'iPhone X'的字段都查出来
              wx.setStorageSync('isModelmes',true);
            }else {
              wx.setStorageSync('isModelmes',false);
            }
        },
    })
    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
  },
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
page{
  background: #f7f7f7;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.bottomActive{
  bottom: 0 !important;
  padding-bottom: 50rpx !important;
}
.footImt{
  bottom: 0!important;
}
</style>
