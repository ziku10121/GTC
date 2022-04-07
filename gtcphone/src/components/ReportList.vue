<template>
    <div class="card shadow-sm w-100 SGTP-CardStyle" 
    data-bs-toggle="modal" :data-bs-target="'#condno'+GTDOrder.condno" 
        v-if="!IsDataNullorEmpty">
        <div class="card-header" :class="BorderStyleCTR(GTDOrder.condstatus)">
        <div class="row">
            <div class="col-auto me-auto" >條件單序號 : {{ GTDOrder.condno }}</div>
            <div class="col-auto badge" 
                :class="BageStyleCTR(GTDOrder.condstatus)"
            >
                {{ ConvertStatus(GTDOrder.condstatus) }}
            </div>
        </div>
        </div>
        <div class="card-body clearfix">
        <div class="row">
            <div class="col-11">
            <div class="text-start"> 
                {{ GTDOrder.exh }} {{ GTDOrder.com }} {{ GTDOrder.ym }}
            </div>
            <div class="text-start">
                <div v-if="GTDOrder.tpl == 0">觸發價 : = {{ConvertPrice('tprice',GTDOrder.tp1,GTDOrder.tp2,GTDOrder.tp3)}}</div>
                <div v-else-if="GTDOrder.tpl == 1">觸發價 : &gt;{{ConvertPrice('tprice',GTDOrder.tp1,GTDOrder.tp2,GTDOrder.tp3)}}</div>
                <div v-else-if="GTDOrder.tpl == 2">觸發價 : &ge;{{ConvertPrice('tprice',GTDOrder.tp1,GTDOrder.tp2,GTDOrder.tp3)}}</div>
                <div v-else-if="GTDOrder.tpl == 3">觸發價 : &lt;{{ConvertPrice('tprice',GTDOrder.tp1,GTDOrder.tp2,GTDOrder.tp3)}}</div>
                <div v-else-if="GTDOrder.tpl == 4">觸發價 : &le;{{ConvertPrice('tprice',GTDOrder.tp1,GTDOrder.tp2,GTDOrder.tp3)}}</div>
            </div>
            </div>
            <div class="col-3 align-self-center badge" :class="BageStyleCTR(GTDOrder.condstatus)" 
                v-show="false" 
            >
                {{ ConvertStatus(GTDOrder.condstatus) }}
            </div>
            <div class="col-1 align-self-center" v-show="true">
            <i class="bi bi-chevron-right" ></i>
            </div>
        </div>
        </div>
        <div class="card-footer" id="cardfooter">
        <div>條件單建立時間 : {{  fulltimeformat(GTDOrder.ordtm) }}</div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal" :id="'condno'+GTDOrder.condno" tabindex="-1" 
        aria-labelledby="exampleModalLabel" aria-hidden="true" v-if="!IsDataNullorEmpty" 
    >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">條件單序號 : {{ GTDOrder.condno }}</h5>
                    <button type="button" class="btn-close" 
                        data-bs-dismiss="modal" aria-label="Close"
                        v-if="false" 
                    >
                    </button>
                </div>
                <div class="modal-body" style="font-size: 15px;">
                    <p>委託資訊</p>
                    <div class="row">
                        <div class="col-6"><p>交易所 : {{GTDOrder.exh}}</p></div>
                        <div class="col-6"><p>商品 : {{ConvertCom(GTDOrder.ctyp,GTDOrder.com,GTDOrder.ym,GTDOrder.stkprc,GTDOrder.cp)}}</p></div>
                        <div class="col-6">
                            <p v-if="GTDOrder.ordtyp !=1 && GTDOrder.ordtyp !=3">價格 : {{ConvertPrice('price',GTDOrder.p1,GTDOrder.p2,GTDOrder.p3)}}</p>
                            <p v-else>價格 : 市價</p>
                        </div>
                        <div class="col-6" v-if="GTDOrder.ordtyp ==3 || GTDOrder.ordtyp ==2"><p>停損價 : {{ConvertPrice('stprice',GTDOrder.p3,GTDOrder.p4,GTDOrder.p5)}}</p></div>
                        <div class="col-6">
                            <p v-if="GTDOrder.tpl==0">觸發價 : ={{GTDOrder.tp1}}</p>
                            <p v-else-if="GTDOrder.tpl==1">觸發價 : &gt;{{ConvertPrice('tprice',GTDOrder.tp1,GTDOrder.tp2,GTDOrder.tp3)}}</p>
                            <p v-else-if="GTDOrder.tpl==2">觸發價 : &ge;{{ConvertPrice('tprice',GTDOrder.tp1,GTDOrder.tp2,GTDOrder.tp3)}}</p>
                            <p v-else-if="GTDOrder.tpl==3">觸發價 : &lt;{{ConvertPrice('tprice',GTDOrder.tp1,GTDOrder.tp2,GTDOrder.tp3)}}</p>
                            <p v-else-if="GTDOrder.tpl==4">觸發價 : &le;{{ConvertPrice('tprice',GTDOrder.tp1,GTDOrder.tp2,GTDOrder.tp3)}}</p>
                        </div>
                        <div class="col-6"><p>目前狀態 :{{ConvertStatus(GTDOrder.condstatus)}}</p></div> 
                        <div class="col-12"><p>建立時間 : {{ fulltimeformat(GTDOrder.ordtm)}}</p></div>
                        <div class="col-12"><p>啟動區間 : {{GTDOrder.startdt}} ~ {{GTDOrder.enddt}}</p></div>
                    </div>                   
                    <hr>
                    <p>口數資訊</p>
                    <div class="row">
                        <div class="col-6">
                            <p>委託口數 : {{GTDOrder.qty}} </p>
                        </div>
                        <div class="col-6">
                            <p>成交口數 : {{GTDOrder.cumfillqty}}</p>
                        </div>
                        <div class="col-6">
                            <p>已刪口數 : {{GTDOrder.cxlqty}}</p>
                        </div>
                        <div class="col-6">
                            <p>剩餘口數 : {{GTDOrder.resqty}}</p>
                        </div>
                    </div>
                    <hr>
                    <p class="my-0">
                        <a class="d-flex justify-content-between my-0 link-dark" data-bs-toggle="collapse" href="#collapseExample" role="button" 
                            aria-expanded="false" aria-controls="collapseExample" 
                            @click="OnClickRecButton(GTDOrder.condno)" style="text-decoration:none;">
                            <p class="my-0">歷程資訊</p><i class="bi bi-plus-lg my-0" v-if="!recCTRL"></i><i class="bi bi-dash-lg my-0" v-if="recCTRL"></i>
                        </a>
                    </p>
                    <div class="collapse py-0" id="collapseExample">
                        <div class="card card-body border-0">
                            <table class="table SGTP-TableStyle">
                                <thead>
                                    <tr style="font-size: 15px !important;">
                                        <th>時間</th>
                                        <th>歷程</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item) in SingleCondrec" :key="item" style="font-size: 15px !important;">
                                        <td >{{fulltimeformat(item.dbdt)}}</td>
                                        <td >{{ConvertRec(item)}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="container-fluid">
                        <div class="row row-cols-1">
                            <div class="" v-if="CancelButtonRule(GTDOrder.condstatus)">
                                <button type="button" class="btn SGTP-BtnStyle-cancel w-100" 
                                    @click="OnClickCancelBTN(GTDOrder.condno)"
                                    :disabled="IsCallTradeApiLoading? true:false "
                                    data-bs-dismiss="modal"
                                >
                                    取消條件單
                                </button>
                            </div>
                        </div>
                        <div class="row row-cols-2 mt-1 justify-content-center">
                            <div class="col-6" v-if="StartButtonRule(GTDOrder.condstatus)">
                                <button type="button" class="btn SGTP-BtnStyle-confirm w-100" 
                                    @click="OnClickStartBTN(GTDOrder.condno)"
                                    :disabled="IsCallTradeApiLoading? true:false "
                                    data-bs-dismiss="modal"
                                >
                                    啟動條件單
                                </button>
                            </div>
                            <div class="col-6" v-if="PauseButtonRule(GTDOrder.condstatus)">
                                <button type="button" class="btn SGTP-BtnStyle-pause w-100" 
                                    @click="OnClickPauseBTN(GTDOrder.condno)"
                                    :disabled="IsCallTradeApiLoading? true:false " 
                                    data-bs-dismiss="modal"
                                >
                                    暫停條件單
                                </button>
                            </div>
                            <div class="col-6">
                                <button type="button" class="btn btn-secondary w-100"
                                    data-bs-dismiss="modal" aria-label="Close" 
                                >
                                    關閉視窗
                                </button>
                            </div>
                        </div>  
                    </div>                                              
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ConvertTable from "../utility/ConvertTable.js";
import format from '../utility/format'
import {GetCondRec,GTDTrade} from '../api/Api_manager.js';
import { ref, toRef,  } from '@vue/reactivity';
import { useStore } from 'vuex'
import convertable  from '../utility/ConvertTable'

export default {
    name: "ReportList",
    props: {
        GTDOrder: {
            type: Object, 
        },
    },
    setup(props){
        const store = useStore();
        const props_GTDOrder = toRef(props,'GTDOrder');
        const IsDataNullorEmpty = ref( props_GTDOrder.value==null || JSON.stringify(props_GTDOrder.value)==="{}" );

        var SingleCondrec = ref({});  //歷程查詢結果
        var IsSingleCondrecLoading = ref(false);  //API是否載入中
        //查詢QC
        var SingleCondrecQc =ref({
            "accountID": {
                "SessionKey": store.state.CustObj.sessionkey,
                "account": store.state.CustObj.Ac,
                "company": store.state.CustObj.Fm,
                "srctype": store.state.CustObj.sr
            },
            "qc": {
                "gtdcond": { 
                    Condno: ""
                },
            },
        });
        
        //取消啟動暫停API設定
        var TradeQC = ref({
            "accountID": {
                "SessionKey": store.state.CustObj.sessionkey,
                "account": store.state.CustObj.Ac,
                "company": store.state.CustObj.Fm,
                "srctype": store.state.CustObj.sr
            },
            "SGTPCond":{
                "slb": null,
                "acc": '',  
                "ae": "Y08",
                "co": '',
                "code": 0,
                "com": "",
                "condcmd": 1,
                "condcode": 0,
                "condno": "",
                "condsno": "",
                "condstatus": 0,
                "condtxt": "",
                "condtyp": 0,
                "cp": 0,
                "creator": "",
                "cseq": "",
                "ctyp": 0,
                "cumfillqty": 0,
                "cxlqty": 0,
                "dbdt": "",
                "dtrd": 0,
                "enddt": "",
                "exh": "",
                "ip": "",
                "op": "BOSS",
                "orddt": "",
                "ordno": "",
                "ordtm": "",
                "ordtyp": 0,
                "oricondstatus": 0,
                "p1": 0,
                "p2": 0,
                "p3": 0,
                "p4": 0,
                "p5": 0,
                "p6": 0,
                "ps": 0,
                "qty": 0,
                "resqty": 0,
                "rplytm": "",
                "seqno": "",
                "src": store.state.CustObj.sr,
                "startdt": "",
                "stkprc": 0,
                "subacc": "",
                "subco": "",
                "tp1": 0,
                "tp2": 0,
                "tp3": 0,
                "tpl": 0,
                "txt": "",
                "uid": "",
                "updt": "",
                "ym": ""
            }
        });
        var recCTRL=ref(false);
        var IsCallTradeApiLoading = ref(false);

        //computed

        //methods
        //Call 歷程 API
        const CallCondrecAPI=async(id)=>{
            try{
                IsSingleCondrecLoading.value =false;
                SingleCondrecQc.value.qc.gtdcond.Condno=id;
                var JsonStr = JSON.stringify(SingleCondrecQc.value);
                var rawdata = await GetCondRec(JsonStr);
                SingleCondrec.value = rawdata.data.condrec;
                // console.log(rawdata);
                IsSingleCondrecLoading.value =true;
            }
            catch(err){
                console.log(err);
            }
        }
        //暫停取消啟動 API
        const CallTradeApi=async(data)=>{
            try{
                IsCallTradeApiLoading.value=true;
                var result = await GTDTrade(data);
                IsCallTradeApiLoading.value=false;
                CreateAlert( TradeTostHtml(result.data),styleCTRL(result.data.CondCmd) );
            }   
            catch(err){
                console.log(err)
            }
        }
        //點擊卡片Call歷程
        //STYLE控制
        const BageStyleCTR=(status)=>{
            switch( status ){
                case 0:
                    return 'bg-dark'; 
                case 1: 
                case 2: 
                case 3: 
                    return 'bg-success';
                case 4: 
                    return 'bg-primary';
                case 5: 
                case 6: 
                case 7: 
                case 8: 
                    return 'bg-warning';
                case 9: 
                case 10:
                case 11:
                case 12:
                    return 'bg-secondary';
                default:
                    return '';
            }
        }
        const BorderStyleCTR=(status)=>{
            switch( status ){
                case 0:
                    return 'card-header-undifine';
                case 1: 
                case 2: 
                case 3: 
                    return 'card-header-start';
                case 4: 
                    return 'card-header-sent';
                case 5: 
                case 6: 
                case 7: 
                case 8: 
                    return 'card-header-pause';
                case 9: 
                case 10:
                case 11:
                case 12:
                    return 'card-header-end';
                default:
                    return '';
            }
        } 
        //時間轉換 
        const fulltimeformat=(time)=>{
            return format.fulltimeformat(time);
        }
        const ConvertBuySell =(data)=>{
            return ConvertTable.ps[data];
        }
        const ConvertStatus =(data)=>{
            return ConvertTable.condstatus[data];
        }
        const ConvertPrice = (type,data,data2,data3)=>{
            switch (type) {
                case 'price':
                    return ConvertTable.price(data,data2,data3);
                case 'stprice':
                    return ConvertTable.stpprice(data,data2,data3);
                case 'tprice':
                    return ConvertTable.tprice(data,data2,data3);
            }
            return null
        }
        const ConvertCom = (ctyp,com,ym,stkprc,cp) =>{
            let outComno;
            if (ctyp==0)
            {
                outComno = com.trim() + ' ' + ym.trim();
                return outComno;
            }else if(ctyp==1){
                outComno = com.trim() + ' ' + ym.trim() + ' ' + stkprc + cp;
                return outComno;
            }else{
                outComno = com.trim() + ' ' + ym.trim();
                return outComno;
            }
        }
        const ConvertRec=(data)=>{
            switch(data.condcode){
                case 999:
                    return '條件單'+ConvertStatus(data.condstatus);
                default:
                    return '條件單'+ConvertStatus(data.condstatus)
            }
        }
        //開啟歷程
        const OnClickRecButton =(id)=>{
            recCTRL.value = !recCTRL.value;
            if(recCTRL.value){
                CallCondrecAPI(id);
            }
        }
        //啟動按鈕 顯示規則
        const StartButtonRule=(value)=> {
            switch (value) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    return false;
                case 7:
                case 8:
                    return true;
                case 9:
                case 10:
                default:
                    return false;
            }
        }
        //啟動按鈕 Call API
        const OnClickStartBTN=(id)=>{
            TradeQC.value.SGTPCond.condcmd=4;
            TradeQC.value.SGTPCond.condno = id;
            var Jsonreq =  JSON.stringify(TradeQC.value);
            CallTradeApi(Jsonreq);
        }
        //取消按鈕 顯示規則
        const CancelButtonRule=(value)=> {
            switch (value) {
                case 0:
                    return false;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    return true;
                case 9:
                case 10:
                case 11:
                case 12:
                default:
                    return false;
            }
        }
        //取消按鈕 Call API
        const OnClickCancelBTN=(id)=>{
            TradeQC.value.SGTPCond.condcmd=2;
            TradeQC.value.SGTPCond.condno = id;
            var Jsonreq =  JSON.stringify(TradeQC.value);
            CallTradeApi(Jsonreq);
        }
        //暫停按鈕 顯示規則
        const PauseButtonRule=(value)=> {
            switch (value) {
                case 0:
                case 1: 
                    return false;
                case 2:
                case 3:
                    return true;
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:   
                case 9:
                case 10:
                case 11:
                case 12:
                default:
                    return false;
            }
        }
        //暫停按鈕 Call API
        const OnClickPauseBTN=(id)=>{
            TradeQC.value.SGTPCond.condcmd=3;
            TradeQC.value.SGTPCond.condno = id;
            var Jsonreq =  JSON.stringify(TradeQC.value);
            CallTradeApi(Jsonreq);
        }
        //toast訊息
        const CreateAlert= ( html ,status)=>{
            var bootstrap = require('bootstrap');
            var style = styleCTRL(status);
            var alertPlaceholder = document.getElementById('liveAlertPlaceholder');
            var wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            alertPlaceholder.append(wrapper);
            var New_toast = wrapper.querySelector('.toast');
            var toast = new bootstrap.Toast(New_toast);
            toast.show();
            New_toast.addEventListener('hidden.bs.toast',function(){
                wrapper.remove();
            })
            window.setTimeout(function(){
                toast.dispose();
                wrapper.remove();
            },3000)
        }
        const styleCTRL=(condstatus)=> {
            var style ={
                BGColor_R:0,
                BGColor_G:0,
                BGColor_B:0,
                BGColor_op:0,
                color:''
            };
            switch(condstatus){
                case 0:
                    style.BGColor_R = 0;
                    style.BGColor_G = 0;
                    style.BGcolor_B = 9;
                    style.BGColor_op=0.8;
                    style.color = 'white';
                    break;
                case 1: 
                case 2: 
                case 3:
                    style.BGColor_R = 21;
                    style.BGColor_G = 115;
                    style.BGcolor_B = 71;
                    style.BGColor_op=0.9;
                    style.color = 'white'; 
                    break;
                case 4:
                    style.BGColor_R = 21;
                    style.BGColor_G = 115;
                    style.BGcolor_B = 71;
                    style.BGColor_op=0.9;
                    style.color = 'white'; 
                    break;
                case 5: 
                case 6: 
                case 7: 
                case 8:
                    style.BGColor_R = 247;
                    style.BGColor_G = 187;
                    style.BGcolor_B = 7;
                    style.BGColor_op=0.9;
                    style.color = 'white';  
                    break;
                case 9: 
                case 10:
                case 11:
                case 12:
                    style.BGColor_R = 105;
                    style.BGColor_G = 113;
                    style.BGcolor_B = 121;
                    style.BGColor_op=0.9;
                    style.color = 'white';  
                    break;
                default:
                    break;
            }
            return style;
        }
        const TradeTostHtml=( trademsg )=>{
            var status = convertable.condstatus[trademsg.CondStatus];
            var action = convertable.condcmd[trademsg.CondCmd] 
            var condno = trademsg.Condno;
            var msg = '';
            var Tostmsg = '';
            if(trademsg.TradeReplyCode==0 || trademsg.TradeReplyCode==999){
                msg ='<span style="color:green"> 成功</span>';
                Tostmsg = condno + "("+ status + ")"
            }
            else{
                msg = '<span style="color:red"> 失敗</span> ' ;
                Tostmsg = condno + "("+ status + ")"+ '<br>'+
                trademsg.TradeReplyText+"("+ trademsg.TradeReplyCode + ")";
            }
            var  html =
            '<div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="300000" style="z-index:99999;">'+
            '<div class="toast-header">'+
            '<strong class="me-auto">'+
                action +'&nbsp;'+msg +
            '</strong>'+
            '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>'+
            '</div>'+
            '<div class="toast-body">'+
                Tostmsg+
            '</div>'+
            '</div>';
            return html;
        }

        return{
            IsSingleCondrecLoading,SingleCondrec,IsDataNullorEmpty,recCTRL,IsCallTradeApiLoading,
            BageStyleCTR,BorderStyleCTR,StartButtonRule,CancelButtonRule,PauseButtonRule,OnClickRecButton,
            ConvertStatus,ConvertPrice,ConvertCom,ConvertBuySell,ConvertRec,fulltimeformat,
            OnClickStartBTN,OnClickPauseBTN,OnClickCancelBTN
        }
    },
};
</script>
<style scoped>
    .card-header-undifine{
        background-color: rgba(0,0,0,0.15) !important;
        /* #000000 */
    }
    .card-header-start{
        background-color: rgba(21,115,71,0.15) !important;
        /* #157347 */
    }
    .card-header-end{
        background-color: rgba(105,113,121,0.15) !important;
        /* #697179 */
    }
    .card-header-sent{
        background-color: rgba(21,115,71,0.15) !important;
        /* #157347 */
    }
    .card-header-pause{
        background-color: rgba(247,187,7,0.15) !important;
        /* #f7bb07 */
    }
</style>