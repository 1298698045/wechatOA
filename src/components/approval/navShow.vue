<template>
  <div class="wraps">
    <div class="searchWrap" v-if="childShow==0">
      <div class="navs">
        <p>
          <van-search background="#f4f4f4" :value="searchValue" @change="changeSearch" placeholder="请输入搜索关键词" />
        </p>
        <p @click="getCancelBlock">取消</p>
      </div>
      <div class="history">
        <div class="text">
          <p>搜索历史</p>
          <p>
            <i-icon type="close" size="20" color="#999999" />
          </p>
        </div>
        <div class="rowWrap">
          <p>崔曼</p>
          <p>补卡申请</p>
        </div>
      </div>
      <div class="activeCenter">
        <div class="box">
          <van-divider contentPosition="center">在这里可以搜索到</van-divider>
          <div class="iconWrap">
            <div class="icon">
              <p>
                <img src="https://wx.phxinfo.com.cn/img/wechat/Scan.png" alt />
              </p>
              <p>审批标题</p>
            </div>
            <div class="icon">
              <p>
                <img src="https://wx.phxinfo.com.cn/img/wechat/Scan.png" alt />
              </p>
              <p>审批状态</p>
            </div>
            <div class="icon">
              <p>
                <img src="https://wx.phxinfo.com.cn/img/wechat/Scan.png" alt />
              </p>
              <p>审批时间</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="screenWrap" v-if="childShow==1">
      <div class="navs">
        <p>
          <van-search background="#f4f4f4" :value="searchValue" placeholder="请输入搜索关键词" />
        </p>
        <p @click="getCancelScreen">取消</p>
      </div>
      <div class="contWrap">
        <van-collapse :value="activeStatus" @change="changeCollapseStatus">
            <van-collapse-item :name="item.Id" v-for="(item,index) in statusList" :key="index">
                <view slot="title" class="title">{{item.Name}}</view>
                <div class="rowBox">
                    <p :class="{'active':statusNum==i}" v-for="(v,i) in item.Items" :key="i" @click="getOptionsStatus(v,i)">{{v.Name}}</p>
                </div>
            </van-collapse-item>
        </van-collapse>
        <van-collapse :value="activeNames" @change="changeCollapse">
          <van-collapse-item :name="item.Id" v-for="(item,index) in optionList" :key="index">
            <view slot="title" class="title">{{item.Name}}</view>
            <div class="rowBox">
              <p
                :class="{'active':processId==v.ProcessId}"
                v-for="(v,i) in item.Items"
                :key="i"
                @click="getOptions(item,index,v,i)"
              >{{v.Name}}</p>
            </div>
          </van-collapse-item>
          <van-collapse-item name="2">
            <view slot="title" class="title">审计处</view>
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
        <van-button type="primary" color="#3399ff" block @click="getSubmit">确定</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
export default {
  name: "NavShow",
  props:['childShow'],
  data() {
    return {
      num:"",
      searchValue:"",
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
            activeNames: [],
            sessionkey:"",
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
            startTime:"",
            endTime:"",
            processId:""
    };
  },
  onLoad(){
    this.sessionkey = wx.getStorageSync('sessionkey');
    this.getProcess();
  },
  computed:{
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
          }
      })
  },
  methods: {
    changeSearch(e){
      this.searchValue = e.mp.detail;
      this.$emit('childFn',true);
    },
    getDeparement(){
        const url = '/pages/publics/pubGroup/main';
        wx.navigateTo({url:url});
    },
    getLanuchPeople(){
        const url = '/pages/publics/organizer/main';
        wx.navigateTo({url:url});
    },
    changeStartTime(e){
          this.startTime = e.mp.detail.value;
      },
      changeEndTime(e){
          this.endTime = e.mp.detail.value;
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
    getOptions(item,index,v,i){
      // this.num = index;
      this.processId = this.optionList[index].Items[i].ProcessId;

    },
    getCancelBlock() {
      this.$parent.isBlock = false;
    },
    changeCollapse(e){
      this.activeNames = e.mp.detail;
    },
    getCancelScreen(e){
      this.$parent.isBlock = false;
    },
    getSubmit(){
      this.$parent.isBlock = false;
      this.$emit('childFn',true);
    },
    changeCollapseStatus(e){
        this.activeStatus = e.mp.detail;
    },
    getOptionsStatus(item,index){
      this.statusNum = index;
    }

  }
};
</script>
<style lang="scss">
.wraps {
  .searchWrap {
    position: fixed;
    top: 0;
    width: 100%;
    .navs {
      width: 100%;
      display: flex;
      background: #f4f4f4;
      border-bottom: 1rpx solid #e2e4e3;
      p:nth-child(1) {
        width: 80%;
      }
      p:nth-child(2) {
        width: 20%;
        text-align: center;
        font-size: 28rpx;
        color: #3399ff;
        text-align: center;
        margin-top: 30rpx;
      }
    }
    .history {
      width: 100%;
      background: #f4f4f4;
      padding: 30rpx 0;
      .text {
        padding: 0 30rpx;
        display: flex;
        justify-content: space-between;
        font-size: 28rpx;
        color: #999999;
      }
      .rowWrap {
        display: flex;
        flex-wrap: wrap;
        padding: 0 30rpx;
        p {
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
    .activeCenter {
      background: #fff;
      border-top: 1rpx solid #e2e4e3;
      .box {
        padding: 50px;
      }
      .iconWrap {
        display: flex;
        .icon {
          flex: 1;
          p:nth-child(1) {
            width: 50rpx;
            height: 50rpx;
            margin: 0 auto;
            img {
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }
          p {
            font-size: 12px;
            color: #505050;
            text-align: center;
          }
        }
      }
    }
  }
  .screenWrap {
    // position: fixed;
    height: 120vh;
    .navs {
      width: 100%;
      display: flex;
      background: #f4f4f4;
      border-bottom: 1rpx solid #e2e4e3;
      p:nth-child(1) {
        width: 80%;
      }
      p:nth-child(2) {
        width: 20%;
        text-align: center;
        font-size: 28rpx;
        color: #3399ff;
        text-align: center;
        margin-top: 30rpx;
      }
    }
    .contWrap {
      background: #fff;
      .title {
        font-size: 28rpx;
        font-weight: bold;
      }
      .rowBox {
        display: flex;
        flex-flow: wrap;
        justify-content: space-between;
        padding: 10rpx 20rpx;
        p {
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
        p.active {
          background: #dbf5ec;
          color: #39c1b3;
        }
      }
    }
    .time {
      margin: 30rpx 0;
      .inp {
        text-align: right;
      }
    }
    .bottom {
      width: 100%;
      position: fixed;
      bottom: 0;
      z-index: 999;
    }
  }
}
</style>