<template>
  <mynav class="sticky-top" />
  <div class="container-fluid">
    <!-- #region 輸入下單元件 -->
    <inputgroup class="mt-2" ref="inputgp" 
      :ComInfo="cominfo" :Customer="custinfo" 
      @InputComplete="InputCompleteEvent"
    />
    <!-- #endregion -->
  </div>
  <!-- #region 設定&&取消按鈕-->
  <div class="fixed-bottom border-top d-flex justify-content-around SGTP-TextStyle-Tobottom">
      <button class="btn SGTP-BtnStyle-cancel w-100 m-1" @click="OnClearOrderSetting"  
        :disabled=" !inputgp.CanTrade? true : false ">
        清除設定
      </button>
      <button
        class="btn SGTP-BtnStyle-confirm w-100 m-1"
        @click="OnclickTrade()"
        v-if="!(IsCheckCA==true&&HaveCheckCertExist==false)"
        :disabled=" !inputgp.CanTrade? true : false ">
        下單
      </button>
      <button class="btn SGTP-BtnStyle-confirm w-100 m-1" 
        @click="OnCheckCert()" v-if="IsCheckCA==true&&HaveCheckCertExist==false"
        :disabled=" !inputgp.CanTrade? true : false ">
        確認憑證
      </button>
  </div>
  <!-- #endregion -->
  <!-- #region 彈跳視窗 -->
    <!-- Order Modal-->
    <div class="modal fade" id="CheckModal" 
      data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" 
      aria-labelledby="staticBackdropLabel" aria-hidden="true" ref="CheckModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content SGTP-ModalStyle" >

          <!-- #region 彈跳視窗頭-->
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">下單資料</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            </button>
          </div>
          <!-- #endregion -->

          <!-- #region 彈跳視窗身體-->
          <div class="modal-body" v-if="isvalidate">
            <div class="row">
              <div class="col-6">帳號:&nbsp;{{inputgp.tradeobject.SGTPCond.acc}}</div>
              <div class="col-6" v-if=" inputgp.tradeobject.SGTPCond.subacc!=undefined && inputgp.tradeobject.SGTPCond.subacc!='' ">
                子帳號:&nbsp;{{inputgp.tradeobject.SGTPCond.subacc}}
              </div>
            </div>
            <hr>
            <div class="col-6">{{ConvertData('comtype', inputgp.tradeobject.SGTPCond.ctyp)}}</div>
            <div class="row"><div class="col-6">交易所:&nbsp;{{inputgp.tradeobject.SGTPCond.exh}}</div></div>
            <div class="row"><div class="col-6">商品:&nbsp;{{inputgp.tradeobject.SGTPCond.com}}</div><div class="col-6">年月:&nbsp;{{inputgp.tradeobject.SGTPCond.ym}}</div></div>
            <div class="row " v-if="inputgp.tradeobject.SGTPCond.ctyp ==1"><div class="col-6">履約價:&nbsp;{{inputgp.tradeobject.SGTPCond.stkprc}}</div><div class="col-6">買/賣權:&nbsp;{{ConvertData('cp',inputgp.tradeobject.SGTPCond.cp)}}</div></div>
            <div class="row"><div class="col-6">買/賣:&nbsp;{{ConvertData('ps',inputgp.tradeobject.SGTPCond.ps)}}</div><div class="col-6">委託別:{{ConvertData('ordtyp',inputgp.tradeobject.SGTPCond.ordtyp)}}</div></div>
            <div class="row">
              <div class="col-6">
                價格:&nbsp;
                <span v-if="inputgp.tradeobject.SGTPCond.ordtyp !=1 && inputgp.tradeobject.SGTPCond.ordtyp !=3"> {{ConvertData('price',inputgp.tradeobject.SGTPCond.p1,inputgp.tradeobject.SGTPCond.p2,inputgp.tradeobject.SGTPCond.p3)}}</span>
                <span v-else>市價</span>
              </div>
              <div class="col-6" v-if="inputgp.tradeobject.SGTPCond.ordtyp ==3 || inputgp.tradeobject.SGTPCond.ordtyp ==2">
                停損價:&nbsp;{{ConvertData('stprice',inputgp.tradeobject.SGTPCond.p4,inputgp.tradeobject.SGTPCond.p5,inputgp.tradeobject.SGTPCond.p6)}}
              </div> 
            </div>
              <div class="row">
                <div class="col-6">口數:&nbsp;{{inputgp.tradeobject.SGTPCond.qty}}</div>
                <div class="col-6">當沖:&nbsp;{{ConvertData('dtrd',inputgp.tradeobject.SGTPCond.dtrd)}}</div>
            </div>
            <hr>
            <div class="row"><div class="col">有效區間:&nbsp;{{inputgp.tradeobject.SGTPCond.startdt}}&nbsp;~&nbsp;{{inputgp.tradeobject.SGTPCond.enddt}}</div></div>
            <div class="row">
              <div class="col">
                觸發價:&nbsp;{{ConvertData('PriceLogic',inputgp.tradeobject.SGTPCond.tpl)}}{{ConvertData('tprice',inputgp.tradeobject.SGTPCond.tpl,inputgp.tradeobject.SGTPCond.tp1,inputgp.tradeobject.SGTPCond.tp2,inputgp.tradeobject.SGTPCond.tp3)}}
              </div>
            </div>
          </div>
          <!-- #endregion -->
          <!-- #region 彈跳視窗尾-->
          <div class="modal-footer">
            <button type="button" class="btn SGTP-BtnStyle-cancel" data-bs-dismiss="modal" >
                取消
            </button>
            <button type="button" class="btn SGTP-BtnStyle-confirm" data-bs-dismiss="modal" 
              @click="IsCheckCA?SignSendTrade(inputgp.tradeobject):SendTrade(inputgp.tradeobject)"
            >
                送出
            </button>
          </div>
          <!-- #endregion -->
        </div>
      </div>
    </div>
    <!-- CertPIN Modal-->
    <div id="CertPINModal" class="modal fade" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-ms modal-dialog-centered">
        <div class="modal-content m-3">
            <div class="modal-header">
            <h5 class="modal-title" id="OrderTitle">登入作業</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="orderMsg">
              <!-- msg -->
              <div class="row mt-2">
                  <div class="col-sm-1"></div>
                  <label class="col-sm-10"><span style="font-size:18px;font-weight:800;">請輸入憑證保護密碼</span></label>
                  <div class="col-sm-1"></div>
              </div>
              <form>
              <div class="row mt-4">
                  <div class="col-sm-1"></div>
                  <label class="col-sm-3 text-start">憑證保護密碼</label>
                  <div class="col-sm-7">
                    <input id="CertPIN" class="form-control form-control-sm"  autocomplete="off" type="password" v-model="certPIN" oninput="value=this.value.replace(/[^a-zA-Z0-9_=%#]/g,'');">
                  </div>
                  <div class="col-sm-1"></div>
                  <div class="col-sm-1"></div>
                  <div class="alert alert-danger mt-3 col-sm-10" :class="{show:pwError==''?false:true}" role="alert">
                    {{pwError}}
                  </div>
                  <div class="col-sm-1"></div>
              </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id="CertPINOk" @click="OnCertPIN">確定</button>
              <button type="button" class="btn btn-secondary me-3" data-bs-dismiss="modal">取消</button>
            </div>
        </div>
        </div>
    </div>
    <!-- Alert Modal-->
    <div id="AlertModal"  class="modal fade" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-ms modal-dialog-centered">
        <div class="modal-content m-5">
            <div class="modal-header">
            <h5 class="modal-title" id="CheckTitle">訊息</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body mt-2" id="CheckMsg">
              <div style="font-size:20px">{{msgError}}</div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">確定</button>
            </div>
        </div>
        </div>
    </div>
  <!-- #endregion -->
  
</template>
<script>
import mynav from "../components/mainnav.vue";
import inputgroup from "../components/Inputgroup.vue";
import ConvertTable from "../utility/ConvertTable.js";
import {GTDTrade} from '../api/Api_manager.js';
import {CheckCA,SelectSignerEx,SignPKCS1} from '../utility/CA'
import { computed, ref } from '@vue/reactivity';
import { useStore } from 'vuex'
import { onBeforeMount,onMounted } from '@vue/runtime-core';
import store from '../store';

export default {
  components: { mynav, inputgroup },
  setup(){
    //variable
    const store = useStore();
    var IsSigner = ref(false);   //是否有簽章通過
    var haveSubaccount = ref(false); //有沒有子帳號
    var CanCustomTrade = ref(false); //客戶可不可以下長效單
    var traderesult = ref(0);
    var inputgp =ref({});   //子元件inputgrp ref
    var IsInputComplete = ref(false);
    var output = ref({});   
    const TradeModelCTR = ref('');  

    var isvalidate = ref(false);
    var certPIN = ref('');      //憑證保護密碼
    var msgError = ref('');     //錯誤訊息
    var pwError = ref('');      //密碼錯誤訊息
    var alertModal = ref(null); //錯誤訊息Modal
    var certPINModal =ref(null);//輸入Pin Modal
    var orderModal = ref(null); //下單確認 Modal
    //computed
    //客戶資訊
    const custinfo = computed(()=>{
      return store.state.FilterAccData;
    });
    //商品資訊
    const cominfo = computed(()=>{
        return store.state.FilterComData;
    });
    //要CA驗證嗎
    const IsCheckCA = computed(()=>{
      return store.state.CustObj.IsCheckCA;
    });
    //有無憑證
    const HaveCheckCertExist =  computed(()=>{
      return store.state.HaveCheckCertExist;
    });

    //methods
    //按下確認本機憑證鈕
    const OnCheckCert=()=>{
      CheckCA(store.state.CustObj.ID,function(isCheckCA,msg){
          console.log('確認憑證'+ isCheckCA );
          store.commit('SetHaveCheckCertExist',isCheckCA);
          console.log(msg);
          showAlertModal(msg);
      });
    }

    //下單主流程 :  判斷是否挑選憑證通過 > Y顯示下單確認頁面，N輸入保護密碼 > 確認憑證 > 加簽 > 下單
    const OnclickTrade=()=>{
      isvalidate.value = inputgp.value.validate();
      if(inputgp.value.validate()){
        if(store.state.CustObj.IsCheckCA){
          if(store.state.HaveCheckCertExist && IsSigner.value){
            orderModal.value.show();
          }else{
            //輸入密碼
            certPIN.value ='';
            store.commit('SetCertPIN',certPIN.value);
            certPINModal.value.show();
          }
        }else{
          orderModal.value.show();
        }
      }
    }

    //憑證保護密碼審核
    const OnCertPIN = () => {
      pwError.value='';
      console.log(certPIN)
      if(certPIN.value ==="" || certPIN.value ===null)
      {
        pwError.value='憑證保護密碼，不得為空值!';
      }
      else
      {
        store.commit('SetCertPIN',certPIN.value);
        //PIN碼規格輸入正確，輸入Modal消失，並挑選憑證
        certPINModal.value.hide();
        GetSelectSignerEx();
        
      }
    }

    //挑選憑證
    const GetSelectSignerEx=()=>{
      SelectSignerEx(store.state.CustObj.ID,certPIN.value,function(signer,msg,data){
        IsSigner.value=signer; //挑選成功與否
        if(signer){
          store.commit('SetCertObj',data);
        }
        else{
          //未獲取報錯
          console.log(msg)
          showAlertModal(msg);
          //異常畫面
        }
      })
    }

    //呈現錯誤訊息
    const showAlertModal=(msg)=>{
      console.log('show',msg);
      if(alertModal.value!=null){
        alertModal.value.show();
        msgError.value=msg;
      }
    }

    //不加簽下單API
    const SendTrade =async(data)=>{
      try{
        // console.log(data);
        var Jsondata = JSON.stringify(data);
        ReSetSetting();
        var result = await GTDTrade(Jsondata);
        CreateAlert( TradeTostHtml(result.data),styleCTRL(result.data.CondCmd) );
        traderesult.value = result.data.TradeReplyCode;
      }
      catch(err){
        console.log(err)
      }
    }
    //加簽下單API
    const SignSendTrade =async(orderdata)=>{
      var Signresult = false;
      try{
        //加簽
        if(store.state.HaveCheckCertExist && IsSigner.value){
          SignPKCS1(orderdata,function(msg, data){
            if(data){
              //加簽成功
              Signresult=true;
              orderdata.CAInfo.scrypttxt = ( data== null|| typeof(data) == 'undefined' ) ? '' : data.signature;
              orderdata.CAInfo.unscrypttxt = ( data== null|| typeof(data) == 'undefined' ) ? '' :JSON.stringify(data);
              orderdata.CAInfo.cano = ( data== null|| typeof(data) == 'undefined' ) ? '' :data.sn;
              orderdata.CAInfo.src = ( data== null|| typeof(data) == 'undefined' ) ? '' :store.state.CustObj.sr;
            }
            else{
              //加簽失敗
              Signresult=false;
              console.log(msg);
              showAlertModal(msg);
            }
          })
        }
        if(Signresult){
          var Jsondata = JSON.stringify(orderdata);
          ReSetSetting();
          var result = await GTDTrade(Jsondata);
          CreateAlert( TradeTostHtml(result.data));
          traderesult.value = result.data.TradeReplyCode;
        }
      }
      catch(err){
        console.log(err)
      }
    }
    //判斷是否完成輸入
    const InputCompleteEvent=(event)=>{
      IsInputComplete.value=event;
    }
    const ConvertData = (type,data,data2,data3,data4)=>{
      switch(type)
      {
        case 'price':
          return ConvertTable.price(data,data2,data3);
        case 'stprice':
          return ConvertTable.stpprice(data,data2,data3);
        case 'tprice':
          return ConvertTable.tpprice(data,data2,data3,data4);
        case 'ps':
          return ConvertTable.ps[data];
        case 'dtrd':
          return ConvertTable.dtrd[data];
        case 'comtype':
          return ConvertTable.comtype[data];
        case 'PriceLogic':
          return ConvertTable.PriceLogic[data];
        case 'ordtyp':
          return ConvertTable.ordtyp[data];
        case 'cp':
          return ConvertTable.cp[data];
      }
      return null
    }
    //BTNCLICKEVENT

    //清除所選設定
    const OnClearOrderSetting =()=>{
      inputgp.value.priceInt = 0;
      inputgp.value.tpriceInt = 0;
      inputgp.value.stpriceInt = 0;
      inputgp.value.comtype = '0';
      inputgp.value.exh = '';
      inputgp.value.exh = cominfo.value.ExhData_list[0].Exhno;
      inputgp.value.ordertype = '0';
      inputgp.value.CP = '0';
      inputgp.value.PS = '0';
      inputgp.value.tpl = '2';
      inputgp.value.qty = 1;
      inputgp.value.startdate = inputgp.value.getTodayDate();
      inputgp.value.enddate = inputgp.value.getTodayDate();
    }

    //清除所選設定
    const ReSetSetting =()=>{
      inputgp.value.ordertype = '0';
      inputgp.value.p1 = 0;
      inputgp.value.p2 = 0;
      inputgp.value.p4 = 0;
      inputgp.value.p5 = 0;
      inputgp.value.qty = 1;
    }
     //toast訊息
    const CreateAlert= ( html)=>{
        var bootstrap = require('bootstrap');
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
        var style = '';
        switch(condstatus){
            case 0:
                style = 'background-color: rgba(0,0,0,0.9) !important; color: white;';
                break;
            case 1: 
            case 2: 
            case 3: 
                style = 'background-color: rgba(21,115,71,0.9) !important; color: white;';
                break;
            case 4: 
                style = 'background-color: rgba(21,115,71,0.9) !important; color: white;';
                break;
            case 5: 
            case 6: 
            case 7: 
            case 8: 
                style = 'background-color: rgba(247,187,7,0.9) !important; color: white;';
                break;
            case 9: 
            case 10:
            case 11:
            case 12:
                style = 'background-color: rgba(105,113,121,0.9) !important; color: white;';
                break;
            default:
                break;
        }
        return style;
    }
    const TradeTostHtml=( trademsg )=>{
        var status = ConvertTable.condstatus[trademsg.CondStatus];
        var action = ConvertTable.condcmd[trademsg.CondCmd] 
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
        '<div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="300000">'+
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

    //CallMethods
    onBeforeMount(()=>{
      //store.dispatch('GetInitialData');
    })
    onMounted(()=>{
      var bootstrap = require('bootstrap');
      var tempAlertModal = new bootstrap.Modal(document.getElementById('AlertModal'));
      var tempCertPINModal = new bootstrap.Modal(document.getElementById('CertPINModal'));
      var tempCheckModal =new bootstrap.Modal(document.getElementById('CheckModal'));
      alertModal.value=tempAlertModal;
      certPINModal.value=tempCertPINModal;
      orderModal.value = tempCheckModal;
    })

    return { 
      cominfo,custinfo,haveSubaccount,CanCustomTrade, //props data
      inputgp,output,TradeModelCTR,IsCheckCA,HaveCheckCertExist,IsInputComplete,msgError,pwError,certPIN,isvalidate,
      SendTrade,SignSendTrade,ConvertData,OnClearOrderSetting,InputCompleteEvent,OnCheckCert,OnCertPIN,IsSigner,OnclickTrade
    }
  },
  data(){
  },
  methods:{
  },
  
  beforeRouteEnter(to, from, next){
    next(vm=>{
      if(vm.$store.state.CustObj.sessionkey==''){
        vm.$router.push({name:'DataLoadingPage'});
      }
    })
  },
};
</script>
<style scoped>
  .alert{
    display: none;
  }
  .alert.show{
    display: block;
    padding:10px 0 !important;
  }
</style>