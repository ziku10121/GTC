<template>
    <!-- #region 搜尋區-->
    <div class="input-group justify-content-center align-items-center  border-bottom py-3 px-2 SGTP-SearchareaStyle">
        <input
            type="text"
            class="form-control"
            placeholder="交易所 / 商品"
            v-model="QuickSearchInput"
            v-if="IsQuickSearch"
        />
        <slot></slot>
        <span 
            v-if="IsSimpleStyle==false"
            class="input-group-text"  
            id="basic-addon1"
            data-bs-toggle="offcanvas"
            data-bs-target="#Searchsetting"
            aria-controls="Searchsetting"
        >
            進階搜尋
        </span>
        <span
            v-if="IsSimpleStyle==false"
            class="input-group-text"
            @click="OnClickClearBTN()"
        >
        清除篩選
        </span>
    </div>
    <!-- #endregion -->

    <!-- #region 查詢條件設定 下方冒出視窗-->
    <div class="offcanvas offcanvas-bottom h-auto SGTP-OffcanvasStyle" tabindex="-1" id="Searchsetting" aria-labelledby="offcanvasBottomLabel"  v-if="IsSimpleStyle==false">
        <!-- #region 視窗頭-->
        <div class="offcanvas-header" >
            <h5 class="offcanvas-title flex-fill" id="offcanvasBottomLabel">
            查詢條件設定
            </h5>
            <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            ></button>
        </div>
        <!-- #endregion -->
        <!-- #region 視窗身體-->
        <div class="offcanvas-body" v-if="IsSimpleStyle==false">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-6 mb-3">
                        <div class="btn-group btn-group-sm" role="group" aria-label="Basic radio toggle button group">
                            <input type="radio" class="btn-check" name="btnradio" id="buildtime" autocomplete="off" @click="switchBTN=true" :checked="switchBTN" >
                            <label class="btn btn-outline-primary" for="buildtime">建立日期</label>

                            <input type="radio" class="btn-check" name="btnradio" id="activetime" autocomplete="off" @click="switchBTN=false" :checked="!switchBTN">
                            <label class="btn btn-outline-primary" for="activetime">有效日期</label>
                        </div>
                    </div>
                </div>
            <div class="row mb-1">
                <label for="a" class="col-4 col-form-label">條件單序號</label>
                <div class="col-8">
                    <input type="text" class="form-control" placeholder="條件單序號" v-model="condno"/>
                </div>
            </div>
            <div class="row mb-1" v-if="IsSubAccountDisplay">
                <label for="subaccount" class="col-4 col-form-label">子帳號</label>
                <div class="col-8">
                    <select v-model="account" class="form-select" id="subaccount">
                        <option value=''>全選</option>
                        <option v-for="item in NoFilterAccData" :key="item" :value="item">{{item.acc}}</option>
                    </select>
                </div>
            </div>
            <div class="row mb-1">
                <span class="col-4 col-form-label" id="startdate">起始日期</span>
                <div class="col-8">
                <div class="input-group">
                    <input
                        type="date"
                        class="form-control"
                        placeholder="起始日期"
                        v-model="startdate"
                        :class="{'is-invalid':startdateError}"
                    />
                    <div class="invalid-feedback">請輸入正確日期</div>
                </div>
                </div>
            </div>
            <div class="row mb-1">
                <span class="col-4 col-form-label" id="enddate">終止日期</span>
                <div class="col-8">
                    <input
                    type="date"
                    class="form-control"
                    placeholder="結束日期"
                    v-model="enddate"
                    :class="{'is-invalid':enddateError}"
                    :min="startdate"
                    />
                    <div class="invalid-feedback">請輸入正確日期</div>
                </div>
            </div> 
            <div class="row mb-1">
                <span class="col-4 col-form-label" id="basic-addon1">商品別</span>
                <div class="col-8">
                    <select id="d" class="form-select" v-model="comtype">
                        <option value="0">期貨</option>
                        <option value="1">選擇權</option>
                    </select>
                </div>
            </div>
            <div class="row mb-1">
                <span class="col-4 col-form-label" id="basic-addon1">交易所</span>
                <div class="col-8">
                    <select id="c" class="form-select" v-model="exh">
                        <option value="">全選</option>
                        <option v-for="item in NoFilterExhDataCompute" :key="item" :value="item.Exhno">{{item.Exhname}}({{item.Exhno}})</option>
                    </select>
                </div>
            </div>
            <div class="row mb-1">
                <span class="col-4 col-form-label" id="basic-addon1">商品</span>
                <div class="col-8">
                    <select id="d" class="form-select" v-model="com">
                        <option value="">全選</option>
                        <option v-for="item in NoFilterComDataCompute" :key="item" :value="item.Comno">{{item.ComName}}({{item.Comno}})</option>
                    </select>
                </div>
            </div>
            <!-- 按鈕 -->
            <div class="row mt">
                <div class="col-6">
                    <button class="btn SGTP-BtnStyle-cancel w-100" @click="OnClearSetting()">清除</button>
                </div>
                <div class="col-6">
                    <button class="btn SGTP-BtnStyle-confirm w-100" @click="OnClickQuery" :data-bs-dismiss="queryBTNclass" >查詢</button>
                </div>
            </div>
        </div>
        </div>
        <!-- #endregion -->
    </div>
    <!-- #endregion 查詢條件設定結束 -->

</template>
<script>
import { computed, ref, toRef } from '@vue/reactivity'
import { onBeforeMount, watch } from '@vue/runtime-core';
import { useStore } from 'vuex'
import format from '../utility/format'
import { useRouter } from 'vue-router'

export default {
    props:{
        IsSimpleStyle:{
            type:Boolean,
            default:false
        },
        IsQuickSearch:{
            type:Boolean,
            default:true
        }
    },
    emits:['OnClickSearch','ClearSearchResult','OnQuickSearch'],
    setup(props,context){
        //#region variable
        const props_IsSimple = toRef(props,'IsSimpleStyle');
        const store = useStore();
        // eslint-disable-next-line no-unused-vars
        const router = useRouter();
        var QuickSearchInput =ref('');
        var account = ref('');
        var switchBTN=ref(true);
        var startdate = ref('');
        var startdateError = ref('');
        var enddate = ref('');
        var enddateError = ref('');
        var condno = ref('');
        var exh = ref('');
        var com = ref('');
        var comtype = ref(0);
        var valid = ref(false);
        //自訂查詢條件單QC
        var queryobj = computed(()=>{return{
            "accountID": {
                "SessionKey": store.state.CustObj.sessionkey,
                "account": store.state.CustObj.Ac,
                "company": store.state.CustObj.Fm,
                "srctype": store.state.CustObj.sr
            },
            "qc": {
                "gtdcond": {
                    "CondStatus" : "9"
                },
                "acc" : store.state.CustObj.Ac, 
                "co" : store.state.CustObj.Fm,
                "subacc" : '',
                "subaco" : '',
                "pdtyp" : switchBTN.value ? 1 : 2 ,
                "mode": {
                    "amount": 100,
                    "index": 1,
                    "type": 2
                },
            },
        }});
        var OnQueryBTNClick = ref(false);

        //#endregion variable
        //compute
        const NoFilterAccData = computed(()=>{
            return store.state.NoFilterAccData.cust;
        });
        //Compute交易所資料
        const NoFilterExhDataCompute = computed(()=>{
            return store.state.NoFilterComData.ExhData_list;
        });
        //Compute商品資料
        const NoFilterComDataCompute = computed(()=>{
            if( store.state.NoFilterComData.ComData_list!=null ){
                var result = store.state.NoFilterComData.ComData_list.filter( item => item.Exhno==exh.value);
                return result;
            }
            else{
                return null;
            }
        });
        const IsSubAccountDisplay = computed(()=>{
            var result = false;
            if(store.state.NoFilterAccData!=null&&store.state.NoFilterAccData!=undefined){
                if(store.state.NoFilterAccData.cust != undefined){
                    for( let i=0 ; i<store.state.NoFilterAccData.cust.length ;i++ ){
                        if(store.state.NoFilterAccData.cust[i].cutyp!=0||store.state.NoFilterAccData.cust[i].cutyp!=2 || store.state.NoFilterAccData.cust[i].cutyp!=4){
                            result=true;
                            break;
                        }
                    }
                    return result;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        })
        const queryBTNclass = computed(()=>{
            if( !IsTimeNaN(startdate.value) && !IsTimeNaN(enddate.value) ){
                return 'offcanvas'
            }
            else{
                return ''
            }
        });
        watch(QuickSearchInput,(new_value,old_value)=>{
            if(QuickSearchInput.value == true)
                context.emit('OnQuickSearch',QuickSearchInput.value);
        })
        //#region watch
        //條件單序號Input
        watch(condno,()=>{
            queryobj.value.qc.gtdcond.Condno = condno.value;
        });
        //子帳號選擇
        watch(account,()=>{
            queryobj.value.qc.subacc = account.value.acc;
            queryobj.value.qc.subaco = account.value.co;
        });
        //商品別Select
        watch(comtype,()=>{
            queryobj.value.qc.ctyp = comtype.value;
            exh.value='';
            com.value='';
        });
        //交易所Select
        watch(exh,()=>{
            queryobj.value.qc.exh = exh.value;
        });
        //商品Select
        watch(com,()=>{
            queryobj.value.qc.com = com.value;
        });
        watch(startdate,(new_value,old_value )=>{
            // console.log(new_value);
            queryobj.value.qc.sdt = format.ToJsonDate(startdate.value.replace(/-/g, '/'));
            validempty("startdate", startdate.value);
        });
        watch(enddate,(new_value,old_value)=>{
            queryobj.value.qc.edt = format.ToJsonDate(enddate.value.replace(/-/g, '/'));
            validempty("enddate", enddate.value);
        });
        watch(switchBTN,()=>{
            if(switchBTN.value){
                queryobj.value.qc.pdtyp = 1;
            }
            else{
                queryobj.value.qc.pdtyp = 2;
            }
        });
        //#endregion watch
        
        //#region methods
        //判斷填入時間是否為空值
        // eslint-disable-next-line no-unused-vars
        const IsTimeNaN=(time)=>{
            return isNaN(new Date(time+ ' 00:00:00').getTime());
        }
        //查詢條件驗證
        const validate = () => {
            valid = true;
            if (!validempty("startdate", startdate.value)) {
				valid = false;
			}
			if (!validempty("enddate", enddate.value)) {
				valid = false;
			}
            return valid;
        }
        const validempty = (type, item) => {
            var tempError = (item == "" || item == "undefined") ? true : false;
            switch (type) 
            {
                case "startdate":
                startdateError.value = tempError;
                break;
                case "enddate":
                enddateError.value = tempError;
                break;
            }
            return !tempError;
		};
        //點選查詢事件
        const OnClickQuery = ()=>{
            validate();
            if(props_IsSimple.value==false && valid){
                if( startdate.value=='' || enddate.value == '' ){
                    OnQueryBTNClick.value=true;
                }
                else{
                    OnQueryBTNClick.value=false;
                    var emitMsg = queryobj.value;
                    context.emit('OnClickSearch',emitMsg);
                }
            }
        }
        //清除剛剛的搜尋結果
        const OnClickClearBTN=()=>{
            if(props_IsSimple.value==false){
                context.emit('ClearSearchResult');
            } 
        }
        //清除所設定篩選值
        const OnClearSetting=()=>{
            ClearToDefault();
        }
        const ClearToDefault =()=>{
            startdate.value = '';
            enddate.value = '';
            condno.value = '';
            exh.value = '';
            com.value = '';
            comtype.value = 0;
        }
        //#endregion methods

        //call methods
        
        //lifecycle
        onBeforeMount(()=>{
            if(props_IsSimple.value==false){
                store.dispatch('GetInitialData');
            }
        })

        return{
            condno,exh,QuickSearchInput,startdate,startdateError,enddate,enddateError,com,comtype,account,IsSubAccountDisplay,
            switchBTN,queryBTNclass,NoFilterExhDataCompute,NoFilterComDataCompute,NoFilterAccData,queryobj,
            OnClickQuery,OnClearSetting,OnClickClearBTN
        }
    },
}
</script>