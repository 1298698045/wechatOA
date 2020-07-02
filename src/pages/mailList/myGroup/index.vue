<template>
    <div class="wrap">
        <div class="header">
            <van-search :value="value" @change="changeSearch" placeholder="请输入搜索关键词" />
            <i-tabs :current="current" @change="handleChangeTab">
                <i-tab key="tab1" title="我创建的"></i-tab>
                <i-tab key="tab2" title="我加入的"></i-tab>
            </i-tabs>
        </div>
        <div class="center">
            <h3>
                常用群组
            </h3>
            <div class="content">
                <div class="row" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
                    <div class="lBox">
                        <p></p>
                    </div>
                    <div class="rBox">
                        <p class="name">{{item.name}}</p>
                        <p class="num">{{item.Quantity}}人</p>
                    </div>
                </div>
            </div>
            <h3>
                30天内无消息的群组
            </h3>
            <div class="content">
                <div class="row">
                    <div class="lBox">
                        <p></p>
                    </div>
                    <div class="rBox">
                        <p class="name">绍兴第二医院</p>
                        <p class="num">56人</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            value:"",
            current:'tab1',
            list:[],
            sessionkey:"",
            scope:"owner", // 我创建的 "owner" 我加入的 "join" 公用的 "public"

            
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
                    method:"sys.groups.search",
                    SessionKey:this.sessionkey,
                    search:this.value,
                    // scope:this.scope
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
            })
        },
        changeSearch(e){
            this.value = e.mp.detail;
            this.getQuery();
        },
        handleChangeTab(e){
            this.current = e.mp.detail.key;
        },
        getDetail(item){
            const url = '/pages/mailList/contacts/main?id='+item.groupId+'&name='+item.name;
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
        .center{
            h3{
                padding: 13rpx 33rpx;
                color: #999999;
                font-size: 26rpx;
            }
            .content{
                width: 100%;
                background: #fff;
                padding: 0 33rpx;
                .row{
                    display: flex;
                    align-items: center;
                    .lBox{
                        padding: 20rpx 0;
                        p{
                            width: 83rpx;
                            height: 83rpx;
                            line-height: 83rpx;
                            text-align: center;
                            font-size: 26rpx;
                            color: #fff;
                            background: #3399ff;
                            border-radius: 50%;
                        }
                    }
                    .rBox{
                        padding: 20rpx 0;
                        flex: 1;
                        margin-left: 20rpx;
                        border-bottom: 2rpx solid #e2e4e3;
                        .name{
                            font-size: 33rpx;
                            color: #333333;
                        }
                        .num{
                            font-size: 29rpx;
                            color: #999999;
                        }
                    }
                }
            }
        }
    }
</style>