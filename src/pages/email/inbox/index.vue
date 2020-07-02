<template>
    <div class="wrap">
         <div class="nav">
            <p>
                <van-search :value="value" placeholder="搜索邮件" />
            </p>
            <p @click="getEdit" v-if="!show">编辑</p>
            <!-- <p @click="getAllSelect" v-if="show&&result==''">全选</p> -->
            <p @click="getCancel" v-if="show">取消</p>
        </div>
        <div class="center">
            <van-checkbox-group :value="result" @change="changeCheckbox">
                <div class="content" v-for="(item,index) in list " :key="index">
                    <div class="checkWrap" v-if="show">
                        <van-checkbox custom-class="check" :name="item.emailId"></van-checkbox>
                    </div>
                    <div class="left">
                        <p class="radius">{{item.name}}</p>
                    </div>
                    <div class="right"  @click="getDetail(item)">
                        <div>
                            <p>
                                <span v-if="!item.isRead"></span>
                                {{item.fromName}}</p>
                            <p>{{item.subject?item.subject:'无主题'}}</p>
                            <p>{{item.content?item.content:'此邮件没有文字内容'}}</p>
                        </div>
                        <div>
                            <p>
                                <i-icon type="collection_fill" color="#ecd464" v-if="item.starEmail=='1'" />
                                {{item.time}}</p>
                            <span>2</span>
                        </div>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <div class="footer" v-if="show">
            <div class="box">
                <p @click="getAllSelect" v-if="result==''">全选</p>
                <p @click="getCancelAll" v-if="result!=''">取消全选</p>
                <p @click="signEmailAll"  v-if="result==''">全标已读</p>
                <p @click="getSign"  v-if="result!=''">标记邮件</p>
                <p @click="getMove" class="color" :class="result!=''?'active':''">移动</p>
                <p @click="deleteEmail" class="color"  :class="result!=''?'active':''">删除</p>
                <!-- <p @click="getRejection">拒收</p> -->
            </div>
        </div>
        <div class="clues-add-button"  @click="onCluesAddBtnClick">
            +
        </div>
        <van-action-sheet
            :show="showSheet"
            :round="false"
            :actions="actions"
            cancel-text="取消"
            @close="onClose"
            @select="onSelect"
            @cancel="onCancel"
        />
        <van-popup
        :show="showAll"
        position="center"
        custom-style="width:80%;height: auto;border-radius:7rpx;"
        @close="onClosePopup"
        >
            <div class="popup">
                <h3>
                    全部标记已读
                </h3>
                <p>将本文件夹下的未读邮件全部标为已读状态？</p>
                <div>
                    <span @click="onClosePopup">取消</span>
                    <span>确定</span>
                </div>
            </div>
        </van-popup>
        <van-action-sheet
            :show="showWrite"
            :actions="actionsWrite"
            :round="false"
            cancel-text="取消"
            @close="onWriteClose"
            @cancel="onWriteCancel"
            @select="onWriteSelect"
        >
        </van-action-sheet>
    </div>
</template>
<script>
import {getDate} from '@/utils/changeDate.js';
export default {
    data(){
        return {
            result:[],
            show:false,
            list:[],
            pageNumber:1,
            pageSize:25,
            isPage:false,
            emailId:"",
            name:"",
            ltags:"",
            showSheet:false,
            actions: [
                {
                    name:"星标"
                },
                {
                    name: '标为未读',
                    color:"#3399ff"
                },
                {
                    name: '标为已读',
                    color:"#3399ff"
                }
            ],
            signNum:1,
            showAll:false,
            actionsWrite: [
                {
                    id:1,
                    name: '写邮件',
                    color:"#3399ff"
                },
                {
                    id:2,
                    name: '写群邮件',
                    color:"#3399ff"
                }
            ],
            showWrite:false,
            sessionkey:""
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.name = options.name;
        this.ltags = options.ltags;
        wx.setNavigationBarTitle({
            title: this.name
        })
        this.getQuery();
    },
    onShow(){
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.basicinfo.search",
                    SessionKey:this.sessionkey,
                    ltags:this.ltags,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize                 
                }
            }).then(res=>{
                this.list = res.listData;
                this.list.map(item=>{
                    const time = getDate(item.createdOn.replace(/-/g,'/'));
                    const name = item.fromName.substr(1);
                    item.name = name;
                    item.time = time;
                    return item;
                })
                console.log(this.list);
            })
        },
        getStarQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.star.getlist",
                    SessionKey:this.sessionkey,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize                 
                }
            }).then(res=>{
                this.list = res.listData;
                this.list.map(item=>{
                    const time = getDate(item.createdOn.replace(/-/g,'/'));
                    const name = item.fromName.substr(1);
                    item.name = name;
                    item.time = time;
                    return item;
                })
                console.log(this.list);
            })
        },
        changeCheckbox(e){
            this.result = e.mp.detail;
            this.emailId = this.result.join(',');
        },
        // 全标已读
        signEmailAll(){
            this.showAll = true;
            // this.signNum = 1;
            // this.signEmail();
        },
        signEmail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.info.setread",
                    SessionKey:this.sessionkey,
                    Id:this.emailId,
                    action:this.signNum
                }
            }).then(res=>{
                console.log(res);
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        that.result = [];
                        that.emailId = "";
                        that.show = false;
                    }
                })
            })
        },
        // 删除邮件
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
                console.log(res);
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        that.result = [];
                        that.emailId = "";
                        that.show = false;
                        setTimeout(()=>{
                            that.getQuery();
                        },1000)
                    }
                })
            })
        },
        getEdit(){
            this.show = !this.show;
        },
        getAllSelect(){
            this.result = [];
            this.list.forEach(item=>{
                this.result.push(item.emailId);
            })
        },
        getCancel(){
            this.result = [];
            this.show = false;
        },
        getCancelAll(){
            this.result = [];
        },
        getDetail(item){
            const url = '/pages/email/detail/main?emailId='+item.emailId+'&ltags='+'Inbox';
            wx.navigateTo({url:url});
        },
        getMove(){
            const url = '/pages/email/moveEmail/main';
            wx.navigateTo({url:url});
        },
        getRejection(){
            wx.showModal({
                title: '提示',
                content: '拒收后，你将不再收到来自卫辉的邮件。',
                confirmText:'确定拒收',
                success (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        },
        onCluesAddBtnClick(){
            this.showWrite = true;
            // const url = '/pages/email/writeMail/main';
            // wx.navigateTo({
            //     url:url
            // })
        },
        onWriteSelect(e){
            let id = e.mp.detail.id;
            if(id==1){
                const url = "/pages/email/writeMail/main";
                wx.navigateTo({url:url});
            }else if(id==2){
                const url = "/pages/email/group/main";
                wx.navigateTo({url:url});
            }
        },
        onWriteClose(){
            this.showWrite = false;
        },
        onWriteCancel(){
            this.showWrite = false;
        },
        onClose(){
            this.showSheet = false;
        },
        onCancel(){
            this.showSheet = false;
        },
        onSelect(e){
            console.log(e);
            let name = e.mp.detail.name;
            if(name=='标为未读'){
                this.signNum = 0;
            }else if(name=='标为已读'){
                this.signNum = 1;
            }
            this.signEmail();
        },
        // 标记邮件
        getSign(){
            this.showSheet = true;
        },
        onClosePopup(){
            this.showAll = false;
        },

    },
    onPullDownRefresh(){
        this.pageNumber = 1;
        this.getQuery();
        wx.stopPullDownRefresh();
    },
    onReachBottom(){

    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .nav{
            width: 100%;
            background: #fff;
            display: flex;
            p:nth-child(1){
                width: 85%;
            }
            p:nth-child(2){
                width: 15%;
                color: #3399ff;
                font-size: 28rpx;
                text-align: center;
                margin-top: 15px;
            }
        }
        .center{
            background: #fff;
            padding: 20rpx ;
            // padding-bottom: 100rpx;
            .content:last-child .right{
                border:none;
            }
            .content{
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                .checkWrap{
                    width: 30px;
                }
                .left{
    
                }
                .right{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    margin-left: 20rpx;
                    padding:10rpx 0;
                    border-bottom: 1rpx solid #eaeeed;
                    div:nth-child(1){
                        p:nth-child(1){
                            font-size: 28rpx;
                            font-weight: bold;
                            color: #333333;
                            span{
                                width: 10rpx;
                                height: 10rpx;
                                border-radius: 50%;
                                background: #fc6464;
                                display: inline-block;
                            }
                        }
                        p:nth-child(2){
                            font-size: 12px;
                            color: #333333;
                        }
                        p:nth-child(3){
                            font-size: 12px;
                            color: #999999;
                        }
                    }
                    div:nth-child(2){
                        overflow: hidden;
                        p:nth-child(1){
                            font-size: 10px;
                            color: #999999;
                            text-align: right;
                        }
                        span:nth-child(2){
                            font-size: 10px;
                            color: #333;
                            text-align: center;
                            background: #eceeed;
                            width: 31rpx;
	                        height: 33rpx;
                            display: inline-block;
                            float: right;
                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            background: #fff;
            position: fixed;
            bottom: 0;
            .box{
                display: flex;
                padding: 30rpx 20rpx;
                justify-content: space-around;
                p{
                    font-size: 29rpx;
                    color: #3399ff;
                }
                p:nth-child(4){
                    color: #ff6666;
                }
                .color{
                    opacity: .5;
                }
                .color.active{
                    opacity: 1;
                }
            }
        }
        .popup{
            padding: 20rpx 30rpx;
            h3{
                font-size: 23rpx;
                color: #999999;
            }
            p{
                font-size: 33rpx;
                color: #333333;
                padding: 30rpx 0;
            }
            div{
                text-align: right;
                span{
                    font-size: 28rpx;
                    color: #3399ff;
                }
                span:nth-child(1){
                    margin-right: 60rpx;
                }
            }
        }
    }
</style>