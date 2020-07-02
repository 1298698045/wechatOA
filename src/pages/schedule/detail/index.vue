<template>
    <div class="wrap">
        <div class="container">
            <div class="header">
                <div class="row">
                    <div class="l">
                        <p></p>
                    </div>
                    <div class="r">
                        <p>{{detail.Subject}}</p>
                        <p>我的日程</p>
                    </div>
                </div>
                <div class="rowTime">
                    <div class="lMin">
                        <p>05月25日</p>
                        <p>周一</p>
                    </div>
                    <div class="num">
                        <span></span><p>1天</p><span></span>
                    </div>
                    <div class="lMin">
                        <p>05月26日</p>
                        <p>周二</p>
                    </div>
                </div>
                <div class="rows">
                    <div class="l">
                        <i class="iconfont icon-zhongfu1"></i>
                    </div>
                    <div class="r">
                        <p>每周重复</p>
                    </div>
                </div>
                <div class="rows">
                    <div class="l">
                        <i class="iconfont icon-type"></i>
                    </div>
                    <div class="r">
                        <p>日历：{{detail.calendarType}}</p>
                    </div>
                </div>
                <div class="rows">
                    <div class="l">
                        <i class="iconfont icon-gongzuozhuangtai"></i>
                    </div>
                    <div class="r">
                        <p>显示为：{{detail.displayStatus}}</p>
                    </div>
                </div>
                <div class="rows">
                    <div class="l">
                        <i class="iconfont icon-shanguangdeng"></i>
                    </div>
                    <div class="r">
                        <p>15分钟前，应用内提醒</p>
                    </div>
                </div>
            </div>
            <div class="describe">
                <div class="rows">
                    <div class="l">
                        <i class="iconfont icon-beizhu"></i>
                    </div>
                    <div class="r">
                        <p>绍兴第二医院布置职工创新奖真实性及两个效益审核环节工作</p>
                    </div>
                </div>
            </div>
            <div class="moveRow">
                <p>
                    <i class="iconfont icon-zuzhiren"></i>
                </p>
                <p>
                    <input type="text" placeholder="邀请参与人">
                </p>
                <p>
                    <i-icon type="enter" color="#999999" size="20" />
                </p>
            </div>
            <div class="moveRow">
                <p>
                    <i class="iconfont icon-fujian"></i>
                </p>
                <p>
                    附件
                </p>
                <p>
                    <i class="iconfont icon-add"></i>
                </p>
            </div>
            <div class="moveRow">
                <p>
                    <i-icon type="enter" color="#fff" size="20" />
                </p>
                <p class="move">
                    更多
                </p>
            </div>
            <h3>回复 2</h3>
            <div class="commentWrap">
                <div class="comment">
                    <div class="lBox">
                        <p>卫辉</p>
                    </div>
                    <div class="rBox">
                        <p class="info">卫辉 <span>信息中心</span><span>05月25日 11:23</span></p>
                        <div class="imgBox">
                            <p></p>
                        </div>
                        <!-- <p class="text"></p> -->
                    </div>
                </div>
                <div class="comment items" v-for="(item,index) in commentList" :key="index">
                    <div class="lBox">
                        <p>{{item.CreatedByName}}</p>
                    </div>
                    <div class="rBox">
                        <p class="info">{{item.CreatedByName}} <span>信息中心</span><span>{{item.CreatedOn}}</span></p>
                        <p class="text">{{item.Comment}}</p>
                    </div>
                </div>
                <div class="comment">
                    <div class="lBox">
                        <i class="iconfont icon-tixing1"></i>
                    </div>
                    <div class="rBox items">
                        <p class="info"><span>崔曼 创建了 日程</span><span>05月25日 11:23</span></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="inpWrap" :style="{'height':height+'px'}" catchtouchmove="true" v-if="overlayShow==true">
            <div class="top" @click="getCloseOver">

            </div>
            <div class="bottom">
                <div class="box">
                    <textarea class="textarea" v-model="comment" @blur="getBlur" :show-confirm-bar="false" cursor-spacing='140' placeholder="我来说两句..." :auto-focus="true" name="" id="" maxlength="500" cols="30" rows="10"></textarea>
                    <div class="total">
                        <p>
                            {{contentSize}}/{{total}}
                        </p>
                        <p @click="getSendout" :class="{active:comment!=''}">
                            发送
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" v-if="!overlayShow">
            <div class="boxWrap">
                <div class="box" @click="getComment">
                    <p>
                        <i class="iconfont icon-pinglun1"></i>
                    </p>
                    <p>评论</p>
                </div>
                <div class="box">
                    <p>
                        <i class="iconfont icon-bianzu"></i>
                    </p>
                    <p>发送</p>
                </div>
                <div class="box" @click="getMove">
                    <p>
                        <i class="iconfont icon-elipples"></i>
                    </p>
                    <p>更多</p>
                </div>
            </div>
        </div>
        <van-action-sheet
            :show="show"
            :round="false"
            :actions="actions"
            cancel-text="取消"
            @cancel="onClose"
            @close="onClose"
            @select="onSelect"
            z-index="99999"
        />
    </div>
</template>
<script>
export default {
    data(){
        return {
            overlayShow:false,
            height:"",
            comment:"",
            total:500,
            actions: [
                {
                    name: '添加参与人',
                },
                {
                    name: '修改',
                },
                {
                    name: '删除'
                }
            ],
            show:false,
            id:"",
            sessionkey:"",
            detail:{},
            commentList:[]
        }
    },
    computed:{
        contentSize(){
            return this.comment.length || 0;
        },
    },
    onLoad(options){
        this.id = options.id;
        let sessionKey = wx.getStorageSync('sessionkey');
        this.sessionKey = sessionKey;
        this.height = wx.getSystemInfoSync().windowHeight;
        this.getQuery();
        this.getCommentQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"activity.event.get",
                    SessionKey:this.sessionKey,
                    id:this.id
                }
            }).then(res=>{
                console.log(res);
                this.detail = res.data;
            })
        },
        getCommentQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"object.comments.getlist",
                    SessionKey:this.sessionKey,
                    id:this.id
                }
            }).then(res=>{
                console.log(res);
                this.commentList = res.listData;
            })
        },
        getComment(){
            this.overlayShow = true;
        },
        getCloseOver(){
            this.overlayShow = false;
        },
        getBlur(){
            this.overlayShow = false;
            // this.height = '20';
        },
        getMove(){
            this.show = true;
        },
        onClose(){
            this.show = false;
        },
        onSelect(e){
            let name = e.mp.detail.name;
            if(name=='修改'){
                const url = '/pages/schedule/newSchedule/main?id='+this.id;
                wx.navigateTo({url:url});
            }else if(name=='删除'){
                this.getDelete();
            }
        },
        getSendout(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"object.comment.add",
                    SessionKey:this.sessionKey,
                    objectid:this.id,
                    objTypeCode:4200,
                    comments:this.comment
                }
            }).then(res=>{
                console.log(res);
                this.getCommentQuery();
            })
        },
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"activity.event.delete",
                    SessionKey:this.sessionKey,
                    id:this.id
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:"success",
                    duration:2000
                })
            })
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/schedule.css';
    .wrap{
        .container{
            padding-bottom: 80px;
            .header{
                margin-top: 24rpx;
                background: #fff;
                .row{
                    display: flex;
                    padding: 0 37rpx;
                    .l{
                        padding: 20rpx 0;
                        p{
                            width: 23rpx;
                            height: 23rpx;
                            border-radius: 50%;
                            background: #52b55e;
                            margin-top: 10rpx;
                        }
                    }
                    .r{
                        width: 100%;
                        padding: 20rpx 0;
                        margin-left: 20rpx;
                        border-bottom: 2rpx solid #e3e3e3;
                        p:nth-child(1){
                            font-size: 33rpx;
                            color: #333333;
                            line-height: 1.5;
                        }
                        p:nth-child(2){
                            font-size: 26rpx;
                            color: #7b8187;
                        }
                    }
                }
                .rowTime{
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 20rpx 0;
                    .lMin{
                        width: 35%;
                        p:nth-child(1){
                            font-size: 40rpx;
                            font-weight: bold;
                            text-align: center;
                        }
                        p:nth-child(2){
                            text-align: center;
                            font-size: 24rpx;
                            color: #333333;
                        }
                    }
                    .num{
                        display: flex;
                        align-items: center;
                        span{
                            display: inline-block;
                            width: 20rpx;
                            height: 2rpx;
                            background: #e2e4e3;
                        }
                        p{
                            font-size: 24rpx;
                            width: 82rpx;
                            height: 48rpx;
                            text-align: center;
                            line-height: 48rpx;
                            color: #999999;
                            background: #eef0f2;
                            border-radius: 26rpx;
                        }
                    }
                }
                .rows{
                    display: flex;
                    align-items: center;
                    padding: 0 37rpx;
                    .l{
                        i{
                            color: #343434;
                        }
                    }
                    .r{
                        padding: 30rpx 0;
                        border-top: 2rpx solid #e3e3e3;
                        flex: 1;
                        margin-left: 20rpx;
                        font-size: 34rpx;
                        color: #333333;
                    }                
                }
            }
            .describe{
                margin-top: 24rpx;
                background: #fff;
                .rows{
                    display: flex;
                    padding: 0 37rpx;
                    .l{
                        padding: 30rpx 0;
                        i{
                            color: #000000;
                        }
                    }
                    .r{
                        padding: 30rpx 0;
                        flex: 1;
                        margin-left: 20rpx;
                        font-size: 34rpx;
                        color: #333333;
                    }
                }
            }
            .moveRow{
                margin-top: 24rpx;
                background: #fff;
                display: flex;
                padding: 30rpx 37rpx;
                align-items: center;
                p:nth-child(2){
                    flex: 1;
                    margin-left: 20rpx;
                }
                .move{
                    color: #999999;
                }
            }
            h3{
                background: #f7f7f7;
                color: #999999;
                font-size: 28rpx;
                padding: 31rpx 47rpx;
            }
            .commentWrap{
                background: #fff;
                .items{
                    align-items: center;
                }
                .comment:last-child .rBox{
                    border-bottom: none;
                }
                .comment{
                    display: flex;
                    padding: 0 32rpx;
                    .lBox{
                        padding: 20rpx 0;
                        width:60rpx;
                        p{
                            width: 60rpx;
                            height: 60rpx;
                            line-height: 60rpx;
                            text-align: center;
                            border-radius: 50%;
                            background: #3399ff;
                            color: #fff;
                            font-size: 20rpx;
                        }
                    }
                    .rBox{
                        flex: 1;
                        margin-left: 20rpx;
                        padding: 20rpx 0;
                        border-bottom: 2rpx solid #e3e3e3;
                        .imgBox{
                            display: flex;
                            margin-top: 10rpx;
                            p{
                                width: 200rpx;
                                height: 200rpx;
                                background: #e5e5e5;
                                border-radius: 9rpx;
                            }
                        }
                        .info{
                            font-size: 28rpx;
                            color: #3399ff;
                            overflow: hidden;
                            span:nth-child(1){
                                color: #666666;
                            }
                            span:nth-child(2){
                                color: #666666;
                                float: right;
                            }
                        }
                        .text{
                            font-size: 34rpx;
                            color: #333333;
                        }
                    }
                }
            }
        }
        .inpWrap{
            width: 100%;
            position: fixed;
            bottom: 100px;
            z-index: 999;
            .top{
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 1);
                opacity: .5;
            }
            .bottom{
                width: 100%;
                height: auto;
                position: fixed;
                bottom: 0;
                background: #fff;
                z-index: 9999;
                .box{
                    padding: 33rpx 33rpx 0 33rpx;
                    .textarea{
                        width: 100%;
                        height: 188rpx;
                        background: #fff;
                        color: #333333;
                        font-size: 28rpx;
                        border-bottom: 2rpx solid #eaebeb;
                    }
                    .total{
                        display: flex;
                        justify-content: space-between;
                        padding: 33rpx 0;
                        p:nth-child(1){
                            color: #999999;
                            font-size: 28rpx;
                        }
                        p:nth-child(2){
                            color: #999999;
                            font-size: 33rpx;
                        }
                        p:nth-child(2).active{
                            color: #3399ff;
                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            z-index: 999;
            .boxWrap{
                display: flex;
                justify-content: space-around;
                padding: 20rpx 0;
                .box{
                    width: 33%;
                    text-align: center;
                    p:nth-child(1){
                        i{
                            color: #3399ff;
                        }
                    }
                    p:nth-child(2){
                        color: #3399ff;
                        font-size: 21rpx;
                        margin-top: 10rpx;
                    }
                }
            }
        }
    }
</style>