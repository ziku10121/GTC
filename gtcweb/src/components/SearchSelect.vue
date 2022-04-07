<template>
    <form action="" class="p-3 p-lg-4" style="background: white" novalidate>
        <!-- #region 分公司 帳戶 子帳號 -->	
        <div class="row mb-4 text-start">
            <div class="col-12 col-lg-2 mb-2">
                <div class="row">
                    <div class="col-4 col-lg-auto">
                        <label for="inputTextInput" class="col-form-label fw-bold">分公司：</label>
                    </div>
                    <div class="col-auto col-lg-auto">
                        <label for="inputTextInput" class="col-form-label text-start">{{searchObject.co}}</label>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-2 mb-2">
                <div class="row">
                    <div class="col-4 col-lg-auto">
                        <label for="inputTextInput" class="col-form-label fw-bold">帳號：</label>
                    </div>
                    <div class="col col-lg-auto">
                        <label for="inputTextInput" class="col-form-label">{{searchObject.acc}}</label>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-2" v-show="IsSubAccountDisplay">
                <div class="row">
                    <div class="col-4 col-lg-auto">
                        <label for="inputTextInput" class="col-form-label fw-bold">子帳號：</label>
                    </div>
                    <div class="col-8 col-lg">
						<select id="searchsubaccount" class="form-select" v-model="subaccount">
							<option selected value="">全部</option>
							<option v-for="item in cust" :key="item" :value="item">{{item.acc}}</option>
						</select>
						<div class="invalid-feedback">請選擇子帳號</div>
					</div>
                </div>
            </div>
        </div>
        <!-- #endregion -->	
        <hr>
        <div class="row mt-3 text-start">
            <!-- #region 條件序號 -->	
            <div class="col-12 col-lg-6 col-xl-4 col-xxl-2 mb-3 mb-lg-3">
                <div class="row">
                    <div class="col-4 col-lg-12">
                        <label for="condno" class="col-form-label fw-bold">條件序號</label>
                    </div>
                    <div class="col-8 col-lg">
                        <input id="condno" class="form-control" type="text" v-model="condno">
                    </div>
                </div>
            </div>
            <!-- #endregion -->	

            <!-- #region 當前狀態 -->	
            <!-- <div class="col-12 col-lg-6 col-xl-4 col-xxl-2 mb-3 mb-lg-3">
                <div class="row">
                    <div class="col-4 col-lg-12">
                        <label class="col-form-label fw-bold" for="condstatus">當前狀態</label>
                    </div>
                    <div class="col col-lg">
                        <select id="condstatus" class="form-select" v-model="condstatus">
                            <option value="0" selected>全選</option>
                            <option value="1">未啟動</option>
                            <option value="2">啟動</option>
                            <option value="4">已送出</option>
                            <option value="5">系統暫停</option>
                            <option value="7">人工暫停</option>
                            <option value="9">結案</option>
                            <option value="12">已預約結案</option>
                            <option value="99">狀態不明</option>
                        </select>
                    </div>
                </div>
            </div> -->
            <!-- #endregion -->	

            <!-- #region 交易所 -->	
            <div class="col-12 col-lg-6 col-xl-4 col-xxl-2 mb-3 mb-xl-5 mb-xxl-3">
                <div class="row">
                    <div class="col-4 col-lg-12">
                        <label class="col-form-label fw-bold" for="exh">交易所</label>
                    </div>
                    <div class="col-8 col-lg">
                        <select id="searchexh" class="form-select" v-model="exh">
                            <option value="" selected>全選</option>
                            <option v-for="item in cominfo.ExhData_list" :key="item.Exhno" :value="item.Exhno">
                               {{item.Exhname}} ({{item.Exhno}})
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- #endregion -->	

            <!-- #region 商品別 -->	
            <div class="col-12 col-sm-6 col-xl-4 col-xxl-2 mb-3 mb-xl-5 mb-xxl-3">
                <div class="row">
                    <div class="col-4 col-sm-auto col-lg-12">
                        <label for="comtype" class="col-form-label fw-bold">商品別</label>
                    </div>
                    <div class="col-8 col-sm-8 col-lg">
                        <select id="searchcomtype" class="form-select" v-model="comtype">
                            <option value="8" selected>全選</option>
                            <option value="0">期貨</option>
                            <option value="1">選擇權</option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- #endregion -->	

            <!-- #region 商品 -->	
            <div class="col-12 col-sm-6 col-xl-4 col-xxl-2 mb-3 mb-xl-5 mb-xxl-3">
                <div class="row">
                    <div class="col-4 col-sm-auto col-lg-12">
                        <label  class="col-form-label fw-bold" for="com">商品</label>
                    </div>
                    <div class="col-8 col-sm-8 col-lg">
                        <select id="searchcom" class="form-select" v-model="com">
                            <option value="" selected>全選</option>
                            <option v-for="item in computedCom" :key="item.Comno" :value="item.Comno">
                               {{item.ComName}}({{item.Comno}})
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- #endregion -->	

            <!-- #region 來源別 -->	
            <div class="col-12 col-sm-6 col-xl-4 col-xxl-2 mb-3 mb-xl-5 mb-xxl-3">
                <div class="row">
                    <div class="col-4 col-sm-auto col-lg-12">
                        <label class="col-form-label fw-bold" for="srctype">來源別</label>
                    </div>
                    <div class="col-8 col-sm-8 col-lg">
                        <select id="srctype" class="form-select" v-model="srctype">
                            <option value="" selected>全選</option>
                            <option value="00">人工單</option>
                            <option value="10">精誠手機</option>
                            <option value="20">精誠網頁</option>
                            <option value="40">精誠交易員AP</option>
                            <option value="48">W來電下單</option>
                            <option value="49">長校單下單</option>
                            <option value="81">API</option>
                            <option value="99">交易所刪單</option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- #endregion -->	

            <!-- #region 空白格式排列 -->
            <div class="col-12 col-lg-6 col-xl-4 col-xxl-2 mb-3 mb-lg-3">
            </div>
            <!-- #endregion -->

            <!-- #region 查詢方式 -->	
            <div class="col-12 col-lg-4 col-xl-4 col-xxl-2 mb-3 mb-lg-3">
                <div class="row">
                    <div class="col-4 col-lg-12">
                        <label class="col-form-label fw-bold" for="searchtype">查詢方式</label>
                    </div>
                    <div class="col-8 col-lg">
                        <div class="row text-center">
                            <div class="col btn-group">
                                <input type="radio" class="btn-check" name="stype" id="createtime" value="1" v-model="timetype">
                                <label class="btn btn-outline-dark ms-4" for="createtime">建立日期</label>
                                <input type="radio" class="btn-check" name="stype" id="activetime" value="2" v-model="timetype">
                                <label class="btn btn-outline-dark me-4" for="activetime">有效日期</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- #endregion -->	

            <!-- #region 建立時間 -->	
            <div class="col-12 col-lg-8 col-xl-12 col-xxl-4 mb-3 mb-lg-3">
                <div class="row align-items-center text-start">
                    <div class="col-12 col-lg-12">
                        <label class="col-form-label fw-bold" v-if="timetype==1">建立日期</label>
                        <label class="col-form-label fw-bold" v-if="timetype==2">有效日期</label>
                    </div>
                    <div class="col-12 col-lg">
                        <input type="Date" class="form-control date" id="StartDate" v-model="startdate">
                    </div>
                    <div class="col-1 text-center">至</div>
                    <div class="col-12 col-lg">
                        <input type="Date" class="form-control date" id="EndDate" :min="startdate" v-model="enddate">
                    </div>
                </div>
            </div>
            <!-- #endregion -->	
        </div>
        <!-- #region 按鈕 -->
        <div class="row justify-content-end">
            <div class="col-6 col-sm-6 col-md-3 col-lg-2 col-xxl-1">
                <button class="btn btn-secondary w-100 w-xl-75" type="button" :disabled="false" @click="OnReset">重設條件</button>
            </div>
            <div class="col-6 col-sm-6 col-md-3 col-lg-2 col-xxl-1">
                <button class="btn btn-primary w-100 w-xl-75" type="button" @click="OnQuery">查詢</button>
            </div>
        </div>
         <!-- #endregion -->	
    </form> 
</template>

<script>
import convert from "../utility/convert";

import {computed, ref, toRef} from "@vue/reactivity";
import {onMounted, watch} from '@vue/runtime-core';
import {useStore} from "vuex";
export default {
    emits: ["query"],
    setup(props, context) {
        //Variable
        const store = useStore();
		const cominfo = computed(()=>{
            return store.state.NoFilterComData;
        });
        const cust = computed(()=>{
            return store.state.NoFilterAccData.cust;
        });
        const IsSubAccountDisplay = computed(()=>{
            var result = false;
            if(store.state.NoFilterAccData!=null&&store.state.NoFilterAccData!=undefined){
                if(store.state.NoFilterAccData.cust != undefined){
                    for( let i=0 ; i<store.state.NoFilterAccData.cust.length ;i++ ){
                        if(store.state.NoFilterAccData.cust[i].cutyp==1||store.state.NoFilterAccData.cust[i].cutyp!=2 || store.state.NoFilterAccData.cust[i].cutyp!=4){
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
        var subaccount = ref("");   //子帳號
        var condno = ref("");       //條件序號
        // var condstatus = ref("");   //當前狀態
		var exh = ref("");          //交易所
		var comtype = ref("");      //商品別
		var com = ref("");          //商品
        var srctype = ref("");      //來源別
        var timetype = ref("");     //查詢方式
		var startdate = ref("");    //有效開始時間
		var enddate = ref("");      //有效結束時間
        var searchObject = ref({
            "gtdcond": {
            },
			"co": store.state.CustObj.Fm, //測試公司碼，Trust給的
			"acc": store.state.CustObj.Ac, //測試帳號，Trust給的
            "subacc":'',
            "subco":'',
		});

        //computed
		//篩選商品資料
		const computedCom = computed(() => {
            if(cominfo.value.ComData_list!=undefined){
                // 判斷交易所 & 商品類別
                if(exh.value=="" && comtype.value==8)
                {
                    return cominfo.value.ComData_list;
                }
                else
                {
                    if(exh.value==""){
                        //篩選商品別
                        return cominfo.value.ComData_list.filter((item) => item.Comtype == comtype.value);
                    }
                    if(comtype.value==8){
                        //篩選交易所
                        return cominfo.value.ComData_list.filter((item) => item.Exhno == exh.value);
                    }
                    return cominfo.value.ComData_list.filter((item) => item.Exhno == exh.value && item.Comtype == comtype.value)
                }
            }
		});

        watch(exh, () => {
			com.value="";
		});
        watch(comtype, () => {
			com.value="";
		});
        watch(subaccount, () => {
			if (cust.value.length > 0){
                if(subaccount.value==''){
                    searchObject.value.subacc='';
                    searchObject.value.subco= '';
                }else{
                    searchObject.value.subacc=subaccount.value.acc;
                    searchObject.value.subco= subaccount.value.co;
                }
			}
		});

        const getToday = () => {
			var date = new Date();
			var YY = date.getFullYear();
			var MM = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
			var dd = (date.getDate() < 10 ? "0" : "") + date.getDate();
			var day = YY + "-" + MM + "-" + dd;
			var dateString = day;
			return dateString;
		};

        const OnReset= () =>{
            condno.value = "";              //條件序號
            //condstatus.value = 0;           //當前狀態
            exh.value="";                   //交易所
            comtype.value = 8;            //商品別
            com.value="";                   //商品
            srctype.value="";               //來源別
            timetype.value = 2;             //查詢方式
            startdate.value = getToday();   //開始時間
            enddate.value = getToday();     //結束時間
        }

        //emit methods
        const OnQuery=()=>{
            searchObject.value.com = com.value;
            searchObject.value.ctyp= comtype.value;
            searchObject.value.exh = exh.value;
            searchObject.value.src = srctype.value;
            searchObject.value.pdtyp = timetype.value;
            searchObject.value.sdt = convert.ToJsonDate(startdate.value);
            searchObject.value.edt = convert.ToJsonDate(enddate.value);
            searchObject.value.gtdcond.Condno = condno.value.trim();
            //查詢頁數為1
            console.log('query',searchObject.value);
            store.commit("SetModeIndex", 1);
            context.emit('query',searchObject.value);
        }

        //lifecycle
        onMounted(()=>{
            OnReset();
        })

        return{
            cominfo,cust,IsSubAccountDisplay,searchObject,subaccount,condno,exh,comtype,com,srctype,timetype,startdate,enddate,
            computedCom,
            OnQuery,OnReset,
            //condstatus,
        }
    }
}
</script>

<style lang="scss" scoped>
  @import "@/ColorStyle/scss/styleconfig.scss";
  @import "@/ColorStyle/scss/SGTP.scss";
</style>