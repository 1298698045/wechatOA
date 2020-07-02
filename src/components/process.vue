<template>
    <div class="wrap">
        <div class="navHeader">
            <p>
                <span class="l" @click="getTab">执行记录</span>
                <span class="r">流程图</span>
            </p>
        </div>
        <div class="content" v-for="(item,index) in list" :key="index">
            <div class="leftBox">
                <p class="ra">
                    <span></span>
                </p>
                <p class="line">
                    <span></span>
                </p>
            </div>
            <div class="rightBox">
                <h3>{{item.CreatedOn}}</h3>
                <div class="boxWrap">
                    <p class="title">{{item.ToActivityName}}</p>
                    <p class="name">
                        办理人
                        <span>{{item.BusinessUnitIdName}}  {{item.CreatedByName}}</span>
                    </p>
                    <p class="name top">
                        处理意见
                        <span>{{item.Description}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'process',
    props:['processInstanceId'],
    data(){
        return {
            sessionkey:"",
            list:[]
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
                    method:"flow.process.rulelog.getlist",
                    SessionKey:this.sessionkey,
                    processInstanceId:this.processInstanceId
                }
            }).then(res=>{
                console.log(res);
                this.list = res.rows;
            })
        },
        getTab(){
            
        }
    }
}
</script>
<style lang="scss">
page{
    // background: #fff;
}
    .wrap{
        padding-bottom: 50rpx;
        .navHeader{
            display: flex;
            justify-content: center;
            margin: 31rpx 0;
            p{
                span{
                    display: inline-block;
                    width: 138rpx;
                    height: 58rpx;
                    line-height: 58rpx;
                    font-size: 28rpx;
                    text-align: center;
                }
                .l{
                    background: #3399ff;
                    color: #fff;
                    border-top-left-radius: 5rpx;
                    border-bottom-left-radius: 5rpx;
                    border: 1rpx solid #3399ff;
                    border-right: none;
                }
                .r{
                    background: #fff;
                    color: #3399ff;
                    border-top-right-radius: 5rpx;
                    border-bottom-right-radius: 5rpx;
                    border:1rpx solid #3399ff;
                    box-shadow: border-box;
                    border-left: none;
                }
            }
        }
        .content{
            display: flex;
            padding: 0 43rpx;
            margin-bottom: -10rpx;
            .leftBox{
                .ra{
                    width: 35rpx;
                    height: 35rpx;
                    border-radius: 50%;
                    border:1rpx solid #3399ff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span{
                        display: inline-block;
                        width: 16rpx;
                        height: 16rpx;
                        background: #3399ff;
                        border-radius: 50%;
                    }
                }
                .line{
                    text-align: center;
                    span{
                        display: inline-block;
                        width: 2rpx;
                        height: 277rpx;
                        background: #3399ff;
                    }
                }
            }
            .rightBox{
                flex: 1;
                margin-left: 43rpx;
                h3{
                    font-size: 24rpx;
                    color: #999999;
                }
                .boxWrap{
                    width: 100%;
                    // height: 201rpx;
                    background: #fff;
                    border-radius: 14rpx;
                    margin-top: 31rpx;
                    border: 1rpx solid #e2e4e3;
                    box-shadow: border-box;
                    .title{
                        background: #f2f2f2;
                        font-size: 24rpx;
                        color: #999999;
                        // height: 42rpx;
                        // line-height: 42rpx;
                        padding:14rpx 21rpx;
                    }
                    .name{
                        padding: 19rpx 21rpx;
                        color: #666666;
                        font-size: 28rpx;
                        span{
                            color: #333333;
                        }
                    }
                    .top{
                        border-top: 1rpx solid #e2e4e3;
                        box-shadow: border-box;
                    }
                }
            }
        }
    }
</style>