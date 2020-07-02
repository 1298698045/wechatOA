<template>
    <div class="wrap">
        <div class="content">
            <div class="rowWrap">
                <div class="name">
                    <p>头像</p>
                </div>
                <div class="right">
                    <p class="radius" :class="imgUrl!=''?'active':''">
                        <span v-if="imgUrl==''"  @click="getAvatar">
                            {{info.fullName}}
                        </span>
                        <img v-if="imgUrl!=''" :src="imgUrl" alt="" @click="getPreview">
                    </p>
                    <i-icon type="enter" color="#cccccc" size="20" />
                </div>
            </div>
            <div class="rowWrap" @click="getEditName">
                <div class="name">
                    <p>名字</p>
                </div>
                <div class="right">
                    <span class="text">{{info.fullName}}</span>
                    <i-icon type="enter" color="#cccccc" size="20" />
                </div>
            </div>
            <div class="rowWrap">
                <div class="name">
                    <p>账号</p>
                </div>
                <div class="right">
                    <span class="text">{{info.userName}}</span>
                    <i-icon type="enter" color="#fff" size="20" />
                </div>
            </div>
            <div class="rowWrap" @click="getQrcode">
                <div class="name">
                    <p>我的二维码</p>
                </div>
                <div class="right">
                    <i-icon type="picture" />
                    <i-icon type="enter" color="#cccccc" size="20" />
                </div>
            </div>
            <picker @change="bindPickerSix" :value="sixIndex" :range="sixList">
                <div class="rowWrap">
                        <div class="name">
                            <p>性别</p>
                        </div>
                        <div class="right">
                            <span class="text">{{sixList[sixIndex]}}</span>
                            <i-icon type="enter" color="#cccccc" size="20" />
                        </div>
                </div>
            </picker>
            <picker mode="region" @change="bindPickerRegion" :value="region">
                <div class="rowWrap">
                    <div class="name">
                        <p>地区</p>
                    </div>
                    <div class="right">
                        <span class="text">{{region[0]}}-{{region[1]}}</span>
                        <i-icon type="enter" color="#cccccc" size="20" />
                    </div>
                </div>
            </picker>
            <div class="rowWrap">
                <div class="name">
                    <p>单位名称</p>
                </div>
                <div class="right">
                    <span class="text">绍兴第二医院</span>
                    <i-icon type="enter" color="#fff" size="20" />
                </div>
            </div>
             <div class="rowWrap">
                <div class="name">
                    <p>部门</p>
                </div>
                <div class="right">
                    <span class="text">{{info.deptName}}</span>
                    <i-icon type="enter" color="#fff" size="20" />
                </div>
            </div>
            <div class="rowWrap">
                <div class="name">
                    <p>职务</p>
                </div>
                <div class="right">
                    <span class="text">管理员</span>
                    <i-icon type="enter" color="#fff" size="20" />
                </div>
            </div>
            <div class="rowWrap" @click="getBindingPhone">
                <div class="name">
                    <p>手机号</p>
                </div>
                <div class="right">
                    <span class="text">{{info.mobile}}</span>
                    <i-icon type="enter" color="#cccccc" size="20" />
                </div>
            </div>
            <div class="rowWrap" @click="getEmail">
                <div class="name">
                    <p>邮箱</p>
                </div>
                <div class="right">
                    <span class="text">未设置</span>
                    <i-icon type="enter" color="#cccccc" size="20" />
                </div>
            </div>
        </div>
         <van-popup
        :show="showName"
        position="center"
        custom-style="width:80%;height: auto;border-radius:7rpx;"
        @close="onClosePopup"
        >
            <div class="popup">
                <h3>
                    修改名字
                </h3>
                <p>
                    <input type="text" :focus="isTrue" :value="editName" ref="inp" class="inp">
                </p>
                <div>
                    <span @click="onClosePopup">取消</span>
                    <span>确定</span>
                </div>
            </div>
        </van-popup>
        <van-popup
        :show="showEmail"
        position="center"
        custom-style="width:80%;height: auto;border-radius:7rpx;"
        @close="onCloseEmail"
        >
            <div class="popup">
                <h3>
                    邮箱
                </h3>
                <p>
                    <input type="text" placeholder="请输入" class="inp">
                </p>
                <div>
                    <span @click="onCloseEmail">取消</span>
                    <span>确定</span>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    data(){
        return {
            name:"张丽萍",
            showName:false,
            sixList:['男','女'],
            sixIndex:0,
            region: ['浙江省', '绍兴市', '海珠区'],
            showEmail:false,
            editName:"",
            isTrue:true,
            imgUrl:"",
            sessionkey:"",
            info:{}
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getUserInfo();
    },
    methods:{
        getUserInfo(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.userinfo.get",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.info = res.data[0];
            })
        },
        getAvatar(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    console.log(tempFilePaths);
                    that.imgUrl = tempFilePaths[0];
                    wx.uploadFile({
                        url:"https://wx.phxinfo.com.cn/rest?method="+"sys.user.uploadavatar"+"&SessionKey="+that.sessionkey,
                        filePath: tempFilePaths[0],
                        name:"file",
                        formData: {
                            'user': 'test'
                        },
                        success:res=>{
                            console.log(res);
                        }
                    })
                }
            })
    
        },
        getPreview(){
            let that = this;
            wx.previewImage({
                current: that.imgUrl, // 当前显示图片的http链接
                urls: [that.imgUrl] // 需要预览的图片http链接列表
            })
        },
        getEditName(){
            this.editName = this.name;
            this.showName = true;
        },
        onClosePopup(){
            this.showName = false;
        },
        getQrcode(){
            const url = '/pages/my/qrCode/main';
            wx.navigateTo({url:url});
        },
        bindPickerSix(e){
            this.sixIndex = e.mp.detail.value;
        },
        bindPickerRegion(e){
            console.log(e);
            this.region = e.mp.detail.value;
        },
        onCloseEmail(){
            this.showEmail = false;
        },
        getEmail(){
            this.showEmail = true;
        },
        getBindingPhone(){
            const url = '/pages/my/bindingPhone/main?mobile='+this.info.mobile;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .content{
            width: 100%;
            background: #fff;
            margin-top: 35rpx;
            .rowWrap{
                display: flex;
                justify-content: space-between;
                padding: 10rpx 33rpx;
                border-bottom: 1rpx solid #eaebeb;
                .name{
                    color: #666666;
                    font-size: 32rpx;
                    line-height: 100rpx;
                }
                .right{
                    line-height: 100rpx;
                    .radius{
                        width: 100rpx;
                        height: 100rpx;
                        line-height: 100rpx;
                        display: inline-block;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                            border-radius: 50%;
                        }
                    }
                    .radius.active{
                        background: #fff;
                    }
                    .text{
                        color: #333333;
                        font-size: 33rpx;
                    }
                }
            }
        }
        .popup{
            padding: 20rpx 30rpx;
            h3{
                font-size: 23rpx;
                color: #999999;
            }
            p{
                font-size: 33rpx;
                color: #333333;
                padding: 30rpx 0;
                .inp{
                    border-bottom: 1rpx solid #3399ff;
                }
            }
            div{
                text-align: right;
                span{
                    font-size: 28rpx;
                    color: #3399ff;
                }
                span:nth-child(1){
                    margin-right: 60rpx;
                }
            }
        }
    }
</style>