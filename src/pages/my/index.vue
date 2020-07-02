<template>
    <div class="wrap">
        <div class="header">
            <div class="navBox">
                <div @click="getInfo">
                    <p>{{info.fullName}}</p>
                </div>
                <div @click="getInfo">
                    <p class="name">{{info.fullName}}</p>
                    <p class="info">{{info.deptName}}</p>
                </div>
                <div>
                    <i class="iconfont icon-erweima2" style="color:#A3A7AC;"></i>
                    <!-- <van-icon name="qr" size="30" color="#cccccc" @click="getQrCode" /> -->
                    <i-icon type="enter" size="20" color="#cccccc" />
                </div>
            </div>
        </div>
        <div class="center">
            <div class="row">
                <p>
                    <i class="iconfont icon-shequshenghuo" style="color:#e4a454;"></i>
                    <!-- <img src="https://wx.phxinfo.com.cn/img/wechat/06.Mail.png" alt=""> -->
                </p>
                <p>
                    社区
                </p>
                <p>
                    <i-icon type="enter" size="20" />
                </p>
            </div>
            <div class="rowWrap">
                <div class="box" @click="getEmail">
                    <p>
                        <i class="iconfont icon-shejiao_youjian" style="color:#ec746c;"></i>
                        <!-- <img src="https://wx.phxinfo.com.cn/img/wechat/06.Mail.png" alt=""> -->
                    </p>
                    <p class="division">
                        邮件
                        <span><i-icon type="enter" size="20" /></span>
                    </p>
                </div>
                <div class="box" @click="getUsb">
                    <p>
                        <i class="iconfont icon-youpan" style="color:#3399ff;"></i>
                        <!-- <img src="https://wx.phxinfo.com.cn/img/wechat/06.Mail.png" alt=""> -->
                    </p>
                    <p class="division">
                        优盘
                        <span><i-icon type="enter" size="20" /></span>
                    </p>
                </div>
            </div>
            <div class="row" @click="getRouterSet">
                <p>
                    <i class="iconfont icon-shezhi1" style="color:#587396;"></i>
                    <!-- <img src="https://wx.phxinfo.com.cn/img/wechat/06.Mail.png" alt=""> -->
                </p>
                <p>
                    设置
                </p>
                <p>
                    <i-icon type="enter" size="20" />
                </p>
            </div>
            <button @click="getOpen">订阅</button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            sessionkey:"",
            info:{},
            tmplIds:[],
            data:"",
            openid:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.openid = wx.getStorageSync('openid');
        this.sessionkey = sessionkey;
        this.getUserInfo();
        this.getAvatar();
        this.getTemplate();
        
    },
    methods:{
        getEmail(){
            const url = '/pages/email/main';
            wx.navigateTo({url:url});
        },
        getUsb(){
            const url = '/pages/usbDrive/main';
            wx.navigateTo({url:url});
        },
        getTemplate(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"wxmi.user.msgsubscribe.notaccept",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.tmplIds = res.data;
            })
        },
        getOpen(){
            let that = this;
            wx.requestSubscribeMessage({
                tmplIds:this.tmplIds,
                success:res=>{
                    console.log(res);
                    that.data = JSON.stringify(res);
                    that.$httpWX.get({
                        url:that.$api.message.queryList,
                        data:{
                            method:"wxmi.user.msgsubscribe.save",
                            SessionKey:this.sessionkey,
                            openid:that.openid,
                            data:that.data
                        }
                    }).then(res=>{
                        console.log(res);
                    })
                }
            })
        },
        getUserInfo(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.userinfo.get",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.info = res.data[0];
            })
        },
        getAvatar(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.user.avatar.get",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getRouterSet(){
            const url = '/pages/my/mysetting/main';
            wx.navigateTo({url:url});
        },
        getQrCode(){
            const url = '/pages/my/qrCode/main';
            wx.navigateTo({url:url});
        },
        getInfo(){
            const url = '/pages/my/personalInfo/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    @import '../../../static/css/public.scss';
    @font-face {
        font-family: 'iconfont';
        src: url(data:font/truetype;charset=utf-8;base64,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) format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    }

    .icon-shequshenghuo:before {
    content: "\e60a";
    }

    .icon-youpan:before {
    content: "\e600";
    }

    .icon-shezhi1:before {
    content: "\e63d";
    }

    .icon-shejiao_youjian:before {
    content: "\e601";
    }

    .icon-erweima2:before {
    content: "\e602";
    }


    .wrap{
        .header{
            background: #fff;
            .navBox{
                padding: 30rpx;
                display: flex;
                div:nth-child(1){
                    p{
                        width: 120rpx;
                        height: 120rpx;
                        line-height: 120rpx;
                        text-align: center;
                        border-radius: 50%;
                        color: #fff;
                        font-size: 28rpx;
                        background: #3399ff;
                    }
                }
                div:nth-child(2){
                    flex: 1;
                    margin-left: 30rpx;
                    .name{
                        font-size: 36rpx;
                        font-weight: bold;
                        color: #333333;
                        margin-top: 20rpx;
                    }
                    .info{
                        font-size: 12px;
                        color: #999999;
                        margin-top: 10rpx;
                    }
                }
                div:nth-child(3){
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
        .center{
            .row{
                display: flex;
                background: #fff;
                margin: 20rpx 0;
                padding: 30rpx;
                align-items: center;
                p:nth-child(1){
                    width: 50rpx;
                    // height: 50rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                }
                p:nth-child(2){
                    font-size: 28rpx;
                    flex: 1;
                    margin-left: 30rpx;
                }
            }
            .rowWrap{
                background: #fff;
                .box:last-child .division{
                    border: none;
                }
                .box{
                    display: flex;
                    padding: 0 30rpx;
                    align-items: center;
                    p:nth-child(1){
                        width: 50rpx;
                        height: 50rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    p:nth-child(2){
                        font-size: 28rpx;
                        flex: 1;
                        margin-left: 30rpx;
                        overflow: hidden;
                        padding: 30rpx 0;
                        span{
                            float: right;
                        }
                    }
                    .division{
                        border-bottom: 1rpx solid #e2e4e3;
                    }
                }
            }
        }
    }
</style>