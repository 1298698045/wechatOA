<template>
    <div class="wrap">
        <div class="banner padding">
            <img :src="pathUrl!=''?pathUrl:'https://wx.phxinfo.com.cn/img/wechat/04.banner.png'" alt="">
            <span @click="getOpenPhoto">
                更换封面
            </span>
        </div>
        <div class="nav padding">
            <p>管理员控制台<span>（仅管理员可见）</span></p>
            <p>应用管理</p>
        </div>
        <div class="header padding">
            <div class="boxWrap">
                <div class="box">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Add.png" alt="">
                    </p>
                    <p>组织架构</p>
                </div>
                <div class="box">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Add.png" alt="">
                    </p>
                    <p>使用手册</p>
                </div>
                <div class="box">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Add.png" alt="">
                    </p>
                    <p>我的客服</p>
                </div>
                <div class="box">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Add.png" alt="">
                    </p>
                    <p>设置工作台</p>
                </div>
            </div>
        </div>
        <div class="center">
            <h3 class="padding">最近使用</h3>
            <div class="box">
                <p v-for="(item,index) in rowImgs" :key="index" @click="getOpenDetail(index)">
                    <img :src="item" alt="">
                </p>
            </div>
        </div>
        <div class="content" v-for="(item,index) in list" :key="index">
            <h3 class="padding" @click="getOpen(index)">
                <p>{{item.name}}</p>
                <p>{{item.showContent?'收起':'展开'}}</p>
            </h3>
            <div class="row" v-if="item.showContent">
                <div class="box" v-for="(v,i) in item.items" :key="i" @click="getRouter(v)">
                    <p>
                        <img :src="imgUrl+v.icon" alt="">
                    </p>
                    <p>{{v.label}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data(){
        return {
            rowImgs:[
                'https://wx.phxinfo.com.cn//img/icons/news.png',
                'https://wx.phxinfo.com.cn//img/icons/wftasks.png',
                'https://wx.phxinfo.com.cn//img/icons/email.png',
                'https://wx.phxinfo.com.cn//img/icons/file.png',
                'https://wx.phxinfo.com.cn//img/icons/meeting.png',
                'https://wx.phxinfo.com.cn//img/icons/addresslist.png'

            ],
            list:[],
            show:false,
            pathUrl:"",
            sessionkey:"",
            organizationName:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.organizationName = wx.getStorageSync('organizationName');
        wx.setNavigationBarTitle({
            title: this.organizationName
        })

        this.getQuery();
    },
    computed:{
        ...mapState({
            imgUrl:state=>{
                return state.user.imgUrl
            },
            sessionkey:state=>{
                return state.loginUser.sessionkey
            }
        })
    },
    methods:{
        getOpen(index){
            this.list[index].showContent = !this.list[index].showContent;
            console.log(this.list[index].showContent);
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"app.modules.getlist",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                this.list.map(item=>{
                    // const showContent = false;
                    // item.showContent = showContent;
                    // return item;
                    this.$set(item,'showContent',false)
                })
                this.list[0].showContent = true;
            })
        },
        getOpenDetail(index){
            if(index==0){
                const url = '/pages/journalism/main?contentTypeCode='+1;
                wx.navigateTo({url:url});
            }else if(index==1){
                const url = '/pages/todoBusiness/main';
                wx.navigateTo({url:url});
            }else if(index==2){
                const url  = '/pages/email/main';
                wx.navigateTo({url:url});
            }else if(index==3){
                const url = '/pages/usbDrive/main';
                wx.navigateTo({url:url});
            }else if(index==4){
                const url = '/pages/meeting/notice/main';
                wx.navigateTo({url:url});
            }else if(index==5){
                const url = '/pages/homeMailList/main';
                wx.switchTab({url:url});
            }
        },
        getRouter(item){
            console.log(item);
            // 107邮件 101待办事务 104新闻
            if(item.id==107){
                const url  = '/pages/email/main';
                wx.navigateTo({url:url});
            }else if(item.id==104){
                const url = '/pages/journalism/main?contentTypeCode='+1;
                wx.navigateTo({url:url});
            }else if(item.id==101){
                const url = '/pages/todoBusiness/main';
                wx.navigateTo({url:url});
            }else if(item.id==106){
                const url = '/pages/usbDrive/main';
                wx.navigateTo({url:url});
            }else if(item.id==100202){
                const url = '/pages/journalism/main?contentTypeCode='+2;
                wx.navigateTo({url:url});
                // const url = '/pages/todoBusiness/launch/main';
                // wx.navigateTo({url:url});
            }else if(item.id==302){
                const url = '/pages/clockIn/main';
                wx.navigateTo({url:url});
            }else if(item.id==20034){
                const url = '/pages/conferenceRoom/main';
                wx.navigateTo({url:url});
            }else if(item.id==103){
                const url = '/pages/schedule/main';
                wx.switchTab({url:url});
            }else if(item.id==100101){
                const url = '/pages/approval/main';
                wx.navigateTo({url:url});
            }else if(item.id==112){
                const url = '/pages/meeting/notice/main';
                wx.navigateTo({url:url});
            }
        },
        getOpenPhoto(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    that.pathUrl = tempFilePaths[0];
                }
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../static/css/public.scss';
    .wrap{
        background: #fff;
        .banner{
            background: #fff;
            height: 130px;
            position: relative;
            img{
                width: 100%;
                height: 100%;
                vertical-align: middle;
                border-radius: 10px;
            }
            span{
                display: inline-block;
                color: #fff;
                font-size: 24rpx;
                width: 179rpx;
                height: 52rpx;
                line-height: 52rpx;
                text-align: center;
                position: absolute;
                top:50px;
                background: #000000;
                right: 30rpx;
                opacity: .5;
                border-top-left-radius: 28rpx;
                border-bottom-left-radius: 28rpx;
            }
        }
        .nav{
            background: #fff;
            display: flex;
            justify-content: space-between;
            p:nth-child(1){
                font-size: 28rpx;
                font-weight: bold;
                span{
                    font-size: 12px;
                    color: #a3a3a3;
                }
            }
            p:nth-child(2){
                font-size: 12px;
                color: #3399ff;
            }
        }
        .header{
            border-bottom: 1rpx solid #e2e2e2;
            .boxWrap{
                display: flex;
                .box{
                    width: 25%;
                    p:nth-child(1){
                        width: 60rpx;
                        height: 60rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 0 auto;
                        img{
                            width: 40rpx;
                            height: 40rpx;
                        }
                    }
                    p:nth-child(2){
                        font-size: 12px;
                        text-align: center;
                    }

                }
            }
        }
        .center{
            border-bottom: 1rpx solid #e2e2e2;
            h3{
                font-size: 28rpx;
                font-weight: bold;
            }
            .box{
                display: flex;
                justify-content: space-around;
                padding: 20rpx 0 ;
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
        }
        .content{
            border-bottom: 1rpx solid #e2e2e2;
            h3{
                display: flex;
                justify-content: space-between;
                p:nth-child(1){
                    font-size: 28rpx;;
                    font-weight: bold;
                }
                p:nth-child(2){
                    font-size: 20rpx;
                    color: #a3a3a3;
                }
            }
            .row{
                display: flex;
                flex-wrap: wrap;
                .box{
                    width: 25%;
                    margin: 20rpx 0;
                    p:nth-child(1){
                        width: 100rpx;
                        height: 100rpx;
                        margin: 0 auto;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    p:nth-child(2){
                        font-size: 12px;
                        color: #333333;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>