<template>
  <div class="wrap">
    <picker @change="pickerLeave" :value="leaveIdx" range-key="name" :range="leaveList">
      <div class="rowWrap">
        <p class="label">
          请假类型
          <span>*</span>
        </p>
        <p class="name">
          <span
            :class="leaveList[leaveIdx]?'active':''"
          >{{leaveList[leaveIdx]?leaveList[leaveIdx].name:'请选择'}}</span>
          <i-icon type="enter" color="#cccccc" />
        </p>
      </div>
    </picker>
    <h3>假期余额</h3>
    <div class="content">
      <picker
        @change="pickerStartTime"
        mode="multiSelector"
        :value="multiIndex"
        :range="newMultiArray"
      >
        <div class="row">
          <p class="label">
            开始时间
            <span>*</span>
          </p>
          <p class="name">
            <span>{{startTime}}</span>
            <i-icon type="enter" color="#cccccc" />
          </p>
        </div>
      </picker>
      <picker
        @change="pickerEndTime"
        mode="multiSelector"
        :value="endMultiIndex"
        :range="newMultiArray"
      >
        <div class="row">
          <p class="label">
            结束时间
            <span>*</span>
          </p>
          <p class="name">
            <span>{{endTime}}</span>
            <i-icon type="enter" color="#cccccc" />
          </p>
        </div>
      </picker>
      <div class="row">
        <p class="label">
          时长(天)
          <span>*</span>
        </p>
        <p class="name">
          <input
            type="text"
            placeholder-style="text-align:right;color: #ababab;"
            selection-end="-1"
            placeholder="请输入时长"
          />
        </p>
      </div>
      <div class="rowBottom">
        <p>
          根据排班自动计算时长
          <span>查看明细</span>
        </p>
      </div>
    </div>
    <div class="leaveComment">
      <p>
        请假事由
        <span>*</span>
      </p>
      <div class="box">
        <textarea name id cols="30" rows="10"></textarea>
      </div>
    </div>
    <div class="imgContent">
      <div class="head" @click="handleSelPhoto">
        <p>图片</p>
        <p>
          <i class="iconfont icon-tupian"></i>
        </p>
      </div>
      <div class="cont" v-if="imgList!=''">
        <p class="imgWrap" v-for="(item,index) in imgList" :key="index">
          <img :src="item" alt />
          <span class="close" @click="getCloseImg(index)">
            <i-icon type="close" color="#fff" size="12" />
          </span>
        </p>
      </div>
    </div>
    <!-- 审批人 -->
    <div class="approved">
      
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      leaveIdx: "",
      leaveList: [
        {
          id: "",
          name: "年假"
        },
        {
          id: "",
          name: "事假"
        },
        {
          id: "",
          name: "病假"
        },
        {
          id: "",
          name: "调休"
        },
        {
          id: "",
          name: "产假/公休"
        },
        {
          id: "",
          name: "陪产假"
        },
        {
          id: "",
          name: "婚假"
        },
        {
          id: "",
          name: "工伤假"
        },
        {
          id: "",
          name: "丧假"
        },
        {
          id: "",
          name: "哺乳假"
        },
        {
          id: "",
          name: "计生假"
        },
        {
          id: "",
          name: "探亲假"
        }
      ],
      multiIndex: [0, 0, 0, 0, 0],
      endMultiIndex: [0, 0, 0, 0, 0],
      startTime: "",
      endTime: "",
      imgList: []
    };
  },
  computed: {
    newMultiArray: () => {
      let array = [];
      const date = new Date();
      const years = [];
      const months = [];
      const days = [];
      const hours = [];
      const minutes = [];
      var d = new Date();
      var y = d.getFullYear();
      for (let i = y; i <= date.getFullYear() + 10; i++) {
        years.push("" + i + "年");
      }
      array.push(years);
      for (let i = 1; i <= 12; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        months.push("" + i + "月");
      }
      array.push(months);
      for (let i = 1; i <= 31; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        days.push("" + i + "日");
      }
      array.push(days);
      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        hours.push("" + i + "时");
      }
      array.push(hours);
      for (let i = 0; i < 60; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minutes.push("" + i + "分");
      }
      array.push(minutes);
      return array;
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      let minute = date.getMinutes();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      if (minute >= 1 && minute <= 9) {
        minute = "0" + month;
      }
      var currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        minute;
      return currentdate;
    }
  },
  methods: {
    pickerLeave(e) {
      this.leaveIdx = e.mp.detail.value;
    },
    pickerStartTime(e) {
      this.multiIndex = e.target.value;
      const index = this.multiIndex;
      const year = this.newMultiArray[0][index[0]];
      const month = this.newMultiArray[1][index[1]];
      const day = this.newMultiArray[2][index[2]];
      const hour = this.newMultiArray[3][index[3]];
      const minute = this.newMultiArray[4][index[4]];
      this.startTime =
        year + "-" + month + "-" + day + " " + hour + ":" + minute;
      this.startTime = this.RemoveChinese(this.startTime) + ":00";
    },
    pickerEndTime(e) {
      this.endMultiIndex = e.target.value;
      const index = this.endMultiIndex;
      const year = this.newMultiArray[0][index[0]];
      const month = this.newMultiArray[1][index[1]];
      const day = this.newMultiArray[2][index[2]];
      const hour = this.newMultiArray[3][index[3]];
      const minute = this.newMultiArray[4][index[4]];
      this.endTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
      this.endTime = this.RemoveChinese(this.endTime) + ":00";
    },
    // 正则去除汉字
    RemoveChinese(strValue) {
      if (strValue != null && strValue != "") {
        var reg = /[\u4e00-\u9fa5]/g;
        return strValue.replace(reg, "");
      } else return "";
    },
    // 打开本地图库
    handleSelPhoto() {
      wx.chooseImage({
        count: 9,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          console.log(res);
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          tempFilePaths.forEach(item => {
            this.imgList.push(item);
          });
          // wx.uploadFile({
          //     url: "http://112.126.75.65:10020/rest?method="+'file.attachfiles.upload'+'&SessionKey=' + '5d884846-1d19-449d-b4e2-1b5a83623a41'+'&pid='+this.uuid, //仅为示例，非真实的接口地址
          //     filePath: tempFilePaths[0],
          //     name: 'file',
          //     formData: {
          //         'user': 'test'
          //     },
          //     success (res){
          //         console.log(res);
          //         const data = res.data
          //         //do something
          //     }
          // })
        }
      });
    }
  }
};
</script>
<style lang="scss" scopod>
@import '../../../../static/css/icon.css';
.wrap {
  .rowWrap {
    display: flex;
    justify-content: space-between;
    padding: 34rpx 33rpx;
    background: #fff;
    margin-top: 35rpx;
    .label {
      color: #666666;
      font-size: 32rpx;
      span {
        color: #ff6666;
      }
    }
    .name {
      span {
        font-size: 31rpx;
        color: #ababab;
      }
      span.active {
        color: #333333;
      }
    }
  }
  h3 {
    padding: 31rpx 33rpx;
    color: #3399ff;
    font-size: 26rpx;
  }
  .content {
    background: #fff;
    .row {
      display: flex;
      justify-content: space-between;
      padding: 34rpx 33rpx;
      background: #fff;
      .label {
        color: #666666;
        font-size: 32rpx;
        span {
          color: #ff6666;
        }
      }
      .name {
        span {
          font-size: 31rpx;
          color: #ababab;
        }
        span.active {
          color: #333333;
        }
        input {
          font-size: 31rpx;
          text-align: right;
          margin-right: 20rpx;
        }
      }
    }
    .rowBottom {
      padding: 20rpx 33rpx;
      border-top: 2rpx solid #eaebeb;
      p {
        font-size: 26rpx;
        color: #ababab;
        span {
          color: #3399ff;
          margin-left: 10rpx;
        }
      }
    }
  }
  .leaveComment {
    padding: 34rpx 33rpx;
    background: #fff;
    margin: 35rpx 0;
    p {
      font-size: 32rpx;
      color: #666666;
      span {
        color: #ff6666;
      }
    }
    .box {
      textarea {
        height: 100rpx;
        font-size: 31rpx;
        color: #333333;
      }
    }
  }
  .imgContent {
    background: #fff;
    margin-bottom: 20rpx;
    .head {
      font-size: 28rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 33rpx;
      color: #666666;
      .iconfont {
        color: #3399ff;
      }
    }
    .cont {
      padding: 20rpx;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      // flex-direction: row;
      .imgWrap {
        width: 100rpx;
        height: 100rpx;
        position: relative;
        margin-right: 20rpx;
        margin-top: 10rpx;
        img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
          border-radius: 7rpx;
        }
        // .close{
        //     position: absolute;
        //     top: -10rpx;
        //     right: -10rpx;
        // }
        .close {
          display: inline-block;
          width: 33rpx;
          height: 33rpx;
          line-height: 33rpx;
          text-align: center;
          background: #9c9c9c;
          position: absolute;
          top: -10rpx;
          right: -10rpx;
          border-radius: 50%;
          opacity: 0.8;
        }
      }
    }
  }
}
</style>