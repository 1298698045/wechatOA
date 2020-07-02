<template>
    <div class="wrap">
        <div class="content">
            <div class="row">
                <p>链接分享</p>
                <p><van-switch :checked="checked" size="20px" @change="changeSwitch" /></p>
            </div>
            <div class="row" v-if="checked">
                <p>复制链接</p>
                <p><i-icon type="enter" size="20" color="#ababab" /></p>
            </div>
            <div class="row" v-if="checked">
                <p>分享链接</p>
                <p><i-icon type="enter" size="20" color="#ababab" /></p>
            </div>
        </div>
        <h3>接收者点击链接即可成为该共享文件夹的查看者，停止分享后原有链接将无法继续访问</h3>
         <div class="content">
            <div class="row" @click="getAdmin('0')">
                <p>谁可以管理</p>
                <p><span>1人</span><i-icon type="enter" size="20" color="#ababab" /></p>
            </div>
            <div class="row" @click="getAdmin('0')">
                <p>谁可以编辑/上传</p>
                <p><span>0人</span><i-icon type="enter" size="20" color="#ababab" /></p>
            </div>
            <div class="row" @click="getAdmin('0')">
                <p>谁可以查看</p>
                <p><span>0人</span><i-icon type="enter" size="20" color="#ababab" /></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            checked:false,
            id:"",
            sessionkey:""
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.id = options.id;
    },
    methods:{
        getAdmin(index){
            const url = '/pages/usbDrive/admin/main?index='+index+'&id='+this.id;
            wx.navigateTo({url:url});
        },
        changeSwitch(e){
            this.checked = e.mp.detail;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .content{
            margin-top: 20px;
            background: #fff;
            .row{
                display: flex;
                justify-content: space-between;
                padding:25rpx 30rpx;
                align-items: center;
                border-bottom: 1rpx solid #eaebeb;
                p{
                    font-size: 28rpx;
                }
            }
            .row:last-child {
                border: none;
            }
        }
        h3{
            padding: 30rpx;
            font-size: 12px;
            color: #999999;
        }
    }
</style>