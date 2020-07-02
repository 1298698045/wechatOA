<template>
    <div class="wrap">
        <div class="center">
            <div class="header">
                <div class="box">
                    <div class="flex">
                        <span class="label">群组：</span>
                        <span class="spans" v-if="nameList!=''" v-for="(item,index) in nameList" :key="index">{{item.name}}</span>
                        <i class="iconfont icon-quxiao1"  v-if="nameList!=''" @click="getDeleteName"></i>
                    </div>
                    <div class="input">
                        <input type="text" :value="name" :auto-focus="true" @input="changeName">
                        <i class="iconfont icon-tianjia"  v-if="name==''" @click="getAddContacts"></i>
                    </div>
                    <!-- <van-field
                        custom-style="color:#999;"
                        input-class="inp"
                        title-width="50px"
                        label="群组："
                        :value="name"
                        :border="false"
                        @change="changeName"
                        :focus="isFocus"
                    />
                    <van-icon custom-class="icon" name="add" color="#3399ff" size="20" @click="getAddContacts" /> -->
                </div>
                <div class="theme"  v-if="!isShow">
                    <van-field
                        custom-style="color:#999;"
                        input-class="inp"
                        title-width="50px"
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
                        <p class="radius">{{item.quantity}}</p>
                    </div>
                    <div class="cont">
                        <p>{{item.value}}</p>
                        <p>{{item.quantity}}人</p>
                    </div>
                </div>
            </div>
            <div class="content"  v-if="!isShow">
                <textarea class="textarea" v-model="mailBody" placeholder="输入正文..." name="" id="" cols="30" rows="10"></textarea>
            </div>
        </div>
        <div class="bottom">
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
        <div class="footer">
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
                <p class="btn" @click="getSendOut">发送</p>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex';
export default {
    data(){
        return {
            isFocus:false,
            isShow:false,
            name:"",
            subject:"",
            mailBody:"",
            list:[
            ],
            fileList:[],
            temp:[],
            nameList:[],
            sessionkey:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.isFocus = true;
        this.getQuery();
    },
    computed:{
        ...mapState({
            groupList:state=>{
                console.log(state.mailList.groupList);
                return state.mailList.groupList
            }
        })
    },
    onShow(){
        this.nameList = this.groupList;
    },
    methods:{
        ...mapMutations([
            'getDelGroup'
        ]),
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.contact.search",
                    SessionKey:this.sessionkey,
                    tag:this.name,
                    IsGroup:true
                }
            }).then(res=>{
                this.list = res;
            })
        },
        changeSubject(e){
            this.subject = e.mp.detail;
        },
        changeName(e){
            this.name = e.mp.detail.value;
            let length = this.name.length;
            if(length>=2){
                this.getQuery();
                this.isShow = true;
            }
            if(this.name == ''){
                this.isShow = false;
            }
        },
        getSelect(item){
            let groupId = item.key;
            let name = item.value;
            this.temp.push({
                groupId:groupId,
                name:name
            })
            this.nameList = this.unique(this.temp);
            this.isShow = false;
            this.name = '';
        },
        unique(arr) { // 根据唯一标识orderId来对数组进行过滤
    　　　　　　const res = new Map();  //定义常量 res,值为一个Map对象实例
    　　　　　　//返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
    　　　　　　return arr.filter((arr) => !res.has(arr.groupId) && res.set(arr.groupId, 1)) 
        },
        getDeleteName(){
            let index = this.nameList.length-1;
            this.nameList.splice(index,1);
            this.getDelGroup(this.nameList[index].id);
        },
        getPhoto(){
            var that = this;
            wx.chooseImage({
                count: 9,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    console.log(tempFilePaths,'路径');
                    that.fileList = tempFilePaths;
                }
            })
        },
        getAddContacts(){
            const url = "/pages/publics/pubGroup/main";
            wx.navigateTo({url:url});
        },
        getSendOut(){
            let toGroupIds = [];
            this.nameList.forEach(item=>{
                toGroupIds.push(item.id);
            })
            toGroupIds = toGroupIds.join(',');
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.componse.send",
                    SessionKey:this.sessionkey,
                    subject:this.subject,
                    mailBody:this.mailBody,
                    toGroupIds:toGroupIds,
                    emailStatus:1,
                    priority:0
                }
            }).then(res=>{
                console.log(res);
                wx.navigateBack({
                    delta: 1
                })
            })
        },
        getUpan(){
            const url = '/pages/uPan/main';
            wx.navigateTo({url:url});
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
         .center{
            width: 100%;
            padding-bottom: 80px;
            .header{
                .box{
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
                .theme{
                    border-bottom: 2rpx solid #ededed;
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
            background: #fff;
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