<template>
    <div class="wrap">
        <div class="container">
            <div class="header">
                <div class="rowBtn">
                    <p class="save" @click="getSendOut('0','save')">保存</p>
                    <p class="send"  @click="getSendOut('1')">发送</p>
                </div>
                <p class="clas" v-for="(item,index) in info.toUsers" :key="index">收件人：<span>{{item.name}}</span></p>
                <p class="clas" >抄送/密送，发件人：{{info.fromName}}</p>
                <!-- <p class="clas" >主题：<span class="bold">回复：{{info.subject}}</span>
                    
                </p> -->
                <div class="boxWrap">
                    <div class="flex">
                        <span class="label">主题：</span>
                        <span class="bold">回复：{{info.subject}}</span>
                    </div>
                    <div class="input">
                        <i class="iconfont icon-fujian" style="color:#999999;" @click="getFujian"></i>
                    </div>
                </div>
            </div>
            <div class="boxText">
                <textarea name="" auto-focus="auto" v-model="mailBody" id="" cols="30" rows="10"></textarea>
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
            <!-- <h3>{{content}}</h3> -->
            <div class="wxParse">
                <wxParse :content="content" v-if="content!=''" />
            </div>
        </div>
        <div class="bottom" v-if="fileList!=''">
            <div class="boxWrap">
                <scroll-view scroll-x="true" style="display: flex;width: 100%">
                    <div class="swiper-item" v-for="(item,index) in fileList" :key="index">
                        <p class="imgs" @click="getPreviewImg(item,index)">
                                <img v-if="item.fileExtension=='jpg'||item.fileExtension=='png'" :src="item.link" alt="">
                                <img v-if="item.fileExtension=='rar'" src="https://wx.phxinfo.com.cn/img/wechat/rar.png" alt="">
                                <img v-if="item.fileExtension=='txt'" src="https://wx.phxinfo.com.cn/img/wechat/02.3.1.Txt.png" alt="">
                                <img v-if="item.fileExtension=='pdf'" src="https://wx.phxinfo.com.cn/img/wechat/02.3.1.Pdf.png" alt="">
                                <img v-if="item.fileExtension=='ppt'" src="https://wx.phxinfo.com.cn/img/wechat/02.3.1.PPT.png" alt="">
                                <img v-if="item.fileExtension=='word'" src="https://wx.phxinfo.com.cn/img/wechat/word.png" alt="">
                                <!-- <img :src="item.link" alt=""> -->
                            <i class="iconfont icon-quxiao2" @click="getDeleteFile(item,index)"></i>
                        </p>
                        <p class="text">023904.jpg</p>
                        <p class="minText">6.42M</p>
                    </div>
                </scroll-view>
            </div>
        </div>
        <!-- <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="row">
                <p>
                    <i class="iconfont icon-paizhao1"></i>
                    <i class="iconfont icon-tupian1" @click="getPhoto"></i>
                    <i class="iconfont icon-youpan1"></i>
                </p>
                <p class="sendout" @click="getSendOut('1')">发送</p>
            </div>
        </div> -->
        <van-action-sheet
            :show="sheetShow"
            cancel-text="取消"
            @close="onClose"
            @cancel="onClose"
        >
            <div class="sheetWrap">
                <p  @click="getUpan">优盘</p>
                <p @click="getphotograph">拍照</p>
                <p @click="getPhoto">从手机相册选择</p>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
import wxParse from 'mpvue-wxparse';
import {mapState,mapMutations,mapGetters} from 'vuex';
export default {
    components:{
        wxParse
    },
    data(){
        return {
            emailId:"",
            info:"",
            fromName:"",
            ltags:"",
            content:"",
            mailBody:"",
            sessionkey:"",
            EmailId:"",
            fileList:[],
            sheetShow:false
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        ...mapState({
            selectFiles:state=>{
                return state.usb.selectFiles;
            }
        }),
        ...mapGetters([
            'filterList'
        ]),
        fileids(){
            let temp = [];
            this.fileList.forEach(item=>{
                if(item.id){
                    temp.push(item.id);
                }
            })
            return temp.join(',');
        },
        filesImgs(){
            let temp = [];
            this.fileList.forEach(item=>{
                if(item.link){
                    temp.push(item.link);
                }
            })
            return temp;
        },
    },
    onShow(){
        this.fileList = this.fileList.concat(this.selectFiles);
        if(this.fileList!=''){
            this.getSendOut('0').then(res=>{
                this.getUploadFile(this.EmailId);
            });
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
        this.getRespond();
    },
    onUnload(){
        this.clearFile([]);
    },
    methods:{
        getFujian(){
            this.sheetShow = true;
        },
        onClose(){
            this.sheetShow = false;
        },
        getUpan(){
            this.sheetShow = false;
            const url = '/pages/uPan/main';
            wx.navigateTo({url:url});
        },
        getRespond(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.respond,
                    SessionKey:this.sessionkey,
                    id:this.emailId
                }
            }).then(res=>{
                console.log(res);
            })
        },
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
        // 预览图片
        getPreviewImg(item,index){
            console.log(this.filesImgs,'123123')
            wx.previewImage({
                urls:this.filesImgs,
                current:item.link,
                success:res=>{
                    console.log(res,'success');
                }
            })
        },
        getDeleteFile(item,index){
            console.log(item);
            this.fileList.splice(index,1);
            if(item.id){
                this.delete(item.id);
            }
        },
        // 选择来自优盘的文件作为附件 id：草稿id
        getUploadFile(id){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.addusbfile,
                    SessionKey:this.sessionkey,
                    mailid:id,
                    fileids:this.fileids
                }
            }).then(res=>{
                console.log(res);
            })
        },
        ...mapMutations([
            'clearFile',
            'delete'
        ]),
        getPhoto(){
            this.sheetShow = false;
            this.getSendOut('0').then(()=>{
                let that = this;
                wx.chooseImage({
                    count: 9,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success (res) {
                        // tempFilePath可以作为img标签的src属性显示图片
                        const tempFilePaths = res.tempFilePaths;
                        console.log(tempFilePaths,'路径');
                        // that.fileList = [];
                        for(var i=0;i<tempFilePaths.length;i++){
                            that.fileList.push({
                                link:tempFilePaths[i],
                                fileExtension:'png'
                            });
                        }
                        console.log(that.selectFiles,that.fileList,'selectFiles');
                        that.fileList = that.fileList.concat(that.selectFiles);
                        let Files = that.fileList.join(',');
                        console.log(Files,'Files');
                        for (var i = 0; i < tempFilePaths.length;i++){
                            wx.uploadFile({
                                url: "https://wx.phxinfo.com.cn/rest?method="+'email.attachfiles.upload'+'&SessionKey=' + that.sessionkey+'&pid='+that.EmailId,
                                filePath: tempFilePaths[i],
                                name: 'file',
                                formData: {
                                    'user': 'test'
                                },
                                success (res){
                                    // debugger
                                    console.log(res);
                                    const data = res.data
                                    //do something
                                }
                            })
                        }
                    }
                })
            })
        },
        getSendOut(emailStatus,str){
            return new Promise((resolve,rejcet)=>{
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:"email.componse.send",
                        SessionKey:this.sessionkey,
                        subject:this.info.subject,
                        mailBody:this.mailBody,
                        // toUserids:this.UserId,
                        emailStatus:emailStatus,
                        priority:0,
                        attachfileids:"",
                        id:this.EmailId
                    }
    
                }).then(res=>{
                    console.log(res);
                    if(emailStatus=='1'){
                        wx.showToast({
                            title:"发送成功",
                            icon:"success",
                            duration:2000,
                            success:res=>{
                                setTimeout(()=>{
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                },1000)
                            }
                        })
                    }else if(emailStatus=='0'){
                        this.EmailId = res.data[0].EmailId;
                        if(str=='save'){
                            wx.showToast({
                                title:"保存草稿成功",
                                icon:"success",
                                duration:2000,
                                success:res=>{
                                    setTimeout(()=>{
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    },1000)
                                }
                            })
                        }
                    }
                    resolve();
                })
            })
        }
    }
}
</script>
<style lang="scss">
    // @import '../../../../static/css/public.scss';
    @import '../../../../static/css/emaiIcon.css';
    page{
        background: #fff;
    }
    .wrap{
        .container{
            padding-bottom: 200px;
            .header{
                background: #fff;
                padding:0 30rpx;
                .rowBtn{
                    display: flex;
                    justify-content: space-between;
                    padding: 32rpx 33rpx;
                    border-bottom: 1rpx solid #ededed;
                    .save{
                        font-size: 34rpx;
                        color: #3399ff;
                    }
                    .send{
                        font-size: 34rpx;
                        color: #999999;
                    }
                    .send.active{
                        color: #3399ff;
                    }
                }
                .clas{
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
                .boxWrap{
                    padding: 20rpx 0;
                    border-bottom: 1rpx solid #ededed;
                    overflow: hidden;
                    display: flex;
                    justify-content: space-between;
                    .label{
                        font-size: 28rpx;
                        color: #999999;
                    }
                    .bold{
                        font-weight: bold;
                        font-size: 32rpx;
                    }
                }
                // p:last-child{
                //     border: none;
                // }
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
            .wxParse{
                padding: 30rpx;
            }
        }
        .bottom{
            width: 100%;
            position: fixed;
            bottom: 0;
            border-top: 1rpx solid #eceeed;
            overflow: hidden;
            .boxWrap{
                    width: 100%;
                    height: 220rpx;
                    box-sizing: border-box;
                    display: flex;
                    white-space: nowrap;
                    padding: 0 20rpx;
                    .swiper-item{
                        width: 146rpx;
                        height: 146rpx;
                        display: inline-block;
                        // background: red;
                        // margin-right: 10rpx;
                        margin: 20rpx 26rpx 0 0;
                        .imgs{
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            position: relative;
                            img{
                                width: 146rpx;
                                height: 146rpx;
                                border-radius: 12rpx;
                            }
                            i{
                                position: absolute;
                                top: -8rpx;
                                right: -13rpx;
                                color: #9c9c9c;

                            }
                        }
                        .text{
                            font-size: 10px;
                            color: #333;
                            text-align: center;
                        }
                        .minText{
                            font-size: 8px;
                            color: #666666;
                            text-align: center;
                        }
                    }
            }
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
                    // .icon{
                    //     margin-right: 40rpx;
                    // }
                    display: flex;
                    width: 200rpx;
                    justify-content: space-between;
                    i{
                        color: #3399ff;
                        font-size: 20px;
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
        .sheetWrap{
            text-align: center;
            p{
                font-size: 36rpx;
                padding: 30rpx 0;
                color:#333333;
            }
            p:nth-child(2){
                border-top: 1rpx solid #e2e3e5;
                border-bottom: 1rpx solid #e2e3e5;
            }
        }
    }
</style>