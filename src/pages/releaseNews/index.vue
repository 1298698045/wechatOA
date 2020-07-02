<template>
    <div class="wrap">
        <div class="nav">
            带“*”必填
        </div>
        <div class="center">
            <div class="row">
                <picker class="pickers" v-model="columnIdx" :range="column" @change="changeColumn">
                    <van-field
                        :value="column[columnIdx]"
                        required
                        clearable
                        title-width="75px"
                        label="栏目"
                        icon="arrow"
                        :readonly="true"
                        placeholder="请选择"
                    />
                </picker>
                <van-field
                    :value="tag"
                    required
                    clearable
                    title-width="75px"
                    label="标签"
                    icon="arrow"
                    :readonly="true"
                    placeholder="请选择"
                    @click="getTag"
                />
                <van-popup
                    :show="show"
                    position="center"
                    custom-style="width: 80%;height: 70%;overflow: scroll;"
                    @close="onClose"
                >
                    <div class="popupWrap">
                        <van-checkbox-group :value="result" @change="changeCheckbox">
                            <van-checkbox :name="item" v-for="(item,index) in tagList" :key="index" custom-class="checkbox">{{item}}</van-checkbox>
                        </van-checkbox-group>
                    </div>
                
                </van-popup>
            </div>
            <div class="row">
                <van-field
                    :value="title"
                    title-width="75px"
                    required
                    clearable
                    label="标题"
                    placeholder="请输入标题"
                    @change="changeTitle"
                />
                 <van-field
                    :value="content"
                    title-width="75px"
                    :type="'textarea'"
                    required
                    autosize
                    maxlength="100"
                    label="内容"
                    placeholder="请输入内容"
                    @change="changeContent"
                />
            </div>
            <div class="row">
                <div class="photo" @click="handleSelPhoto">
                    <p>图片</p>
                    <p>
                        <i-icon type="picture_fill" size="20" />
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="photo" @click="getRouterUpan">
                    <p>附件</p>
                    <p>
                        <i-icon type="accessory" size="20" />
                    </p>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="btnWrap">
                <button class="btn leftBtn">取消</button>
                <button class="btn rightBtn" @click="getNext">下一步</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            columnIdx:"",
            column:['医共体制度文件','医院动态','信息中心专栏'],
            show:false,
            result:[],
            tagIndex:"",
            // tag:"",
            tagList:[
                '院办','人事','财务','医务','护理','总务','信息','后勤','监察室','质控办','临床药学','制度文件','教学管理','科教科',
                '医保办','健康管理','门诊','其他','通知','工会'
            ],
            title:"",
            content:"",
        }
    },
    computed:{
        tag(){
            return this.result.join(',');
        }
    },
    methods:{
        changeColumn(e){
            this.columnIdx = e.mp.detail.value;
        },
        changeTag(e){
            this.tagIndex = e.mp.detail.value;
        },
        getTag(){
            this.result = [];
            this.show = true;
        },
        changeCheckbox(e){
            this.result = e.mp.detail;
        },
        onClose(){
            this.show = false;
        },
        // 打开本地图库
        handleSelPhoto(){
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    console.log(res);
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths
                }
            })
        },
        // 优盘
        getRouterUpan(){
            const url = "/pages/uPan/main";
            wx.navigateTo({url:url});
        },
        getNext(){
            const url = "/pages/releaseNewsTwo/main";
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        .nav{
            font-size: 12px;
            color: #999999;
            padding: 30rpx;
        }
        .center{
            padding:0 10rpx;
            .row:nth-child(1){
                // padding: 0;
            }
            .row{
                padding-bottom: 20px;
                .photo{
                    padding:20rpx;
                    background: #fff;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                .popupWrap{
                    width: 90%;
                    margin: 0 auto;
                    .checkbox{
                        font-size: 16px;
                        padding: 20rpx 0;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            padding: 20rpx 0;
            .btnWrap{
                display: flex;
                justify-content: space-between; 
                .btn{
                   width: 45%;
                   font-size: 15px;
                }
                .leftBtn{
                    border: none;
                    background: #f3f3f3;
                }
                .rightBtn{
                    border: none;
                    background: #3399ff;
                    color: #ffffff;
                }
            }
        }
    }
</style>