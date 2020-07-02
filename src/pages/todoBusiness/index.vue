<template>
    <div class="wrap">
        <div class="header" :class="{'active':isBlock||screenShow}">
            <i-tabs :current="current" @change="handleChange">
                <i-tab key="tab1" title="我发起"></i-tab>
                <i-tab key="tab2" title="待审批"></i-tab>
                <i-tab key="tab3" title="已审批"></i-tab>
                <i-tab key="tab4" title="传阅"></i-tab>
            </i-tabs>
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
            <div class="navs" v-if="isBlock">
                <p>
                    <van-search background="#f4f4f4" :value="searchValue" @change="changeSearch" placeholder="请输入搜索关键词" />
                </p>
                <p @click="getCancelBlock">取消</p>
            </div>
            <!-- <div class="history" v-if="isBlock">
                <div class="text">
                    <p>搜索历史</p>
                    <p><i-icon type="close" size="20" color="#999999" /></p>
                </div>
                <div class="rowWrap">
                    <p>崔曼</p>
                    <p>补卡申请</p>
                </div>
            </div> -->
        </div>
        <div class="container" :class="isBlock?'mar':''" v-if="!screenShow">
            <div class="radio" v-if="current=='tab4'&&!isBatch">
                <div class="row">
                    <p>
                        <van-checkbox :value="checked" @change="changeRadio">只看未读  3</van-checkbox>
                    </p>
                    <p @click="getBatchOperation">批量操作</p>
                </div>
            </div>
            <div class="center padding"  v-for="(item,index) in list" :key="index">
                <van-checkbox-group :value="result" @change="onChangeCheck">
                    <div class="boxWrap">
                        <van-checkbox v-if="current=='tab4'&&isBatch" :name="item.instanceId" custom-class="check"></van-checkbox>
                        <div>
                            <p class="radius">{{item.createdByName}}</p>
                        </div>
                        <div class="cont" @click="getDetail(item)">
                            <h3>{{item.createdByName}}提交的流程申请表</h3>
                            <p class="title">标题：<span>{{item.name}}</span></p>
                            <p class="title">级别：<span>{{item.priority==0?'普通':item.priority==1?'紧急':'非常紧急'}}</span></p>
                            <p class="time">{{item.createdOn}} · 来自{{item.createdByName}} {{item.businessUnitIdName}}</p>
                        </div>
                        <div class="more">
                            <p><i-icon type="more" size="20" color="#a4a4a4" @click="getMore(item)" v-if="current!='tab4'" /></p>
                            <p v-if="item.StateCode" class="sp" :class="item.StateCode==0?'blue':item.StateCode==3?'success':item.StateCode==5?'error':''">{{item.StateCode==0?'草稿':item.StateCode==1?'审批中':item.StateCode==3?'已完成':'已拒绝'}}</p>
                        </div>
                    </div>
                </van-checkbox-group>
            </div>
        </div>
        <!-- 筛选 -->
        <div class="screenWrap" v-if="screenShow">
             <!-- <div class="navs">
                <p>
                    <van-search background="#f4f4f4" :value="searchValue" placeholder="请输入搜索关键词" />
                </p>
                <p @click="getCancelScreen">取消</p>
            </div> -->
            <div class="contWrap">
                <van-collapse :value="activeStatus" @change="changeCollapseStatus">
                    <van-collapse-item :name="item.Id" v-for="(item,index) in statusList" :key="index">
                        <view slot="title" class="title">{{item.Name}}</view>
                        <div class="rowBox">
                            <p :class="{'active':statusNum==i}" v-for="(v,i) in item.Items" :key="i" @click="getOptionsStatus(v,i)">{{v.Name}}</p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </div>
            <div class="contWrap">
                <van-collapse :value="activeNames" @change="changeCollapse">
                    <van-collapse-item :name="item.Id" v-for="(item,index) in optionList" :key="index">
                        <view slot="title" class="title">{{item.Name}}</view>
                        <div class="rowBox">
                            <p :class="{'active':processId==v.ProcessId}" v-for="(v,i) in item.Items" :key="i" @click="getOptions(item,index,v,i)">{{v.Name}}</p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </div>
            <div class="time">
                <van-field
                    input-class="inp"
                    :value="groupList"
                    :readonly="true"
                    clearable
                    label="部门"
                    icon="arrow"
                    placeholder="请选择"
                    @click="getDeparement"
                />
                <van-field
                    input-class="inp"
                    :value="designee.FullName"
                    :readonly="true"
                    clearable
                    label="发起人"
                    icon="arrow"
                    placeholder="请选择"
                    @click="getLanuchPeople"
                />
            </div>
            <div class="time">
                <picker mode="date" :value="startTime" @change="changeStartTime">
                    <van-field
                        input-class="inp"
                        :value="startTime"
                        :readonly="true"
                        clearable
                        label="开始时间"
                        icon="arrow"
                        placeholder="请选择"
                    />
                </picker>    
                <picker mode="date" :value="startTime" @change="changeEndTime">
                    <van-field
                        input-class="inp"
                        :value="endTime"
                        :readonly="true"
                        clearable
                        label="结束时间"
                        icon="arrow"
                        placeholder="请选择"
                    />
                </picker>  
            </div>
            <div class="bottom">
                <van-button type="primary" color="#3399ff" block @click="getSubSearch">确定</van-button>
            </div>
        </div>
        <!-- <div class="activeCenter" v-if="isBlock">
            <div class="box">
                <van-divider contentPosition="center">在这里可以搜索到</van-divider>
                <div class="iconWrap">
                    <div class="icon">
                        <p>
                            <img src="https://wx.phxinfo.com.cn/img/wechat/Scan.png" alt="">
                        </p>
                        <p>审批标题</p>
                    </div>
                    <div class="icon">
                        <p>
                            <img src="https://wx.phxinfo.com.cn/img/wechat/Scan.png" alt="">
                        </p>
                        <p>审批状态</p>
                    </div>
                    <div class="icon">
                        <p>
                            <img src="https://wx.phxinfo.com.cn/img/wechat/Scan.png" alt="">
                        </p>
                        <p>审批时间</p>
                    </div>
                </div>
            </div>
        </div> -->
        <van-action-sheet
            :show="showMore"
            :actions="actions"
            cancel-text="取消"
            @close="getCloseMore"
            @cancel="getCancel"
            @select="onSelect"
            :round="false"
        />
        <van-dialog
            use-slot
            title="催办"
            :show="cbShow"
            show-cancel-button
            @close="onClose"
            @confirm="getUrgeSubmit"
            >
             <div class="dialog">
                <p>
                    <textarea class="textarea" v-model="message" placeholder="请输入留言" name="" id="" cols="30" rows="10"></textarea>
                </p>
            </div>
        </van-dialog>
        <!-- <div class="footer" v-if="!isBlock&&!screenShow&&!isBatch">
            <div class="row">
                <div>
                    <p>
                        <i class="iconfont icon-huabanbeifenx"></i>
                    </p>
                    <p>待办事务</p>
                </div>
                <div>
                    <p>
                        <i class="iconfont icon-xiaoshuai"></i>
                    </p>
                    <p>流程效率</p>
                </div>
            </div>
        </div> -->
        <div class="footer" v-if="isBatch">
            <div class="rowBox">
                <p class="cancel" @click="getCancelBatch">取消</p>
                <p class="all" @click="getAllCheck" v-if="!isAllSign">全选</p>
                <p class="all" v-else @click="getCancelAll" >取消全选</p>
                <p class="sign" @click="getSign">标为已读</p>
                <p class="del" @click="getBatchDel">删除</p>
            </div>
        </div>
        <van-notify id="van-notify" />
    </div>
</template>
<script>
import { mapState,mapMutations,mapActions,mapGetters } from 'vuex';
import Notify from '../../../static/vant/notify/notify';
export default {
    data(){
        return {
            searchValue:"",
            isBlock:false,
            current: 'tab1',
            showMore:false,
            checked:false,
            cbShow:false,
            screenShow:false,
            actions:[
                {
                    name: '撤回',
                    color:"#3399ff"
                },
                {
                    name: '传阅',
                    color:"#3399ff"
                },
                {
                    name: '催办',
                    color:"#3399ff"
                }
            ],
            activeNames: [],
            num:"",
            optionList:[
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                }
                
            ],
            startTime:"",
            endTime:"",
            list:[],
            message:"",
            processInstanceId:"",
            createdByName:"",
            sessionkey:"",
            isBatch:false,
            result:[],
            isAllSign:false,
            timeSort:['时间排序','优先级排序'],
            timeSortIdx:0,
            id:"",
            readState:-1,
            process:[],
            statusList:[
                {
                    Id:0,
                    Name:"状态",
                    Items:[
                        {
                            Id:0,
                            Name:"草稿"
                        },
                        {
                            Id:1,
                            Name:"流转中"
                        },
                        {
                            Id:2,
                            Name:"挂起"
                        },
                        {
                            Id:3,
                            Name:"已完成"
                        },
                        {
                            Id:4,
                            Name:"已终止"
                        },
                        {
                            Id:5,
                            Name:"退回"
                        },

                    ]
                }
            ],
            activeStatus:[],
            statusNum:-1,
            // stateCode:-1,
            processId:"",
            createdByIds:"",
            linkUrl:"flow.mytasks.getlist"
        }
    },
    onLoad(){
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
        ...mapState({
            designee:state=>{
                return state.mailList.designee;
            },
            groupList:state=>{
                return state.mailList.groupList.map(item=>{
                    return item.name;
                })
            },
            deptIds:state=>{
                return state.mailList.groupList.map(item=>{
                    return item.id;
                })
            },
        }),
        
        sort(){
            let sort = this.timeSortIdx==0?'CreatedOn':'Priority';
            return sort;
        }
    },
    methods:{
        ...mapMutations([
            'clearGroup',
            'clearDesignee'
        ]),
        changeSearch(e){
            this.searchValue = e.mp.detail;
            this.getQuery();
        },
        getDeparement(){
            const url = '/pages/publics/pubGroup/main';
            wx.navigateTo({url:url});
        },
        getLanuchPeople(){
            const url = '/pages/publics/organizer/main';
            wx.navigateTo({url:url});
        },
        bindPickerChange(e){
            this.timeSortIdx = e.mp.detail.value;
            this.getQuery();
        },
        getBatchOperation(){
            this.isBatch = true;
        },
        onChangeCheck(e){
            this.result = e.mp.detail;
        },
        getCancelBatch(){
            this.result = [];
            this.isBatch = false;
        },
        getAllCheck(){
            this.list.forEach(item=>{
                this.result.push(item.instanceId);
            })
            this.isAllSign = true;
        },
        getCancelAll(){
            this.result = [];
            this.getCancelAll = false;
        },
        // 标为已读
        getSign(){
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
                this.isBatch = false;
            })
        },
        getBatchDel(){
            console.log(this.ValueIds);
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
                this.isBatch = false;
            })
        },
        getUrgeSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.instance.pushmessage",
                    SessionKey:this.sessionkey,
                    processInstanceId:this.processInstanceId,
                    Message:this.message
                }
            }).then(res=>{
                Notify({ type: 'primary', message: res.msg });
            })
        },
        getSubSearch(){
            this.screenShow = false;
            this.getQuery();
        },
        // 获取待办事务
        getQuery(){
            // let url = linkUrl; 
            // let url = "";
            // if(linkUrl){
            //     url = linkUrl;
            // }else {
            //     url = "flow.mytasks.getlist"
            // }
            if(this.current=='tab4'){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.linkUrl,
                        SessionKey:this.sessionkey,
                        search:this.searchValue,
                        sort:this.sort,
                        readState:this.readState,
                        stateCode:this.statusNum,
                        processId:this.processId,
                        deptIds:this.deptIds!=''?this.deptIds.join(','):'',
                        createdByIds:this.designee.hasOwnProperty('id')?this.designee.id:'',
                        startTime:this.startTime,
                        endTime:this.endTime
                    }
                }).then(res=>{
                    console.log(res);
                    this.list = res.listData;
                })
            }else {
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.linkUrl,
                        SessionKey:this.sessionkey,
                        search:this.searchValue,
                        sort:this.sort,
                        stateCode:this.statusNum,
                        processId:this.processId,
                        deptIds:this.deptIds!=''?this.deptIds.join(','):'',
                        createdByIds:this.designee.hasOwnProperty('id')?this.designee.id:'',
                        startTime:this.startTime,
                        endTime:this.endTime
                    }
                }).then(res=>{
                    console.log(res);
                    this.list = res.listData;
                })
            }
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            this.searchValue = '';
            this.statusNum = -1;
            this.processId = '';
            this.clearGroup([]);
            this.clearDesignee({});
            this.screenShow = false;
            if(this.current == 'tab1'){
                this.actions = [
                    {
                        name: '撤回',
                        color:"#3399ff"
                    },
                    {
                        name: '传阅',
                        color:"#3399ff"
                    },
                    {
                        name: '催办',
                        color:"#3399ff"
                    }
                ]
                this.linkUrl = 'flow.mytasks.getlist';
            }else if(this.current == 'tab2'){
                this.actions = [
                    {
                        name: '委托',
                        color:"#3399ff"
                    },
                    {
                        name: '传阅',
                        color:"#3399ff"
                    },
                    {
                        name: '加签',
                        color:"#3399ff"
                    }
                ]
                this.linkUrl = 'flow.waitingtasks.getlist';
            }else if(this.current == 'tab3'){
                this.actions = [
                    {
                        name: '传阅',
                        color:"#3399ff"
                    },
                    {
                        name: '加签',
                        color:"#3399ff"
                    }
                ]
                this.linkUrl = 'flow.finishedtasks.getlist';
            }else if(this.current == 'tab4'){
                // let url = 'flow.waitingread.getlist';
                // let url = 'flow.process.read.getlist';
                this.linkUrl = 'flow.readtasks.getlist';
            }
            this.getQuery();
            
        },
        // 搜索
        getSearch(){
            this.isBlock = true;
            this.screenShow = false;
        },
        // 筛选
        getScreen(){
            this.getProcess();
            this.isBlock = false;
            this.screenShow = true;
        },
        // 筛选查询折叠面板列表
        getProcess(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.process.all.list",
                    SessionKey:this.sessionkey,
                    search:''
                }
            }).then(res=>{
                console.log(res);
                this.optionList = res.data;
            })
        },
        getCancelBlock(){
            this.isBlock = false;
        },
        getCancelScreen(){
            this.statusNum = -1;
            this.processId = '';
            this.clearGroup([]);
            this.clearDesignee({});
            this.screenShow = false;
        },
        getMore(item){
            this.id = item.id;
            this.processInstanceId = item.processInstanceId;
            this.createdByName = item.createdByName;
            this.name = item.name;
            this.updateInstanceId(item.processInstanceId);
            this.showMore = true;
        },
        getCancel(){
            this.showMore = false;
        },
        getCloseMore(){
            this.showMore = false;
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
        // 撤回
        getWithdraw(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.instance.cancelsubmit",
                    SessionKey:this.sessionkey,
                    processInstanceId:this.processInstanceId
                }
            }).then(res=>{
                Notify({ type: 'primary', message: res.msg });
                this.getQuery();
            })
        },
        onSelect(e){
            console.log(e);
            let name = e.mp.detail.name;
            if(name=='撤回'){
                let that = this;
                this.showMore = false;
                wx.showModal({
                    title: '提示',
                    content: '你确定要撤回申请吗？',
                    cancelColor:"#3399ff",
                    confirmColor:"#3399ff",
                    success:res=>{
                        if (res.confirm) {
                            that.getWithdraw();
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }else if(name=='传阅'){
                this.showMore = false;
                const url = '/pages/todoBusiness/circulate/main?name='+this.name+'&id='+this.processInstanceId;
                wx.navigateTo({url:url});
            }else if(name=='催办'){
                this.showMore = false;
                this.cbShow = true;
            }else if(name=='委托'){
                this.showMore = false;
                const url = '/pages/todoBusiness/circulate/main?name='+this.name+'&id='+this.id+'&sign='+1;
                wx.navigateTo({url:url});
            }
        },
        onClose(){
            this.cbShow = false;
        },
        changeCollapse(e){
            this.activeNames = e.mp.detail;
        },
        changeCollapseStatus(e){
            this.activeStatus = e.mp.detail;
        },
        getOptions(item,index,v,i){
            this.processId = this.optionList[index].Items[i].ProcessId;
            // this.num = index;
            // this.processId = item.ProcessId;
        },
        getOptionsStatus(item,index){
            this.statusNum = index;
        },
        changeStartTime(e){
            this.startTime = e.mp.detail.value;
        },
        changeEndTime(e){
            this.endTime = e.mp.detail.value;
        },
        ...mapMutations([
            'updateInstanceId'
        ]),
        // 事务详情
        getDetail(item){
            this.updateInstanceId(item.instanceId);
            const url = '/pages/todoBusiness/detail/main?id='+item.processInstanceId+'&name='+item.name;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    @import '../../../static/css/public.scss';
    .wrap{
        .header.active{
            position: relative;
        }
        .header{
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 999;
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
            .navs{
                width: 100%;
                display: flex;
                background: #f4f4f4;
                border-bottom: 1rpx solid #e2e4e3;
                p:nth-child(1){
                    width: 80%;
                }
                p:nth-child(2){
                    width: 20%;
                    text-align: center;
                    font-size: 28rpx;
                    color: #3399ff;
                    text-align: center;
                    margin-top: 30rpx;
                }
            }
            .history{
                width: 100%;
                background: #f4f4f4;
                padding: 30rpx 0;
                .text{
                    padding: 0 30rpx;
                    display: flex;
                    justify-content: space-between;
                    font-size: 28rpx;
                    color: #999999;
                }
                .rowWrap{
                    display: flex;
                    flex-wrap: wrap;
                    padding:0 30rpx;
                    p{
                        background: #fff;
                        border-radius: 20px;
                        padding: 20rpx;
                        font-size: 26rpx;
                        align-items: center;
                        margin-right: 10px;
                        margin-top: 10px;
                    }
                }
            }
        }
        .container.mar{
            margin: 0;
        }
        .container{
            margin-top: 100px;
            padding-bottom: 60px;
            .radio{
                padding: 20rpx 30rpx;
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
            .center{
                background: #fff;
                margin: 10rpx 0;
                .boxWrap{
                    width: 100%;
                    display: flex;
                    .check{
                        padding: 20rpx 20rpx 0 0;
                    }
                    div:nth-child(1){
                        
                    }
                    .cont{
                        flex: 1;
                        margin-left: 20rpx;
                        h3{
                            font-size: 30rpx;
                            font-weight: bold;
                            color: #333333;
                        }
                        .title{
                            font-size: 26rpx;
                            color: #666666;
                            margin: 10rpx 0;
                            span{
                                color: #333333;
                            }
                        }
                        .time{
                            color: #999999;
                            font-size: 12px;
                            margin-top: 20px;
                        }
                    }
                    .more{
                        width: 60px;
                        position: relative;
                        text-align: right;
                        .sp{
                            position: absolute;
                            bottom:0px;
                            padding:0px;
                            margin:0px;
                            right: 0;
                            font-size: 12px;
                            color:#d49746;
                        }
                        .sp.success{
                            color: #39c1b3;
                        }
                        .sp.blue{
                            color: #3399ff;
                        }
                        .sp.error{
                            color: #ff6666;
                        }
                    }
                }
            }
        }
        .activeCenter{
            background: #fff;
            border-top: 1rpx solid #e2e4e3;
            .box{
                padding: 50px;
            }
            .iconWrap{
                display: flex;
                .icon{
                    flex: 1;
                    p:nth-child(1){
                        width: 50rpx;
                        height: 50rpx;
                        margin:0 auto;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align:middle;
                        }
                    }
                    p{
                        font-size: 12px;
                        color:#505050;
                        text-align: center;
                    }
                }
            }
        }
        .screenWrap{
            padding-bottom: 80px;
            .navs{
                width: 100%;
                display: flex;
                background: #f4f4f4;
                border-bottom: 1rpx solid #e2e4e3;
                p:nth-child(1){
                    width: 80%;
                }
                p:nth-child(2){
                    width: 20%;
                    text-align: center;
                    font-size: 28rpx;
                    color: #3399ff;
                    text-align: center;
                    margin-top: 30rpx;
                }
            }
            .contWrap{
                background: #fff;
                .title{
                    font-size: 28rpx;
                    font-weight: bold;
                }
                .rowBox{
                    display: flex;
                    flex-flow: wrap;
                    justify-content: space-between;
                    padding:10rpx 20rpx;
                    p{
                        width: 45%;
                        height: 30px;
                        line-height: 30px;
                        font-size: 14px;
                        background: #f4f4f4;
                        color: #666666;
                        border-radius: 10rpx;
                        padding-left: 10rpx;
                        margin: 10rpx 0;
                    }
                    p.active{
                        background: #dbf5ec;
                        color: #39c1b3;
                    }
                }
            }
            .time{
                margin: 30rpx 0;
                .inp{
                    text-align: right;
                }
            }
            .bottom{
                width: 100%;
                position: fixed;
                bottom: 0;
                z-index: 999;
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            border-top: 1rpx solid #e2e4e3;
            .row{
                display: flex;
                padding: 20rpx 0;
                div{
                    width: 50%;
                    p:nth-child(1){
                        width: 50rpx;
                        height: 50rpx;
                        margin: 0 auto;
                        i{
                            font-size: 20px;
                            color: #3399ff;
                        }
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    p:nth-child(2){
                        font-size: 12px;
                        color: #3399ff;
                        text-align: center;
                    }
                }
            }
            .rowBox{
                display: flex;
                background: #fff;
                padding: 30rpx 0;
                p{
                    flex: 1;
                    text-align: center;
                    font-size: 29rpx;
                }
                .cancel,.all{
                    color: #3399ff;
                }
                .sign{
                    color: #14bc81;
                }
                .del{
                    color: #ff6666;
                }
            }
        }
        .dialog{
            p{
                padding:  30rpx;
                .textarea{
                    width: 100%;
                    height: 100px;
                    background: #e4e4e4;
                    border-radius: 10rpx;
                    color: #999999;
                }
            }
        }
    }
</style>