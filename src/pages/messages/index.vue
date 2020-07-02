<template>
    <div class="wrap">
        <van-search :value="value" placeholder="搜索" />
        <i-notice-bar icon="systemprompt" color="#3399ff" i-class="systemprompt" closable>
            启用新消息通知，不错过重要新消息!
        </i-notice-bar>
        <div class="center">
            <div class="content" :class="{active:num==index}" v-for="(item,index) in list" :key="index" @click="handleSelelct(item,index)">
                <i-row>
                    <i-col span="4" i-class="left">
                        <div class="imgWrap">
                            <img :src="imgUrl+item.Icon" alt="">
                        </div>
                    </i-col>
                    <i-col span="15" i-class="centerCol">
                        <p class="topText">
                            {{item.Name}}
                            <!-- {{index==1?'新闻':index==2?'优盘':'待办事务'}} -->
                        </p>
                        <p class="minText">查看{{item.Name}}的内容</p>
                    </i-col>
                    <i-col span="5" class="rightCol">
                        <p class="time">{{item.time}}</p>
                        <span v-if="item.Quantity">{{item.Quantity}}</span>
                        <!-- <i-badge count="66" i-class-alone="demo-badge-alone" /> -->
                    </i-col>
                </i-row>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data(){
        return {
            list:[],
            num:"",
            sessionkey:""
        }
    },
    onShow(){
        this.num = -1;
    },
    computed:{
        ...mapState({
            imgUrl:state=>{
                return state.user.imgUrl
            },
            openid:state=>{
                return state.loginUser.openid
            },
            sessionkey:state=>{
                return state.loginUser.sessionkey
            }
        })
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    methods:{
        getQuery(){
            console.log(this.$httpWX,this.$api.message.queryList);
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"message.statics.getlist",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                this.list = res.listDta;
                this.list.map(item=>{
                    const time = this.getDate(item.ModifiedOn.replace(/-/g,'/'));
                    item.time = time;
                    return item;
                })
            })
        },
        getDate(ModifiedOn){
            let time = (new Date(ModifiedOn)).getTime();
            time = new Date(time);
            var year = time.getFullYear()+'年';
            var month = time.getMonth()+1+'月';
            var date = time.getDate()+'日';
            const newDate = `${month}${date}`;
            return newDate;
        },
        handleSelelct(item,index){
            console.log(item);
            this.num = index;
            let id = item.ModuleId;
            // 107邮件 101待办事务 104新闻
            if(id==104){
                const url = '/pages/journalism/main?contentTypeCode='+1;
                wx.navigateTo({url:url});
            }else if(id==106){
                const url = '/pages/usbDrive/main';
                wx.navigateTo({url:url});
            }else if(id==101){
                const url = '/pages/todoBusiness/main'
                wx.navigateTo({url:url});
            }else if(id==107){
                const url = '/pages/email/main'
                wx.navigateTo({url:url});
            }else if(id==103){
                const url = '/pages/schedule/main';
                wx.switchTab({url:url});
            }else if(id==100202){
                const url = '/pages/journalism/main?contentTypeCode='+2;
                wx.navigateTo({url:url});
            }else if(id==111){
                const url = '/pages/meeting/notice/main';
                wx.navigateTo({url:url});
            }
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        .systemprompt{
            background: #fff!important;
        }
        .center{
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #fff;
            .content.active{
                background: #f3f3f3;
            }
            .content{
                padding: 20rpx;
                background: #fff;
                .left{
                    .imgWrap{
                        width: 48px;
                        height: 48px;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .centerCol{
                    .topText{
                        color: #333333;
                        font-size: 30rpx;
                        margin-top: 10rpx;
                    }
                    .minText{
                        color: #999999;
                        font-size: 20rpx;
                    }
                }
                .rightCol{
                        text-align: right;
                    .time{
                        font-size: 10px;
                        color: #999999;
                        margin-top: 10rpx;
                    }
                    span{
                        width: 21px;
                        height: 14px;
                        text-align: center;
                        background: red;
                        color: #fff;
                        display: inline-block;
                        font-size: 10px;
                        border-radius: 20rpx;
                    }
                }
            }
        }
    }
</style>