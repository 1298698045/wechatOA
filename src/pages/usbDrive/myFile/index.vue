<template>
    <div class="wrap">
        <div class="nav" v-if="srchType=='share'">
            <p class="publicfile">{{shareFileName}}</p>
            <p class="jurisdiction">权限设置：绍兴第二医院</p>
        </div>
        <div class="search">
            <van-search :value="search" placeholder="搜索" @change="changeSearch" />
        </div>
        <div class="header">
            <h3 v-if="electionShow">选择一下文件</h3>
            <div v-if="!electionShow">
                <picker class="pickers" v-model="columnIdx" :range="column" @change="changeColumn">
                    <p>{{column[columnIdx]}}<i-icon type="unfold" /></p>
                </picker>
            </div>
            <div v-if="!electionShow">
                <p>
                    <i class="iconfont icon-quanxuan icon" :class="{'active':electionShow==true}" @click="getSelectFile"></i>
                </p>
                <p>
                    <i class="iconfont icon-shaixuan icon" :class="{'active':electionShow==true}" @click="getScreen"></i>
                </p>
            </div>
        </div>
        
        <div class="center" v-if="!isTime">
            <van-checkbox-group :value="result" @change="changeGroup">
            <!-- folders -->
                <div class="content" :class="electionShow?'contentActive':''" @click="getOpen" v-for="(item,index) in folders" :key="index">
                    <div class="radioWrap" v-if="electionShow">
                        <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
                    </div>
                    <div class="img">
                        <p  @click="getOpenFolder(item)">
                            <img src="https://wx.phxinfo.com.cn/img/wechat/Folder.png" alt="">
                        </p>
                    </div>
                    <div class="cont">
                        <div  @click="getOpenFolder(item)">
                            <p class="title">{{item.name}}</p>
                            <p class="text">{{item.createdOn}}</p>
                        </div>
                        <p class="icon">
                            <i class="iconfont icon-gengduo" @click="getEditFile(item,'folders')"></i>
                        </p>
                    </div>
                </div>
                <!-- files -->
                <div class="content" :class="electionShow?'contentActive':''" v-for="(item,index) in files" :key="index">
                    <div class="radioWrap" v-if="electionShow">
                        <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
                    </div>
                    <div class="img">
                        <p @click="getPreviewImage(item.link)">
                            <img :src="item.fileExtension=='jpg'?item.link:'https://wx.phxinfo.com.cn/img/wechat/rar.png'" alt="">
                        </p>
                    </div>
                    <div class="cont">
                        <div>
                            <p class="title information-title">{{item.name}}.{{item.fileExtension}}</p>
                            <p class="text">{{item.createdOn}}</p>
                        </div>
                        <p class="icon">
                            <i class="iconfont icon-gengduo" @click="getEditFile(item,'files')"></i>
                        </p>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <div class="centerActive" v-if="isTime">
            <van-checkbox-group :value="result" @change="changeGroup">
                <div class="rowWrap">
                    <h3>文件夹</h3>
                    <div class="row" v-for="(item,index) in folders" :key="index">
                        <div class="radioWrap" v-if="electionShow">
                            <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
                        </div>
                        <div class="l">
                            <p>
                                <img src="https://wx.phxinfo.com.cn/img/wechat/Folder.png" alt="">
                            </p>
                        </div>
                        <div class="r">
                            <div class="text">
                                <p>{{item.name}}</p>
                                <p>{{item.createdOn}}</p>
                            </div>
                            <p class="icon" @click="getEditFile(item,'folders')">
                                <i class="iconfont icon-gengduo"></i>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="rowWrap" v-for="(item,index) in files" :key="index">
                    <h3>{{item.DateTypeName}}</h3>
                    <div class="row" v-for="(v,i) in item.FileList" :key="i">
                        <div class="radioWrap" v-if="electionShow">
                            <van-checkbox :name="v.id+v.str" custom-class="radio"></van-checkbox>
                        </div>
                        <div class="l">
                            <p>
                                <img :src="v.link" alt="">
                            </p>
                        </div>
                        <div class="r">
                            <div class="text">
                                <p>{{v.name}}</p>
                                <p>{{v.createdOn}}</p>
                            </div>
                            <p class="icon" @click="getEditFile(v,'files')">
                                <i class="iconfont icon-gengduo"></i>
                            </p>
                        </div>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <van-action-sheet
            :show="showSheet"
            :actions="actions"
            @close="onClose"
            @select="onSelect"
            :round="false"
        />
        <!-- 编辑文件 -->
        <van-action-sheet z-index="10000" @close="getEditClose" :round="false" safe-area-inset-bottom cancel-text="取消" @cancel="getEditCancel" :show="editSheet">
            <div class="editSheet">
                <div class="headers">
                    <div class="imgBox">
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Folder.png" alt="">
                    </div>
                    <div class="textWrap">
                        <p class="overflow">{{fileName}}</p>
                        <p>{{createdByName}}  {{createdOn}}</p>
                    </div>
                </div>
                <div class="content">
                    <p v-if="str=='files'">发送给联系人</p>
                    <p v-if="str=='files'">发邮件</p>
                    <p @click="getObtainLink">获取分享链接</p>
                    <p @click="getRename">重命名</p>
                    <p @click="getMoveFile">移动到</p>
                    <p v-if="str=='files'" @click="getCopy">复制到</p>
                    <p @click="deleteFile">删除</p>
                </div>
            </div>
        </van-action-sheet>

        <van-action-sheet z-index="10000" :round="false" safe-area-inset-bottom cancel-text="取消" @close="getClose" @cancel="getCancel" :show="screenShow">
            <div class="titleSheet">
                <p>筛选</p>
            </div>
            <div class="sheetContent">
                <div class="box" @click="getRouterClass('file')">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Folders.png" alt="">
                    </p>
                    <p>文档</p>
                </div>
                <div class="box" @click="getRouterClass('rar')">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/rar.png" alt="">
                    </p>
                    <p>压缩包</p>
                </div>
                <div class="box" @click="getRouterClass('img')">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Image.png" alt="">
                    </p>
                    <p>图片</p>
                </div>
                <div class="box" @click="getRouterClass('other')">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/Other.png" alt="">
                    </p>
                    <p>其他</p>
                </div>
            </div>
        </van-action-sheet>
        <van-popup :show="popupModal" custom-style="width:80%;height: 20%;border-radius:10rpx;" @close="popupClose">
            <div class="popup">
                <p>上传文件</p>
                <p @click="getOpenPhoto">照片</p>
                <p>手机文件</p>
            </div>
        </van-popup>

        <i-divider content="没有更多了"></i-divider>
        <div class="clues-add-button" v-if="!showSheet&&!electionShow" @click="onCluesAddBtnClick">
            +
        </div>
        <div class="footer" v-if="electionShow">
            <div class="operation">
                <p class="cancel" @click="getCancelAll">取消</p>
                <p class="all" @click="getSelectAll" v-if="resultId==''">全选</p>
                <p class="all" v-if="resultId!=''" @click="getAllCancel">取消全选</p>
                <p class="move" :class="{'active':result!=''}">移动</p>
                <p class="delete" @click="getDeleteFile" :class="{'active':result!=''}">删除</p>
            </div>
        </div>
        <!-- 新建文件夹弹框 -->
        <newFolder v-if="newShow" :ParentId="ParentId" :str="str" :newSign="newSign" :fileId="fileId" :fileName="fileName" @changeShow="changeShow" />
    </div>
</template>
<script>
import newFolder from '../../../components/newFolder';
export default {
    components:{
        newFolder
    },
    data(){
        return {
            value:"",
            search:"",
            columnIdx:0,
            column:['名称排序','时间排序'],
            showSheet:false,
            actions: [
                {
                    id:1,
                    name: '上传文件'
                },
                {
                    id:2,
                    name: '新建文件'
                }
            ],
            name:"我的图片",
            screenShow:false,
            electionShow:false,
            checked:false,
            popupModal:false,
            editSheet:false,
            result:[],
            files:[],
            folders:[],
            resultId:[],
            sign:"",
            sort:"Name",
            fileName:"",
            fileId:"",
            createdByName:"",
            createdOn:"",
            str:"",
            isTime:false,
            imgList:[],
            newShow:false,
            srchType:"",
            ParentId:"10010000-0000-0000-0000-000000000001",
            shareFileName:"",
            sessionkey:""
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.srchType = options.srchType;
        if(this.srchType=='my'){
            this.ParentId = "10010000-0000-0000-0000-000000000001";
        }else if(this.srchType=='share'){
            this.ParentId = options.Folderid;
            this.shareFileName = options.shareFileName;
        }
        this.getQuery();
    },
    methods:{
        changeSearch(e){
            console.log(e);
            this.search = e.mp.detail;
            this.getQuery();
        },
        changeShow(isBook){
            this.newShow = isBook;
            this.files = [];
            this.folders = [];
            this.getQuery();
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.files.search",
                    SessionKey:this.sessionkey,
                    srchType:this.srchType,
                    sort:this.sort,
                    Folderid:this.ParentId,
                    search:this.search
                }
            }).then(res=>{
                console.log(res);
                this.files = res.files;
                this.folders = res.folders;
                if(this.sort=='Name'){
                    this.files.forEach(item=>{
                        this.$set(item,'str',' files');
                        if(item.fileExtension=='jpg'){
                            this.imgList.push(item.link)
                        }
                    })
                    this.folders.forEach(item=>{
                        this.$set(item,'str',' folders');
                    })
                }else {
                    this.folders.forEach(item=>{
                        this.$set(item,'str',' folders');
                    })
                    this.files.forEach(item=>{
                        console.log(item,'---')
                        item.FileList.forEach(v=>{
                            this.$set(v,'str',' files');
                        })
                    })
                    console.log(this.files,'123132123');
                }
            })
        },
        changeGroup(e){
            console.log(e);
            this.result = e.mp.detail;
            // this.result.map(item=>{
            //     console.log(item.split(' '));
            //     let result = item.split(' ');
            //     let id = result[0];
            //     this.sign = result[1];
            //     this.resultId.push(id);
            // })
            // console.log(this.resultId);
        },
        getSelectAll(){
            this.result = [];
            this.resultId = [];
            let list = [];
            if(!this.isTime){
                list = [...this.files,...this.folders];
            }else {
                let temp = [];
                this.files.forEach(item=>{
                    temp = temp.concat(item.FileList);
                    list = [...temp,...this.folders];
                })
            }
            list.forEach(item=>{
                this.result.push(item.id+item.str);;
            })
            this.result.map(item=>{
                let result = item.split(' ');
                let id = result[0];
                this.sign = result[1];
                this.resultId.push(id);
                console.log('全选',this.resultId);
            })
        },
        getAllCancel(){
            this.resultId = [];
            this.result = [];
        },
        getCancelAll(){
            this.result = [];
            this.resultId = [];
            this.electionShow = false;
            wx.setNavigationBarTitle({
                title: '我的文件'
            })
        },
        getDeleteFile(){
            console.log(this.result,'result');
            // return;
            let method = '';
            let that = this;
            let temp = [];
            for(var i=0; i < this.result.length; i++){
                let result = this.result[i].split(' ');
                let id = result[0];
                let str = result[1];
                let IsFolder = '';
                if(str=='folders'){
                    IsFolder = true;
                }else {
                    IsFolder = false;
                }
                temp.push({
                    id:id,
                    IsFolder:IsFolder
                })
            }
            temp = JSON.stringify(temp);
            console.log(temp,'temp');
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.batch.delete",
                    SessionKey:this.sessionkey,
                    files:temp
                }
            }).then(res=>{
                wx.showToast({
                    title:"删除成功",
                    icon:"success",
                    duration:2000,
                    success:res=>{
                        that.result = [];
                        that.resultId = [];
                        that.electionShow = false;
                        that.getQuery();
                    }
                })
            })


            // for(var i=0; i < this.result.length;i++){
            //     console.log(this.result[i],'1233');
            //     let result = this.result[i].split(' ');
            //     let id = result[0];
            //     let str = result[1];
            //     if(str=='files'){
            //         method = 'file.delete'
            //     }else if(str=='folders'){
            //         method = 'file.directory.delete';
            //     }
            //     var name  = 'str'+i;
            //     name =  new Promise((resolve,reject)=>{     
            //         that.$httpWX.get({
            //                 url:that.$api.message.queryList,
            //                 data:{
            //                     method:method,
            //                     SessionKey:"5af66c21-6974-4251-bb0c-b3f4f7e0f416",
            //                     Id:id
            //                 }
            //             }).then(res=>{
            //                 console.log(res);
            //                 resolve(res);
            //             })
            //     })  
            //   Promise.all([name]).then((result)=>{
            //     //   debugger
            //       that.result = [];
            //       that.resultId = [];
            //       that.electionShow = false;
            //       that.getQuery();
            //   }).catch((error)=>{

            //   })

            // }
        },
        deleteFileQuery(){

        },
        changeColumn(e){
            this.columnIdx = e.mp.detail.value;
            if(this.columnIdx==0){
                this.sort = 'Name'
                this.isTime = false;
            }else if(this.columnIdx==1){
                this.sort = 'Createdon';
                this.isTime = true;
            }
            this.getQuery();
        },
        onCluesAddBtnClick(){
            this.showSheet = true;
        },
        onSelect(e){
            console.log(e);
            let id = e.mp.detail.id;
            if(id==2){
                // let url = '/pages/usbDrive/newFolder/main';
                // wx.navigateTo({url:url});
                this.newSign = 0;
                this.fileName = '';
                this.fileId = '';
                this.newShow = true;
            }else if(id==1){
                // this.popupModal = true;
                this.getOpenPhoto();
            }
        },
        onClose(){
            this.showSheet = false;
        },
        getScreen(){
            this.screenShow = true;
            this.isTime = false;
        },
        getCancel(){
            this.screenShow = false;
        },
        getClose(){
            this.screenShow = false;
        },
        // 选择文件
        getSelectFile(){
            this.electionShow = !this.electionShow;
            // this.isTime = false;
            if(this.electionShow){
                wx.setNavigationBarTitle({
                    title: '已选择'
                })
            }else {
                wx.setNavigationBarTitle({
                    title: '我的文件'
                })
            }
        },
        onChange(e){
            this.checked = e.mp.detail;
        },
        popupClose(){
            this.popupModal = false;
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
                    wx.uploadFile({
                        url: "https://wx.phxinfo.com.cn/rest?method="+'file.upload.create'+'&SessionKey='+that.sessionkey, //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            that.popupModal = false;
                            that.getQuery();
                            
                            const data = res.data
                            //do something
                        }
                    })
                }
            })
        },
        getEditFile(item,str){
            this.str = str;
            this.fileName = item.name;
            this.fileId = item.id;
            console.log(this.fileId);
            this.createdByName = item.createdByName;
            this.createdOn = item.createdOn;
            this.editSheet = true;
        },
        getEditCancel(){
            this.editSheet = false;
        },
        getEditClose(){
            this.editSheet = false;
        },
        // 重命名
        getRename(){
            this.editSheet = false;
            this.newSign = 1;
            this.newShow = true;
            // const url = '/pages/usbDrive/newFolder/main?name='+this.fileName+'&id='+this.fileId+'&sign='+'rename';
            // wx.navigateTo({url:url});
        },
        // 删除单个文件
        deleteFile(){
            let method = '';
            if(this.str=='folders'){
                method = 'file.directory.delete'
            }else {
                method = 'file.delete'
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:method,
                    SessionKey:this.sessionkey,
                    Id:this.fileId
                }
            }).then(res=>{
                console.log(res);
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        setTimeout(()=>{
                            that.editSheet = false;
                            that.getQuery();
                        },1000)
                    }
                })
            })
        },
        getOpenFolder(item){
            const url = '/pages/usbDrive/myFile/childFile/main?id='+item.id+'&name='+item.name;
            wx.navigateTo({
                url:url
            })
        },
        // 获取分享链接
        getObtainLink(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.directory.get",
                    SessionKey:this.sessionkey,
                    Id:this.fileId    
                }
            }).then(res=>{
                console.log(res);
            })
        },
        // 复制到
        getCopy(){
            const url = '/pages/usbDrive/copyUsb/main?fileId='+this.fileId;
            wx.navigateTo({
                url:url
            })
            this.editSheet = false;
        },
        // 移动到
        getMoveFile(){
            const url = '/pages/usbDrive/myFile/moveFile/main?fileId='+this.fileId+'&fileName='+this.fileName+'&str='+this.str;
            wx.navigateTo({url:url});
            this.editSheet = false;
        },
        getPreviewImage(url){
            let that = this;
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: that.imgList// 需要预览的图片http链接列表
            })
        },
        getRouterClass(item){
            const url = '/pages/usbDrive/myFile/classFlie/main?fileType='+item;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .nav {
        background: #fff;
        padding: 31rpx 33rpx;
        .publicfile {
            font-size: 32rpx;
            color: #333333;
        }
        .jurisdiction {
            font-size: 24rpx;
            color: #3399ff;
        }
    }
    .search{
        background: #fff;
    }
    .header{
        padding: 33rpx;
        background: #fff;
        font-size: 24rpx;
        color: #3399ff;
        display: flex;
        justify-content: space-between;
        h3{
            font-size: 26rpx;
            color: #999999;
        }
        div:nth-child(2){
            display: flex;
            .icon.active{
                color: #a4a4a4;
            }
            p:nth-child(1){
                margin-right: 20px;
            }
        }
    }
    .centerActive{
        padding-bottom: 80px;
        .rowWrap{
            background: #fff;
            padding: 0 33rpx;
            border-top: 1rpx solid #e2e4e3;
            h3{
                color: #a3a3a3;
                font-size: 25rpx;
                padding: 25rpx 0;
            }
            .row{
                display: flex;
                .radioWrap{
                    .radio{
                        margin-top: 20rpx;
                        margin-right: 20rpx;
                    }
                }
                .l{
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
                .r{
                    flex: 1;
                    overflow: hidden;
                    margin-left: 25rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 25rpx;
                    .text{
                        p:nth-child(1){
                            font-size: 32rpx;
                            color: #333333;
                            width:300rpx; 
                            white-space:nowrap; 
                            overflow:hidden; 
                            text-overflow:ellipsis;
                        }
                        p:nth-child(2){
                            font-size: 24rpx;
                            color: #999999;
                        }
                    }
                }
            }

        }
    }
    .center{
        padding-bottom: 120rpx;
        .content.contentActive{
            padding:0 33rpx;
        }
        .content{
            background: #fff;
            display: flex;
            padding: 0 33rpx 0 0;

            .radioWrap{
                .radio{
                    margin-top: 20px;
                }
            }
            .img{
                padding:20rpx 0;
                margin-left: 33rpx;
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
            .cont{
                margin-left: 15px;
                flex: 1;
                display: flex;
                justify-content: space-between;
                border-bottom: 1rpx solid #f6f6f6;
                padding:20rpx 0;
                .title{
                    width: 200px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow:ellipsis;
                }
                .text{
                    font-size: 12px;
                    color: #999999;
                }
                .icon{
                    .iconfont{
                        margin-top: 20rpx;
                        color: #a4a4a4;
                        font-size: 20px;
                    }
                }
            }
        }
    }
    .clues-add-button {
        position: fixed;
        right: 20px;
        bottom: 80px;
        background: #049bfb;
        width: 50px;
        height: 50px;
        z-index: 1002;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        opacity: 0.8;
        font-size: 30px;
    }
    .footer{
        width: 100%;
        position: fixed;
        bottom: 20px;
    }
    .popup{
        padding: 20px;
        p{
            font-size: 28rpx;
        }
        p:nth-child(1){
            color: #999999;
            font-size: 12px;
        }
        p:nth-child(2){
            margin: 15px 0;
        }
    }
    .editSheet{
        width: 100%;
        overflow: hidden;
        .headers{
            padding: 30rpx;
            border-bottom: 1rpx solid #e2e4e3;
            display: flex;
            .imgBox{
                width: 60rpx;
                height: 60rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .textWrap{
                margin-left: 20rpx;
                p:nth-child(1){
                    font-size: 28rpx;
                }
                p:nth-child(2){
                    font-size: 12px;
                    color: #999999;
                }
            }
        }
        .content{
            padding:0 30rpx;
            p{
                font-size: 28rpx;
                padding: 20rpx 0;
                border-bottom: 1rpx solid #e2e4e3;
            }
            p:last-child{
                border:none;
            }
        }
    }
    .titleSheet{
        background: #f4f4f4;
        padding: 30rpx 0;
        text-align: center;
        color: #666666;
        font-size: 26rpx;
    }
    .sheetContent{
        display: flex;
        justify-content: space-around;
        background: #f4f4f4;
        padding: 30rpx 0;
        .box{
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
    .footer{
        position: fixed;
        bottom: 20px;
        z-index: 999;
        .operation{
            display: flex;
            justify-content: space-between;
            color: #cccccc;
            background: #fff;
            height: 104rpx;
            line-height: 104rpx;
            font-size: 29rpx;
            padding: 0 30rpx;
            .cancel,.all{
                color: #3399ff
            }
            .delete.active{
                color: #ff6666;
            }
            .move.active{
                color: #3399ff;
            }
        }
    }
</style>