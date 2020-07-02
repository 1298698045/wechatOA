<template>
    <div class="wrap">
        <i-tabs :current="current" @change="handleChange">
            <i-tab key="tab1" title="会议"></i-tab>
            <i-tab key="tab2" title="任务"></i-tab>
            <i-tab key="tab3" title="纪要"></i-tab>
            <i-tab key="tab4" title="议题"></i-tab>
        </i-tabs>
        <div v-if="current=='tab1'&&!isShow">
            <div class="container">
                <div class="header">
                    <div class="row">
                        <div class="l">
                            <p></p>
                        </div>
                        <div class="r">
                            <p>{{detailInfo.name}}</p>
                            <p>我的会议</p>
                        </div>
                    </div>
                    <div class="rowTime">
                        <div class="lMin">
                            <p>{{startMonth}}月{{startDate}}日</p>
                            <p>{{startDay}}</p>
                        </div>
                        <div class="num">
                            <span></span><p>{{mathNum}}天</p><span></span>
                        </div>
                        <div class="lMin">
                            <p>{{endMonth}}月{{endDate}}日</p>
                            <p>{{endDay}}</p>
                        </div>
                    </div>
                    <!-- <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-zhongfu1"></i>
                        </div>
                        <div class="r">
                            <p>每周重复</p>
                        </div>
                    </div> -->
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-type"></i>
                        </div>
                        <div class="r">
                            <p>日历：工作</p>
                        </div>
                    </div>
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-gongzuozhuangtai"></i>
                        </div>
                        <div class="r">
                            <p>显示为：正忙</p>
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
                <div class="header">
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-shiliangzhinengduixiang"></i>
                        </div>
                        <div class="r" style="border:none;">
                            <p>{{detailInfo.location}}</p>
                        </div>
                    </div>
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-huiyishi"></i>
                        </div>
                        <div class="r">
                            <p>会议室：2号楼国际交流中心</p>
                        </div>
                    </div>
                </div>
                <div class="describe">
                    <div class="rows">
                        <div class="l">
                            <i class="iconfont icon-beizhu"></i>
                        </div>
                        <div class="r">
                            <p>{{detailInfo.meetingContent}}</p>
                        </div>
                    </div>
                </div>
                <div class="moveRow"  @click="getSignDetail">
                    <p>
                        <i class="iconfont icon-qiandao2"></i>
                    </p>
                    <p>
                        1人已签到
                    </p>
                    <p>
                        <i-icon type="enter" color="#999999" size="20" />
                    </p>
                </div>
                <div class="moveCont">
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
                    <div class="moveRow" @click="getInvitation">
                        <p>
                            <i class="iconfont icon-zuzhiren"></i>
                        </p>
                        <p style="border:none;">
                            邀请10人，1人接受
                        </p>
                        <p>
                            <i-icon type="enter" color="#999999" size="20" />
                        </p>
                    </div>
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
                    <!-- <div class="comment">
                        <div class="lBox">
                            <p>卫辉</p>
                        </div>
                        <div class="rBox">
                            <p class="info">卫辉 <span>信息中心</span><span>05月25日 11:23</span></p>
                            <div class="imgBox">
                                <p></p>
                            </div>
                        </div>
                    </div> -->
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
                    <div class="lBox">
                        <div class="box" @click="getComment">
                            <p>
                                <i class="iconfont icon-pinglun1"></i>
                            </p>
                            <p>评论</p>
                        </div>
                        <div class="box" @click="getSignIn">
                            <p>
                                <i class="iconfont icon-qiandao2"></i>
                            </p>
                            <p>签到</p>
                        </div>
                        <div class="box" @click="getMove">
                            <p>
                                <i class="iconfont icon-gengduo"></i>
                            </p>
                            <p>更多</p>
                        </div>
                    </div>
                    <div class="rBox">
                        <p>
                            <span @click="getRefuse(2)">拒绝</span>
                            <span @click="getRefuse(1)">已接受</span>
                        </p>
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
            <van-action-sheet :show="reasonShow" @close="getCancel" z-index="999" :round="false">
                <div class="sheetWrap">
                    <div class="title">
                        <p class="color" @click="getCancel">取消</p>
                        <p>拒绝理由</p>
                        <p class="color" @click="getSubmit">确认</p>
                    </div>
                    <van-radio-group :value="radio" @change="onChange">
                        <van-cell-group>
                            <van-cell :title="item.name" v-for="(item,index) in list" :key="index" clickable :data-name="item.name" @click="onClick">
                                <van-radio slot="right-icon" :name="item.name" />
                            </van-cell>
                            <!-- <van-cell title="单选框 2" clickable data-name="2" @click="onClick">
                            <van-radio slot="right-icon" name="2" />
                            </van-cell> -->
                        </van-cell-group>
                    </van-radio-group>
                </div>
            </van-action-sheet>
        </div>
        <Summarys v-if="current=='tab3'" :detailInfo="detailInfo" :current="current" :name="detailInfo.name" :Meetingid="detailInfo.valueId" ref="child" />
        <Topics v-if="current=='tab4'" :current="current" :name="detailInfo.name" :Meetingid="detailInfo.valueId" ref="child"  />
        <mapList @childFn="getChildFn" @cancel="getCancelChild" v-if="isShow" />
    </div>
</template>
<script>
import Summarys from '@/components/summary/summarys';
import Topics from "@/components/summary/topics";
import mapList from '@/components/mapList';
export default {
    components:{
        Summarys,
        mapList,
        Topics
    },
    data(){
        return {
            current:"tab1",
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
            commentList:[
                {
                    CreatedByName:"张三",
                    CreatedOn:"2020-06-04 09:09",
                    Comment:'评论'
                }
            ],
            id:"f491d01b-f5bd-4de5-816e-d23b963a7384",
            detailInfo:{},
            status:'',
            reasonShow:false,
            radio:'',
            descripiton:"",
            list:[
                {
                    name:"请假中"
                },
                {
                    name:"生病中"
                },
                {
                    name:"出差中"
                },
                {
                    name:"会议中"
                },
                {
                    name:"外出中"
                },
                {
                    name:"休息中"
                },
                {
                    name:"其他"
                }
            ],
            startMonth:"",
            startDate:"",
            startDay:"",
            endMonth:"",
            endDate:"",
            endDay:"",
            mathNum:"",
            isShow:false,
            address:"",
            latitude:"",
            longitude:"",
            location:""
        }
    },
    computed:{
        contentSize(){
            return this.comment.length || 0;
        },
    },
    onLoad(options){
        this.id = options.id;
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.height = wx.getSystemInfoSync().windowHeight;
        this.getQueryDetail();
        this.getCommentQuery();
        this.getFileQuery();
    },
    methods:{
        getChildFn(val,isBook){
            console.log(val,isBook);
            this.isShow = isBook;
        },
        getCancelChild(val){
            this.isShow = val;
        },
        // 获取附件
        getFileQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.summary.get",
                    SessionKey:this.sessionkey,
                    Meetingid:this.id
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getQueryDetail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.info.get",
                    SessionKey:this.sessionkey,
                    id:this.id,
                    ObjTypeCode:5000
                }
            }).then(res=>{
                console.log(res);
                this.detailInfo = res.data;
                let scheduledStart = this.detailInfo.scheduledStart;
                let scheduledEnd = this.detailInfo.scheduledEnd;
                let date = new Date(scheduledStart);
                let endDate = new Date(scheduledEnd);
                this.startMonth = date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1;
                this.startDate = date.getDate()<10?'0'+date.getDate():date.getDate();
                this.endMonth =  endDate.getMonth()+1<10?'0'+(endDate.getMonth()+1):endDate.getMonth()+1;
                this.endDate = endDate.getDate()<10?'0'+endDate.getDate():endDate.getDate();            
                this.startDay = this.getWeekDay(date);
                this.endDay = this.getWeekDay(endDate);
                this.mathNum = this.intervalTime(date,endDate);
            })
        },
        getWeekDay(date){
            let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
            let day = week[date.getDay()];
            return day;
        },
        intervalTime(date,endDate){
            let startTime = new Date(date).getTime();
            let endTime = new Date(endDate).getTime();
            let date3 = endTime - startTime;
            //计算出相差天数
            let days = Math.floor(date3 / (24 * 3600 * 1000));
            return days;
            //计算出小时数

            var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000));
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));

            //计算相差秒数

            var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);
        },
        getCommentQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"object.comments.getlist",
                    SessionKey:this.sessionkey,
                    id:this.id,
                    ObjTypeCode:5000
                }
            }).then(res=>{
                console.log(res);
                this.commentList =  res.listData;
            })
        },
        onChange(e){
            console.log(e);
        },
        onClick(e) {
            console.log(e)
            this.radio = e.mp.currentTarget.dataset.name;
            this.descripiton = this.radio;
        },
        getCancel(){
            this.radio = '';
            this.reasonShow = false;
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab3'){
                
            }
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
                const url = '/pages/schedule/newSchedule/main?MeetingId='+this.id;
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
                    SessionKey:this.sessionkey,
                    objectid:this.id,
                    objTypeCode:5000,
                    comments:this.comment
                }
            }).then(res=>{
                console.log(res);
                this.comment = '';
                this.getCommentQuery();
            })
        },
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.info.delete",
                    SessionKey:this.sessionkey,
                    ObjTypeCode:20015,
                    Id:this.id
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:"success",
                    duration:2000
                })
            })
        },
        getSignIn(){
            var that = this
            wx.chooseLocation({
                success: function (res) {
                    console.log(res);
                    // success
                    if (res.name == '') {
                    } else {
                        that.location = res.name;
                        that.latitude = res.latitude;
                        that.longitude = res.longitude;
                        that.address = res.address;
                        that.$httpWX.get({
                            url:that.$api.message.queryList,
                            data:{
                                method:"meeting.audience.checkin",
                                SessionKey:that.sessionkey,
                                id:that.id,
                                location:that.address,
                                latitude:that.latitude,
                                longitude:that.longitude
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
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            })
            // this.isShow = true;
            // const url = '/pages/meeting/signin/main';
            // wx.navigateTo({url:url});
        },
        // 签到详情
        getSignDetail(){
            const url = '/pages/meeting/signinDetail/main';
            wx.navigateTo({url:url});
        },
        getInvitation(){
            const url = '/pages/meeting/joinDetail/main?id='+this.id;
            wx.navigateTo({url:url});
        },
        // 拒绝
        getRefuse(status){
            this.status = status;
            if(status==2){
                this.reasonShow = true;
            }else {
                this.getSubmit();
            }
            
        },
        getSubmit(){
            var descripiton = '';
            if(this.status==2){
                descripiton = this.descripiton;
            }else {
                descripiton = '';
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.people.status",
                    SessionKey:this.sessionkey,
                    Id:this.id,
                    descripiton:descripiton,
                    status:this.status
                }
            }).then(res=>{
                console.log(res);
                this.reasonShow = false;
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
@import '../../../../static/css/meeting.css';
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
            .moveCont{
                margin-top: 24rpx;
                background: #fff;
                .moveRow{
                    background: #fff;
                    display: flex;
                    padding: 0 37rpx;
                    align-items: center;
                    margin: 0;
                    p:nth-child(2){
                        padding: 30rpx 0;
                        flex: 1;
                        margin-left: 20rpx;
                        border-bottom: 2rpx solid #e3e3e3;
                    }
                    .move{
                        color: #999999;
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
        .sheetWrap{
            .title{
                display: flex;
                padding: 26rpx 33rpx;
                p:nth-child(2){
                    flex: 1;
                    text-align: center;
                    font-size: 36rpx;
                    color: #333333;
                    font-weight: bold;
                }
                .color{
                    font-size: 33rpx;
                    color: #3399ff;
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
                // justify-content: space-around;
                padding: 20rpx 0;
                .lBox{
                    width: 50%;
                    display: flex;
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
                .rBox{
                    width: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    p{
                        span{
                            display: inline-block;
                            width: 164rpx;
                            height: 59rpx;
                            line-height: 59rpx;
                            text-align: center;
                            background: #fff;
                            color: #3399ff;
                            font-size: 32rpx;
                            border: 1rpx solid #bfc1c2;
                        }
                        span:nth-child(1){
                            border-right: none;
                            border-top-left-radius: 7rpx;
                            border-bottom-left-radius: 7rpx;
                        }
                        span:nth-child(2){
                            border-left: none;
                            border-top-right-radius: 7rpx;
                            border-bottom-right-radius: 7rpx;
                            background:rgba(51, 153, 255, .5);
                            color: #fff;
                            
                        }
                    }
                }
            }
        }
    }
</style>