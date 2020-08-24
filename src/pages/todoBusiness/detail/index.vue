<template>
    <div class="wrap">
        <div class="nav">
            <i-tabs :current="current" @change="changeTabs">
                <i-tab key="tab1" title="表单"></i-tab>
                <i-tab key="tab2" title="文件"></i-tab>
                <i-tab key="tab3" title="流程"></i-tab>
                <i-tab key="tab4" title="关联"></i-tab>
                <i-tab key="tab5" title="讨论"></i-tab>
            </i-tabs>
        </div>
        <div class="rowWrap padding margin" v-if="current=='tab1'">
            <p>查看TA的历史记录</p>
            <p><i-icon type="enter" size="20" color="#cccccc" /></p>
        </div>
        <!-- 表单 -->
        <div class="center margin padding"  v-if="current=='tab1'">
           <div class="steps">
               <div class="step">
                   <p class="radius">崔曼</p>
                   <p class="pactive"></p>
               </div>
               <div class="center">
                   <p>崔曼  发起申请</p>
               </div>
               <div class="time">
                   <p>05:22 11:10</p>
               </div>
           </div>
           <div class="steps">
               <div class="step">
                   <p class="radius">崔曼</p>
                   <p class="pactive"></p>
               </div>
               <div class="center">
                   <p>崔曼  <span>审批中</span></p>
               </div>
               <div class="time">
                   <p> 已等待7分钟</p>
               </div>
           </div>
           <div class="steps">
               <div class="step">
                   <p class="radius">崔曼</p>
                   <p class="admin">主管理员</p>
               </div>
               <div class="center">
                   <p>崔曼  <span>审批中</span></p>
               </div>
               <div class="time">
                   <p> 已等待7分钟</p>
               </div>
           </div>
        </div>
        <!-- 文件 -->
        <File v-if="current=='tab2'" :instanceId="instanceId" :processInstanceId="processInstanceId"></File>
        <!-- 流程 -->
        <process v-if="current=='tab3'" :processInstanceId="processInstanceId" />
        <!-- 关联 -->
        <relation ref="child" :instanceId="instanceId" v-if="current=='tab4'"></relation>
        <!-- 评论 -->
        <div class="comment" v-if="current=='tab5'">
            <div class="cont" v-for="(item,index) in commentList" :key="index">
                <div class="lBox">
                    <p class="radius">{{item.CreatedByName}}</p>
                </div>
                <div class="rBox">
                    <div class="text">
                        <p>{{item.CreatedByName}}</p>
                        <p>{{item.Comment}}</p>
                    </div>
                    <p class="time">{{item.CreatedOn}}</p>
                </div>
            </div>
            <div class="fixed" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
                <div class="box">
                    <p>
                        <input class="inp" v-model="commentVal" placeholder="请输入评论内容" type="text">
                    </p>
                    <p>
                        <i-icon type="emoji" size="30" />
                    </p>
                    <p @click="comment">
                        <span :class="{'active':commentVal!=''}">发送</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="footer" v-if="current=='tab1'||current=='tab2'" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="bottoms">
                <div class="icon">
                    <div>
                        <p>
                            <i class="iconfont icon-pinglun"></i>
                        </p>
                        <p>评论</p>
                    </div>
                    <div @click="getCirculation">
                        <p>
                            <i class="iconfont icon-bianzu"></i>
                        </p>
                        <p>传阅</p>
                    </div>
                    <div @click="getDetailMore">
                        <p>
                            <i class="iconfont icon-gengduo"></i>
                        </p>
                        <p>更多</p>
                    </div>
                </div>
                <div class="btn">
                    <p @click="getRefuse">拒绝</p>
                    <p @click="getAgree">同意</p>
                </div>
            </div>
        </div>
        <!-- 拒绝弹框 -->
        <van-popup
            :show="refuseShow"
            position="center"
            custom-style="width:80%;height: auto;border-radius:10rpx;"
            overlay-style="background: #333;opacity: .5;"
            @close="onCloseRefuse">
            <div class="popup">
                <h3>拒绝意见</h3>
                <div class="text">
                    <textarea class="textarea" placeholder="请输入留言" name="" id="" cols="30" rows="10"></textarea>
                </div>
                <p>退回上一步</p>
                <p class="back">退回节点</p>
                <p>退回上一步</p>
            </div>
        </van-popup>
        <!-- 同意弹框 -->
        <van-popup
            :show="agreeShow"
            position="bottom"
            custom-style="width:100%;height: auto;"
            @close="onCloseAgree"
            overlay-style="background: #333;opacity: .5;">
            <div class="agreeWrap">
                <div class="header">
                    <div>
                        <p class="radius">崔曼</p>
                    </div>
                    <div>
                        <h3>崔曼提交的流程申请表</h3>
                        <p><span>标题：</span>生物医学研究伦理审查审批表</p>
                    </div>
                </div>  
                <div class="cont">
                    <h3>
                        <van-checkbox :value="checked" @change="onChange">节点(1)：行政部</van-checkbox>
                    </h3>
                    <div class="box">
                        <div class="row">
                            <van-checkbox :value="checked" @change="onChange">张丽萍(zlp001)/人事科/行政部</van-checkbox>
                        </div>
                        <div class="row">
                            <van-checkbox :value="checked" @change="onChange">张丽萍(zlp001)/人事科/行政部</van-checkbox>
                            <p><i-icon type="close" size="20" color="#3399ff" /></p>
                        </div>
                        <div class="rows">
                            <p class="add">
                                <i-icon type="add" size="30" color="#3399ff" />
                                <span>
                                    添加办理人员
                                </span>
                            </p>
                        </div>
                    </div>
                    <h3>
                        <van-checkbox :value="checked" @change="onChange">节点(1)：行政部</van-checkbox>
                    </h3>
                    <div class="box">
                        <div class="row">
                            <van-checkbox :value="checked" @change="onChange">张丽萍(zlp001)/人事科/行政部</van-checkbox>
                        </div>
                        <div class="row">
                            <van-checkbox :value="checked" @change="onChange">张丽萍(zlp001)/人事科/行政部</van-checkbox>
                            <p><i-icon type="close" size="20" color="#3399ff" /></p>
                        </div>
                        <div class="rows">
                            <p class="add">
                                <i-icon type="add" size="30" color="#3399ff" />
                                <span>
                                    添加办理人员
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="popupRow">
                        <div class="row">
                            <p>通知</p>
                            <p>
                                <span>应用内</span>
                                <span>&nbsp;短信</span>
                            </p>
                        </div>
                        <div class="text">
                            流程事务:[ 05 绍兴第二医院医共体分院招标关于采购事项的审批单 信息中心 崔曼 ]，请您查阅！
                        </div>
                    </div>  
                    <div class="textarea">
                        <p>留言</p>
                        <textarea name="" placeholder="请输入内容" id="" cols="30" rows="10"></textarea>
                    </div>
                </div>
                <div class="fot">
                    <div class="box">
                        <p @click="onCloseAgree">取消</p>  
                        <p>上一环节</p>
                        <p>提交</p>  
                    </div>
                </div> 
            </div>
        </van-popup>
        <van-action-sheet
            :show=" sheetShow "
            :round="false"
            z-index="999"
            cancel-text="取消"
            :actions="actions"
            @close="onCloseSheet"
            @cancel="onCloseSheet"
        >
            <div class="sheetWrap">
                <p class="row" @click="getAddSign">加签</p>
                <p class="row">结束</p>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
import relation from '../../../components/relation';
import File from '../../../components/file';
import process from '@/components/process';
import { mapState } from 'vuex';
export default {
    components:{
        relation,
        File,
        process
    },
    data(){
        return {
            current:'tab1',
            refuseShow:false,
            agreeShow:false,
            checked:false,
            commentList:[],
            commentVal:"",
            sessionkey:"",
            processInstanceId:"",
            name:"",
            sheetShow:false
        }
    },
    computed:{
        ...mapState({
            instanceId:state=>{
                return state.user.instanceId
            }
        }),
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        console.log(options);
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.name = options.name;
        this.processInstanceId = options.id;
        this.getQuery();
        this.getCommentQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.instance.get",
                    SessionKey:this.sessionkey,
                    id:this.instanceId,
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getDetailMore(){
            this.sheetShow = true;
        },
        onCloseSheet(){
            this.sheetShow = false;
        },
        // 传阅
        getCirculation(){
            const url = '/pages/todoBusiness/circulate/main?name='+this.name+'&id='+this.processInstanceId;
            wx.navigateTo({url:url});
        },
        // 评论列表
        getCommentQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"object.comments.getlist",
                    SessionKey:this.sessionkey,
                    id:this.instanceId,
                }
            }).then(res=>{
                console.log(res);
               this.commentList = res.listData;
            })
        },
        comment(){
            if(this.commentVal!=''){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:"object.comment.add",
                        SessionKey:this.sessionkey,
                        objectid:this.instanceId,
                        comments:this.commentVal
                    }
                }).then(res=>{
                    console.log(res);
                    this.commentVal = "";
                    this.getCommentQuery();
    
                })
            }
        },
        changeTabs(e){
            this.current = e.mp.detail.key;
        },
        // 拒绝
        getRefuse(){
            this.refuseShow = true;
        },
        onCloseRefuse(){
            this.refuseShow = false;
        },
        getAgree(){
            // console.log(this.$refs.child.$emit);
            // this.$refs.child.$emit('childMethod','hello');
            this.agreeShow = true;
        },
        onCloseAgree(){
            this.agreeShow = false;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    @import '../../../../static/css/schedule.css';
    .wrap{
        .rowWrap{
            background: #fff;
            font-size: 28rpx;
            color: #666666;
            display: flex;
            justify-content: space-between;
        }
        .center{
            background: #fff;
            .steps:last-child .step .pactive{
                width: 0;
                height: 0;
                border: none;
            }
            .steps{
                display: flex;
                .step{
                    p:nth-child(1){
                        width: 60rpx;
                        height: 60rpx;
                        line-height: 60rpx;
                        font-size: 10px;
                    }
                    .pactive{
                        width: 10px;
                        height: 50rpx;
                        border-right:1px dashed #cccccc ;
                        margin-left: 8rpx;
                    }
                    .admin{
                        background: #e4f5ff;
                        padding: 5rpx;
                        color: #3399ff;
                        font-size: 8px;
                    }
                }
                .center{
                    flex: 1;
                    font-size: 12px;
                    line-height: 60rpx;
                    color: #666666;
                    margin-left: 10px;
                    p{
                        span{
                            color: #d49746;
                        }
                    }
                }
                .time{
                    font-size: 12px;
                    line-height: 60rpx;
                    color: #666666;
                }
            }
        }
        .comment{
            width: 100%;
            .cont:last-child .rBox{
                border: none;
            }
            .cont{
                background: #fff;
                display: flex;
                padding: 20rpx 30rpx 20rpx 0;
                .lBox{
                    width: 50px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .radius{
                        width: 60rpx;
                        height: 60rpx;
                        line-height: 60rpx;
                        font-size: 10px;
                    }
                }
                .rBox{
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 20rpx;
                    border-bottom: 1rpx solid #f6f6f6;
                    .text{
                        p:nth-child(1){
                            font-size: 12px;
                            color: #bbbbbb;
                            padding: 10rpx 0;
                        }
                         p:nth-child(2){
                            font-size: 15px;
                            color: #333333;
                        }
                    }
                    .time{
                        color: #bbbbbb;
                        font-size: 12px;
                    }
                }
            }
            .fixed{
                width: 100%;
                position: fixed;
                bottom: 20px;
                background: #fff;
                // padding: 20rpx;
                .box{
                    display: flex;
                    justify-content: space-between;
                    padding: 20rpx;
                    p:nth-child(1){
                        width: 60%;
                        .inp{
                            background: #eceeed;
                            border-radius: 10rpx;
                            height: 35px;
                            padding-left: 10rpx;
                        }
                    }
                    p:nth-child(3){
                        span{
                            display: inline-block;
                            width: 130rpx;
                            height: 35px;
                            line-height: 35px;
                            text-align: center;
                            color: #ffffff;
                            background: #3399ff;
                            border-radius: 10rpx;
                            font-size: 28rpx;
                            opacity: .5;
                        }
                        span.active{
                            opacity: 1;
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
            .bottoms{
                display: flex;
                padding: 10rpx 30rpx;
                justify-content: center;
                align-items: center;
                .icon{
                    width: 50%;
                    display: flex;
                    justify-content: space-around;
                    div{
                        // margin-right: 30px;
                        p{
                            font-size: 12px;
                            display: flex;
                            justify-content: center;
                            .iconfont{
                                font-size: 20px;
                                color: #646464;
                            }
                        }
                    }
                }
                .btn{
                    width: 50%;
                    display: flex;
                    p{
                        width: 80px;
                        height: 35px;
                        line-height: 35px;
                        text-align: center;
                        background: #3399ff;
                        font-size: 28rpx;
                        color: #fff;
                    }
                    p:nth-child(1){
                        color: #3399ff;
                        background: #fff;
                        border:1rpx solid #cccccc;
                        border-right: none;
                    }
                }
            }
        }
        .popup{
            padding-bottom: 10px;
            h3{
                font-size: 30rpx;
                color: #3399ff;
                border-bottom: 2rpx solid #3399ff;
                text-align: center;
                padding: 20rpx 0;
            }
            .text{
                .textarea{
                    background: #e4e4e4;
                    height: 80px;
                    padding: 10px;
                    border-radius: 10rpx;
                    width: 85%;
                    margin: 20px auto;
                }
            }
            p{
                width: 90%;
                height: 40px;
                line-height: 40px;
                font-size: 28rpx;
                border-radius: 10rpx;
                margin: 0 auto;
                background: #fff;
                color: #3399ff;
                text-align: center;
                border:1rpx solid #cccccc;

            }
            .back{
                color: #fff;
                background: #3399ff;
                border: none;
                margin: 10px auto;
            }
        }
        .agreeWrap{
            position: relative;
            background: #f2f2f2;
            .header{
                display: flex;
                padding: 30rpx;
                border-bottom: 1rpx solid #e2e4e3;
                width: 100%;
                background: #fff;
                // position: fixed;
                div:nth-child(2){
                    margin-left: 20rpx;
                    h3{
                        font-size: 28rpx;
                        font-weight:bold;
                    }
                    p{
                        font-size: 12px;
                        color: #333333;
                        margin-top: 10rpx;
                        span{
                            color: #666666;
                        }
                    }
                }
            }
            .cont{
                width: 100%;
                // position: absolute;
                // top: 70px;
                height: 400px;
                overflow: scroll;
                padding-bottom: 50px;
                h3{
                    background: #f2f2f2;
                    font-size: 12px;
                    color: #999999;
                    padding: 20rpx;
                }
                .box{
                    padding: 20rpx;
                    background: #fff;
                    .row{
                        padding: 20rpx 0;
                        font-size: 28rpx;
                        border-bottom: 1rpx solid #e2e4e3;
                        color: #333333;
                        display: flex;
                        justify-content: space-between;
                    }
                    .rows{
                        padding: 10rpx 0 0 0;
                        font-size: 28rpx;
                        color: #333333;
                        display: flex;
                        justify-content: center;
                        .add{
                            // text-align: center;
                            color: #3399ff;
                            span{
                                margin-top: 10rpx;
                                display: inline-block;
                            }
                        }
                    }
                }
                .popupRow{
                    .row{
                        padding: 20rpx;
                        color: #999999;
                        font-size: 12px;
                        background: #f2f2f2;
                        display: flex;
                        justify-content: space-between;
                        p:nth-child(2){
                            span:nth-child(1){
                                display: inline-block;
                                background: #3399ff;
                                border-top-left-radius: 10rpx;
                                border-bottom-left-radius: 10rpx;
                                padding: 10rpx 20rpx;
                                color: #fff;
                            }
                            span:nth-child(2){
                                display: inline-block;
                                background: #fff;
                                border-top-right-radius: 10rpx;
                                border-bottom-right-radius: 10rpx;
                                padding: 10rpx 20rpx;
                                color: #3399ff;
                                border: 1rpx solid #3399ff;
                                box-sizing: border-box;
                                border-left: none;
                            }
                        }
                    }
                    .text{
                        padding: 20rpx;
                        background: #fff;
                        font-size: 12px;
                        color: #333333;
                    }
                }
                .textarea{
                    padding: 20rpx;
                    background: #fff;
                    margin-top: 20rpx ;
                    p{
                        font-size: 28rpx;
                        font-weight: bold;
                    }
                    textarea{
                        height: 80px;
                    }
                }
            }
            .fot{
                width: 100%;
                position: fixed;
                bottom: 0;
                background: #fff;
                .box{
                    display:flex;
                    justify-content: center;
                    p{
                        width: 33.3%;
                        text-align: center;
                        color: #3399ff;
                        padding: 20rpx;
                        border-right: 1rpx solid #f2f2f2;
                    }
                }

            }
        }
        .sheetWrap{
            width: 100%;
            .title{
                text-align: center;
                font-size: 22rpx;
                color: #999999;
                padding: 13rpx 0;
            }
            .row{
                text-align: center;
                padding: 26rpx 0;
                font-size: 33rpx;
                color: #3399ff;
                border-top: 1rpx solid #eceeed
            }
        }
    }
</style>