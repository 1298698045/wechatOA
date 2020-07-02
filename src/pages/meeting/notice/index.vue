<template>
    <div class="wrap">
        <div class="center" v-for="(item,index) in list" :key="index">
            <p class="time">{{item.ModifiedOn}}</p>
            <div class="content">
                <div class="lBox">
                    <p>{{item.OwningUserName}}</p>
                </div>
                <div class="rBox">
                    <div class="cont">
                        <div class="title">
                            <p class="name">{{item.Subject}}</p>
                            <p class="tag">已接受</p>
                        </div>
                        <p class="text">针对服务品质进行评估</p>
                        <div class="info">
                            <p>组织人：{{item.CreatedByName}}</p>
                            <p>内部会议室：{{item.RoomIdName}}</p>
                            <p>时间：1月9日 周二 10:00～11:00</p>
                        </div>
                    </div>
                    <div class="btnWrap">
                        <p @click="getEdit(item)">
                            修改
                        </p>
                        <p @click="getDetail(item)">查看详情</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>点击进入会议模块</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            sessionkey:"",
            pageNumber:1,
            pageSize:20,
            list:[]
        }
    },
    onShow(){
        this.getQuery();
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
                    method:"meeting.my.getlist",
                    SessionKey:this.sessionkey,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
            })
        },
        getDetail(item){
            const url = '/pages/meeting/detail/main?id='+item.MeetingId;
            wx.navigateTo({url:url});
        },
        getEdit(item){
            const url = '/pages/schedule/newSchedule/main?MeetingId='+item.MeetingId;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding-bottom: 100px;
        .time{
            font-size: 24rpx;
            color: #fff;
            width: 219rpx;
            height: 46rpx;
            line-height: 46rpx;
            text-align: center;
            background: #cecece;
            border-radius: 5rpx;
            margin: 0 auto;
            margin-top: 60rpx;
        }
        .content{
            display: flex;
            padding: 17rpx;
            .lBox{
                p{
                    width: 83rpx;
                    height: 83rpx;
                    line-height: 83rpx;
                    text-align: center;
                    background: #3399ff;
                    font-size: 26rpx;
                    color: #fff;
                    border-radius: 50%;
                }
            }
            .rBox{
                width: 551rpx;
                background: #fff;
                border-radius: 5rpx;
                margin-left: 20rpx;
                .cont{
                    padding: 28rpx;
                    .title{
                        display: flex;
                        justify-content: space-between;
                        .name{
                            font-size: 32rpx;
                            font-weight: bold;
                            color: #333333;
                        }
                        .tag{
                            width: 92rpx;
                            height: 42rpx;
                            line-height: 42rpx;
                            text-align: center;
                            background: #fff;
                            border:1rpx solid #00d058;
                            color: #00d058;
                            border-radius: 5rpx;
                            font-size: 24rpx;
                        }
                    }
                    .text{
                        font-size: 32rpx;
                        color: #333333;
                    }
                    .info{
                        margin-top: 20rpx;
                        p{
                            font-size: 28rpx;
                            color: #999999;
                        }
                    }
                }
                .btnWrap{
                    display: flex;
                    padding: 20rpx 0;
                    width: 90%;
                    margin: auto;
                    border-top: 2rpx solid #e4e4e4;

                    p{
                        flex: 1;
                        font-size: 32rpx;
                        color: #3399ff;
                        text-align: center;
                    }
                    p:nth-child(1){
                        border-right: 2rpx solid #e4e4e4;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            p{
                text-align: center;
                padding: 30rpx 0;
                font-size: 29rpx;
                color: #3399ff;
            }
        }
    }
</style>