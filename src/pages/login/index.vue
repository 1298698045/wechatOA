<template>
    <div class="wrap">
        <div class="title">
            <p>凤凰办公账号登录</p>
        </div>
        <div class="content">
            <!-- <van-field
                :value="username"
                title-width="100rpx"
                clearable
                label="主机："
                placeholder="(如：phxinfo.cn)"
            /> -->
            <van-field
                :value="username"
                @change="changeUserName"
                title-width="100rpx"
                clearable
                label="账号："
                placeholder="请输入账号"
            />
            <van-field
                type="password"
                :value="password"
                @change="changePassword"
                title-width="100rpx"
                clearable
                label="密码："
                placeholder="请输入密码"
            />
            <div class="btn">
                <van-button type="info" color="#3399ff" @click="getLogin" block>登陆</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState,mapMutations,mapActions,mapGetters } from 'vuex';
export default {
    data(){
        return {
            code:"",
            openid:"",
            username:"",
            password:"",
            userId:"",
            fullName:"",
            sessionkey:""

        }
    },
    onLoad(){
        let openid = wx.getStorageSync('openid');
        this.openid = openid;
        // if(openid){
        //     const url = '/pages/messages/main';
        //     wx.switchTab({url:url});
        // }else {
        //     this.login();
        // }
        this.login();
        if(openid){
            this.getLogin();
            // const url = '/pages/messages/main';
            // wx.switchTab({url:url});
        }
    },
    methods:{
        login(){
            let that = this;
            wx.login({
                success:res=>{
                    console.log(res);
                    that.code = res.code;
                }
            })
        },
        getLogin(){
            let data = {};
            if(this.openid){
                data = {
                    openid:this.openid,
                    username:this.username,
                    password:this.password
                }
            }else {
                data = {
                    code:this.code,
                    username:this.username,
                    password:this.password
                }
            }
            this.$httpWX.get({
                url:this.$api.login.login,
                data:data
            }).then(res=>{
                console.log(res);
                wx.setStorageSync('openid',res.openid);
                wx.setStorageSync('sessionkey',res.sessionkey);
                wx.setStorageSync('organizationName',res.organizationName);
                wx.setStorageSync('fullName',res.fullName);
                this.openid = res.openid;
                this.sessionkey = res.sessionkey;
                this.userId = res.userId;
                this.fullName = res.fullName;
                this.updateOpenid(res.openid);
                this.updateSessionkey(res.sessionkey);
                this.updateUserId(res.userId);
                this.updateFullName(res.fullName);
                if(res.status*1===1){
                    const url = '/pages/messages/main';
                    wx.switchTab({url:url});
                }
            })
        },
        ...mapMutations([
            'updateOpenid',
            'updateSessionkey',
            'updateUserId',
            'updateFullName'
        ]),
        changeUserName(e){
            this.username = e.mp.detail;
        },
        changePassword(e){
            this.password = e.mp.detail;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../static/css/public.scss';
    page{
        background: #fff;
    }
    .wrap{
        .title{
            font-size: 47rpx;
            color: #333333;
            font-weight: bold;
            text-align: center;
            margin-top: 124rpx;
        }
        .content{
            margin-top: 50rpx;
            padding: 0 67rpx;
            .btn{
                margin-top: 38rpx;
            }
        }
    }
</style>