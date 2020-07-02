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
                <p>
                    附件
                </p>
                <span></span>
            </div>
            <!-- <div>
                <van-divider contentPosition="left">附件</van-divider>
            </div> -->
            <div class="enclosureCont">
                <p v-for="(item,index) in enclosureList" :key="index" @click="getOpenFile(item)"><i-icon type="accessory" color="#ff6666" />
                    <span class="overflow">
                        {{item.name}}
                    </span>
                </p>
            </div>
            <div class="dividerWrap">
                <p>
                    相关标签
                </p>
                <span></span>
            </div>
            <div class="tagContent">
                <p>院办</p>
                <p>财务</p>
            </div>
            <div class="border">
                <p @click="getLick">点赞{{info.likecount}}</p>
                <p>不喜欢{{info.dislikeqty}}</p>
            </div>
            <div class="dividerWrap" v-if="relevantList!=''">
                <p>
                    相关推荐
                </p>
                <span></span>
            </div>
            <!-- <div>
                <van-divider contentPosition="left">相关推荐</van-divider>
            </div> -->
            <div class="contentWrap">
                <div class="content" v-for="(item,index) in relevantList" :key="index" @click="getParentPage(item)">
                    <p class="h1">{{item.title}}</p>
                    <div class="rowText">
                        <span>热</span>
                        <span>文艺、美工</span>
                        <span>{{item.readcount}}阅读</span>
                        <span>{{item.commentcount}}评论</span>
                        <span>{{item.time}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="tabWrap">
            <van-index-bar :scroll-top="scrollTop">
                <i-tabs :current="current" @change="handleChangeTab">
                    <i-tab key="tab1" :title="'评论'+info.CommentCount"></i-tab>
                    <i-tab key="tab2" :title="'已读'+info.ReadCount"></i-tab>
                </i-tabs>
                <div class="content" v-for="(item,index) in commentList" :key="index" v-if="current=='tab1'">
                    <div class="row">
                        <p>{{item.CreatedByName}}</p>
                    </div>
                    <div class="row">
                        <p class="name">{{item.CreatedByName}}</p>
                        <p class="cont">{{item.Comment}}</p>
                        <p class="info">信息中心 <span>{{item.CreatedOn}}</span></p>
                    </div>
                    <div class="row">
                        <i class="iconfont icon-zan zan" :class="item.IsLike==1?'active':''" @click="getCommentLive(item)">{{item.LikeQty}}</i>
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
        <div class="footer" v-if="overlayShow==false">
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
            sessionkey:""
        }
    },
    onUnload(){
        // console.log(1111);
        // wx.redirectTo({
        //     url: '/pages/journalism/main'
        // })
    },
    onLoad(){
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
        })
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
                data.CreatedOn = getDate(data.CreatedOn.replace(/-/g,'/'));
                this.info = data
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
                    pid:this.journalismId
                }
            }).then(res=>{
                console.log('附件',res);
                this.enclosureList = res.listData;
            })
        },
        getOpenFile(item){
            console.log(item);
            // fileExtension
            let url = item.link;
            if(item.fileExtension=='docx'||item.fileExtension=='pdf'){
                wx.downloadFile({
                    url: url, 
                    success (res) {
                        debugger
                        if (res.statusCode === 200) {
                            var filePath = res.tempFilePath
                        }
                        wx.openDocument({
                            filePath: filePath,
                            success: function (res) {
                                console.log('打开文档成功')
                            }
                        })
                    }
                })
            }else if(item.fileExtension=='jpg'){
                wx.previewImage({
                    current: item.link, // 当前显示图片的http链接
                    urls: [item.link] // 需要预览的图片http链接列表
                })
            }
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
                Notify({ type: 'primary', message: res.msg });
                this.queryInfo();
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
                Notify({ type: 'primary', message: res.msg });
                this.queryInfo();
            })
        },
        // 评论点赞
        getCommentLive(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.comment.like",
                    SessionKey:this.sessionkey,
                    id:item.CommentId,
                    objectTypeCode:"100205",
                    action:"Like"
                }
            }).then(res=>{
                console.log(res);
                this.queryInfo();
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
            background: #fff;
            .row:nth-child(1){
                width:75rpx;
                height: 75rpx;
                border-radius: 50%;
                text-align: center;
                line-height: 75rpx;
                background: #3399ff;
                font-size: 21rpx;
                color: #fff;
            }
            .row:nth-child(2){
                font-size: 28rpx;
                padding: 10rpx 0;
                flex: 1;
                margin-left: 20px;
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
                p{
                    width: 164rpx;
                    height: 75rpx;
                    line-height: 75rpx;
                    text-align: center;
                    border:2rpx solid #cccccc;
                    border-radius: 38rpx;
                    color: #333333;
                    margin: 0 10rpx;
                    font-size: 24rpx;
                }
            }
            .tagContent{
                padding: 33rpx;
                display: flex;
                p{
                    width: 111rpx;
	                height: 56rpx;
                    line-height: 56rpx;
                    text-align: center;
                    font-size: 24rpx;
                    color: #666666;
                    background: #f2f2f2;
                    border-radius: 28rpx;
                    margin-right: 20rpx;
                }
            }
            .dividerWrap{
                // padding-left: 33rpx;
                display: flex;
                align-items: center;
                padding: 20rpx 0 20rpx 33rpx;
                p{
                    color: #999999;
                    font-size: 22rpx;
                }
                span{
                    flex: 1;
                    display: inline-block;
                    width: 100%;
                    height: 2rpx;
                    background: #eceeed;
                    margin-left: 20rpx;
                }
            }
            .enclosureCont{
                padding: 10rpx 30rpx;
                font-size: 28rpx;
                p{
                    margin: 10rpx 0;
                    padding: 0 20rpx;
                    height: 69rpx;
                    line-height: 69rpx;
                    background: #f2f2f2;
                    border-radius: 35rpx;
                    display: flex;
                    color: #333333;
                    font-size: 28rpx;
                    .overflow{
                        flex: 1;
                        width: 100%;
                        margin-left: 20rpx;
                    }
                }
            }
            .contentWrap{
                .content{
                    padding: 30rpx;
                    border-bottom: 1rpx solid #eceeed;
                    .h1{
                        font-size: 36rpx;
                        color: #333333;
                        font-weight: bold;
                    }
                    .rowText{
                        span{
                            font-size: 22rpx;
                            display: inline-block;
                            margin: 0 10rpx;
                        }
                        span:nth-child(1){
                            font-size: 15rpx;
                            color: #ff6666;
                            border:1rpx solid #ff6666;
                            display: inline-block;
                            // padding:0 5rpx;
                            border-radius: 2rpx;
                            margin-left: 0;
                            margin-right: 10rpx;
                            border-radius: 5rpx;
                            width: 30rpx;
                            text-align: center;
                        }
                        span:nth-child(2),span:nth-child(5){
                            color: #999999;
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
                        width: 75rpx;
                        height: 75rpx;
                        border-radius: 50%;
                        background: #3399ff;
                        text-align: center;
                        line-height: 75rpx;
                        font-size: 21rpx;
                        color: #fff;
                    }
                }
                .row:nth-child(2){
                    flex:1;
                    margin-left: 20rpx;
                    .name{
                        font-size: 28rpx;
                        color: #3399ff;
                    }
                    .cont{
                        font-size: 32rpx;
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
                    .zan{
                        color:#999999;
                        font-size: 12px;
                    }
                    .active{
                        color: #fc6464;
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
            bottom: 20px;
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