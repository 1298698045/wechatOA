<template>
    <div class="wrap">
        <div class="header">

            <p v-for="(item,index) in info.toUsers" :key="index">收件人：<span>{{item.name}}</span></p>
            <p>抄送/密送，发件人：{{info.fromName}}</p>
            <p>主题：<span class="bold">回复：{{info.subject}}</span></p>
        </div>
        <div class="boxText">
            <textarea name="" v-model="mailBody" id="" cols="30" rows="10"></textarea>
        </div>
        <div class="content">
            <h3>-------------原始邮件-------------</h3>
            <div class="contBox">
                <p>发件人：<span>{{info.fromName}}</span></p>
                <p>发送时间：<span>{{info.createdOn}}</span></p>
                <p v-for="(item,index) in info.toUsers" :key="index">收件人：<span>{{item.name}}</span></p>
                <p>主题：<span>回复：{{info.subject}}</span></p>
            </div>
        </div>
        <h3>{{content}}</h3>
        <div class="footer">
            <div class="row">
                <p>
                    <van-icon custom-class="icon" name="photo" size="30" color="#3399ff" />
                    <van-icon @click="getPhoto" custom-class="icon" name="photo" size="30" color="#3399ff" />
                    <van-icon custom-class="icon" name="photo" size="30" color="#3399ff" />                    
                </p>
                <p class="sendout" @click="getSendOut">发送</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            emailId:"",
            info:"",
            fromName:"",
            ltags:"",
            content:"",
            mailBody:"",
            sessionkey:""
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.emailId = options.emailId;
        this.ltags = options.ltags;
        this.getQuery();
        this.contentDetail();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.info.get",
                    SessionKey:this.sessionkey,
                    id:this.emailId,
                    ltags:this.ltags
                }
            }).then(res=>{
                this.info = res.data;
                this.fromName = this.info.fromName.substr(1);
            })
        },
        contentDetail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.contentbody.get",
                    SessionKey:this.sessionkey,
                    id:this.emailId,
                    ltags:this.ltags
                }
            }).then(res=>{
                this.content = res;
            })
        },
        getSendOut(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.componse.send",
                    SessionKey:this.sessionkey,
                    subject:this.info.subject,
                    mailBody:this.mailBody,
                    // toUserids:this.UserId,
                    emailStatus:1,
                    priority:0,
                    attachfileids:""
                }

            }).then(res=>{
                wx.showToast({
                    title:'发送成功',
                    icon:'success',
                    duration:2000
                })
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    page{
        background: #fff;
    }
    .wrap{
        .header{
            background: #fff;
            padding:0 30rpx;
            p{
                font-size: 28rpx;
                color: #999999;
                padding: 20rpx 0;
                border-bottom: 1rpx solid #ededed;
                span{
                    color: #666666;
                }
                .bold{
                    color: #333333;
                    font-weight: bold;
                }
            }
            p:last-child{
                border: none;
            }
        }
        .boxText{
            padding: 20rpx 30rpx;
            background: #fff;
            textarea{
                width: 100%;
            }
        }
        .content{
            width: 100%;
            background: #fff;
            h3{
                font-size: 10px;
                color: #333333;
                padding: 30rpx;
            }
            .contBox{
                width: 85%;
                margin: 0 auto;
                padding:20rpx 30rpx ;
                background: #f4f4f4;
                border-radius: 10px;
                p{
                    font-size: 24rpx;
                    color: #333333;
                    font-weight: bold;
                    span{
                        font-weight: normal;
                    }
                }
            }
        }
        h3{
            padding: 30rpx;
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            border-top: 1rpx solid #eceeed;
            .row{
                display: flex;
                padding: 20rpx;
                justify-content: space-between;
                align-items: center;
                p:nth-child(1){
                    .icon{
                        margin-right: 40rpx;
                    }
                }
                p:nth-child(2){
                    padding: 10rpx 30rpx;
                    font-size: 28rpx;
                    color: #fff;
                    background: #3399ff;
                    border-radius: 5rpx;
                }
            }
        }
    }
</style>