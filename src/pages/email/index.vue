<template>
    <div class="wrap">
        <div class="nav">
            <p>
                <van-search :value="value" @focus="getFocus" placeholder="搜索" />
            </p>
            <!-- <p>编辑</p> -->
        </div>
        <div class="header">
            <div class="row" @click="getInbox('收件箱')">
                <div class="col">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/02.4.Inbox.png" alt="">
                    </p>
                </div>
                <div class="col">
                    <p>收件箱</p>
                </div>
                <div class="col">
                    <p>{{unReadQty}}</p>
                </div>
            </div>
            <div class="row" @click="getInbox('星标邮件')">
                <div class="col">
                    <p>
                        <img src="https://wx.phxinfo.com.cn/img/wechat/02.4.StarMail.png" alt="">
                    </p>
                </div>
                <div class="col">
                    <p>星标邮件</p>
                </div>
                <div class="col">
                    <!-- <p>{{startQty}}</p> -->
                </div>
            </div>
        </div>
        <h3>文件夹</h3>
        <div class="center">
            <div class="content" v-for="(item,index) in list" :key="index">
                <div class="l">
                    <p>
                        <img :src="item.imgUrl" alt="">
                    </p>
                </div>
                <div class="r">
                    <p  @click="getInbox(item.name,item.Id)">{{item.name}}
                        <span>{{item.num}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="clues-add-button" v-if="!showWrite" @click="onCluesAddBtnClick">
            <van-icon name="plus" size="20px" />
        </div>
        <van-action-sheet
            :show="showWrite"
            :actions="actions"
            :round="false"
            cancel-text="取消"
            @close="onClose"
            @cancel="onCancel"
            @select="onSelect"
            z-index="99999"
        >
        </van-action-sheet>
    </div>
</template>
<script>
export default {
    data(){
        return {
            list:[
                {
                    name:"群邮件",
                    num:"",
                    imgUrl:"https://wx.phxinfo.com.cn/img/wechat/02.4.GroupMail.png"
                },
                {
                    name:"草稿箱",
                    num:"",
                    imgUrl:"https://wx.phxinfo.com.cn/img/wechat/02.4.Drafts.png"
                },
                {
                    name:"已发送",
                    num:"",
                    imgUrl:"https://wx.phxinfo.com.cn/img/wechat/02.4.Sendout.png"
                },
                {
                    name:"已删除",
                    num:"",
                    imgUrl:"https://wx.phxinfo.com.cn/img/wechat/02.4.Delete.png"
                }
            ],
            actions: [
                {
                    id:1,
                    name: '写邮件',
                    color:"#3399ff"
                },
                {
                    id:2,
                    name: '写群邮件',
                    color:"#3399ff"
                }
            ],
            showWrite:false,
            startQty:"",
            unReadQty:"",
            sessionkey:""
        }
    },
    onShow(){

    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;   
        this.getEmailAmount().then((res)=>{
            console.log(this.startQty,'startQty',res);
        });
        this.getQuery();
    },
    methods:{
        getFocus(){
            const url = '/pages/email/searchEmail/main';
            wx.navigateTo({url:url});
        },
        // 获取文件
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.folderQuery,
                    SessionKey:this.sessionkey                    
                }
            }).then(res=>{
                let data = res.data.map(item=>({
                    name:item.Name,
                    Id:item.Id,
                    imgUrl:"https://wx.phxinfo.com.cn/img/wechat/02.4.GroupMail.png"
                }))
                // console.log(data,'-----');
                this.list = this.list.concat(data);
            })
        },
        async getEmailAmount(){
            let response
          await this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.mailbox.qty.get",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.startQty = res.listData.startQty;
                this.unReadQty = res.listData.unReadQty;
                // this.list[1].num = res.listData.draftQty;
                this.list[0].num = res.listData.groupQty;
                this.list[3].num = res.listData.deleteQty;
                response = res;
            })
            return  response;
        },
        getInbox(name,id){
            var ltags = '';
            if(name=='收件箱'){
                ltags = 'inbox';
            }else if(name=='星标邮件'){
                ltags = 'star';
            }else if(name =='群邮件'){
                ltags = 'group';
            }else if(name =='草稿箱'){
                ltags = 'draft';
            }else if(name == '已发送'){
                ltags = 'Sent';
            }else if(name =='已删除'){
                ltags = 'deleted';
            }else {
                ltags = 'folder'
            }
            const url = "/pages/email/inbox/main?name="+name+'&ltags='+ltags+'&folderId='+id;
            wx.navigateTo({url:url});
        },
        onCluesAddBtnClick(){
            this.showWrite = true;
            // const url = "/pages/email/writeMail/main";
            // wx.navigateTo({url:url});
        },
        onClose(){
            this.showWrite = false;
        },
        onCancel(){
            this.showWrite = false;
        },
        onSelect(e){
            let id = e.mp.detail.id;
            if(id==1){
                const url = "/pages/email/writeMail/main";
                wx.navigateTo({url:url});
            }else if(id==2){
                const url = "/pages/email/group/main";
                wx.navigateTo({url:url});
            }
        }
    }
}
</script>
<style lang="scss">
    @import '../../../static/css/public.scss';
    .wrap{
        width: 100%;
        height: 100vh;
        background: #fff;
        .nav{
            width: 100%;
            background: #fff;
            .van-search__content{
                border-radius: 38rpx!important;
            }
            // display: flex;
            // p:nth-child(1){
            //     width: 85%;
            // }
            // p:nth-child(2){
            //     width: 15%;
            //     color: #3399ff;
            //     font-size: 28rpx;
            //     text-align: center;
            //     margin-top: 15px;
            // }
        }
        .header{
            background: #fff;
            .row{
                padding: 20rpx;
                display: flex;
                .col:nth-child(1){
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .col:nth-child(2){
                    flex: 1;
                    margin-left: 20rpx;
                    p{
                        font-size: 28rpx;
                        color: #333;
                        line-height: 80rpx;
                    }
                }
                .col:nth-child(3){
                    p{
                        font-size: 12px;
                        color: #3399ff;
                        line-height: 80rpx;
                    }
                }
                
            }
        }
        h3{
            padding:17rpx 30rpx;
            font-size: 25rpx;
            color: #999999;
            background: #fff;
        }
        .center{
            width: 100%;
            background: #fff;
            .content:last-child .r{
                border:none;
            }
            .content{
                display: flex;
                padding: 20rpx;
                .l{
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .r{
                    width: 100%;
                    border-bottom: 1rpx solid #f6f6f6;
                    margin-left: 20rpx;
                    p{
                        font-size: 28rpx;
                        color: #333;
                        line-height: 80rpx;
                        overflow: hidden;
                        span{
                            float: right;
                            font-size: 12px;
                            color: #cccccc;
                        }
                    }
                }
            }
        }
    }
</style>