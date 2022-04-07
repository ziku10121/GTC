/* eslint-disable no-useless-escape */
<template>
<div id="SettingArea" v-if="CanTrade">
    <!-- #region 條件單設定區 --> 
    <!-- 有子帳號 -->
    <div class="row mb-1" v-if="IsBaseAccLogin">
        <label for="subaccount" class="col-3 col-form-label">子帳號</label>
        <div class="col-9 col-sm-8">
        <select class="form-select" id="subaccount" v-model="subaccount" :class="{'is-invalid': subaccountError}">
            <option selected disabled value=''>請選擇子帳號</option>
            <option v-for="item in Customer.cust" :key="item" :value="item" >{{item.acc}}</option>
        </select>
        <div class="invalid-feedback">請選擇子帳號</div>
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 交易所選擇 -->
    <div class="row mb-1">
        <label class="col-3 col-form-label" for="exh">交易所</label>
        <div class="col-9">
        <select id="exh" class="form-select" v-model="exh" :class="{'is-invalid': exhError}">
            <option v-for="item in computedexh" :key="item" :value="item.Exhno">{{item.Exhname}}({{item.Exhno}})</option>
            <option selected v-if="computedexh ==null" value="">無交易所</option>
        </select>
        <div class="invalid-feedback">請選擇交易所</div>
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 商品別選擇 e.g.期貨或選擇權-->
    <div class="row mb-1">
        <label class="col-3 col-form-label" for="comtype">商品別</label>
        <div class="col-9">
            <select id="comtype" class="form-select" v-model="comtype">
                <option value="0">期貨</option>
                <option value="1">選擇權</option>
            </select>
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 商品選擇 -->
    <div class="row mb-1">
        <label class="col-3 col-form-label" for="com">商品</label>
        <div class="col-9">
        <select id="com" class="form-select" v-model="com" :class="{'is-invalid': comError }">
            <option v-for="item   in computedCom" :key="item" :value="item">{{item.ComName}}({{item.Comno}})</option>
            <option selected v-if="computedCom ==null" value=''>無商品</option>
        </select>
        <div class="invalid-feedback">請選擇商品</div>
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 買或賣選擇-->
    <div class="row mb-1">
        <label class="col-3 col-form-label" for="PS">買/賣</label>
        <div class="col-9">
            <select id="PS" class="form-select" v-model="PS" :disabled="isLimit">
                <option value="0">買</option>
                <option value="1">賣</option>
            </select>
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 契約月份-->
    <div class="row mb-1">
        <label class="col-3 col-form-label" for="ContractYM">契約月份</label>
        <div class="col-9">
        <select id="ContractYM" class="form-select" v-model="contractym" :disabled="isLimit" :class="{'is-invalid': contractymError}">
            <option v-for="item in computedContract" :key="item" :value="item.YM"  >{{item.YM}}</option>
            <option selected v-if="computedContract ==null" value="">無契約月份</option>
        </select>
        <div class="invalid-feedback">請選擇契約月份</div>
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 賣/賣權 -->
    <div class="row mb-1" v-if=" comtype==1 ">
        <label class="col-3 col-form-label" for="CP">賣/賣權</label>
        <div class="col-9">
        <select id="CP" class="form-select" v-model="CP" :disabled="isLimit">
            <option value="1">買權</option>
            <option value="2">賣權</option>
        </select>
        </div>
    </div> 
    <!-- #endregion -->
    <!-- #region 履約價 -->
    <div class="row mb-1" v-if="IsStkprcdecDisplay">
        <label class="col-3 col-form-label" id="stkprcdec">履約價</label>
        <div class="col-9">
            <select id="stkprcdec" class="form-select" v-model="stkprcdec" :disabled="isLimit" :class="{'is-invalid': stkpriceError }">
                <option v-for="item in computedStkprc" :key="item" :value="item.Stkprcdec">{{item.Stkprcdec}}</option>
                <option selected v-if="computedStkprc==null" value="">無履約價</option>
            </select>
            <div class="invalid-feedback">請選擇履約價</div>
        </div>
    </div>
    <!-- #region 口數-->
    <div class="row mb-1">
        <label class="col-3 col-form-label" id="qty">口數</label>
        <div class="col-9">
        <input
            id="qty"
            type="number"
            class="form-control"
            :step=1
            v-model="qty"
            :disabled="isLimit"
            :class="{'is-invalid': qtyError }"
        />
        <div class="invalid-feedback">請輸入正確口數</div>
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 委託方式別-->
    <div class="row mb-1" >
        <label class="col-3 col-form-label" for="ordertype" >委託方式</label>
        <div class="col-9">
        <select id="ordertype" class="form-select" v-model="ordertype" :disabled="isLimit">
            <option value="0">限價</option>
            <option value="1" v-show="!IsMKTDisable">市價</option>
            <option value="2" v-show="!IsSwlDisable">停損限價</option>
            <option value="3" v-show="!IsStpDisable">停損市價</option>
        </select>
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 價格 -->
    <div class="row mb-1">
        <label class="col-3 col-form-label" id="price">價格</label>
        <div class="col-9">
            <div class="row" id="price" v-show="ordertype != 1 && ordertype != 3" :class="{'is-invalid': price1Error||price2Error}"> 
                <div class="col-3 pe-0">
                    <select id="priceInt" class="form-select" v-model="priceInt" @change="priceConvert()" :disabled="isLimit">
                        <option value="0">+</option>
                        <option value="1">-</option>
                    </select>
                </div>
                <div class="col-4 ps-0 pe-0">
                    <input
                    class="form-control ps-2 pe-4"
                    type="number"
                    v-model="p1"
                    :step="IntStep"
                    :disabled="Isp1Disable || isLimit"
                    :class="{'is-invalid': price1Error }"
                    />
                    <div class="invalid-feedback" style="font-size:10px;">{{ price1Msg }}</div>
                </div>
                <div class="col-5 ps-0">
                    <div class="row" style="padding-left:12px;padding-right:12px;">
                        <input type="number" class="form-control col ps-2 pe-4" v-model="p2" v-if="Isp2p3Display" :step="NumeratorStep" :disabled="Isp1Disable" :class="{'is-invalid': price2Error }">
                        <span class="input-group-text col-4 ps-1" v-if="Isp2p3Display">/ {{ p3 }}</span>
                        <div class="invalid-feedback" style="font-size:10px;">{{ price2Msg }}</div>
                    </div>
                </div>
            </div>
            <div class="input-group" id="price">
                <input
                    class="form-control"
                    type="text"
                    value="市價"
                    v-show="ordertype == 1 || ordertype == 3"
                    :disabled="true"
                />
            </div>
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 停損價 -->
    <div class="row mb-1" v-show="ordertype == 3 || ordertype == 2">
        <label class="col-3 col-form-label" id="stopprice">停損價</label>
        <div class="col-9">
            <div class="row"  id="stopprice" :class="{'is-invalid': price4Error||price5Error}">
                <div class="col-3 pe-0">
                    <select id="priceInt" class="form-select" v-model="stpriceInt" @change="priceConvert()">
                        <option value="0">+</option>
                        <option value="1">-</option>
                    </select>
                </div>
                <div class="col-4 ps-0 pe-0">
                    <input
                        id="price"
                        type="number"
                        class="form-control ps-2 pe-4"
                        v-model="p4"
                        :step="IntStep"
                        :disabled="Isp4Disable || isLimit"
                        :class="{'is-invalid': price4Error }"
                    />
                    <div class="invalid-feedback" style="font-size:10px;">{{ price4Msg }}</div>
                </div>
                <div class="col-5 ps-0">
                    <div class="row" style="padding-left:12px;padding-right:12px;">
                        <input type="number" class="form-control col ps-2 pe-4"  v-model="p5" v-if="Isp5p6Display" :step="NumeratorStep" :disabled="Isp4Disable" :class="{'is-invalid': price5Error }">
                        <span class="input-group-text col-4 ps-1"  v-if="Isp5p6Display">/ {{ p6 }}</span>
                        <div class="invalid-feedback" style="font-size:10px;">{{ price5Msg }}</div>
                    </div>
                </div>
            </div>  
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 是否當沖-->
    <div class="row mb-1">
        <label for="Pawn" class="col-3 col-form-label">當沖</label>
        <div class="col-9">
            <select class="form-select" id="Pawn" v-model="Pawn" :disabled="isLimit">
                <option value="2" v-show="!IsDtradeDisable">自動</option>
                <option value="1" v-show="!IsDtradeDisable">是</option>
                <option value="0">否</option>
            </select>
        </div>
    </div>
    <!-- #endregion -->
    <!-- #region 起始日期 -->
    <div class="row mb-1">
        <label id="startdate-label" class="col-3 col-form-label" for="startdate">起始日期</label>
        <div class="col-9">
            <div class="input-group">
                <input
                type="date"
                id="startdate"
                class="form-control"
                placeholder="起始日期"
                :min="todaydate"
                v-model="startdate"
                :class="{'is-invalid': startdateError }"
            />
            <div class="invalid-feedback">請輸入正確日期</div>
            </div>
        </div>
    </div>
    <!-- #endregion -->

    <!-- #region 結束日期 -->
    <div class="row mb-1">
        <label id="enddate-label" class="col-3 col-form-label" for="enddate">結束日期</label>
        <div class="col-9">
        <input
            type="date"
            id="enddate"
            class="form-control"
            placeholder="結束日期"
            :min="startdate"
            v-model="enddate"
            :class="{'is-invalid': enddateError }"
        />
        <div class="invalid-feedback">請輸入正確日期</div>
        </div>
    </div>
    <!-- #endregion -->

    <!-- #region 觸發價設定-->
    <div class="row mb-1">
        <label class="col-3 col-form-label">觸發價</label>
        <div class="col-9">
            <div class="row" :class="{'is-invalid': tprice1Error||tprice2Error}">
                <div class="col-12 mb-1">
                    <select class="form-select" v-model="tpl">
                        <option value="2">大於等於</option>
                        <option value="4">小於等於</option>
                    </select>
                </div>
                <div class="col-3 pe-0">
                    <select id="priceInt" class="form-select" v-model="tpriceInt" @change="priceConvert()">
                        <option value="0">+</option>
                        <option value="1">-</option>
                    </select>
                </div>
                <div class="col-4 ps-0 pe-0">
                    <input
                        type="number"
                        class="form-control ps-2 pe-4"
                        v-model="tp1"
                        :step="IntStep"
                        :class="{'is-invalid': tprice1Error }"
                    />
                </div>
                <div class="col-5 ps-0">
                    <div class="row" style="padding-left:12px;padding-right:12px;">
                        <input type="number" class="form-control col ps-2 pe-4" v-model="tp2" :step="NumeratorStep" v-if="Istp2tp3Display" :class="{'is-invalid': tprice2Error }"> 
                        <span class="input-group-text col-4 ps-1" v-if="Istp2tp3Display">/ {{ tp3 }}</span>
                    </div>
                </div>
            </div>
            <div class="invalid-feedback"> <div class="row">{{tprice1Msg }} {{tprice2Msg }} </div></div> 
        </div>
    </div>
    <!-- #endregion -->
    <br>
    <br>
</div>
<div v-else>
    <p class="text-center">帳戶無權限下單</p>
</div>
</template>
<script>
import { computed, ref, toRef } from '@vue/reactivity';
import {  onMounted, watch } from '@vue/runtime-core';
import { useStore } from 'vuex'

export default {
    props:{
        //商品資訊
        ComInfo:{
            type:Object,
        },
        //客戶資訊
        Customer:{
            type:Object
        }
    },
    emmit:['InputComplete'],
    // eslint-disable-next-line no-unused-vars
    setup(props,context){
        //variable
        const Props_Customer = toRef(props,'Customer');
        const props_cominfo = toRef(props,'ComInfo');
        const store = useStore();
        //#region  Input
        var subaccount = ref(''); //子帳號
        var account=ref('');
        var comtype = ref(0);  //商品種類
        var exh = ref('');    //交易所
        var com = ref('');    //商品
        var contractym = ref('');   //契約月份
        var ordertype = ref(0);   //委託方式
        var CP = ref(0);    //買或賣權
        var PS = ref(0);      //買或賣
        var tpl = ref(2);   //觸發價邏輯
        var tp1 = ref(0);   //觸發價整數
        var tp2 = ref(0);   //觸發價分子
        var tp3 = ref(1);   //觸發價分母
        var qty = ref(1);    //口數
        var priceInt = ref(0); 	//單價正負數
		var stpriceInt = ref(0); //停損價正負數
		var tpriceInt = ref(0); 	//觸發價正負數
        var p1 = ref('');  //價格整數
        var p2 = ref('');  //價格分數
        var p3 = ref('');  //價格分母
        var p4=ref('');    //停損價整數
        var p5=ref('');    //停損價分數
        var p6 = ref('');  //停損價分母
        var stkprcdec = ref(''); //履約價
        //今天時間
        var todaydate = ref(new Date().getFullYear()+"-"+(("0" + (new Date().getMonth() + 1)).slice(-2))+"-"+(("0" + new Date().getDate()).slice(-2)));
        var startdate = ref(todaydate.value);  //開始時間
        var enddate = ref(todaydate.value);   //結束時間
        var Pawn = ref('2');   //是否當沖
        var IntStep =ref(1);
        var NumeratorStep =ref(1);
        //檢驗使用
        var price1Error = ref();
		var price1Msg = ref("");
		var price2Error = ref();
		var price2Msg = ref("");
		var price4Error = ref();
		var price4Msg = ref("");
		var price5Error = ref();
		var price5Msg = ref("");
		var tprice1Error = ref();
		var tprice1Msg = ref("");
		var tprice2Error = ref();
		var tprice2Msg = ref("");
		var subaccountError = ref();
		var exhError = ref();
		var comError = ref();
		var contractymError = ref();
		var stkpriceError = ref();
		var qtyError = ref();
		var tplError = ref();
		var startdateError = ref();
		var enddateError = ref();
        const clientIP = ref('');
        //#endregion

        //#region 下單設定
        var tradeobject = computed(()=>{
            return{
                "accountID": 
                {
                    "SessionKey": store.state.CustObj.sessionkey,
                    "account": store.state.CustObj.Ac,
                    "company": store.state.CustObj.Fm,
                    "srctype": store.state.CustObj.sr
                },
                "SGTPCond":
                {
                    "slb": null,
                    "acc": store.state.CustObj.Ac, 
                    "ae": "Y08",
                    "co": store.state.CustObj.Fm,
                    "code": 0,
                    "com": com.value.Comno,
                    "condcmd": 1,
                    "condcode": 0,
                    "condno": "",
                    "condsno": "",
                    "condstatus": 0,
                    "condtxt": "",
                    "condtyp": 0,
                    "cp":  CP.value,
                    "creator": "bos",
                    "cseq": "",
                    "ctyp": comtype.value,
                    "cumfillqty": 0,
                    "cxlqty": 0,
                    "dbdt": "",
                    "dtrd": Pawn.value,
                    "enddt": enddate.value.replace( /-/g , '/' ),
                    "exh": exh.value,
                    "ip": clientIP.value,
                    "op": "bos",
                    "orddt": "",
                    "ordno": "",
                    "ordtm": "",
                    "ordtyp": ordertype.value,
                    "oricondstatus": 0,
                    "p1": p1.value,
                    "p2": p2.value,
                    "p3": p3.value,
                    "p4": p4.value,
                    "p5": p5.value,
                    "p6": p6.value,
                    "ps": PS.value,
                    "qty": qty.value,
                    "resqty": 0,
                    "rplytm": "",
                    "seqno": "",
                    "src": store.state.CustObj.sr,
                    "startdt": startdate.value.replace( /-/g , '/' ),
                    "stkprc":stkprcdec.value,
                    "subacc": subaccount.value.acc,
                    "subco": subaccount.value.co,
                    "tp1": tp1.value,
                    "tp2": tp2.value,
                    "tp3": tp3.value,
                    "tpl": tpl.value,
                    "txt": "",
                    "uid": "37f0711e995f43c38d81b8e6ac9f0e23",
                    "updt": "",
                    "ym": contractym.value
                },
            }
        });    
        //#endregion

        //#region computed
        const CanTrade = computed(()=>{
            var result=false;
            if(store.state.CustObj.IsBaseAccLogin){
                result = JSON.stringify(Props_Customer.value.cust)!='[]'&&JSON.stringify(Props_Customer.value.cust)!='{}';
            }
            else{
                result = true;
            }
            return result;
        });
        const isLimit = computed(()=>{
                var result = true;
                if(com.value != ''  && exh.value != '' ) result =false;
                return result;
        })
        const IsStkprcdecDisplay = computed(()=>{
            if(comtype.value==0){
                return false;
            }
            else{
                return true;
            }
        })
        //價格分子分母顯示邏輯
        const Isp2p3Display = computed(()=>{
            if( props_cominfo.value!=null&&props_cominfo.value!=undefined){
                if(com.value!=''){
                    if(com.value.Denominator==1){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        });
        //整數價格輸入框Disable邏輯
        const Isp1Disable = computed(()=>{
            if( ordertype.value==1|| ordertype.value==3){
                return true;
            }
            else{
                return false;
            }
        })
        //停損價分子分母顯示邏輯
        const Isp5p6Display = computed(()=>{
            if( props_cominfo.value!=null&&props_cominfo.value!=undefined){
                if(com.value!=''){
                    if(com.value.Denominator==1){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        });
        //停損價整數顯示邏輯
        const Isp4Disable = computed(()=>{
            if( ordertype.value==1|| ordertype.value==0){
                return true;
            }
            else{
                return false;
            }
        })
        //觸發價分子分母顯示邏輯
        const Istp2tp3Display = computed(()=>{
            if( props_cominfo.value!=null){
                if(com.value!=''){
                    if(com.value.Denominator==1){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        })
        //市價Disable邏輯
        const IsMKTDisable = computed(()=>{
            if(com.value!='' && com.value!=null&&com.value!=undefined){
                return com.value.MktFlag=='Y'? false : true ;
            }
            else{
                return true
            }
        })
        //停損價市價Disable邏輯
        const IsStpDisable = computed(()=>{
            if(com.value!=''&& com.value!=null&&com.value!=undefined){
                return com.value.StpFlag=='Y'? false : true ;
            }
            else{
                return true
            }
        })
        //停損價限價Disable邏輯
        const IsSwlDisable = computed(()=>{
            if(com.value!='' && com.value!=null&&com.value!=undefined){
                return com.value.SwlFlag=='Y'? false : true ;
            }
            else{
                return true
            }
        })
        //當沖Disable邏輯
        const IsDtradeDisable = computed(()=>{
            if(com.value!='' &&com.value!=null&&com.value!=undefined){
                var result = com.value.DtradeFlag=='Y'? false : true ;
                Pawn.value = com.value.DtradeFlag=='Y'? '2' : '0';
                return result;
            }
            else{
                return true
            }
        })
        //篩選交易所資料
        const computedexh = computed(()=>{
            if(props_cominfo.value.ExhData_list!=null||props_cominfo.value.ExhData_list!=undefined){
                if(Array.isArray(props_cominfo.value.ExhData_list) && props_cominfo.value.ExhData_list.length>0 )
                {
                    return props_cominfo.value.ExhData_list;
                }
            }
            return null;
        })
        //篩選商品資料
        const computedCom = computed(()=>{
            if( props_cominfo.value.ComData_list!=null ){
                var result = props_cominfo.value.ComData_list.filter( item => item.Exhno==exh.value && item.Comtype == comtype.value);
                if(Array.isArray(result) && result.length>0)
                {
                    return result;
                }}
                return null;
        });
        //篩選契約月份資料
        const computedContract = computed(()=>{
            if(props_cominfo.value.Contract_list!=null){
                var result = null;
                //商品別選期貨
                if(comtype.value==0){
                    result = props_cominfo.value.Contract_list.filter( item => item.Comno==com.value.Comno && item.Comtype == 0 );
                }
                //商品別選選擇權
                else{
                    result = props_cominfo.value.Contract_list.filter( item => item.Comno==com.value.Comno && item.Comtype == 1 );
                }
                if(Array.isArray(result) && result.length>0)
                {
                    return result.filter(onlyUnique);
                }
            }
            return null;
        });
        //篩選履約價
        const computedStkprc = computed(()=>{
            if(comtype.value == 1 && props_cominfo.value.Contract_list!=null){
                var result = props_cominfo.value.Contract_list.filter( item => item.Comno==com.value.Comno && item.Comtype == 1 && item.YM ==contractym.value  && item.type == CP.value );
                //商品別選選擇權
                if(Array.isArray(result) && result.length>0)
                {
                    return result.filter(onlyUnique);
                }
            }
            return null;
        });
        const IsBaseAccLogin = computed(()=>{
            return store.state.CustObj.IsBaseAccLogin;
        })
        
        //#endregion
        
        //#region Watch
        watch(subaccount,()=>{
            //選到子帳號
            if(IsBaseAccLogin.value){
                validempty("subaccount", subaccount.value)     
            }
        });
        watch(comtype,()=>{
            //組成下單資訊
            if(comtype.value == 0) CP.value=0;
            else CP.value=1;
        });
        watch(exh,()=>{
            //組成下單資訊
            validempty("exh", exh.value);
        });
        watch(computedexh,()=>{
            if (computedexh.value!= null)
            {
                exh.value = computedexh.value[0].Exhno;
            }
            else
            exh.value ='';
        });
        watch(com,()=>{
            validempty("com", com.value);
            p3.value = com.value.Denominator!=1 ? com.value.Denominator : 0 ;
            p6.value = com.value.Denominator!=1 ? com.value.Denominator : 0 ;
            tp3.value = com.value.Denominator!=1 ? com.value.Denominator : 0 ;
            p1.value=0;
            p2.value=0;
            p4.value=0;
            p5.value=0;
            if( com.value.Denominator!=1)
            {
            IntStep.value = 1;
            NumeratorStep.value = com.value.Tickunit!=null ? com.value.Tickunit :1;
            }
            else
            {
            IntStep.value =  com.value.Tickunit!=null ? com.value.Tickunit :1;
            NumeratorStep.value = 1;
            }
        });
        watch(computedCom,()=>{
            if (computedCom.value!= null)
            {
                com.value = computedCom.value[0];
            }
            else
                com.value ='';
        });
        watch(contractym,()=>{
            validempty("contractym", contractym.value)        
        });
        watch(computedContract,()=>{
            if (computedContract.value!= null)
            {
            contractym.value = computedContract.value[0].YM;
            }
            else
            contractym.value ='';
        });
        watch(ordertype,()=>{
            //選擇市價or停損市價
            if(ordertype.value==1 ||ordertype.value==3 ){
                p1.value=0;
                p2.value=0;
                p4.value=0;
                p5.value=0;
            }
        });
        watch([IsMKTDisable,IsStpDisable,IsSwlDisable],()=>{
            ordertype.value=0;
        })
        watch(stkprcdec,()=>{
            if(comtype.value == 1)validempty("stkprice", stkprcdec.value);
        })
        watch(computedStkprc,()=>{
            if (computedStkprc.value!= null)
            {
            stkprcdec.value = computedStkprc.value[0].Stkprcdec;
            }
            else
            stkprcdec.value ='';
        });
        watch(qty,()=>{
            validqty(qty.value);
        });
        watch(p1,()=>{
            priceConvert();
            validp1('p1', p1.value);
        });
        watch(p2,()=>{
            priceConvert();
            validp2('p2',p2.value);
        });
        watch(p4,()=>{
            priceConvert();
            validp1('p4', p4.value);
        });
        watch(p5,()=>{
            priceConvert();
            validp2('p5',p5.value);
        });
        watch(tp1,()=>{
            priceConvert();
            validp1('tp1', tp1.value);
        });
        watch(tp2,()=>{
            priceConvert();
            validp2('tp2',tp2.value);
        });    
        watch(startdate, () => {
			validempty("startdate", startdate.value);
		});
		watch(enddate, () => {
			validempty("enddate", enddate.value);
		});
        //#endregion Watch

        //methods
        const priceConvert = () => {
			if(priceInt.value==0){
				tradeobject.value.SGTPCond.p1 = p1.value;
				tradeobject.value.SGTPCond.p2 = p2.value;
			}else{
				tradeobject.value.SGTPCond.p1 = p1.value*-1;
				tradeobject.value.SGTPCond.p2 = p2.value*-1;
			}
            if(stpriceInt.value==0){
				tradeobject.value.SGTPCond.p4 = p4.value;
				tradeobject.value.SGTPCond.p5 = p5.value;
			}else{
				tradeobject.value.SGTPCond.p4 = p4.value*-1;
				tradeobject.value.SGTPCond.p5 = p5.value*-1;
			}
            if(tpriceInt.value==0){
				tradeobject.value.SGTPCond.tp1 = tp1.value;
				tradeobject.value.SGTPCond.tp2 = tp2.value;
			}else{
				tradeobject.value.SGTPCond.tp1 = tp1.value*-1;
				tradeobject.value.SGTPCond.tp2 = tp2.value*-1;
			}
		}

        // eslint-disable-next-line no-unused-vars
        const getTodayDate = ()=>{
            return new Date().getFullYear()+"-"+(("0" + (new Date().getMonth() + 1)).slice(-2))+"-"+(("0" + new Date().getDate()).slice(-2));
        }
        const getip=()=>{
            fetch('https://api.ipify.org?format=json')
                .then(x => x.json())
                .then(({ ip }) => {
                    clientIP.value=ip;
            });
        }
        const onlyUnique =(value, index, self) =>{
            return self.indexOf(value) === index;
        }
        const validp1 = (type, item) => {
            var tempMsg = "";
			var tempError = false;
            if( (item === null || item ===''))
            {
                tempMsg = "尚未輸入價格";
                tempError = true;
            }//有分母商品，P1必為整數
            else if (p3.value > 1)
            {
                if (!((item | 0) === item)){
				tempMsg = "請輸入整數";
                tempError = true;
                }
                if(item<0){
                    tempMsg = "請輸入整數";
                    tempError = true;
                }
            }
            //無分母商品，P1要判斷跳動點
            else
            {
                if( item>=0){
                    if ( floatSafeRemainder(item, IntStep.value)!= 0) {
                    tempMsg = "不符合該商品跳動點";
                    tempError = true;
                    }
				}else{
					tempMsg = "請輸入正數"; 
					tempError = true;
				}
            }
            
            switch(type)
            {
                case 'p1':
                price1Msg.value = (tempError)? tempMsg :"";
                price1Error.value = tempError;
                break;
                case 'p4':
                price4Msg.value = (tempError)? tempMsg :"";
                price4Error.value = tempError;
                break;
                case 'tp1':
                tprice1Msg.value = (tempError)? '觸發價 - '+tempMsg :"";
                tprice1Error.value = tempError;
                break;
            }
			return !tempError;
		};
		const validp2 = (type,item) => {
			var tempMsg = "";
			var tempError = false;

            if( (item === null || item ==='' ))
            {
                tempMsg = "尚未輸入價格";
                tempError = true;
            }//有分母商品，P1必為整數
            else if (p3.value > 1)
            { 
                if( item>=0 ){
                    if (floatSafeRemainder(item, NumeratorStep.value) != 0) {
                        tempMsg = "不符合該商品跳動點"; 
                        tempError = true;
                    }
                    else if( item > p3.value){
                        tempMsg = "輸入數值請小於:"+p3.value;
                        tempError = true;
                    }
                }
                else{
                    tempMsg = "請輸入正數"; 
                    tempError = true;
                }
            }

            switch(type)
            {
                case 'p2':
                price2Msg.value = (tempError)? tempMsg :"";
                price2Error.value = tempError;
                break;
                case 'p5':
                price5Msg.value = (tempError)? tempMsg :"";
                price5Error.value = tempError;
                break;
                case 'tp2':
                tprice2Msg.value = (tempError)? '觸發價分子 - '+tempMsg :"";
                tprice2Error.value = tempError;
                break;
            }
			return !tempError;
		};
        const validempty = (type, item) => {
            var tempError = (item == "" || item == "undefined") ? true : false;
            switch (type) 
            {
                case "subaccount":
                subaccountError.value = tempError;
                break;
                case "exh":
                exhError.value = tempError;
                break;
                case "com":
                comError.value = tempError;
                break;
                case "contractym":
                contractymError.value = tempError;
                break;
                case "stkprice":
                stkpriceError.value = tempError;
                break;
                case "tpl":
                tplError.value = tempError;
                break;
                case "startdate":
                startdateError.value = tempError;
                break;
                case "enddate":
                enddateError.value = tempError;
                break;
                default:
                break;
            }
            return !tempError;
		};
		const floatSafeRemainder = (val, step) => {
			var valDecCount = (val.toString().split(".")[1] || "").length;
			var stepDecCount = (step.toString().split(".")[1] || "").length;
			var decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
			var valInt = parseInt(val.toFixed(decCount).replace(".", ""));
			var stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
			return (valInt % stepInt) / Math.pow(10, decCount);
		};
		const validqty = (item) => {
			qtyError.value = false;
			if ((item | 0) === item && item > 0 && item <= 100) {
				return true;
			}
			qtyError.value = true;
			return false;
		};
		// eslint-disable-next-line no-unused-vars
		const validate = () => {
            var valid = true;
            if(IsBaseAccLogin.value){
                if (!validempty("subaccount", subaccount.value)) {
                    valid = false;
                }
            }
			if (!validempty("exh", exh.value)) {
				valid = false;
			}
			if (!validempty("com", com.value)) {
				valid = false;
			}
			if (!validempty("contractym", contractym.value)) {
				valid = false;
			}
			if (!validempty("stkprice", stkprcdec.value) && comtype.value == 1) {
				valid = false;
			}
			if (!validqty(qty.value)) {
				valid = false;
			}
			if (!validp1('p1', p1.value)) {
				valid = false;
			}
			if (!validp2('p2',p2.value)) {
				valid = false;
			}
			if (!validp1('p4',p4.value)) {
				valid = false;
			}
			if (!validp2('p5',p5.value)) {
				valid = false;
			}
			if (!validp1('tp1',tp1.value)) {
				valid = false;
			}
			if (!validp2('tp2',tp2.value)) {
				valid = false;
			}
			if (!validempty("startdate", startdate.value)) {
				valid = false;
			}
			if (!validempty("enddate", enddate.value)) {
				valid = false;
			}
            return valid;
		};

        getip();

        //LifeCycle
        onMounted(()=>{
            if(computedexh.value!=null){
                exh.value = computedexh.value[0].Exhno;
            }
        });

        return{
            Isp2p3Display,Isp5p6Display,Isp1Disable,Isp4Disable,IsStkprcdecDisplay,Istp2tp3Display,
            IsMKTDisable,IsStpDisable,IsSwlDisable,IsDtradeDisable,isLimit,
            subaccount,account,comtype,CP,exh,com,PS,priceInt,stpriceInt,tpriceInt,tpl,tp1,tp2,tp3,qty,p1,p2,p3,p4,p5,p6,startdate,enddate,Pawn,contractym,ordertype,stkprcdec,IntStep,NumeratorStep,
            todaydate,IsBaseAccLogin,CanTrade,priceConvert,
            computedexh,computedCom,computedContract,computedStkprc,tradeobject,
            price1Error,price1Msg,price2Error,price2Msg,price4Error,price4Msg,price5Error,price5Msg,tprice1Error,tprice1Msg,tprice2Error,tprice2Msg,
			subaccountError,exhError,comError,contractymError,stkpriceError,qtyError,tplError,startdateError,enddateError,
            validempty,validqty,validp1,validp2,validate,getTodayDate
        }
    },
}
</script>
<style scoped>
</style>