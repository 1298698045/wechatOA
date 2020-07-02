<template>
    <div class="wrap">
        <div class="header">
            <div class="row">
                <p class="title">{{info.subject}}</p>
                <p class="iconWrap">
                    <i-icon type="packup" color="#3399ff" size="20" />
                    <i-icon type="unfold" color="#3399ff" size="20" />
                </p>
            </div>
            <div class="cont" v-if="show">
                <p class="">发件人：<span>{{info.fromName}}</span></p>
                <p class="email">weihui@fenghuang.com</p>
                <div v-for="(item,index) in info.toUsers" :key="index">
                    <p class="mar">收件人：<span>{{item.name}}</span></p>
                    <p class="email">zhanglp@fenghuang.com</p>
                </div>
                <p class="mar">&nbsp;&nbsp;&nbsp;时间：<span>{{info.createdOn}}</span></p>
                <div class="bottom">
                    <p>&nbsp;&nbsp;&nbsp;附件：<i-icon type="accessory" color="#fc6464" /><span>{{encolsureSize==1?enclosure[0].name:encolsureSize}}</span></p>
                    <p class="show" @click="getHide">
                        <i-icon type="collection_fill" color="#ecd464" />
                        隐藏
                    </p>
                </div>
            </div>
            <div class="contActive" v-else-if="!show">
                <div>
                    <p class="radius">{{fromName}}</p>
                </div>
                <div>
                    <p>{{info.fromName}}<i-icon type="accessory" color="#fc6464" />{{encolsureSize==1?enclosure[0].name:encolsureSize}}</p>
                    <p class="time">{{info.createdOn}}</p>
                </div>
                <div>
                    <p @click="getShow">详情</p>
                </div>
            </div>
        </div>
        <div class="center">
            <p>{{content}}</p>
        </div>
        <div class="content">
            <div class="box" v-for="(item,index) in enclosure" :key="index">
                <div>
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Shared_files.png" alt="">
                    </p>
                </div>
                <div>
                    <p>{{item.name}}.{{item.fileExtension}}</p>
                    <p class="time">2019/2/14  17:56   31.2MB</p>
                </div>
            </div>
        </div>
        <van-action-sheet
            :round="false"
            :show="starShow"
            :actions="starActions"
            cancel-text="取消"
            @close="starClose"
            @cancel="starCancel"
            @select="starSelect"
        />
        <van-action-sheet
        :round="false"
        :show="isShow"
        :actions="actions"
        cancel-text="取消"
        @close="handleClose"
        @cancel="hadleCancel"
        @select="handleSelect"
        />
        <van-action-sheet z-index="10000" :round="false" safe-area-inset-bottom cancel-text="取消" @close="getClose" @cancel="getCancel" :show="screenShow" title="筛选">
            <div class="sheetContent">
                <div class="box" @click="getThoroughDel">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Folders.png" alt="">
                    </p>
                    <p>彻底删除</p>
                </div>
                <div class="box">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/rar.png" alt="">
                    </p>
                    <p>拒收</p>
                </div>
                <div class="box" @click="getMoveEmail">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Image.png" alt="">
                    </p>
                    <p>移动到</p>
                </div>
            </div>
        </van-action-sheet>
        <div class="footer">
            <p @click="getOpenStar">
                <i class="iconfont icon-shoucang color"></i>
            </p>
            <p @click="getDelete">
                <i class="iconfont icon-shanchu1 color"></i>
            </p>
            <p @click="getShare">
                <i class="iconfont icon-zhuanfa1 color"></i>
            </p>
            <p @click="getOpenSheet">
                <i class="iconfont icon-elipples color"></i>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return  {
            show:false,
            isShow:false,
            actions:[
                { name: '回复', color: '07c160' },
                { name: '全部回复', color: '07c160' },
                { name: '转发', color: '07c160',openType:"share" }
            ],
            screenShow:false,
            starShow:false,
            starActions:[
                { name: '添加星标', color: '07c160' },
                { name: '标为未读', color: '07c160' }
            ],
            fromName:"",
            emailId:"",
            ltags:"",
            info:{},
            content:"",
            enclosure:[],
            encolsureSize:"",
            sessionkey:""
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.emailId = options.emailId;
        this.ltags = options.ltags;
        this.getQuery();
        this.contentDetail();
        this.enclosureQuery();
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
        // 附件列表
        enclosureQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.attachfiles.getlist",
                    SessionKey:this.sessionkey,
                    id:this.emailId                    
                }
            }).then(res=>{
                this.enclosure = res.listData;
                this.encolsureSize = res.listData.length;
            })
        },
        getShow(){
            this.show = true;
        },
        getHide(){
            this.show = false;
        },
        getShare(){
            this.isShow = true;
        },
        handleClose(){
            this.isShow = false;
        },
        hadleCancel(){
            this.isShow = false;
        },
        // 彻底删除
        getThoroughDel(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.thoroughDel,
                    SessionKey:this.sessionkey,
                    ids:this.emailId,
                    ltags:this.ltags,
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:'none',
                    duration:2000,
                    success:res=>{
                        wx.navigateBack({
                            delta:1
                        })
                    }
                })
            })
        },
        handleSelect(e){
            let name = e.mp.detail.name;
            if(name=='回复'){
                const url = "/pages/email/replyEmail/main?emailId="+this.emailId+'&ltags='+this.ltags;
                wx.navigateTo({url:url});
            }

        },
        getOpenStar(){
            this.starShow = true;
        },
        starCancel(){
            this.starShow = false;
        },
        starClose(){
            this.starShow = false;
        },
        starSelect(e){
            let name = e.mp.detail.name;
            if(name=='添加星标'){
                this.addCollection();
            }else if(name=='标为未读'){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                        data:{
                            method:"email.info.setread",
                            SessionKey:this.sessionkey,
                            Id:this.emailId,
                            action:0
                        }
                }).then(res=>{
                    wx.showToast({
                        title:res.msg,
                        icon:'success',
                        duration:2000
                    })
                })
            }
        },
        // 添加星标
        addCollection(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.star.add",
                    SessionKey:this.sessionkey,
                    Id:this.emailId,
                    action:"add"
                }
            }).then(res=>{
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000
                })
            })
        },
        getDelete(){
            let that = this;
            wx.showModal({
                title: '提示',
                content: '确定删除邮件？',
                success:res=>{
                    if (res.confirm) {
                    console.log('用户点击确定')
                        that.deleteEmail();
                    } else if (res.cancel) {
                    console.log('用户点击取消')
                    }
                }
            })
        },
        deleteEmail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.mailbox.delete",
                    SessionKey:this.sessionkey,
                    id:this.emailId,
                    mailbox:"Inbox"
                }
            }).then(res=>{
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000
                })
            })
        },
        getMoveEmail(){
            const url = '/pages/email/moveEmail/main?id='+this.emailId;
            wx.navigateTo({url:url});
        },
        getOpenSheet(){
            this.screenShow = true;
        },
        getCancel(){
            this.screenShow = false;
        },
        getClose(){
            this.screenShow = false;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    @import '../../../../static/css/emaiIcon.css';
    page{
        background: #fff;
    }
    .wrap{
        .header{
            width: 100%;
            border-bottom: 1rpx solid #eaeeed;
            .row{
                display: flex;
                padding: 20rpx ;
                justify-content:space-between;
                .title{
                    font-size: 28rpx;
                    font-weight: bold;
                }
            }
            .cont{
                padding: 0 20rpx 20rpx 20rpx;
                font-size: 28rpx;
                p{
                    color: #999999;
                    span{
                        color: #333333;
                    }
                }
                .email{
                    margin-left: 60px;
                }
                .mar{
                    margin-top: 10rpx;
                }
                .bottom{
                    display: flex;
                    justify-content: space-between;
                    .show{
                        color: #3399ff;
                    }
                }
            }
            .contActive{
                padding: 0 20rpx 20rpx 20rpx;
                font-size: 28rpx;
                display: flex;
                div:nth-child(2){
                    flex: 1;
                    margin-left: 20rpx;
                }
                div:nth-child(3){
                    p{
                        color: #3399ff;
                        margin-top: 20px;
                    }
                }
                .time{
                    color: #999999;
                }
            }
        }
        .center{
            padding: 20rpx;
            height: auto;
            border-bottom: 1rpx solid #eaeeed;
            p{
                font-size: 28rpx;
                color: #333333;
            }
        }
        .content{
            width: 100%;
            position: fixed;
            bottom: 60px;
            .box{
                display: flex;
                padding: 30rpx 20rpx;
                div:nth-child(1){
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                div:nth-child(2){
                    width: 100%;
                    margin-left: 20rpx;
                    font-size: 28rpx;
                    border-bottom: 1rpx solid #eaeeed;
                    .time{
                        font-size: 12px;
                        color: #999999;
                    }
                }
            }
            .box:last-child div:nth-child(2){
                border: none;
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            border-top: 1rpx solid #eaeeed;
            display: flex;
            padding: 30rpx 0;
            p{
                flex: 1;
                text-align: center;
                .color{
                    color: #3399ff;
                    font-size: 20px;
                }
            }
        }
        .sheetContent{
            display: flex;
            // justify-content: space-around;
            background: #f4f4f4;
            padding: 30rpx 20rpx;
            .box{
                margin-right: 20rpx;
                p:nth-child(1){
                    width: 120rpx;
                    height: 120rpx;
                    background: #fff;
                    border-radius: 10rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                        width: 80%;
                        height: 80%;
                        align-items: center;
                    }
                }
                p:nth-child(2){
                    font-size: 12px;
                    text-align: center;
                }
            }
        }
    }
</style>