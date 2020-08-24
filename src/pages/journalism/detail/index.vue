<template>
    <div class="wrap">
        <div class="header">
            <h1>{{info.Title}}</h1>
            <!-- <h1>采购审批</h1> -->
        </div>
        <div class="rowWrap">
            <div class="row">
                <p>{{info.CreatedbyName}}</p>
            </div>
            <div class="row">
                <p>{{info.CreatedbyName}}</p>
                <p class="time">{{info.BusinessUnitIdName}} <span>{{info.CreatedOn}}</span></p>
            </div>
            <!-- <div class="row">
                <p class="gz" :class="{'active':follow==true}" @click="getFollow">{{follow?'已关注':'关注'}}</p>
            </div> -->
        </div>
        <div class="center">
            <div class="parse">
                <wxParse :content="article" />
            </div>
            <div class="dividerWrap" v-if="enclosureList!=''">
                <!-- <p>
                    附件
                </p> -->
                <span></span>
            </div>
            <!-- <div>
                <van-divider contentPosition="left">附件</van-divider>
            </div> -->
            <div class="boxWrap">
                <h3>附件</h3>
                <div class="enclosureCont">
                    <p v-for="(item,index) in enclosureList" :key="index" @click="getOpenFile(item)">
                        <i class="iconfont icon-fujian2"></i>
                        <!-- <i-icon type="accessory" color="#ff6666" /> -->
                        <span class="overflow">
                            {{item.name}}
                        </span>
                    </p>
                </div>
            </div>
            <div class="dividerWrap">
                <!-- <p>
                    相关标签
                </p> -->
                <span></span>
            </div>
            <div class="boxWrap">
                <h3>标签</h3>
                <div class="tagContent">
                    <p v-for="(item,index) in KeyWords" :key="index">{{item}}</p>
                    <!-- <p>财务</p> -->
                </div>
            </div>
            <div class="dividerWrap">
                <span></span>
            </div>
            <div class="border">
                <!-- <p @click="getLick">点赞{{info.likecount}}</p>
                <p>不喜欢{{info.dislikeqty}}</p> -->
                <p @click="getFabulous(zanShow)" :class="{'active':zanShow}">
                    <i class="iconfont icon-zan2"></i>
                    <span v-if="!zanShow">点赞</span>
                    <span v-else>
                        {{info.LikeCount}}
                    </span>
                </p>
                <!-- <p>
                    <i class="iconfont icon-shanchu1"></i>
                    <span>
                        不喜欢
                    </span>
                </p> -->
            </div>
            <!-- <div class="dividerWrap" v-if="relevantList!=''">
                <p>
                    相关推荐
                </p>
                <span></span>
            </div> -->
            <!-- <div>
                <van-divider contentPosition="left">相关推荐</van-divider>
            </div> -->
        </div>
        <div class="contentWrap">
            <div class="relevantList" v-for="(item,index) in relevantList" :key="index" @click="getParentPage(item)">
                <div class="content" v-if="item.coverdisplay!='RightTitle'">
                    <p class="h1">{{item.title}}</p>
                    <div class="rowText">
                        <span>{{item.keywords}}</span>
                        <span>{{item.readcount}}阅读</span>
                        <span>{{item.commentcount}}评论</span>
                        <span>{{item.time}}</span>
                    </div>
                </div>
                <div class="rightContent" v-if="item.coverdisplay=='RightTitle'">
                    <div class="left">
                        <p class="title">
                            {{item.title}}
                        </p>
                        <p class="time">
                            {{item.keywords}}  {{item.readcount}}阅读  {{item.time}}
                        </p>
                    </div>
                    <div class="right">
                        <img src="" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="tabWrap">
            <van-index-bar :scroll-top="scrollTop">
                <i-tabs :current="current" @change="handleChangeTab">
                    <i-tab key="tab1" :title="'评论 '+info.CommentCount"></i-tab>
                    <i-tab key="tab2" :title="'已读 '+info.ReadCount"></i-tab>
                </i-tabs>
                <div class="content" v-for="(item,index) in commentList" :key="index" v-if="current=='tab1'">
                    <div class="row">
                        <p>{{item.CreatedByName}}</p>
                    </div>
                    <div class="row">
                        <p class="name">{{item.CreatedByName}}</p>
                        <p class="cont">{{item.Comment}}</p>
                        <p class="info">{{item.BusinessUnitName}} <span>{{item.CreatedOn}}</span></p>
                    </div>
                    <div class="row" @click="getCommentLive(item)">
                        <i class="iconfont icon-zan2 zan" :class="item.IsLike==1?'active':''">
                        </i>
                        <span :class="item.IsLike==1?'active':''">{{item.IsLike==1?item.LikeQty:'赞'}}</span>
                    </div>
                </div>
                <div class="content" v-for="(item,index) in readerList" :key="index" v-if="current=='tab2'">
                    <div class="row">
                        <p>{{item.ReaderIdName}}</p>
                    </div>
                    <div class="row">
                        <p class="name">{{item.ReaderIdName}}</p>
                        <p class="info">{{item.BusinessUnitIdName}} <span>{{item.time}}</span></p>
                    </div>
                    <!-- <div class="row">
                        <i class="iconfont icon-zan zan">58</i>
                    </div> -->
                </div>
            </van-index-bar>   
        </div>
        <div class="inpWrap" :style="{'height':height+'px'}" catchtouchmove="true" v-if="overlayShow==true">
            <div class="top" @click="getCloseOver">

            </div>
            <div class="bottom">
                <div class="box">
                    <textarea class="textarea" v-model="comment" @blur="getBlur" :show-confirm-bar="false" cursor-spacing='140' placeholder="我来说两句..." :auto-focus="true" name="" id="" maxlength="500" cols="30" rows="10"></textarea>
                    <div class="total">
                        <p>
                            {{contentSize}}/{{total}}
                        </p>
                        <p @click="getSendout" :class="{active:comment!=''}">
                            发送
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- <van-overlay :show="overlayShow" @click="onClickHide">
        </!-->
        <div class="footer" v-if="overlayShow==false" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="bottomBox">
                <!-- <p>
                    <i class="iconfont icon-fanhui"></i>
                </p> -->
                <p>
                    <span @click="getFocus" class="inp">
                        <i class="iconfont icon-xingzhuang"></i>
                        写评论...
                    </span>
                    <!-- <input class="inp" type="text" v-model="comment" placeholder="写评论..." @focus="getFocus" @blur="getBlur" @confirm="getSendout" /> -->
                </p>
                <p>
                    <i class="iconfont icon-pinglun icon" @click="getComment"></i>
                </p>
                <p>
                    <i class="iconfont icon-shoucang xing icon" :class="{'xingActive':isShow==true}" @click="getLive(isShow)"></i>
                </p>
                <p>
                    <i class="iconfont icon-zan2 zan icon" :class="{'zanActive':zanShow==true}" @click="getFabulous(zanShow)"></i>
                </p>
                <!-- 二期版本 -->
                <!-- <p>
                    <i class="iconfont icon-elipples icon" @click="getEdit"></i>
                </p> -->
            </div>
        </div>
        <van-action-sheet
            :show="moveShow"
            :round="false"
            cancel-text="取消"
            :actions="actions"
            @cancel="getCancelMove"
            @close="closeMoveShow"
            @select="onSelectMove"
        />
        <!-- <van-popup
            :show="moveShow"
            position="center"
            custom-style="width:80%;height: auto;border-radius:10rpx;"
            @close="closeMoveShow"
        >
            <div class="moveWrap">
                <p>分享</p>
                <p>编辑</p>
                <p @click="getDelete">删除</p>
                <h3 @click="closeMoveShow">取消</h3>
            </div>
        </van-popup> -->
        <van-notify id="van-notify" />
    </div>
</template>
<script>
import wxParse from 'mpvue-wxparse';
import { mapState, mapMutations } from 'vuex';
import { getDate } from '@/utils/changeDate.js';
import Notify from '../../../../static/vant/notify/notify';
// const openFile = require('../../../utils/openFiles');
import getOpenFiles from '@/utils/openFiles';
export default {
    components:{
        wxParse
    },
    data(){
        return {
            article: '<div>5月10日，宣武医院举办了“以拼搏为美，向行动致敬”主题宣讲暨表彰大会。院党委书记张国君、副院长吴英锋、院党委副书记李嘉、张维等出席大会。会议由张维主持。近年来，宣医人在医疗、护理、教学、科研、管理、后勤等方面兢兢业业、开拓创新，取得了优异的成绩，涌现出众多先进典型。首都劳动奖章获得者、“全国十大最美医生”华扬主任；“北京榜样”、急诊科“天使在身边”志愿者代表陶雪莹和梁琦爽；52岁援藏专家、拉萨市“2017年度卫生援藏先进工作者”马淑；科研创新代表、北京市三八红旗奖章获得者王蓉；我院“十佳青年”、癫痫患儿的知心姐姐霍光研等人作为典型代表，成为此次主题宣讲大会的宣讲对象。</div>',
            current:'tab1',
            isShow:false,
            zanShow:false,
            follow:false,
            scrollTop:1,
            info:{},
            commentList:[],
            relevantList:[],
            readerList:[],
            comment:"",
            enclosureList:[],
            moveShow:false,
            actions:[
                {
                    name: '分享',
                    color:"#3399ff"
                },
                {
                    name: '编辑',
                    color:"#3399ff"
                },
                {
                    name: '删除',
                    color:"#3399ff"
                }
            ],
            height:"",
            overlayShow:false,
            total:500,
            sessionkey:"",
            KeyWords:[],
            // journalismId:"804d311c-850a-47c0-9a23-49037a37c518"
        }
    },
    onUnload(){
        // console.log(1111);
        // wx.redirectTo({
        //     url: '/pages/journalism/main'
        // })
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.height = wx.getSystemInfoSync().windowHeight;
        console.log(this.height);
        // 获取单个内容基本信息
        this.queryInfo();
        // 内容正文详情
        this.contentBody();
        // 获取相关性内容类别
        this.getRelevantCont();
        // 评论列表
        this.getCommentsList();
        this.getEnclosure();
    },
    computed:{
        contentSize(){
            return this.comment.length || 0;
        },
        ...mapState({
            journalismId:state=>{
                return state.user.journalismId;
            }
        }),
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        openImgs(){
            let temp = [];
            this.enclosureList.forEach(item=>{
                if(item.fileExtension.indexOf('jpg')!=-1||item.fileExtension.indexOf('png')!=-1){
                    temp.push(item.link);
                }
            })
            return temp;
        },
    },
    methods:{
        queryInfo(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"content.info.get",
                    SessionKey:this.sessionkey,
                    id:this.journalismId
                }
            }).then(res=>{
                let data = res.data[0];
                // data.CreatedOn = getDate(data.CreatedOn.replace(/-/g,'/'));
                this.info = data;
                this.info.CommentCount = this.info.CommentCount==0?'':this.info.CommentCount;
                this.info.ReadCount = this.info.ReadCount==0?'':this.info.ReadCount;
                this.KeyWords = this.info.KeyWords.split(',');
                if(this.info.IsFavor=="1"){
                    this.isShow = true;
                }else {
                    this.isShow = false;
                }
                if(this.info.IsLike=="1"){
                    this.zanShow = true;
                }else {
                    this.zanShow = false;
                }
            })
        },
        contentBody(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.contentbody.get",
                    SessionKey:this.sessionkey,
                    id:this.journalismId
                }
            }).then(res=>{
                console.log(res);
                this.article = res;
            })
        },
        getRelevantCont(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.related.getlist",
                    SessionKey:this.sessionkey,
                    id:this.journalismId
                }
            }).then(res=>{
                this.relevantList = res.listData;
                this.relevantList.map(item=>{
                    const time = getDate(item.createdon.replace(/-/g,'/'));
                    item.time = time;
                    return item;
                })
            })
        },
        // 附件file.attachfiles.getlist
        getEnclosure(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.attachfiles.getlist",
                    SessionKey:this.sessionkey,
                    pid:this.journalismId,
                    ObjTypeCode:100201
                }
            }).then(res=>{
                console.log('附件',res);
                this.enclosureList = res.listData;
            })
        },
        getOpenFile(item){
            console.log(item,this.openImgs);
            const openImgs = JSON.stringify(this.openImgs);
            getOpenFiles(item,openImgs);
            // let url = item.link;
            // if(item.fileExtension=='docx'||item.fileExtension=='pdf'||item.fileExtension=='xls'||item.fileExtension=='xlsx'){
            //     wx.downloadFile({
            //         url: url, 
            //         fileType:item.fileExtension,
            //         success (res) {
            //             debugger
            //             if (res.statusCode === 200) {
            //                 var filePath = res.tempFilePath
            //             }
            //             wx.openDocument({
            //                 filePath: filePath,
            //                 fileType:item.fileExtension,
            //                 success: function (res) {
            //                     console.log('打开文档成功')
            //                 }
            //             })
            //         }
            //     })
            // }else if(item.fileExtension=='jpg'){
            //     wx.previewImage({
            //         current: item.link, // 当前显示图片的http链接
            //         urls: [item.link] // 需要预览的图片http链接列表
            //     })
            // }
        },
        getFocus(){
            this.overlayShow = true;
        },
        getCloseOver(){
            this.overlayShow = false;
        },
        getBlur(){
            this.overlayShow = false;
            // this.height = '20';
        },
        // 评论
        getSendout(){
            if(this.comment!=''){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:"news.comment.add",
                        SessionKey:this.sessionkey,
                        id:this.journalismId,
                        comments:this.comment
                    }
                }).then(res=>{
                    this.comment = "";
                    this.overlayShow = false;
                    this.queryInfo();
                    this.getCommentsList();
                })
            }else {
                
            }
        },
        getCommentsList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"object.comments.getlist",
                    SessionKey:this.sessionkey,
                    id:this.journalismId,
                    pageNumber:1,
                    pageSize:25
                }
            }).then(res=>{
                console.log(res);
                this.commentList = res.listData;
            })
        },
        handleChangeTab(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab1'){
                this.getCommentsList();
            }else {
                this.readerQuery();
            }
        },
        getFollow(){
            this.follow = !this.follow;
        },
        // 已读
        readerQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"content.reader.getlist",
                    SessionKey:this.sessionkey,
                    id:this.journalismId
                }
            }).then(res=>{
                console.log(res);
                this.readerList = res.listData;
                // CreatedOn
                this.readerList.map(item=>{
                    const time = getDate(item.CreatedOn.replace(/-/g,'/'));
                    item.time = time;
                    return item;
                })
            })
        },
        getLick(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.comment.like",
                    SessionKey:this.sessionkey,
                    id:this.journalismId,
                    objectTypeCode:'100201'
                }
            }).then(res=>{
                console.log(res);
                Notify({ type: 'primary', message: res.msg });
            })
        },
        getLive(show){
            let IsFavor = false;
            if(show==true){
                IsFavor = false;
            }else {
                IsFavor = true;
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.favor.add",
                    SessionKey:this.sessionkey,
                    Id:this.journalismId,
                    IsFavor:IsFavor
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        setTimeout(()=>{
                            this.queryInfo();
                        },1000)
                    }
                })
            })
        },
        getFabulous(show){
            let IsLike = '';
            if(show==true){
                IsLike = "dislike";
            }else {
                IsLike = "Like";
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.comment.like",
                    SessionKey:this.sessionkey,
                    id:this.journalismId,
                    objectTypeCode:'100201',
                    action:IsLike
                }
            }).then(res=>{
                console.log(res);
                // Notify({ type: 'primary', message: res.msg });
                this.queryInfo();
            })
        },
        // 评论点赞
        getCommentLive(item){
            let action = '';
            if(item.IsLike==1){
                action = 'dislike';
            }else {
                action = 'Like';
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.comment.like",
                    SessionKey:this.sessionkey,
                    id:item.CommentId,
                    objectTypeCode:"100205",
                    action:action
                }
            }).then(res=>{
                console.log(res);
                this.queryInfo();
                this.getCommentsList();
            })
        },
        getComment(){
            wx.pageScrollTo({
                scrollTop: 1000,
                duration: 300
            })
        },
        closeMoveShow(){
            this.moveShow = false;
        },
        getCancelMove(){
            this.moveShow = false;
        },
        getEdit(){
            this.moveShow = true;
        },
        onSelectMove(e){
            console.log(e);
            let name = e.mp.detail.name;
            if(name=='分享'){

            }else if(name=='编辑'){
                const url = "/pages/releaseNewsTwo/main?id="+this.journalismId;
                wx.navigateTo({url:url});
            }else if(name=='删除'){
                wx.showModal({
                    title: '提示',
                    content: '你确定要删除这条新闻么？',
                    success:res=>{
                        if (res.confirm) {
                            this.getDelete();
                        } else if (res.cancel) {
                        console.log('用户点击取消')
                        }
                    }
                })
            }
        },
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.info.delete",
                    SessionKey:this.sessionkey,
                    Id:this.journalismId,
                    ObjTypeCode:"100201"                    
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        let that = this;
                        that.moveShow = false;
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            })
        },
        ...mapMutations([
            'updateId'
        ]),
        getParentPage(item){
            let id = item.contentid;
            this.updateId(id);
            const url = "/pages/journalism/detail/main";
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    @import "../../../../static/css/public.scss";
    @import url("~mpvue-wxparse/src/wxParse.css");
    @import '../../../../static/css/icon.css';
    @import '../../../../static/css/journalism.css';
    .wrap{
        // background: #fff;
        .header{
            padding: 30rpx;
            background: #fff;
            h1{
                font-size: 47rpx;
                color: #333333;
            }
        }
        .rowWrap{
            padding: 30rpx;
            display: flex;
            align-items: center;
            background: #fff;
            .row:nth-child(1){
                width:69rpx;
                height: 69rpx;
                border-radius: 50%;
                text-align: center;
                line-height: 69rpx;
                background: #3399ff;
                font-size: 23rpx;
                color: #fff;
            }
            .row:nth-child(2){
                font-size: 31rpx;
                padding: 10rpx 0;
                flex: 1;
                margin-left: 20rpx;
                .time{
                    font-size: 22rpx;
                    color: #999999;
                }
            }
            .row:nth-child(3){
                padding-top: 20rpx;
                p{
                    width: 60px;
                    height: 30px;
                    font-size: 12px;
                    color: #fff;
                    background: #ff6666;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 10rpx;
                }
                .gz.active{
                    background: #fff;
                    border: 2rpx solid #e3e5e4;
                    color: #666666;
                }
            }
        }
        .center{
            background: #fff;
            .parse{
                padding: 30rpx;
            }
            .border{
                display: flex;
                justify-content: center;
                padding: 30rpx;
                p:nth-child(1){
                    margin-right: 30px;
                }
                p:nth-child(1).active{
                    border: 2rpx solid #fc6464;
                    color: #fc6464;
                }
                p{
                    width: 242rpx;
                    height: 72rpx;
                    line-height: 72rpx;
                    text-align: center;
                    border:2rpx solid #cccccc;
                    border-radius: 38rpx;
                    color: #333333;
                    margin: 0 10rpx;
                    font-size: 24rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    span{
                        margin-left: 15rpx;
                    }
                }
            }
            .boxWrap{
                padding: 0 33rpx;
                h3{
                    font-size: 32rpx;
                    color: #333333;
                    padding: 33rpx 0;
                }
            }
            .tagContent{
                padding-bottom: 33rpx;
                display: flex;
                p{
                    width: 111rpx;
	                height: 56rpx;
                    line-height: 56rpx;
                    text-align: center;
                    font-size: 24rpx;
                    color: #666666;
                    background: #f2f2f2;
                    border-radius: 9rpx;
                    margin-right: 20rpx;
                }
            }
            .dividerWrap{
                display: flex;
                align-items: center;
                // padding: 20rpx 0 20rpx 33rpx;
                padding: 20rpx 33rpx;
                p{
                    color: #999999;
                    font-size: 22rpx;
                }
                span{
                    flex: 1;
                    display: inline-block;
                    width: 100%;
                    height: 2rpx;
                    background: #e2e3e5;
                }
            }
            .boxWrap{
                padding:0 33rpx;
                h3{
                    font-size: 32rpx;
                    color: #333333;
                    padding: 33rpx 0;
                }
                .enclosureCont{
                    font-size: 28rpx;
                    p:first-child{
                        margin: 0;
                    }
                    p{
                        // margin: 10rpx 0;
                        margin-top: 20rpx;
                        padding: 0 20rpx;
                        height: 76rpx;
                        line-height: 76rpx;
                        background: #f2f2f2;
                        border-radius: 9rpx;
                        display: flex;
                        color: #333333;
                        font-size: 28rpx;
                        .overflow{
                            flex: 1;
                            width: 100%;
                            margin-left: 20rpx;
                        }
                        .iconfont{
                            color: #fc6464;
                        }
                    }
                }
            }
        }
        .contentWrap{
            background: #fff;
            margin-top: 16rpx;
            .relevantList{                    
                padding: 30rpx;
                border-bottom: 1rpx solid #eceeed;
                .content{
                    .h1{
                        font-size: 36rpx;
                        color: #333333;
                        // font-weight: bold;
                    }
                    .rowText{
                        span{
                            font-size: 22rpx;
                            display: inline-block;
                            margin: 0 10rpx;
                            color: #999999;
                        }
                        
                    }
                }
                .rightContent{
                    display: flex;
                    justify-content: space-between;
                    .left{
                        flex: 1;
                        position: relative;
                        .title{
                            font-size: 36rpx;
                            color: #333333;
                        }
                        .time{
                            position: absolute;
                            bottom: 0;
                            font-size: 24rpx;
                            color: #999999;
                        }
                    }
                    .right{
                        width: 217rpx;
                        height: 127rpx;
                        background: #ccc;
                        border-radius: 7rpx;
                        img{
                            width: 217rpx;
                            height: 217rpx;
                            border-radius: 7rpx;
                        }
                    }
                }
            }
        }
        .tabWrap{
            margin: 30rpx 0;
            margin-bottom: 60px;
            padding-bottom: 50px;
            .content{
                background: #fff;
                padding: 30rpx;
                display: flex;
                border-bottom: 1rpx solid #eceeed;
                .row:nth-child(1){
                    p{
                        width: 69rpx;
                        height: 69rpx;
                        border-radius: 50%;
                        background: #3399ff;
                        text-align: center;
                        line-height: 69rpx;
                        font-size: 23rpx;
                        color: #fff;
                    }
                }
                .row:nth-child(2){
                    flex:1;
                    margin-left: 19rpx;
                    .name{
                        font-size: 31rpx;
                        color: #3399ff;
                    }
                    .cont{
                        font-size: 35rpx;
                        margin: 15rpx 0;
                        color: #333333;
                    }
                    .info{
                        font-size: 22rpx;
                        color: #999999;
                        span{
                            margin-left: 20rpx;
                        }
                    }
                }
                .row:nth-child(3){
                    display: flex;
                    align-items: center;
                    .zan{
                        color:#999999;
                        font-size: 12px;
                    }
                    span{
                        margin-left: 10rpx;
                        font-size: 27rpx;
                        color: #666666;
                    }
                    .active{
                        color: #ff6666;
                    }
                }
            }
        }
        .inpWrap{
            width: 100%;
            position: fixed;
            bottom: 100px;
            z-index: 999;
            .top{
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 1);
                opacity: .5;
            }
            .bottom{
                width: 100%;
                height: auto;
                position: fixed;
                bottom: 0;
                background: #fff;
                z-index: 9999;
                .box{
                    padding: 33rpx 33rpx 0 33rpx;
                    .textarea{
                        width: 100%;
                        height: 188rpx;
                        background: #fff;
                        color: #333333;
                        font-size: 28rpx;
                        border-bottom: 2rpx solid #eaebeb;
                    }
                    .total{
                        display: flex;
                        justify-content: space-between;
                        padding: 33rpx 0;
                        p:nth-child(1){
                            color: #999999;
                            font-size: 28rpx;
                        }
                        p:nth-child(2){
                            color: #999999;
                            font-size: 33rpx;
                        }
                        p:nth-child(2).active{
                            color: #3399ff;
                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            background: #fff;
            position: fixed;
            bottom: 0px;
            .bottomBox{
                padding: 20rpx 0;
                display: flex;
                justify-content: space-around;
                align-items: center;
                .inp{
                    width:305rpx;
                    height: 67rpx;
                    line-height: 67rpx;
                    // display:inline-block;
                    padding: 0 20rpx;
                    border-radius: 10rpx;
                    background: #f3f5f4;
                    font-size: 12px;
                    display: flex;
                    border-radius: 35rpx;
                }
                p{
                    .icon{
                        color: #666666;
                    }
                    .xing.xingActive{
                        color: #EFD063;
                    }
                    .zan.zanActive{
                        color:#FF6666;
                    }
                    .iconfont{
                        font-size: 20px;
                    }
                }
            }
        }
        .moveWrap{
            padding: 30rpx;
            p{
                font-size: 28rpx;
                padding: 20rpx 0;
            }
            h3{
                color: #3399ff;
                font-size: 24rpx;
                padding: 10rpx 30rpx;
                background: #f1f1f1;
                float: right;
                margin-right: 30rpx;
                margin-bottom: 30rpx;
                border-radius: 3px;
            }
        }
    }
</style>