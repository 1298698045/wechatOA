<template>
    <div class="wrap">
        <div class="center">
            <div class="header">
                <div class="boxWrap">
                    <div class="flex">
                        <span class="label">收件人：</span>
                        <span class="spans" v-if="nameList!=''" v-for="(item,index) in nameList" :key="index">{{item.FullName}}</span>
                        <i class="iconfont icon-quxiao1"  v-if="nameList!=''" @click="getDeleteName"></i>
                        <!-- <i-icon v-if="nameList!=''" size="20" type="delete" @click="getDeleteName" /> -->
                    </div>
                    <div class="input">
                        <input type="text" :value="name" :auto-focus="true" @input="changeName">
                        <i class="iconfont icon-tianjia"  v-if="name==''" @click="getAddContacts"></i>
                    </div>
                    <!-- <van-field
                        custom-style="color:#999;"
                        title-width="120rpx"
                        input-class="inp"
                        label="收件人："
                        :value="name"
                        :border="false"
                        @change="changeName"
                        :focus="isFocus"
                    />
                    <van-icon v-if="name==''" custom-class="icon" name="add" color="#3399ff" size="20" @click="getAddContacts" /> -->
                </div>
                <div class="boxWrap">
                    <div class="flex">
                        <span class="label">抄送人：</span>
                        <span class="spans" v-if="nameListCC!=''" v-for="(item,index) in nameListCC" :key="index">{{item.FullName}}</span>
                        <i class="iconfont icon-quxiao1"  v-if="nameListCC!=''" @click="getDeleteNameCC"></i>
                    </div>
                    <div class="input">
                        <input type="text" :v-model="nameCC" :auto-focus="true" @input="changeCC">
                        <i class="iconfont icon-tianjia"  v-if="nameCC==''" @click="getAddCC"></i>
                    </div>
                </div>
                <!-- <div class="rowWrap" v-if="!isShow">
                    <p>抄送/密送，发件人：</p>
                    <p class="col">zhanglp@fenghuang.com</p>
                </div> -->
                <div class="box" v-if="!isShow">
                    <van-field
                        custom-style="color:#999;"
                        title-width="120rpx"
                        input-class="inpzt"
                        label="主题："
                        :value="subject"
                        :border="false"
                        @change="changeSubject"
                    />
                </div>
            </div>
            <div v-if="isShow">
                <div class="rows" v-for="(item,index) in list" :key="index" @click="getSelect(item)">
                    <div class="name">
                        <p class="radius">{{item.name}}</p>
                    </div>
                    <div class="cont">
                        <p>{{item.FullName}}</p>
                        <p>{{item.TelPhone}}</p>
                    </div>
                </div>
            </div>
            <!-- <div class="rowWrap">
                <p>收件人：</p>
                <p class="col">weihui@fenghuang.com</p>
                <p><van-icon name="add" color="#3399ff" size="20" @click="getAddContacts" /></p>
            </div>
            <div class="rowWrap">
                <p>抄送/密送，发件人：</p>
                <p class="col">zhanglp@fenghuang.com</p>
            </div>
            <div class="rowWrap">
                <p>主题：</p>
                <p class="col"></p>
            </div> -->
            <div class="content" v-if="!isShow">
                <textarea class="textarea" v-model="mailBody" name="" id="" cols="30" rows="10"></textarea>
            </div>
        </div>
        <div class="bottom" v-if="!isShow&&fileList!=''">
            <div class="boxWrap">
            <scroll-view scroll-x="true" style="display: flex;width: 100%">
                <div class="swiper-item" v-for="(item,index) in fileList" :key="index">
                    <p class="imgs">
                        <img :src="item.link" alt="">
                        <i class="iconfont icon-quxiao" @click="getDeleteFile(item,index)"></i>
                    </p>
                    <p class="text">023904.jpg</p>
                    <p class="minText">6.42M</p>
                </div>
            </scroll-view>
            </div>
        </div>
        <div class="footer" v-if="!isShow">
            <div class="row">
                <div>
                    <p class="imgs">
                        <img src="https://wx.phxinfo.com.cn/img/wechat/02.4.1.Photograph.png" alt="">
                    </p>
                    <!-- <i class="iconfont icon-paizhao"></i> -->
                    <i class="iconfont icon-tupian"  @click="getPhoto"></i>
                    <p class="imgs" @click="getUpan">
                        <img src="https://wx.phxinfo.com.cn/img/wechat/02.4.1.File.png" alt="">
                    </p>
                    <!-- <i class="iconfont icon-dingpan-xin"></i>                  -->
                </div>
                <p class="btn" @click="getSendOut('1')">发送</p>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapMutations,mapGetters} from 'vuex';
export default {
    data(){
        return {
            isShow:false,
            list:[],
            name:"",
            UserId:"",
            mailBody:"",
            subject:"",
            fileList:[],
            isFocus:false,
            nameList:[],
            temp:[],
            emailStatus:1,
            sendBatchId:"",
            sessionkey:"",
            nameCC:"",
            nameListCC:[]
        }
    },
    computed:{
        ...mapState({
            selectListName:state=>{
                return state.mailList.selectListName
            },
            selectFiles:state=>{
                return state.usb.selectFiles;
            },
            selectListNameCC:state=>{
                return state.mailList.selectListNameCC
            }
        }),
        ...mapGetters([
            'filterList'
        ])
    },
    onShow(){
        // console.log(this.filterList,'filterList');
        // console.log(this.selectListName,'selectListName');
        this.nameList = this.selectListName;
        this.nameList = this.nameList.map(item=>({
            UserId:item.id,
            FullName:item.FullName
        }))
        this.fileList = this.fileList.concat(this.selectFiles);
        console.log(this.selectListNameCC,'selectListNameCC');
        this.nameListCC = this.selectListNameCC.map(item=>({
            UserId:item.id,
            FullName:item.FullName
        }))
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.isFocus = true;
        // this.queryAll();
    },
    onUnload(){
        this.getClear([]);
    },
    methods:{
        ...mapMutations([
            'getSign',
            'getSingleDelete',
            'getClear',
            'delete',
            'getSingleDeleteCC'
        ]),
        getUpan(){
            const url = '/pages/uPan/main';
            wx.navigateTo({url:url});
        },
        queryAll(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.addresslist.user.search",
                    SessionKey:this.sessionkey,
                    search:this.name                
                }
            }).then(res=>{
                this.list = res.listData;
                this.list.map(item=>{
                    const name = item.FullName.substr(1);
                    item.name = name;
                    return item;
                })
            })
        },
        unique(arr) { // 根据唯一标识orderId来对数组进行过滤
    　　　　　　const res = new Map();  //定义常量 res,值为一个Map对象实例
    　　　　　　//返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
    　　　　　　return arr.filter((arr) => !res.has(arr.UserId) && res.set(arr.UserId, 1)) 
        }, 
        getDeleteName(){
            let index =  this.nameList.length-1;
            let id = this.nameList[index].id;
            this.nameList.splice(index,1);
            this.getSingleDelete(id);
            
        },
        getDeleteNameCC(){
            let index = this.nameListCC.length-1;
            let id = this.nameListCC[index].id;
            this.nameListCC.splice(index,1);
            this.getSingleDeleteCC(id);
        },
        getSelect(item){
            this.temp.push({
                FullName:item.FullName,
                UserId:item.ValueId
            })
            this.nameList = this.unique(this.temp);
            this.isShow = false;
            this.name = '';
        },
        changeName(e){
            console.log(e);
            this.name = e.mp.detail.value;
             if(this.name){
                this.isShow = true;
            }else {
                this.isShow = false;
            }
            this.queryAll();
        },
        changeCC(e){
            this.nameCC = e.mp.detail.value;
             if(this.nameCC){
                this.isShow = true;
            }else {
                this.isShow = false;
            }
        },
        changeSubject(e){
            this.subject = e.mp.detail;
        },
        getAddContacts(){
            // const url = "/pages/publics/contacts/main";
            this.getSign('writeMail');
            const url = "/pages/publics/mailList/main";
            wx.navigateTo({url:url});
        },
        getAddCC(){
            const url = '/pages/publics/mailList/main?cc='+'cc';
            wx.navigateTo({url:url});
        },
        getPhoto(){
            this.getSendOut('0').then(()=>{
                let that = this;
                console.log(that.sendBatchId);
                wx.chooseImage({
                    count: 9,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success (res) {
                        // tempFilePath可以作为img标签的src属性显示图片
                        const tempFilePaths = res.tempFilePaths;
                        console.log(tempFilePaths,'路径');
                        that.fileList = [];
                        for(var i=0;i<tempFilePaths.length;i++){
                            that.fileList.push({
                                link:tempFilePaths[i]
                            });
                        }
                        let Files = that.fileList.join(',');
                        console.log(Files,'Files');
                        for (var i = 0; i < tempFilePaths.length;i++){
                            wx.uploadFile({
                                url: "https://wx.phxinfo.com.cn/rest?method="+'email.attachfiles.upload'+'&SessionKey=' + that.sessionkey+'&pid='+that.sendBatchId,
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
        getDeleteFile(item,index){
            this.fileList.splice(index,1);
            if(item.id){
                this.delete(item.id);
            }
        },
        getSendOut(emailStatus){
            let toUserids = [];
            this.nameList.forEach(item=>{
                toUserids.push(item.UserId);
            })
            this.UserId = toUserids.join(',');
            return new Promise((reslove,reject)=>{
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:"email.componse.send",
                        SessionKey:this.sessionkey,
                        subject:this.subject,
                        mailBody:this.mailBody,
                        toUserids:this.UserId,
                        emailStatus:emailStatus,
                        priority:0,
                        attachfileids:""
                    }
    
                }).then(res=>{
                    if(emailStatus=='1'){
                        wx.showToast({
                            title:'发送成功',
                            icon:'success',
                            duration:2000
                        })
                        wx.navigateBack({
                            delta: 1
                        })
                    }else if(emailStatus=='0'){
                        this.sendBatchId = res.data[0].sendBatchId;
                    }
                    reslove();
                })
            })
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
    .radius{
        width: 80rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 12px;
        border-radius: 50%;
        text-align: center;
        background: #3399ff;
        color: #fff;
    }
    .wrap{
        .center{
            width: 100%;
            .header{
                .boxWrap{
                    padding: 10rpx 33rpx;
                    border-bottom: 1rpx solid #ededed;
                    overflow: hidden;
                    .flex{
                        float: left;
                        font-size: 28rpx;
                        color: #999999;
                        display: flex;
                        align-items: center;
                        .label{

                        }
                        .spans{
                            display: inline-block;
                            background: #f6f6f6;
                            padding: 10rpx 15rpx;
                            color: #666666;
                            font-size: 26rpx;
                            margin-right: 10rpx;
                            border-radius: 2rpx;
                        }
                    }
                    .input{
                        display: flex;
                        align-items: center;
                        input{
                            flex: 1;
                        }
                        i{
                            color: #3399ff;
                        }
                    }
                }
                .box{
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 2rpx solid #ededed;
                    .inp{
                        color: #999999;
                        // background: #f6f6f6;
                        // width: 100rpx;
                        // text-align: center;
                        // border-radius: 5rpx;
                        // font-size: 26rpx;
                    }
                    .inpzt{
                        font-size: #333333;
                        font-weight: bold;
                    }
                    .icon{
                        margin-right: 30rpx;
                    }
                }
                .rowWrap{
                    display: flex;
                    padding: 20rpx 30rpx;
                    border-bottom: 1rpx solid #ededed;
                }
            }
            .rows{
                display: flex;
                padding: 20rpx 30rpx;
                .cont{
                    flex: 1;
                    margin-left: 20rpx;
                    p:nth-child(1){
                        font-weight: bold;
                    }
                    p:nth-child(2){
                        font-size: 12px;
                        color: #666666;
                    }
                }
            }
            .rowWrap{
                display: flex;
                padding: 20rpx 30rpx;
                border-bottom: 1rpx solid #ededed;
                p{
                    font-size: 28rpx;
                    color: #999999;
                }
                .col{
                    flex: 1;
                }
            }
            .content{
                padding: 20rpx;
                .textarea{
                    width: 100%;
                }
            }
        }
        .bottom{
            width: 100%;
            position: fixed;
            bottom: 60px;
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
                        width: 162rpx;
                        height: 162rpx;
                        display: inline-block;
                        // background: red;
                        // margin-right: 10rpx;
                        margin: 10rpx 10rpx 10rpx 0;
                        .imgs{
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            position: relative;
                            img{
                                width: 90%;
                                height: 150rpx;
                            }
                            i{
                                position: absolute;
                                top: -5rpx;
                                right: -5rpx;
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
                div{
                    display: flex;
                    .imgs{
                        width: 49rpx;
                        height: 49rpx;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    i{
                        font-size: 20px;
                        color: #3399ff;
                        margin: 0 30px;
                    }
                }
                .btn{
                    font-size: 28rpx;
                    color: #fff;
                    background: #3399ff;
                    border-radius: 7rpx;
                    width: 110rpx;
                    height: 67rpx;
                    text-align: center;
                    line-height: 67rpx;
                }
            }
        }
    }
</style>