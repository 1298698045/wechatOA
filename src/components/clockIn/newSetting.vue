<template>
    <div class="wrap">
        <div v-if="!isShow">
            <h3>设置符合你企业要求的考勤方式</h3>
            <div class="center">
                <div class="content">
                    <div class="rowWrap">
                        <div class="l">
                            <p>
                                <img src="https://wx.phxinfo.com.cn/img/wechat/04.2.4.Wi-Fi.png" alt="">
                            </p>
                        </div>
                        <div class="r">
                            <p>将整个办公室设为考勤范围</p>
                            <p>设置办公Wi-Fi，精确到5米的定位方式</p>
                        </div>
                    </div>
                    <div class="row" @click="getAddWorkWiFi">
                        <div class="lBox">
                            <p class="font blue">
                                添加办公Wi-Fi
                            </p>
                            <p class="code">24:de:c6:8f:cb:b2</p>
                        </div>
                        <div class="rBox">
                            <p>
                                <img src="https://wx.phxinfo.com.cn/img/wechat/04.2.4.Add_.png" alt="">
                            </p>
                        </div>
                    </div>
                    <div class="row" v-for="(item,index) in wifiList" :key="index">
                        <div class="lBox">
                            <p class="font">
                                {{item.name}}
                            </p>
                            <p class="code">{{item.address}}</p>
                        </div>
                        <div class="rBox">
                            <i-icon type="close" color="#999999" @click="getDeleteWifi(item)" />
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="rowWrap">
                        <div class="l">
                            <p>
                                <img src="https://wx.phxinfo.com.cn/img/wechat/04.2.4.Address_.png" alt="">
                            </p>
                        </div>
                        <div class="r">
                            <p>将整个办公楼设为考勤范围</p>
                            <p>通过手机定位，精确到50～300米的定位方式</p>
                        </div>
                    </div>
                    <div class="row" v-for="(item,index) in adressList" :key="index">
                        <div class="lBox">
                            <p class="font">
                                {{item.name}}
                            </p>
                            <p class="code">{{item.location}}</p>
                        </div>
                        <div class="rBox">
                            <i-icon type="close" color="#999999" @click="getDeleteAdress(item)" />
                        </div>
                    </div>
                    <div class="row rowActive" @click="getSeeMore">
                        <div class="lBox">
                            <p class="font">查看更多</p>
                        </div>
                        <div class="rBox">
                            <i-icon type="enter" color="#999999" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="lBox">
                            <p class="font">
                                100米
                            </p>
                            <p class="code">允许打卡范围</p>
                        </div>
                        <div class="rBox">
                            <i-icon type="enter" color="#999999" />
                        </div>
                    </div>
                    <div class="row" @click="getAddWorkLocation">
                        <div class="lBox">
                            <p class="font blue">
                                添加办公地点
                            </p>
                            <p class="code">在此范围内即可打卡</p>
                        </div>
                        <div class="rBox">
                            <p>
                                <img src="https://wx.phxinfo.com.cn/img/wechat/04.2.4.Add_.png" alt="">
                            </p>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="row rowActive" @click="getSeniorSetting">
                        <div class="lBox">
                            <p class="font">高级设置</p>
                        </div>
                        <div class="rBox">
                            <i-icon type="enter" color="#999999" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <addWiFi v-if="isShow" @childFn="getChildFn" />
        <van-action-sheet
            :round="false"
            :show="show"
            @close="getClose"
        >
            <div class="sheetWrap">
                <p class="title">IOS如何获取Wi-Fi连接？</p>
                <div class="cont">
                    <p>完成以下3步，就可以获取附近Wi-Fi了</p>
                    <div class="img">
                        <img src="https://wx.phxinfo.com.cn/img/wechat/04.2.4.WiFi_1.jpg" alt="">
                    </div>
                    <div class="img">
                        <img src="https://wx.phxinfo.com.cn/img/wechat/04.2.4.WiFi_2.jpg" alt="">
                    </div>
                    <div class="img">
                        <img src="https://wx.phxinfo.com.cn/img/wechat/04.2.4.WiFi_3.jpg" alt="">
                    </div>
                </div>
                <div class="btn" @click="getToConnect">
                    <p>看懂了，去连接</p>
                </div>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
import addWiFi from './addWiFi';
// import QQMapWX from '../../../src/utils/qqmap-wx-jssdk';
// var qqmapsdk = new QQMapWX({
//     key: 'UVRBZ-UN2WU-KMJV6-2DAPJ-JW5QE-C5BYC' // 必填
// }); 
export default {
    name:"newSetting",
    components:{
        addWiFi
    },
    data(){
        return {
            isShow:false,
            wifiList:[],
            adressList:"",
            show:false,
            isMore:false
        }
    },
    onShow(){
        this.getQueryWIFi();
        this.getQueryAdress();
    },
    onLoad(){
        this.getQueryWIFi();
        this.getQueryAdress();
        // wx.startWifi({
        //     success:function(e){
        //         wx.getWifiList({
        //             success:function(e){
        //                 console.log(e,'wx.getWifiList');
        //                 wx.onGetWifiList(function(e){
        //                     console.log(e,'callback')
        //                 })
        //             }
        //         })
        //     }
        // })
    },
    methods:{
        // 查看更多
        getSeeMore(){
            this.isMore = true;
            this.getQueryAdress();
        },
        getQueryWIFi(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:"207A11C0-12E3-4F7E-8033-F61B6883FFD8",
                    method:"hr.attendwifis.getlist"
                }
            }).then(res=>{
                console.log(res);
                this.wifiList = res.data;
            })
        },
        getDeleteWifi(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:"207A11C0-12E3-4F7E-8033-F61B6883FFD8",
                    method:"entity.info.delete",
                    Id:item.attendwifiid,
                    ObjTypeCode:30093
                }
            }).then(res=>{
                console.log(res);
                this.getQueryWIFi();
            })
        },
        getQueryAdress(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"hr.attendlocations.getlist",
                    SessionKey:"207A11C0-12E3-4F7E-8033-F61B6883FFD8"
                }
            }).then(res=>{
                console.log(res);
                if(!this.isMore){
                    this.adressList = res.data.slice(0,2);
                }else {
                    this.adressList = res.data;
                }
            })
        },
        getDeleteAdress(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:"207A11C0-12E3-4F7E-8033-F61B6883FFD8",
                    method:"entity.info.delete",
                    Id:item.attendlocationid,
                    ObjTypeCode:30092
                }
            }).then(res=>{
                console.log(res);
                this.getQueryAdress();
            })
        },
        // 添加办公地点
        getAddWorkLocation(){
            const url = '/pages/clockIn/mapList/main';
            wx.navigateTo({url:url});
        },
        getClose(){
            this.show = false;
        },
        getToConnect(){
            this.show = false;
            this.$emit('childFn',false);
            this.isShow = true;
        },
        getAddWorkWiFi(){
            this.show =  true;
        },
        getChildFn(val){
            wx.setNavigationBarTitle({
                title: '设置'
            })
            this.isShow = val;
            this.$emit('childFn',true);
            this.getQueryWIFi();
        },
        // 高级设置
        getSeniorSetting(){
            const url = '/pages/clockIn/seniorSetting/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss" scoped>
    h3{
        font-size: 26rpx;
        color: #999999;
        background: #f4f4f4;
        padding: 31rpx 33rpx;
    }
    .center{
        padding-bottom: 80px;
        .content{
            background: #fff;
            margin-bottom: 40rpx;
            .rowWrap{
                display: flex;
                padding: 31rpx 33rpx;
                border-bottom: 2rpx solid #e2e4e3;
                .l{
                    p{
                        width: 63rpx;
                        height: 63rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .r{
                    flex: 1;
                    margin-left: 20rpx;
                    p{
                        font-size: 24rpx;
                        color: #cccccc;
                    }
                }
            }
            .row{
                display: flex;
                padding: 31rpx 33rpx;
                border-bottom: 2rpx solid #e2e4e3;
                justify-content: space-between;
                align-items: center;
                .lBox{
                    .font{
                        font-size: 32rpx;
                        color: #333333;
                    }
                    .code{
                        font-size: 24rpx;
                        color: #999999;
                    }
                    .blue{
                        color: #3399ff;
                    }
                }
                .rBox{
                    p{
                        width: 62rpx;
                        height: 62rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
            }
            .rowActive{
                padding: 40rpx 33rpx;
            }
        }
    }
    .sheetWrap{
        .title{
            font-size: 34rpx;
            font-weight: bold;
            color: #333333;
            text-align: center;
            padding: 20rpx 0;
        }
        .cont{
            padding: 0 20rpx;
            p{
                font-size: 31rpx;
                color: #333333;
            }
            .img{
                width: 100%;
                height: 190rpx;
                margin-top: 20rpx;
                img{
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
        }
        .btn{
            display: flex;
            justify-content: center;
            margin: 30rpx 0;
            p{
                width: 400rpx;
                height: 80rpx;
                line-height: 80rpx;
                text-align: center;
                background: #3399ff;
                font-size: 32rpx;
                color: #fff;
                border-radius: 42rpx;
            }
        }
    }
</style>