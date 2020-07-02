const v = '/rest';
const api = {
    message:{
        queryList:v 
    },
    login:{
        login:'/wxmi/UserLogin.aspx'
    },
    email:{
        thoroughDel:"email.delete",// 彻底删除
        folderQuery:"email.folder.my", // 获取文件
        addFolder:"email.folder.add", // 新建文件
        emailMove:"email.folder.move", // 移动到文件夹
    },
    mailList:{
        queryAll:"oa.addresslist.user.search", // 查询所有联系人
    }
}
export default api;