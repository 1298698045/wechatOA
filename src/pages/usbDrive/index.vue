<template>
    <div class="wrap">
        <div class="header back">
            <van-search :value="value" placeholder="请输入搜索关键词" />
        </div>
        <div class="center back">
            <div class="rowWrap" @click="getLately">
                <p class="imgBox">
                    <img src="https://wx.phxinfo.com.cn/img/wechat/Lately_Files.png" alt="">
                </p>
                <p class="text">最近使用</p>
            </div>
            <div class="rowWrap" @click="getMyFiles">
                <p class="imgBox">
                    <img src="https://wx.phxinfo.com.cn/img/wechat/My_Files.png" alt="">
                </p>
                <p class="text">我的文件</p>
            </div>
            <div class="rowWrap" @click="getSharedFile">
                <p class="imgBox">
                    <img src="https://wx.phxinfo.com.cn/img/wechat/Shared_files.png" alt="">
                </p>
                <p class="text">共享文件</p>
            </div>
        </div>
        <h3>单位文件</h3>
        <div class="content back">
            <div class="rowWrap" v-for="(item,index) in folders" :key="index">
                <p class="imgBox">
                    <img src="https://wx.phxinfo.com.cn/img/wechat/Unit_file.png" alt="">
                </p>
                <p class="text">{{item.name}}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            value:"",
            files:[],
            folders:[],
            sessionkey:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQueryCompanyFile();
    },
    methods:{
        getQueryCompanyFile(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.files.search",
                    SessionKey:this.sessionkey,
                    srchType:'org',
                    sort:this.sort
                }
            }).then(res=>{
                console.log(res);
                this.files = res.files;
                this.folders = res.folders;
                this.files.forEach(item=>{
                    this.$set(item,'str',' files');
                    if(item.fileExtension=='jpg'){
                        this.imgList.push(item.link)
                    }
                })
                this.folders.forEach(item=>{
                    this.$set(item,'str',' folders');
                })
            })
        },
        getLately(){
            const url = '/pages/usbDrive/lately/main';
            wx.navigateTo({url:url});
        },
        getMyFiles(){
            const url = '/pages/usbDrive/myFile/main?srchType='+'my'+'&id='+'10010000-0000-0000-0000-000000000001';
            wx.navigateTo({url:url});
        },
        getSharedFile(){
            const url = '/pages/usbDrive/shareFile/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .back{
        background: #fff;
    }
    .center{ 
        padding: 20rpx;
        .rowWrap{
            display: flex;
            padding: 10rpx 0;
            // border-bottom: 1rpx solid #efefef;
            .imgBox{
                width: 80rpx;
                height: 80rpx;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
            .text{
                line-height: 80rpx;
                margin-left: 20px;
                font-size: 28rpx;
            }
        }
    }
    h3{
        padding: 20rpx;
        font-size: 28rpx;
        color: #a6a6a6;
    }
    .content{
        padding: 20rpx;
        .rowWrap{
            display: flex;
            padding: 10rpx 0;
            // border-bottom: 1rpx solid #efefef;
            .imgBox{
                width: 80rpx;
                height: 80rpx;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
            .text{
                line-height: 80rpx;
                margin-left: 20px;
                font-size: 28rpx;
            }
        }
    }
</style>