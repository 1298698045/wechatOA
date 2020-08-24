<template>
    <div class="wrap">
        <div v-for="(item,index) in list" :key="index">
            <!-- <van-cell-group custom-class="cell">
                <van-field
                    :value="title"
                    custom-style="font-size:34rpx;color:#333333"
                    required
                    label="标题"
                    placeholder="请输入标题"
                    input-align="right"
                />
            </van-cell-group> -->
            <van-cell-group v-if="item.type=='S'||item.type=='E'||item.type=='N'||item.type=='H'" custom-class="cell">
                <van-field
                    :value="item.value"
                    custom-style="font-size:34rpx;color:#333333"
                    :required="item.require||false"
                    :label="item.label"
                    :placeholder="item.helpText"
                    input-align="right"
                    @change="function(val){changeInput(val,item)}"
                />
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='L'||item.type=='DT'||item.type=='LT'">
                <picker @change="(val)=>{bindPickerChange(val,item)}" :value="item.index" range-key="label" :range="currenData[item.id]">
                    <van-field
                        :value="currenData[item.id][item.index]?currenData[item.id][item.index].label:''"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.require||false"
                        disabled
                        :label="item.label"
                        :placeholder="item.helpText"
                        input-align="right"
                        right-icon="arrow"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='D'">
                <picker mode="date" :value="item.value" @change="function(val){bindDateChange(val,item)}">
                    <van-field
                        :value="item.value"
                        title-width="110px"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.require||false"
                        disabled
                        :label="item.label"
                        input-align="right"
                        right-icon="arrow"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='T'">
                <picker class="picker" mode="multiSelector" :value="item.multiIndex" @change="((val)=>{bindMultiPickerChange(val,item)})"
                    :range="newMultiArrayList">
                    <van-field
                        :value="item.value"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.require||false"
                        disabled
                        :label="item.label"
                        input-align="right"
                        right-icon="arrow"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='Year'">
                <picker mode="date" :value="item.value" fields="year"  @change="((e)=>{bindYear(e,item)})">
                    <van-field
                        :value="item.value"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.require||false"
                        disabled
                        :label="item.label"
                        input-align="right"
                        right-icon="arrow"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='Month'">
                <picker mode="date" :value="item.value" fields="month"  @change="((e)=>{bindYMonth(e,item)})">
                    <van-field
                        :value="item.value"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        required
                        disabled
                        :label="item.label"
                        input-align="right"
                        right-icon="arrow"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='G'">
                <div class="checkWrap">
                    <van-checkbox-group :value="item.result" @change="((e)=>{changeCheckTag(e,item)})">
                        <div class="checkboxGroup">
                            <van-checkbox :name="v" v-for="(v,i) in item.value" :key="i" custom-class="check" label-class="labels"  shape="square">
                                <p class="tag">{{v}}</p>
                            </van-checkbox>
                        </div>
                    </van-checkbox-group>
                </div>
            </van-cell-group>
            <!-- <van-cell-group custom-class="cell" v-if="item.type=='Text'">
                <div class="box">
                    <p class="label">{{item.label}}:</p>
                    <textarea v-model="item.value" name="" id="" cols="30" rows="10"></textarea>
                </div>
            </van-cell-group> -->
            <!-- <van-checkbox-group :value="result" @change="function(e){onChangeGroup(e)}">
                <van-cell-group custom-class="cell">
                    <van-cell
                        title="复选框1"
                        value-class="value-class"
                        clickable
                        data-index="1"
                        @click="toggle"
                    >
                    <van-checkbox
                        @tap="noop"
                        :class="'checkboxes-'+1"
                        name="1"
                    />
                    </van-cell>
                </van-cell-group>
            </van-checkbox-group> -->
            <van-cell-group custom-class="cell" v-if="item.type=='O'">
                <van-cell value-class="cellValue" :title="item.label" is-link :value="item.value" @click="getOpenModal(item,index)" />
            </van-cell-group>
            <div class="switch" v-if="item.type=='H'">
                <p>
                    {{item.label}}
                </p>
                <p>
                    <van-switch :checked="item.value" @change="(val)=>{changeSwitch(val,item)}" size="24px" />
                </p>
            </div>
            <div class="row" v-if="item.type=='UC'">
                <p class="title">*<span>内容</span></p>
                <textarea v-model="item.value" name="" id="" cols="30" rows="10" placeholder-class="placeholder" placeholder="请输入"></textarea>
            </div>
            <div class="parentWrap" v-if="item.type=='RelatedList'">
                <h3>{{item.label}}</h3>
                <div class="rowBox" v-for="(v,i) in item.fields" :key="i">
                    <van-cell-group v-if="v.type=='S'||v.type=='E'||v.type=='N'||v.type=='H'" custom-class="cell">
                        <van-field
                            :value="v.value"
                            custom-style="font-size:34rpx;color:#333333"
                            :required="v.require||false"
                            :label="v.label"
                            :placeholder="v.helpText"
                            input-align="right"
                            @change="function(val){changeInput(val,v)}"
                        />
                    </van-cell-group>
                    <!-- <van-cell-group custom-class="cell" v-if="v.type=='L'||v.type=='DT'||v.type=='LT'">
                        <picker @change="(val)=>{bindPickerChange(val,v)}" :value="v.index" range-key="label" :range="currenData[v.id]">
                            <van-field
                                :value="currenData[v.id][v.index]?currenData[v.id][v.index].label:''"
                                input-class="inp"
                                custom-style="font-size:34rpx;color:#333333"
                                :required="v.require||false"
                                disabled
                                :label="v.label"
                                :placeholder="v.helpText"
                                input-align="right"
                                right-icon="arrow"
                            />
                            </picker>
                    </van-cell-group> -->
                    <van-cell-group custom-class="cell" v-if="v.type=='D'">
                        <picker mode="date" :value="v.value" @change="function(val){bindDateChange(val,v)}">
                            <van-field
                                :value="v.value"
                                title-width="110px"
                                input-class="inp"
                                custom-style="font-size:34rpx;color:#333333"
                                :required="v.require||false"
                                disabled
                                :label="v.label"
                                input-align="right"
                                right-icon="arrow"
                                :placeholder="v.helpText"
                            />
                        </picker>
                    </van-cell-group>
                    <van-cell-group custom-class="cell" v-if="v.type=='O'">
                        <van-cell value-class="cellValue" :title="v.label" is-link :value="v.value" @click="getOpenModal(v,i)" />
                    </van-cell-group>
                    <div class="row" v-if="v.type=='UC'">
                        <p class="title">*<span>{{v.label}}</span></p>
                        <textarea v-model="v.value" name="" id="" cols="30" rows="10" placeholder-class="placeholder" :placeholder="v.helpText"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="row">
            <p class="title">*<span>内容</span></p>
            <textarea v-model="content" name="" id="" cols="30" rows="10" placeholder-class="placeholder" placeholder="请输入"></textarea>
        </div> -->
        <div class="row">
            <p class="text">图片</p>
            <div class="content">
                <div class="box" v-for="(item,index) in imgList" :key="index">
                    <img :src="item" alt="">
                </div>
                <div class="box" @click="getChooseImage">
                    <i-icon type="add" size="40" color="#bec5c5" />
                </div>
            </div>
        </div>
        <div class="row">
            <p class="text">附件</p>
            <div class="content">
                <div class="box" v-for="(item,index) in imgList" :key="index">
                    <img :src="item" alt="">
                </div>
                <div class="box">
                    <i-icon type="add" size="40" color="#bec5c5" />
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="btn">
                <van-button type="primary" color="#3399ff" block @click="getSubmit">提交</van-button>
            </div>
        </div>

        <van-popup
            :show="isShow"
            position="bottom"
            custom-style="width:100%;height: 80vh;"
            @close="onClosePopup"
        >
            <div class="popupWrap">
                <van-search :value="value" placeholder="请输入搜索关键词" />
                <ul class="uls">
                    <li @click="getPopupSel(item,index)" v-for="(item,index) in list[searchIdx]?list[searchIdx].temp:''" :key="index">
                        <p>{{item.Name}}</p>
                        <p v-if="popupIdx==index">
                            <i-icon type="right" />
                        </p>
                    </li>
                </ul>
            </div>
        </van-popup>

    </div>
</template>
<script>
import list from '@/utils/test.js';
import {newMultiArray} from '@/utils/multiArray';
import { mockData,dataList,serachList } from '@/utils/mock';
export default {
    data(){
        return {
            title:"通用请示报告",
            index:0,
            level:['普通','紧急','加急'],
            content:"",
            imgList:[],
            ProcessId:"",
            sessionkey:"",
            fullName:"",
            list:[
                {
                    name:"标题",
                    type:1,
                    value:"name",
                    item:[1,2,3]
                },
                {
                    name:"2",
                    type:1,
                    value:"age",
                    item:[1,2,3]
                },
                {
                    name:"l",
                    type:2,
                    value:"2020-02-02"
                }
            ],
            result:[],
            isShow:false,
            popupIdx:-1,
            checked:false,
            currenData:[],
            record:{},
            searchId:"",
            sObjectType:"",
            searchIdx:'',
            ProcessInstanceId:"",
            RuleLogId:""
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        newMultiArrayList(){
            return newMultiArray();
        },
        // filterObj(){
        //     let obj = {};
        //     for(let key in this.record){
        //         if(this.record[key]!=null){
        //             obj[key] = this.record[key];
        //         }
        //     }
        //     return obj;
        // }
    },
    onLoad(options){
        console.log(mockData,dataList,'mockData');
        console.log(serachList,'serachList');
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.fullName = wx.getStorageSync('fullName');
        this.title = options.name;
        this.ProcessId = options.ProcessId;
        console.log(list,'123');
        // this.list = list.listData;
        this.getLayoutQuery();
        this.getLayoutData();
        this.list = mockData;
        this.currenData = dataList.actions[0].returnValue.masterRecord.picklistValuesMap;
        this.record = dataList.actions[0].returnValue.masterRecord.record;
        this.list.forEach(item=>{
            if(item.type=='L'){
                this.$set(item,'index',-1);
            }else{
                let date = '';
                this.$set(item,'value',date);
            }
            if(item.fields){
                item.fields.forEach(v=>{
                    let date = '';
                    this.$set(v,'value',date);
                })
            }
        })
        console.log(this.list,'----');
        // this.dataList = dataList;
        this.list.forEach(item=>{
            if(item.type=='T'){
                let multiIndex = this.getIndex(item.value);
                item.multiIndex = multiIndex;
            }
        })
    },
    methods:{
        getLayoutQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.layout,
                    SessionKey:this.sessionkey,
                    processId:this.ProcessId
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getLayoutData(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.layoutData,
                    SessionKey:this.sessionkey,
                    processId:this.ProcessId,
                    ProcessInstanceId:this.ProcessInstanceId,
                    RuleLogId:this.RuleLogId
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getIndex(startTime){
            let date = new Date(startTime.replace(/-/g,'/'));
            let years = date.getFullYear();
            let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1;
            let d = date.getDate()<10?'0'+date.getDate():date.getDate();
            let hours = date.getHours()<10?'0'+date.getHours():date.getHours();
            let minutes = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();

            const yIdx = this.newMultiArrayList[0].findIndex(item=>item==years+'年');
            const mIdx = this.newMultiArrayList[1].findIndex(item=>item==month+'月');
            const dIdx = this.newMultiArrayList[2].findIndex(item=>item==d+'日');
            const hIdx = this.newMultiArrayList[3].findIndex(item=>item==hours+'时');
            const minIdx = this.newMultiArrayList[4].findIndex(item=>item==minutes+'分');
            const arr = [yIdx,mIdx,dIdx,hIdx,minIdx];
            return arr;
        },
        changeInput(val,item){
            // console.log(val,item);
            item.value =  val.mp.detail;
            this.record[item.id] = item.value;
            // console.log(this.record)
        },
        onChangeGroup(e){
            console.log(e,'123123123');
            this.result = e.mp.detail;
        },
        toggle(e){
            console.log(e);
            let { index } = e.mp.currentTarget.dataset;
        },
        noop() {},
        getOpenModal(item,index){
            this.searchId = item.id;
            this.searchIdx = index;
            this.sObjectType = item.sObjectType;
            item.temp = serachList.listData;
            console.log(item.temp,'00000')
            console.log(this.list[index]);
            this.isShow = true;
        },
        onClosePopup(){
            this.isShow = false;
        },
        getPopupSel(item,index){
            console.log(item,this.searchId);
            this.popupIdx = index;
            this.record[this.searchId] = item;
            this.isShow = false;
            this.list[this.searchIdx].value = item.Name;
            console.log(this.record);
        },
        changeSwitch(e,item){
            console.log(e,item);
            item.value = e.mp.detail;
        },
        bindDateChange(v,item){
            console.log(v,item);
            item.value = v.mp.detail.value;
            this.record[item.id] = item.value;
            console.log(this.record);
        },
        bindMultiPickerChange(v,item){
            item.multiIndex = v.mp.detail.value;
            item.value = this.getCurrentTime(item.multiIndex);
        },
        bindYear(e,item){
            console.log(e,item);
            item.value = e.mp.detail.value;
            this.record[item.id] = item.value;
        },
        bindYMonth(e,item){
            item.value = e.mp.detail.value;
            this.record[item.id] = item.value;
        },
        getCurrentTime(index){
            const year = this.newMultiArrayList[ 0 ][ index[ 0 ] ];
            const month = this.newMultiArrayList[ 1 ][ index[ 1 ] ];
            const day = this.newMultiArrayList[ 2 ][ index[ 2 ] ];
            const hour = this.newMultiArrayList[ 3 ][ index[ 3 ] ];
            const minute = this.newMultiArrayList[ 4 ][ index[ 4 ] ];
            let time = year + "-" + month + "-" + day + " " + hour + ":" + minute;
            time = this.RemoveChinese(time);
            return time;
        },
        RemoveChinese(strValue) {  
            if(strValue!= null && strValue != ""){  
                var reg = /[\u4e00-\u9fa5]/g;   
               return strValue.replace(reg, "");   
            }  
            else  
                return "";  
        },
        changeCheckTag(e,item){
            console.log(e,item);
            item.result = e.mp.detail;
        },
        getSubmit(){
            // console.log(this.list);
            let isBook = false;
            let idx = this.list.length;
            this.list.forEach((item,index)=>{
                console.log(index+1);
                if(index+1==idx){
                    let isBook = true;
                }
                if(item.value==''){
                    wx.showToast({
                        title:`请输入${item.label}`,
                        icon:"success",
                        duration:2000
                    })
                    throw new Error('End');
                }
                
            })
            
            // const params = JSON.stringify(this.list);
            // console.log(params);
            return;
            if(this.title==''){
                wx.showToast({
                    title:'标题不能为空',
                    icon:'none',
                    duration:2000
                })
                return false;
            }else if(this.level==''){
                wx.showToast({
                    title:'级别不能为空',
                    icon:'none',
                    duration:2000
                })
                return false;
            }else if(this.content==''){
                wx.showToast({
                    title:'内容不能为空',
                    icon:'none',
                    duration:2000
                })
                return false;
            }else {
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:"flow.instance.create",
                        SessionKey:this.sessionkey,
                        name:this.title+' '+this.fullName,
                        processid:this.ProcessId,
                        businessUnitId:"",
                        deadline:3,
                        Prority:this.index,
                        Description:this.content
                    }
                }).then(res=>{
                    console.log(res);
                    wx.navigateBack({
                        delta: 1
                    })
                })
            }
        },
        bindPickerChange(val,item){
            console.log(val,item);
            item.index = val.mp.detail.value;
            console.log(this.currenData[item.id][item.index].label);
            // item.value = val.mp.detail.value;
            this.record[item.id] = this.currenData[item.id][item.index].value;
            console.log(this.record);
        },
        getChooseImage(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    console.log(res);
                    // tempFilePath可以作为img标签的src属性显示图片
                    
                    const tempFilePaths = res.tempFilePaths;
                    that.imgList = tempFilePaths;
                    wx.uploadFile({
                        url: "https://wx.phxinfo.com.cn/rest?method="+'flow.files.upload'+'&SessionKey=' + that.sessionkey+'&pid='+that.ProcessId+'&objTypeCode='+'122',
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            console.log(res);
                            const data = res.data
                        }
                    })
                }
            })
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
        .parentWrap{
            width: 100%;
            height: auto;
            background: #fff;
            margin: 30rpx 0;
            padding: 30rpx 0;
            h3{
                font-weight: bold;
                text-align: center;
            }
        }
        .value-class {
            flex: none !important;
        }
        .cell{
            margin-top: 24rpx;
            .cellValue{
                color: #333333;
            }
            .inp{
                color: #333333;
                font-size: 34rpx;
            }
            .box{
                width: 100%;
                background: #fff;
                padding: 30rpx;
                textarea{
                    width: 100%;
                    // color: #999999;
                }
            }
            .checkWrap{
                background: #fff;
                padding: 30rpx;
                .check{
                    padding: 10rpx 0;
                    .tag{
                        width: 500rpx;
                    }
                }
            }
        }
        .switch{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 33rpx;
            background: #fff;
            margin-top: 24rpx;
        }
        .row{
            margin-top: 24rpx;
            background: #fff;
            padding:15rpx;
            .title{
                color: #ff6666;
                span{
                    font-size: 34rpx;
                    color: #333333;
                    margin-left: 5rpx;
                }
            }
            .text{
                font-size: 34rpx;
                color: #333333;
                margin-left: 10rpx;
            }
            textarea{
                width: 90%;
                height: 150rpx;
                padding: 10rpx;
            }
            .placeholder{
                font-size: 34rpx;
                color: #a3a5a7;
            }
            .content{
                display: flex;
                padding: 20rpx 10rpx;
                .box{
                    width: 96rpx;
                    height: 96rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #f7f7f7;
                    margin-right: 10rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .btn{
                padding: 24rpx;
            }
        }
        .popupWrap{
            .uls{
                li{
                    padding: 33rpx ;
                    color: #333333;
                    font-size: 28rpx;
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
    }
</style>