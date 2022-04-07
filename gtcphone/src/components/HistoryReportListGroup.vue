<template>
    <div id="ReportListGroup">
        <SearchArea @OnQuickSearch="QuickHisConSearch" :IsQuickSearch="false" @OnClickSearch="OnQuery" @ClearSearchResult="OnClearSearchResult">
        </SearchArea>
        <TouchMove @refresh="Refresh" @loadingMore="LoadingMore" @movepos="moveposevent" @touchend="touchendEvent">
            <div class="d-flex justify-content-center my-2 " v-if="IsRefresh">
                <div class="spinner-border " role="status" > 
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div :style="{height:movepos+'px'}"></div>
            </div> 
            <div class="row" v-if="IsQueryDataEmpty">
                <p class="text-center">無符合結果</p>
            </div>
            <div v-for="item in FilterHisGTDorders" :key="item">
                <ReportListGroup :GTDOrder="item"></ReportListGroup>
            </div>

            <div class="d-flex justify-content-center" v-if="IsLoadingMore">
                <p class="my-2">載入更多</p>
            </div>
            <div class="row" v-else>
                <div class=" text-center SGTP-TextStyle-Tobottom"  v-if="IsHisCondOrderToMaxPage && IsRefresh==false && IsQueryDataEmpty==false">
                    <p class="my-2">無下一筆資料</p>
                </div>
            </div>
        </TouchMove> 
    </div>
</template>
<script>
import SearchArea from './searchsetting.vue'; 
import TouchMove from './TouchMove.vue'
import ReportListGroup from './ReportList.vue'
import {GetCondOrder,} from '../api/Api_manager'
import { computed, ref } from '@vue/reactivity'

export default {
    components:{ReportListGroup,TouchMove,SearchArea},
    setup() {
        var HisCondOrder  = ref([]);
        var HisCondOrderQC = ref({});
        var HisCondOrderPage = ref(1);
        var IsHisCondOrderToMaxPage = ref(false);
        var IsHisGTDordersLoading = ref(false);
        var IsHisCondOrderNoResult = ref(false);

        var NoFilterComData = ref([]);
        //載入更多控制
        var IsLoadingMore = ref(false);
        //查無結果控制
        var IsQueryDataEmpty = ref(false);
        //載入動畫控制
        var IsRefresh = ref(false);
        //有無下一頁
        var HaveNextPage = ref(false);

        var movepos = ref(0);
        var QuickHisSearchInput = ref('');
        var FilterSpanText = ref('');
        
        //computed
        const FilterHisGTDorders=computed(()=>{
            IsHisCondOrderNoResult.value = false;
            if(HisCondOrder.value!=null){
                //輸入框沒值
                if(QuickHisSearchInput.value==''){
                    IsHisCondOrderNoResult.value =  HisCondOrder.value.length==0? true : false ;
                    return HisCondOrder.value;
                }
                else{
                    var result = selectMatchItems( HisCondOrder.value , QuickHisSearchInput.value );
                    IsHisCondOrderNoResult.value =  result.length==0? true : false ;
                    return result
                }
            }
            else{
                IsHisCondOrderNoResult.value = false;
                return {};
            }
        });
        //methods
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
                    var IsTrue = item.condno.toLowerCase().includes(MixArray[i])||item.exh.toLowerCase().includes(MixArray[i])||item.com.toLowerCase().includes(MixArray[i]); 
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
        const CallCondOrderApi = async(page=1) =>{
            try{
                HisCondOrderQC.value.qc.mode.index = page;
                var JsonData = JSON.stringify(HisCondOrderQC.value);
                IsHisGTDordersLoading.value = true;
                IsRefresh.value = true;
                var result = await GetCondOrder(JsonData);
                if(result.statusText=='OK'){
                    if(result.data.condord!=null && result.data.condord!= undefined){
                        IsHisCondOrderToMaxPage.value = JSON.stringify(result.data.condord) == '[]' ? true : 0 ;
                        if( result.data.condord.length == 0 && page==1){
                            IsQueryDataEmpty.value =true;
                        }
                        HisCondOrder.value = Object.assign(result.data.condord,HisCondOrder.value);
                    }
                    else{
                        // console.log('查詢失敗');
                    }
                }
                else{
                    // console.log('查詢失敗');
                }
                IsHisGTDordersLoading.value = false;
                IsRefresh.value = false;
                IsLoadingMore.value = false;
            }
            catch(err){
                console.log(err);
            }
        }
        //載入更多 載入下一頁
        const LoadingMore = (event)=>{
            IsLoadingMore.value = event;
        }
        //更新動畫
        const Refresh=(event)=>{ 
            IsRefresh.value = event;
        }
        const moveposevent=(event)=>{
            movepos.value = event;
        }
        //快速搜尋
        const QuickHisConSearch=(event)=>{
            QuickHisSearchInput.value = event;
        }
        //更新API
        const touchendEvent=(event)=>{
            IsLoadingMore.value = false;
            //重新刷新
            if( event.IsRefresh && IsHisGTDordersLoading.value==false){
                CallCondOrderApi(1);
            }
            //加載更多
            if( event.IsLoadingMore && IsHisGTDordersLoading.value==false && IsHisCondOrderToMaxPage.value == false){
                HisCondOrderPage.value ++ ;
                IsLoadingMore.value = true;
                CallCondOrderApi( HisCondOrderPage.value );
            }
        }
        //點選查詢
        const OnQuery =(event)=>{
            HisCondOrderQC.value = event;
            CallCondOrderApi(1);
        }
        const OnClearSearchResult =()=>{
            if(HisCondOrder.value!=null&&HisCondOrder.value!=undefined){
                for(let key in HisCondOrder.value) {
                    delete HisCondOrder.value[key]
                }
            }
        }
        
        return{
            IsHisGTDordersLoading,IsRefresh,IsLoadingMore,IsHisCondOrderNoResult,IsHisCondOrderToMaxPage,FilterHisGTDorders,movepos,FilterSpanText,NoFilterComData,
            IsQueryDataEmpty,HaveNextPage,
            moveposevent,Refresh,LoadingMore,QuickHisConSearch,touchendEvent,OnQuery,OnClearSearchResult
        }
    },
}
</script>