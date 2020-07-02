<template>
    <div class="wrap">
        <h3>更换手机号</h3>
        <div class="content">
            <van-field
                :value="phone"
                @change="changePhone"
                clearable
                label="手机号"
                placeholder="请输入手机号"
            />
            <van-field
                :value="sms"
                center
                clearable
                label="验证码"
                placeholder="请输入验证码"
                :border="false"
                use-button-slot
            >
                <p class="send" slot="button">发送验证码</p>
                <!-- <van-button slot="button" color="#3399ff" size="small" type="primary"
                >发送验证码</van-button
                > -->
            </van-field>
            <van-button type="primary" @click="getSubmit" custom-class="btn" color="#3399ff" block>完成</van-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            phone:"",
            sms:"",
            sessionkey:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
    },
    methods:{
        changePhone(e){
            this.phone = e.mp.detail;
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.save",
                    SessionKey:this.sessionkey,
                    ObjTypeCode:8,
                    id:this.sessionkey,
                    MobilePhone:this.phone
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:"修改成功",
                    icon:"success",
                    duration:2000,
                    success:res=>{
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss">
    page{
        background: #fff;
    }
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        h3{
            text-align: center;
            margin-top: 124rpx;
            font-size: 47rpx;
            font-weight: bold;
        }
        .content{
            padding: 50rpx 67rpx;
            .send{
                color: #3399ff;
            }
            .btn{
                margin-top: 30rpx;
            }
        }
    }
</style>