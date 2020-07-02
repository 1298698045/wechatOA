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
            <van-cell-group v-if="item.type=='S'" custom-class="cell">
                <van-field
                    :value="item.value"
                    custom-style="font-size:34rpx;color:#333333"
                    required
                    :label="item.label"
                    :placeholder="'请输入'+item.label"
                    input-align="right"
                    @change="function(val){changeInput(val,item)}"
                />
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='L'">
                <picker @change="(val)=>{bindPickerChange(val,item)}" :value="item.index" range-key="name" :range="item.item">
                    <van-field
                        :value="item.item[item.index]?item.item[item.index].name:''"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        required
                        disabled
                        :label="item.label"
                        :placeholder="'请选择'+item.label"
                        input-align="right"
                        right-icon="arrow"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='D'">
                <picker mode="date" :value="item.value" @change="function(val){bindDateChange(val,item)}">
                    <van-field
                        :value="item.value"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        required
                        disabled
                        :label="item.label"
                        input-align="right"
                        right-icon="arrow"
                    />
                </picker>
            </van-cell-group>
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
            <van-cell-group custom-class="cell" v-if="item.type=='SS'">
                <van-cell :title="item.label" is-link :value="item.value" @click="getOpenModal(item)" />
            </van-cell-group>
            <div class="switch" v-if="item.type=='H'">
                <p>
                    {{item.label}}
                </p>
                <p>
                    <van-switch :checked="item.value" @change="(val)=>{changeSwitch(val,item)}" size="24px" />
                </p>
            </div>
            <!-- <i-cell-group>
                <i-cell title="开关">
                    <switch slot="footer" checked />
                </i-cell>
            </i-cell-group> -->
        </div>
        <div class="row">
            <p class="title">*<span>内容</span></p>
            <textarea v-model="content" name="" id="" cols="30" rows="10" placeholder-class="placeholder" placeholder="请输入"></textarea>
        </div>
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
        <div class="footer">
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
                    <li @click="getPopupSel(0)">
                        <p>姓名</p>
                        <p v-if="popupIdx==0">
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
            checked:false
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.fullName = wx.getStorageSync('fullName');
        this.title = options.name;
        this.ProcessId = options.ProcessId;
        console.log(list,'123');
        this.list = list.listData;
    },
    methods:{
        changeInput(val,item){
            console.log(val,item);
            item.value =  val.mp.detail;
            console.log(this.list);
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
        getOpenModal(){
            this.isShow = true;
        },
        onClosePopup(){
            this.isShow = false;
        },
        getPopupSel(index){
            this.popupIdx = index;
        },
        changeSwitch(e,item){
            console.log(e,item);
            item.value = e.mp.detail;
        },
        bindDateChange(v,item){
            console.log(v,item);
            item.value = v.mp.detail.value;
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
            item.value = val.mp.detail.value;
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
        .value-class {
            flex: none !important;
        }
        .cell{
            margin-top: 24rpx;
            .inp{
                color: #333333;
                font-size: 34rpx;
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