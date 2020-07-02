<template>
    <div class="wrap">
        <h3 v-if="!isShow">带“*”必填</h3>
        <div class="center" v-if="!isShow">
            <div class="content">
                <div class="row">
                    <p class="lable">名称<span>*</span></p>
                    <p class="inp">
                        <input type="text" v-model="name" placeholder="请输入会议室名称">
                    </p>
                </div>
                <div class="row" :class="{'border':imgList!=''}" @click="getChooseImage">
                    <p class="lable">会议室图片</p>
                    <p class="icon">
                        <i class="iconfont icon-tupian"></i>
                    </p>
                </div>
                <div class="imgWrap" v-if="imgList!=''">
                    <div class="box">
                        <p v-for="(item,index) in imgList" :key="index">
                            <i-icon type="delete" i-class="icon" color="#9c9c9c" size="20" @click="getDelete(index)" />
                            <img :src="item" alt="">
                        </p>
                    </div>
                </div>
                <div class="row" @click="getOpenAddress">
                    <p class="lable">会议室地址<span>*</span></p>
                    <p class="inp">
                        <input type="text" disabled v-model="address" placeholder="请选择会议室地址">
                        <i-icon type="enter" size="20" color="#999999" />
                    </p>
                </div>
                <div class="row">
                    <p class="lable">可容纳人数<span>*</span></p>
                    <p class="inp">
                        <input type="text" v-model="Capacity" placeholder="请输入具体数量">
                        <i-icon type="enter" size="20" color="#ffffff" />
                    </p>
                </div>
            </div>
            <div class="checkWrap">
                <p>选择会议室设备</p>
                <van-checkbox-group :value="result" @change="changeTag">
                    <div class="checkboxGroup">
                        <van-checkbox :name="item" v-for="(item,index) in tagList" :key="index" custom-class="check" label-class="label" label-position="left" shape="square">
                            {{item}}
                        </van-checkbox>
                        <!-- <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            话筒
                        </van-checkbox>
                        <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            电脑
                        </van-checkbox>
                        <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            电子屏
                        </van-checkbox>
                        <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            其他
                        </van-checkbox> -->
                    </div>
                </van-checkbox-group>
            </div>
            <div class="rowWrap">
                <div class="row">
                    <div class="l">
                        <p class="max">会议室开放预订</p>
                        <p class="min">允许员工在线预订</p>
                    </div>
                    <div class="r">
                        <van-switch :checked="checkedSwitch" @change="changeSwitch" size="20px" />
                    </div>
                </div>
                <div class="row">
                    <div class="l">
                        <p class="min">会议室使用权限</p>
                        <p class="max">全员可用</p>
                    </div>
                    <div class="r">
                        <i-icon type="enter" size="20" color="#999999" />
                    </div>
                </div>
                <!-- 暂且不用 -->
                <!-- <div class="row">
                    <div class="l">
                        <p>审批人</p>
                    </div>
                    <div class="r">
                        <p class="radius">
                           <i-icon type="add" color="#3399ff" size="20" />
                        </p>
                    </div>
                </div> -->
            </div>
        </div>
         <div class="footer" v-if="!isShow">
            <div class="boxwrap">
                <!-- <van-button type="primary" color="#f3f3f3" :disabled="disabled" custom-class="btn black" block>取消</van-button> -->
                <van-button type="primary" @click="getComplete" color="#3399ff" :disabled="disabled" block>完成</van-button>
            </div>
        </div>
        <mapList @childFn="getChildFn" @cancel="getCancelChild" v-if="isShow" />
    </div>
</template>
<script>
import mapList from '../../../components/mapList';
export default {
    components:{
        mapList
    },
    data(){
        return {
            address:"",
            result:[],
            checked:false,
            checkedSwitch:false,
            imgList:[],
            isShow:false,
            name:"",
            Capacity:"",
            Longitude:"",
            Latitude:"",
            Location:"",
            id:"",
            StatusCode:0,
            tagList:[
              '电脑','投影','多媒体','视频同步','其他'
            ],
            AttachInfo:"",
            sessionkey:""
        }
    },
    onLoad(options){
        Object.assign(this.$data, this.$options.data())
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.id = options.id;
        if(this.id){
            wx.setNavigationBarTitle({
                title: '编辑会议室'
            })
            this.getQuery();
        }else{
            this.id='';
        }
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.info.get",
                    SessionKey:this.sessionkey,
                    ObjTypeCode:"20034",
                    Id:this.id
                }
            }).then(res=>{
                console.log(res);
                let data = res.data;
                this.name = data.Name;
                this.address = data.Location;
                this.Longitude = data.Longitude;
                this.Latitude = data.Latitude;
                this.Capacity = data.Capacity;
                this.result = data.AttachInfo.split(',');
                this.AttachInfo = this.result.join(',');
                if(data.StatusCode==1){
                    this.StatusCode = data.StatusCode;
                    this.checkedSwitch = true;
                }else {
                    this.StatusCode = data.StatusCode;
                    this.checkedSwitch = false;
                }
            })
        },
        changeTag(e){
            this.result = e.mp.detail;
            this.AttachInfo = this.result.join(',');
            console.log(this.AttachInfo);
        },
        getChildFn(val,isBook){
            this.address = val.Name;
            this.isShow = isBook;
            this.Latitude = val.Latitude;
            this.Longitude = val.Longitude;
        },
        getCancelChild(val){
            this.isShow = val;
        },
        getChooseImage(){
            let that = this;
            wx.chooseImage({
                count: 9,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    that.imgList = that.imgList.concat(tempFilePaths);
                    console.log(that.imgList);
                }
            })
        },
        changeSwitch(e){
            this.checkedSwitch = e.mp.detail;
            if(!this.checkedSwitch){
                this.StatusCode = 0;
            }else {
                this.StatusCode = 1;
            }
        },
        getDelete(index){
            this.imgList.splice(index,1);
        },
        getOpenAddress(){
            this.isShow = true;
        },
        getComplete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.save",
                    ObjTypeCode:"20034",
                    SessionKey:this.sessionkey,
                    id:this.id,
                    name:this.name,
                    ApproveByIds:"",
                    Longitude:this.Longitude,
                    Latitude:this.Latitude,
                    Location:this.address,
                    Capacity:this.Capacity,
                    AttachInfo:this.AttachInfo
                }
            }).then(res=>{
                console.log(res);
                wx.navigateBack({
                    delta: 1
                })
                // 上传图片
                // let that = this;
                // wx.uploadFile({
                //     url: "https://wx.phxinfo.com.cn/rest?method="+'file.attachfiles.upload'+'&SessionKey='+that.sessionkey+'&folderid='+res.data.ResourceOrgId,
                //     filePath: that.imgList,
                //     name: 'file',
                //     formData: {
                //         'user': 'test'
                //     },
                //     success (res){
                //         const data = res.data
                //         //do something
                //     }
                // })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../../../../static/css/icon.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        h3{
            color: #999999;
            font-size: 26rpx;
            background: #f4f4f4;
            padding: 31rpx 33rpx;
        }
        .center{
            width: 100%;
            padding-bottom: 80px;
            .content{
                background: #fff;
                .row.border{
                    border-bottom: none;
                }
                .row{
                    padding: 30rpx 33rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2rpx solid #eaebeb;
                    .lable{
                        font-size: 32rpx;
                        color: #666666;
                        span{
                            color: #ff6666;
                            margin-left: 15rpx;
                        }
                    }
                    .inp{
                        display: flex;
                        align-items: center;
                        input{
                            text-align: right;
                            display: inline-block;
                        }
                    }
                    .icon{
                        i{
                            color: #3399ff;
                        }
                    }
                }
                .imgWrap{
                    background: #fff;
                    padding: 30rpx 33rpx;
                    border-bottom: 2rpx solid #eaebeb;
                    .box{
                        display: flex;
                        flex-wrap: wrap;
                        p{
                            width: 100rpx;
                            height: 100rpx;
                            background: #dce1e4;
                            border-radius: 7rpx;
                            margin-right: 40rpx;
                            position: relative;
                            img{
                                width: 100%;
                                height: 100%;
                                vertical-align: middle;
                                border-radius: 7rpx;
                            }
                            .icon{
                                position: absolute;
                                top: -15rpx;
                                right: -15rpx;
                            }
                        }
                    }
                }
            }
            .checkWrap{
                width: 100%;
                background: #fff;
                padding: 33rpx;
                margin: 35rpx 0;
                p{
                    font-size: 25rpx;
                    color: #ababab;
                }
                .checkboxGroup{
                    display: flex;
                    padding-top: 20rpx;
                    .label{
                        margin-left: 10rpx;
                        font-size: 26rpx;
                        color: #666666;
                    }
                }
            }
            .rowWrap{
                background: #fff;
                .row{
                    padding: 33rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2rpx solid #eaebeb;
                    .l{
                        font-size: 32rpx;
                        color: #666666;
                        .max{
                            font-size: 33rpx;
                            color: #333333;
                        }
                        .min{
                            font-size: 24rpx;
                            color: #999999;
                        }
                    }
                    .r{
                        .radius{
                            border-radius: 50%;
                            border: 1rpx solid #3399ff;
                            display: flex;
                            justify-content: center;
                            width: 50rpx;
                            height: 50rpx;
                            align-items: center;

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
            .boxwrap{
                // display: flex;
                // justify-content: space-around;
                padding: 20rpx 33rpx;
                .btn{
                    // width: 328rpx;
                }
                .black{
                    color: #333333 !important;
                }
            }
        }
    }
</style>