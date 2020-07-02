<template>
    <div class="wrap">
        <div class="container">
            <div class="content" v-for="(item,index) in list" :key="index">
                <div class="img" @click="getOpen(item)">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/My_Files.png" alt="">
                    </p>
                </div>
                <div class="cont">
                    <div>
                        <p class="title overflow">{{item.name}}.{{item.fileExtension}}</p>
                        <p class="text">我的文件/新技术、新项目中期工作报告.docx</p>
                    </div>
                    <p class="icon" @click="getOperation(item)">
                        <i class="iconfont icon-gengduo"></i>
                    </p>
                </div>
            </div>
            <div class="footer">
                <van-button type="primary" custom-class="btn" @click="getClear" block>清除记录</van-button>
            </div>
        </div>
        <van-popup
        :show="show"
        :round="false"
        position="center"
        custom-style="width:80%;height: auto;border-radius:10rpx;"
        @close="onClose"
        >
            <div class="popup">
                <h3 class="overflow">{{name}}</h3>
                <p @click="getSendOut">发送</p>
                <p>发邮件</p>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    data(){
        return {
            list:[],
            show:false,
            name:"",
            sessionkey:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.latest.getlist",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
            })
        },
        onClose(){
            this.show = false;
        },
        getClear(){
            let that = this;
            wx.showModal({
                title: '清除使用记录',
                content: '是否清除最近使用的全部记录，清空后记录将无法恢复',
                confirmText:'清除',
                success:res=> {
                    if (res.confirm) {
                        that.clear();
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        },
        clear(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.latestuse.clear",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.getQuery();
            })
        },
        getOperation(item){
            this.name = `${item.name}.${item.fileExtension}`;
            this.id = item.id;
            this.show = true;
        },
        getSendOut(){
            const url = '/pages/publics/contacts/main?file='+'lately'+'&id='+this.id+'&method='+'file.share';
            wx.navigateTo({
                url:url
            })
        },
        getOpen(item){
            wx.downloadFile({
            // 示例 url，并非真实存在
            url: 'http://example.com/somefile.pdf',
            success: function (res) {
                const filePath = res.tempFilePath
                    wx.openDocument({
                        filePath: filePath,
                        success: function (res) {
                            console.log('打开文档成功')
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/public.scss';
    .container{
        padding-bottom: 80px;
    }
    .content{
        background: #fff;
        display: flex;
        padding:0 20rpx;
        .img{
            padding:20rpx 0;
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
    .footer{
        width: 100%;
        position: fixed;
        bottom: 20px;
        background: #fff;
        .btn{
            background: #fff;
            color: #3399ff;
            border: none;
        }
    }
    .popup{
        padding: 0 30rpx;
        h3{
            font-size: 12px;
            color: #999999;
            padding: 30rpx 0;
        }
        p{
            font-size: 28rpx;
        }
        p:nth-child(3){
            padding: 30rpx 0;
        }
    }
</style>