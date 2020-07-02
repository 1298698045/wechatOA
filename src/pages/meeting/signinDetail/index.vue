<template>
    <div class="wrap">
        <i-tabs :current="current" @change="handleChange">
            <i-tab key="tab1" title="未签到"></i-tab>
            <i-tab key="tab2" title="已签到"></i-tab>
        </i-tabs>
        <div class="center">
            <div class="row" v-if="current=='tab1'">
                <div class="lBox">
                    <p>碧池</p>
                </div>
                <div class="rBox">
                    <p>
                        碧池
                        <span>信息中心</span>
                    </p>
                </div>
            </div>
            <div class="rowWrap" v-if="current=='tab2'">
                <div class="lBox">
                    <p>碧池</p>                    
                </div>
                <div class="cBox">
                    <p class="name">
                        碧池
                        <span>信息中心</span>
                    </p>
                    <p class="time">08:23</p>
                </div>
                <div class="rBox" @click="getMove">
                    <i-icon type="more" size="20" color="#3399ff" />
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="box">
                <p>展示签到二维码</p>
                <p>导出Excel</p>
            </div>
        </div>
        <van-action-sheet
            :round="false"
            :show="show"
            cancel-text="取消"
            :actions="actions"
            @close="onClose"
            @cancel="onClose"
            @select="onSelect"
        />
    </div>
</template>
<script>
export default {
    data(){
        return {
            current:'tab1',
            show:false,
            actions:[
                {
                    name: '将碧池标记为未签到'
                }
            ]
        }
    },
    methods:{
        handleChange(e){
            this.current = e.mp.detail.key;
        },
        getMove(){
            this.show = true;
        },
        onClose(){
            this.show = false;
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .center{
            background: #fff;
            .row{
                display: flex;
                padding: 0 33rpx;
                align-items: center;
                .lBox{
                    padding: 16rpx 0;
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        line-height: 80rpx;
                        text-align: center;
                        border-radius: 50%;
                        background: #3399ff;
                        color: #fff;
                        font-size: 30rpx;
                    }
                }
                .rBox{
                    padding: 16rpx 0;
                    flex: 1;
                    margin-left: 20rpx;
                    width: 100%;
                    border-bottom: 2rpx soid #e2e3e5;
                    p{
                        font-size: 35rpx;
                        color: #333333;
                        span{
                            font-size: 26rpx;
                            color: #999999;
                        }
                    }
                }
            }
            .rowWrap{
                display: flex;
                padding: 0 33rpx;
                align-items: center;
                .lBox{
                    padding: 16rpx 0;
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        line-height: 80rpx;
                        text-align: center;
                        border-radius: 50%;
                        background: #3399ff;
                        color: #fff;
                        font-size: 30rpx;
                    }
                }
                .cBox{
                    flex: 1;
                    margin-left: 20rpx;
                    .name{
                        font-size: 35rpx;
                        color: #333333;
                        span{
                            font-size: 26rpx;
                            color: #999999;
                        }
                    }
                    .time{
                        font-size: 24rpx;
                        color: #666666;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            .box{
                display: flex;
                p{
                    width: 50%;
                    text-align: center;
                    padding: 41rpx 0;
                    font-size: 34rpx;
                    color: #3399ff;
                }
            }
        }
    }
</style>