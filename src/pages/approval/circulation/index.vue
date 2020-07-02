<template>
    <div class="wrap">
        <div class="header">
            <div class="nav" v-if="!isBlock">
                <div class="lBox">
                    <picker @change="bindPickerChange" :value="timeSortIdx" :range="timeSort">
                        <p>{{timeSort[timeSortIdx]}}<i-icon type="enter" color="#999999" /></p>
                    </picker>
                </div>
                <div class="rBox">
                    <p @click="getSearch">
                        <i class="iconfont icon-sousuo-copy"></i>
                    </p>
                    <p @click="getScreen">
                        <i class="iconfont icon-xuankeshaixuantubiaoimg-copy"></i>
                    </p>
                </div>
                <!-- <p @click="getSearch"><i-icon type="search" size="20" />搜索</p>
                <p @click="getScreen"><i-icon type="search" size="20" />筛选</p> -->
            </div>
        </div>
        <div class="center">
            <NavShow v-if="isBlock" ref="childs" @childFn="getChildFn" :childShow="childShow" />
            <div class="radio" v-if="!isShow&&!isBlock">
                <div class="row">
                    <p>
                        <van-checkbox :value="checked" @change="changeRadio">只看未读  3</van-checkbox>
                    </p>
                    <p @click="getBatch">批量操作</p>
                </div>
            </div>
            <div class="content" v-if="!isShow&&!isBlock">
                <van-checkbox-group :value=" result " @change="onChange">
                    <div class="row" v-for="(item,index) in list" :key="index">
                        <van-checkbox v-if="isShow" custom-class="checkbox" :name="item.instanceId">
                        </van-checkbox>
                        <div class="lBox">
                            <p>{{item.createdByName}}</p>
                        </div>
                        <div class="rBox"  @click.stop="getDetail(item)">
                            <div class="title">
                                <p>{{item.createdByName}}提交的会议纪要申请</p>
                                <!-- <p class="time">05.22</p> -->
                            </div>
                            <div class="level">
                                <p>
                                    <i class="iconfont icon-jinji2 icon" :class="item.priority==0?'icon':item.priority==1?'zhongji':'jinji'"></i>
                                </p>
                                <p class="name">{{item.name}}</p>
                            </div>
                            <!-- <p class="text">标题：{{item.name}}</p>
                            <p class="text">级别：{{item.priority==0?'普通':item.priority==1?'紧急':'非常紧急'}}</p> -->
                            <div class="status">
                                <p>{{item.createdOn}} · 来自{{item.createdByName}} {{item.businessUnitIdName}}</p>
                                <p>未读</p>
                            </div>
                        </div>
                    </div>
                </van-checkbox-group>
            </div>
        </div>
        <div class="footer" v-if="isShow">
            <div class="boxWrap">
                <p @click="getCancel">
                    取消
                </p>
                <p @click="getAllSelect" v-if="result==''">
                    全选
                </p>
                <p v-if="result!=''" @click="getCancelAll">
                    取消全选
                </p>
                <p @click="getAllSign">
                    标为已读
                </p>
                <p @click="getAllDel">
                    删除
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import NavShow from '@/components/approval/navShow';
import {mapMutations} from 'vuex';
export default {
    components:{
        NavShow
    },
    data(){
        return {
            isBlock:false,
            checked:false,
            result:[],
            isShow:false,
            childShow:'',
            sessionkey:"",
            list:[],
            timeSort:['时间排序','优先级排序'],
            timeSortIdx:0,
            isBook:"",
            readState:-1
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    computed:{
        ValueIds(){
            let temp = [];
            this.result.forEach(item=>{
                temp.push(item);
            })
            return temp.join(',');
        },
        sort(){
            let sort = this.timeSortIdx==0?'CreatedOn':'Priority';
            return sort;
        }
    },
    methods:{
        bindPickerChange(e){
            this.timeSortIdx = e.mp.detail.value;
            this.getQuery();
        },
        getChildFn(isBook){
            this.isBook = isBook;
            this.getQuery();
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.readtasks.getlist",
                    SessionKey:this.sessionkey,
                    readState:this.readState,
                    sort:this.sort,
                    search:this.isBook?this.$refs.childs.searchValue:'',
                    processId:this.isBook?this.$refs.childs.processId:'',
                    stateCode:this.isBook?this.$refs.childs.statusNum:'',
                    deptIds:this.isBook?this.$refs.childs.deptIds.join(','):'',
                    createdByIds:this.isBook?(this.$refs.childs.designee.hasOwnProperty('id')?this.$refs.childs.designee.id:''):""
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
            })
        },
        ...mapMutations([
            'updateInstanceId'
        ]),
        getDetail(item){
            this.updateInstanceId(item.instanceId);
            const url = '/pages/todoBusiness/detail/main?processInstanceId='+item.processInstanceId;
            wx.navigateTo({
                url:url
            })
        },
         changeRadio(e){
            this.checked = e.mp.detail;
            if(this.checked){
                this.readState = 0;
            }else {
                this.readState = 1;
            }
            this.getQuery();
        },
        onChange(e){
            this.result = e.mp.detail;
        },
        getBatch(){
            this.isShow = !this.isShow;
        },
        getCancel(){
            this.result = [];
            this.isShow = false;
        },
        getAllSelect(){
            this.list.forEach(item=>{
                this.result.push(item.instanceId)
            })
        },
        getCancelAll(){
            this.result = [];
        },
        getSearch(){
            this.childShow = 0;
            this.isBlock = true;
        },
        getScreen(){
            this.childShow = 1;
            this.isBlock = true;
        },
        getAllSign(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"wfinstance.notify.batch.read",
                    SessionKey:this.sessionkey,
                    ValueIds:this.ValueIds
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:"success",
                    duration:2000
                })
                this.result = [];
                this.isShow = false;
            })
        },
        getAllDel(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"wfinstance.notify.batch.delete",
                    SessionKey:this.sessionkey,
                    ValueIds:this.ValueIds
                }
            }).then(res=>{
                console.log(res);
                this.result = [];
                this.isShow = false;
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/schedule.css';
    .wrap{
        // width: 100%;
        // height: 100vh;
        // display: flex;
        // flex-direction: column;
        // overflow: hidden;
        .header{
            width: 100%;
            background: #fff;
            .nav{
                width: 100%;
                display: flex;
                background: #ffffff;
                justify-content: space-between;
                align-items: center;
                padding: 30rpx;
                .lBox{
                    font-size: 26rpx;
                    color: #999999;
                }
                .rBox{
                    display: flex;
                    p{
                        flex:1;
                        text-align: center;
                        color: #333333;
                        font-size: 28rpx;
                    }
                    p:nth-child(1){
                        margin-right: 60rpx;
                    }
                }
            }
        }
        .center{
            flex: 1;
            width: 100%;
            .radio{
                padding: 33rpx;
                .row{
                    display: flex;
                    justify-content: space-between;
                    p:nth-child(1){
                        color: #999999;
                        font-size: 12px;
                    }
                    p:nth-child(2){
                        color: #3399ff;
                        font-size: 12px;
                    }
                }
            }
            .content{
                .row{
                    display: flex;
                    padding: 35rpx 24rpx;
                    border-bottom: 2rpx solid #e2e3e5;
                    background: #fff;
                    .checkbox{
                        margin: 10rpx 20rpx 0 0 !important;
                    }
                    .lBox{
                        width: 68rpx;
                        height: 68rpx;
                        line-height: 68rpx;
                        text-align: center;
                        background: #3399ff;
                        border-radius: 50%;
                        color: #fff;
                        font-size: 26rpx;
                    }
                    .rBox{
                        flex: 1;
                        margin-left: 25rpx;
                        .title{
                            display: flex;
                            justify-content: space-between;
                            padding-bottom: 20rpx;
                            p{
                                font-size: 34rpx;
                                color: #333333;
                            }
                            .time{
                                font-size: 22rpx;
                                color: #bbbbbb;
                            }
                        }
                        .level{
                            display: flex;
                            align-items: center;
                            .icon{
                                color: #74b48c;
                            }
                            .icon.jinji{
                                color: #ec746c;
                            }
                            .icon.zhongji{
                                color: #e49c5c;
                            }
                            .name{
                                font-size: 28rpx;
                                color: #333333;
                                margin-left: 20rpx;
                            }
                        }
                        .text{
                            font-size: 26rpx;
                            color: #999999;
                        }
                        .status{
                            display: flex;
                            justify-content: space-between;
                            margin-top: 30rpx;
                            p:nth-child(1){
                                font-size: 22rpx;
                                color: #999999;
                            }
                            p:nth-child(2){
                                font-size: 22rpx;
                                color: #3399ff;
                            }

                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .boxWrap{
                display: flex;
                p{
                    flex: 1;
                    text-align: center;
                    font-size: 29rpx;
                    color: #3399ff;
                }
            }
        }
    }
</style>