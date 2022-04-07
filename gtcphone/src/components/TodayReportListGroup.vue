/* eslint-disable no-unused-vars */
<template>
    <div id="ReportListGroup" style="z-index: 0"> 
        <SearchArea ref="Ref_SearchArea" :IsSimpleStyle="true" @OnQuickSearch="QuickTodayConSearch">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{FilterAccSpanText==''?'全部帳號':FilterAccSpanText}}</button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" @click="FilterAccClick">全部帳號</a></li>
                <li v-for="item in NoFilterAccData.cust" :key="item"><a class="dropdown-item" @click="FilterAccClick">{{item.acc}}</a></li>
            </ul>
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{FilterStatusSpanText==''?'全部狀態':FilterStatusSpanText}}</button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" @click="FilterStatusClick">全部狀態</a></li>
                <li><a class="dropdown-item" @click="FilterStatusClick">未啟動</a></li>
                <li><a class="dropdown-item" @click="FilterStatusClick">啟動</a></li>
                <li><a class="dropdown-item" @click="FilterStatusClick">已送出</a></li>
                <li><a class="dropdown-item" @click="FilterStatusClick">人工暫停</a></li>
                <li><a class="dropdown-item" @click="FilterStatusClick">系統暫停</a></li>
                <li><a class="dropdown-item" @click="FilterStatusClick">預約結案</a></li> 
                <li><a class="dropdown-item" @click="FilterStatusClick">結案</a></li>
            </ul>
            <button type="button" class="btn btn-outline-secondary" @click="FilterData()"><i class="bi bi-search"></i></button>
        </SearchArea>
        <TouchMove @refresh="Refresh" @movepos="moveposevent" @touchend="touchendEvent">
            <div class="d-flex justify-content-center my-2 " v-if="IsRefresh">
                <div class="spinner-border " role="status" > 
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div :style="{height:movepos+'px'}"></div>
            </div>
            <div class="row row-cols-1 gy-2 gx-2">
                <div v-for="item in TodayCondOrder" :key="item" :style="{display:(typeof(item.show) == 'undefined' || item.show)?'block':'none'}">
                    <ReportListGroup :GTDOrder="item"></ReportListGroup>
                </div>
            </div>
            <div class="row mt-3 h-100" v-if=" (JSON.stringify(TodayCondOrder)=='{}' || JSON.stringify(TodayCondOrder)=='[]') && IsRefresh==false">
                <p class="text-center">無符合結果</p>
            </div>
        </TouchMove> 
    </div>
</template>
<script>
import SearchArea from './searchsetting.vue'; 
import TouchMove from './TouchMove.vue'
import ReportListGroup from './ReportList.vue'
import {GetCondOrder} from '../api/Api_manager'
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { onBeforeMount, watch, } from '@vue/runtime-core';

export default {
    components:{ReportListGroup,TouchMove,SearchArea},
    setup() {
        const router = useRouter();
        const store = useStore();
        var TodayCondOrder  = ref([]);
        var TodayCondOrderQC = computed(()=>{
            return{
                "accountID": {
                    "SessionKey": store.state.CustObj.sessionkey,
                    "account": store.state.CustObj.Ac,
                    "company": store.state.CustObj.Fm,
                    "srctype": store.state.CustObj.sr
                },
                "qc": {
                    "gtdcond": {
                        "CondStatus": "0"
                    },
                    "mode": {
                        "amount": 100,
                        "index": 1,
                        "type": 2
                    },
                    "pdtyp": 0,
                    "ctyp":"8",
                    "acc":store.state.CustObj.Ac,
                    "co":store.state.CustObj.Fm,
                    "subacc":'',
                    "subco":''
                }
            }
        });
        var IsTodayGTDordersLoading = ref(false);
        var IsTodayCondOrderNoResult = ref(false);

        var IsRefresh = ref(false);
        var movepos = ref(0);

        var QuickTodaySearchInput = ref('');
        var Ref_SearchArea = ref('');
        var QuickSearchStatus = ref('all');
        var QuickSearchAccount = ref('all');

        var FilterStatusSpanText = ref('');
        var FilterAccSpanText = ref('');
        
        const NoFilterAccData = computed(()=>{
            return store.state.NoFilterAccData;
        });
        const NoFilterComData = computed(()=>{
            return store.state.NoFilterComData;
        });

        const ComputedCondReply = computed(()=>{
            return store.state.WsCondReply;
        })
        watch(ComputedCondReply,()=>{
            if(JSON.stringify(TodayCondOrder.value)!='[]' || JSON.stringify(TodayCondOrder.value)!='{}'){
                var count = 0;
                TodayCondOrder.value.forEach(function(item){
                    if(item.condno.trim() == ComputedCondReply.value.condno.trim()){
                        count++;
                        item = Object.assign(item,ComputedCondReply.value);
                    }
                });
                if(count==0){
                    TodayCondOrder.value.unshift(ComputedCondReply.value);
                } 
            }  
        });

        //methods
        const FilterData =()=>{ 
            QuickTodaySearchInput.value = Ref_SearchArea.value.QuickSearchInput;
            TodayCondOrder.value.forEach(CheckDataShow);
        }
        const CheckDataShow =(item)=>{
            var input = QuickTodaySearchInput.value;  
            var SearchExh = mappingEXH( NoFilterComData.value,input);
            var SearchCom = mappingCom( NoFilterComData.value,input);
            var MixArray = SearchCom.concat(SearchExh);
        
            if( QuickSearchAccount.value =='all' || QuickSearchAccount.value == item.subacc ){
                if(QuickSearchStatus.value == 'all' || QuickSearchStatus.value == item.condstatus){
                    //item.show = true; 
                    if(input != '') {
                        for( let i=0 ; i < MixArray.length ; i++ ){
                            if(item.exh.toLowerCase()==MixArray[i]||item.com.toLowerCase()==(MixArray[i]) ){
                                item.show = true;
                                return;
                            }
                        } 
                    }
                    else{
                        item.show = true;
                        return;
                    }
                    //return;
                }
            }
            item.show = false;
        }
        //模糊篩選
        const selectMatchItems=(lists, keyWords)=> {
            let result = [];
            let input = keyWords.trim().toLowerCase();
            var SearchExh = mappingEXH(NoFilterComData.value,input);
            var SearchCom = mappingCom(NoFilterComData.value,input);
            var MixArray = [];
            MixArray=SearchCom.concat(SearchExh); 
            MixArray.push(input);
            lists.filter(item=>{
                for( let i=0;i < MixArray.length;i++ ){
                    var IsTrue=(item.condno.toLowerCase().includes(MixArray[i])||item.exh.toLowerCase().includes(MixArray[i])||item.com.toLowerCase().includes(MixArray[i]));
                    if( IsTrue)
                    {
                        result.push(item);
                        break;
                    }
                }
            })
            return result;
        }
        //拿輸入的字找到帶有這字眼的交易所
        const mappingEXH=(data,str)=>{
            var result = [];
            var lowstr = str.toLowerCase();
            var rawdata = data.ExhData_list;
            for( var item in rawdata ){
                if(rawdata[item].Exhno.toLowerCase().includes(lowstr) || rawdata[item].Exhname.toLowerCase().includes(lowstr)){
                    result.push(rawdata[item].Exhno.toLowerCase());
                }   
            }
            return result;
        }
        //拿輸入的字找到帶有這字眼的商品
        const mappingCom =(data,str)=>{
            var result = [];
            var lowstr = str.toLowerCase();
            var rawdata = data.ComData_list;
            for( var item in rawdata ){
                if(rawdata[item].Comno.toLowerCase().includes(lowstr) || rawdata[item].ComName.toLowerCase().includes(lowstr)){
                    result.push(rawdata[item].Comno.toLowerCase());
                }   
            }
            return result;
        }
        //API methods
        //條件單API
        const CallCondOrderApi = async(page=1) =>{
            try{
                TodayCondOrderQC.value.qc.mode.index = page;
                var JsonData = JSON.stringify(TodayCondOrderQC.value);
                IsTodayGTDordersLoading.value = true;
                IsRefresh.value = true;
                var result = await GetCondOrder(JsonData);
                if( result.statusText=='OK' && result.data.condord!=null || result.data.condord!= undefined){
                    TodayCondOrder.value = result.data.condord;
                    QuickSearchStatus.value = 'all';
                    QuickSearchAccount.value = 'all';
                    FilterStatusSpanText.value = '全部狀態';
                    FilterAccSpanText.value = '全部帳號';
                }
                else{
                    router.push({name:'loginfail'});
                }
                IsTodayGTDordersLoading.value = false;
                IsRefresh.value = false;
            }
            catch(err){
                console.log(err);
            }
        }
        //更新動畫
        const Refresh=(event)=>{ 
            IsRefresh.value = event;
        }
        const moveposevent=(event)=>{
            movepos.value = event;
        }
        //快速搜尋
        const QuickTodayConSearch=(event)=>{
            // console.log('點及')
            QuickTodaySearchInput.value = event;
        }
        //更新API
        const touchendEvent=(event)=>{
            // console.log("end")
            if( event.IsRefresh && IsTodayGTDordersLoading.value==false){
                CallCondOrderApi(1);
            }
        }
        //li click
        const FilterStatusClick =(event)=>{
            FilterStatusSpanText.value  = event.target.innerText;
            switch(FilterStatusSpanText.value){
                case '全部狀態':
                    QuickSearchStatus.value='all';
                    break;
                case '未啟動':
                    QuickSearchStatus.value=1;
                    break; 
                case '啟動':
                    QuickSearchStatus.value=2;
                    break;
                case '已送出':
                    QuickSearchStatus.value=4;
                    break;
                case '人工暫停':
                    QuickSearchStatus.value=7;
                    break;
                case '系統暫停':
                    QuickSearchStatus.value=5;
                    break;
                case '結案':
                    QuickSearchStatus.value=9;
                    break;
                case '預約結案':
                    QuickSearchStatus.value=12;
                    break;
                default:
                    break;
            }
        }
        const FilterAccClick =(event)=>{
            if(event.target.innerText=='全部帳號'){
                QuickSearchAccount.value = 'all';
                FilterAccSpanText.value  = event.target.innerText;
            }
            else{
                FilterAccSpanText.value  = event.target.innerText;
                QuickSearchAccount.value = event.target.innerText;
            }
        }

        
        //call methods
        onBeforeMount(()=>{
            CallCondOrderApi(1);
        })
        
        return{
            IsTodayGTDordersLoading,IsRefresh,IsTodayCondOrderNoResult,TodayCondOrder,movepos,FilterStatusSpanText, NoFilterAccData,FilterAccSpanText,Ref_SearchArea,
            moveposevent,Refresh,QuickTodayConSearch,touchendEvent,FilterStatusClick,FilterAccClick,selectMatchItems,FilterData,
        }
    },
}
</script>
<style scoped>
    .card-header-undifine{
        background-color: rgba(0,0,0,0.15) !important;
    }
    .card-header-start{
        background-color: rgba(21,115,71,0.15) !important;
    }
    .card-header-end{
        background-color: rgba(105,113,121,0.15) !important;
    }
    .card-header-sent{
        background-color: rgba(21,115,71,0.15) !important;
    }
    .card-header-pause{
        background-color: rgba(247,187,7,0.15) !important;
    }
</style>