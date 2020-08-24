const publics = {
    state:{
        conference:{
            name:"",
            id:"",
            startTime:"",
            endTime:""
        },
        conferenceLink:"", // 会议室列表编辑图片
        messageTotal:""
    },
    mutations:{
        getConferenceName(state,obj){
            console.log(obj,'----------')
            state.conference.name = obj.name;
            state.conference.id = obj.id;
            state.conference.startTime = obj.startTime;
            state.conference.endTime = obj.endTime;
        },
        clearConferce(state,obj){
            state.conference = obj;
        },
        getLink(state,src){
            state.conferenceLink = src;
        },
        getMessageTotal(state,total){
            state.messageTotal = total;
        }
    },
    actions:{

    },
    getters:{

    }
}
export default publics;