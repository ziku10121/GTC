<template>
    <div class="sticky-top bg-light">
        <!-- 導覽列 -->
        <mynav />
        <!-- 搜尋 -->   
        <ul class="nav justify-content-center border-bottom">
            <li class="nav-item" @click="OnclickReportSearch()" :class="CurrentPage==1?'border-bottom border-danger':''" >
                <a class="nav-link" :class="CurrentPage!=1?'link-dark':'link-danger'">回報查詢</a>
            </li>
            <li class="nav-item" @click="OnclickHistorySearch" :class="CurrentPage==2?'border-bottom border-danger':''" >
                <a class="nav-link " :class="CurrentPage==1?'link-dark':'link-danger'">歷史查詢</a>
            </li>
        </ul> 
    </div>
    <div class="container pt-2">
        <div v-if="CurrentPage==1">
            <TodayReport/>
        </div>
        <div v-if="CurrentPage==2">
            <HistoryReport/>
        </div>
    </div>
</template>
<script>
import mynav from "../components/mainnav.vue";
import HistoryReport from '../components/HistoryReportListGroup.vue'
import TodayReport from '../components/TodayReportListGroup.vue'
import {  ref } from '@vue/reactivity';

export default {
    name: "Report",
    components: { mynav,TodayReport,HistoryReport },
    setup(){
        //#region variable
        var CurrentPage = ref(1);
        //#region 分頁切換按鈕規則
        const OnclickHistorySearch=()=>{
            CurrentPage.value = 2; 
        }
        const OnclickReportSearch=()=>{
            CurrentPage.value = 1
        }

        return{
            CurrentPage,OnclickHistorySearch,OnclickReportSearch,
        }
    },
    beforeRouteEnter(to, from, next){
        next(vm=>{
            if(vm.$store.state.CustObj.sessionkey==''){
                vm.$router.push({name:'DataLoadingPage'});
            }
        })
    }
};
</script>
<style scoped>
</style>