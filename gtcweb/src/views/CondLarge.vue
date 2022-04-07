<template>
  <!-- Nav tabs -->
  <div class="m-2 m-xl-4">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#CondOrder" type="button" role="tab" aria-controls="home" aria-selected="true" @click="CallCondOrderApi">條件下單 / 回報</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#CondSearch" type="button" role="tab" aria-controls="profile" aria-selected="false">歷史查詢</button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <!-- 下單及回報 -->
      <div class="tab-pane fade border border-top-0 show active" id="CondOrder" role="tabpanel" aria-labelledby="home-tab">
        <div>
          <OrderSelect  :IsKeepOrder="isKeepOrder" @sendorder="GetOrders" @ca="GetCheckCA"></OrderSelect>
          <hr>
          <div class="ps-3 pe-3 row mt-5">
            <OrderTable :GTDOrders="TodayGTDorders" :OrderRecord="OrderRecord" :isUpdated="isUpdated" @sendorder="GetOrders" @record="GetOCondno" @requery="CallCondOrderApi"></OrderTable>
          </div>
        </div>
      </div>
      <!-- 查詢 -->
      <div class="tab-pane fade border border-top-0" id="CondSearch" role="tabpanel" aria-labelledby="profile-tab">
        <div>
          <SearchSelect @query="GetQueryList"></SearchSelect>
          <hr>
          <div class="ps-3 pe-3 row mt-5">
            <!-- 資料查詢中 -->
            <div v-show="isSearchQuery" class="pt-3 pb-5">
                <div class="spinner-border" style="width:3rem; height:3rem;" role="status" aria-hidden="true"></div>
                <span class="ms-3" style="font-size:18px">資料查詢中...</span>
            </div>
            <SearchTable v-show="!isSearchQuery && !firsttime" :GTDSearchs="OldGTDSearchs" :SearchRecord="SearchRecord" @record="GetSCondno" @callsearch="GetNextQuery"></SearchTable>
          </div>
        </div>
      </div>
    </div>
    <!-- #region Modal -->

    <!-- Single Modal -->
    <div class="modal fade" id="OrderModal" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <!-- #region Modal 標題 -->
          <div class="modal-header" :class="{'bgstart':action=='重啟條件','bgpause':action=='暫停條件','bgcancel':action=='刪除條件'}">
            <h5 class="modal-title" id="staticBackdropLabel" style="color:black">{{action}}單</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <!-- #endregion -->

          <!-- #region Modal 內容 -->
          <div class="container">
            <div class="modal-body text-start">
              <div class="row">
                <div class="col-6">帳號:&nbsp;{{checkOrder.acc}}</div>
                <div class="col-6" v-if="checkOrder.subacc!=undefined && checkOrder.subacc!='' ">
                  子帳號:&nbsp;{{checkOrder.subacc}}
                </div>
              </div>
              <hr>
              <div class="col-6 mt-2" style="font-size:18px"><strong>{{checkOrder.comtype}}</strong></div>
              <div class="ps-3">
                <div class="row">
                <div class="col-12 mt-2"><strong>交易所:</strong>&nbsp;{{checkOrder.exh}}</div>
                </div>
                <div class="row">
                  <div class="col-6 mt-1"><strong>商品:</strong>&nbsp;{{checkOrder.com}}</div>
                  <div class="col-6 mt-1"><strong>契約年月:</strong>&nbsp;{{checkOrder.ym}}</div>
                </div>
                <div class="row " v-if="checkOrder.ctyp ==1">
                  <div class="col-6 mt-1"><strong>買/賣權:</strong>&nbsp;{{checkOrder.cp}}</div>
                  <div class="col-6 mt-1"><strong>履約價:</strong>&nbsp;{{checkOrder.stkprc}}</div>
                </div>
                <div class="row">
                  <div class="col-6 mt-1"><strong>買/賣:</strong>&nbsp;{{checkOrder.ps}}</div>
                  <div class="col-6 mt-1"><strong>口數:</strong>&nbsp;{{checkOrder.qty}}</div>
                  
                </div>
                <div class="row">
                  <div class="col-6 mt-1"><strong>委託別:</strong>{{checkOrder.outordtyp}}</div>
                  <div class="col-6 mt-1"><strong>價格:</strong>&nbsp;
                    <span v-if="checkOrder.ordtyp ==1 || checkOrder.ordtyp ==3">市價</span>
                    <span v-else> 
                      {{checkOrder.price}}
                    </span>
                  </div>
                  <div class="col-6 mt-1" v-if="checkOrder.ordtyp ==2 || checkOrder.ordtyp ==3">
                    <strong>停損價:</strong>&nbsp;{{checkOrder.StpPrice}}
                  </div>
                  <div class="col-6 mt-1"><strong>當沖:</strong>&nbsp;{{checkOrder.dtrd}}</div>
                </div>
                <hr>
                <div class="row">
                  <div class="col mb-1"><strong>有效區間</strong>:&nbsp;{{checkOrder.startdt}}&nbsp;~&nbsp;{{checkOrder.enddt}}</div>
                </div>
                <div class="row">
                  <div class="col mb-2"><strong>觸發價:</strong>&nbsp;{{checkOrder.TPrice}}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- #endregion -->

          <!-- #region Modal 尾部內容 -->
          <div class="modal-footer pt-3 pb-3">
            <div class="col-auto text-start d-flex align-items-center">
              <div class="ps-3">您確定要對該筆條件單做{{action}}操作?</div>
            </div>
            <div class="col text-end">
              <button id="checksok" type="button" class="btn btn-primary me-2" data-bs-dismiss="modal" @click="OnOrderPKCS1()" >確定</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            </div>
          </div>
          <!-- #endregion -->
      </div>
    </div>
    </div>
    <!-- Batch Modal -->
    <div class="modal fade" id="OrdersModal" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header" :class="{'bgstart':action=='重啟條件','bgpause':action=='暫停條件','bgcancel':action=='刪除條件'}">
            <h5 class="modal-title" id="staticBackdropLabel">批次{{action}}單</h5>
            <button v-if="!isUpdating" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container">
              <table class="table modalTable">
                <thead>
                  <tr>
                    <th></th>
                    <th>索引</th>
                    <th>目前狀態</th>
                    <th>條件序號</th>
                    <th>建立時間</th>
                    <th>交易所</th>
                    <th>商品</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in checkOrders" :key="index">
                    <td>
                      <i v-if="!item.isChange" class="bi bi-x-lg"></i>
                      <i v-if="item.isChange" class="bi bi-check-lg"></i>
                    </td>
                    <td>{{index+1}}</td>
                    <td>{{item.condstatus}}</td>
                    <td>{{item.condno}}</td>
                    <td>{{item.outOrdtm}}</td>
                    <td>{{item.exh}}</td>
                    <td>{{item.com}}</td>
                    <td>
                      <i v-if="item.sendStatus==0" class="bi bi-x-circle text-danger"></i>
                      <i v-if="item.sendStatus==1" class="bi bi-check-circle text-success"></i>
                      <i v-if="item.sendStatus==2" class="bi bi-dash-circle text-warning"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer pt-3 pb-3">
            <div class="container">
              <div class="row">
                <div class="col-8 text-start d-flex align-items-center">
                  <div class="ms-3">
                    <div style="font-size:15px;color:red;">
                      <i class="bi bi-x-lg"></i>表示無法做{{action}}操作，
                      <i class="bi bi-check-lg"></i>表示可進行{{action}}操作
                    </div>
                    共有{{checkOrders.length}}筆條件單，{{ordersErrorCount}}筆無法操作，剩餘{{ordersOkCount}}筆可進行操作。
                  </div>
                </div>
                <div class="col-4 text-end">
                  <button v-if="!isUpdated" id="ChecksUpdate" class="btn btn-primary me-3" type="button" value="確定" @click="OnOrderPKCS1(),BtnUpdate()" :disabled="ordersOkCount<1">確定</button>
                  <button v-if="!isUpdating && !isUpdated" class="btn btn-secondary me-3" type="button" data-bs-dismiss="modal">取消</button>
                  <button v-if="isUpdated" id="ChecksOk" class="btn btn-primary me-3" type="button" data-bs-dismiss="modal">關閉</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
    <!-- CertPIN Modal-->
    <div id="CertPINModal" class="modal fade" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-ms modal-dialog-centered">
        <div class="modal-content">
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
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="CheckTitle">訊息</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body mt-2" id="CheckMsg">
              <div style="font-size:20px">{{msgError}}</div>
              <!-- <i class="bi bi-check-circle" style="font-size: 5rem; color: cornflowerblue;"></i> -->
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">確定</button>
            </div>
        </div>
        </div>
    </div>
    <!-- #endregion -->
  </div>
</template>
<script>
// import webca from 'webca';
import OrderSelect from "../components/OrderSelect.vue";
import OrderTable from "../components/OrderTable.vue";
import SearchSelect from "../components/SearchSelect.vue";
import SearchTable from "../components/SearchTable.vue";

import {GTDTrade,GetCondOrder,GetCondRec} from '../api/Api_manager.js';

import {computed, ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { onBeforeMount, onMounted, watch } from '@vue/runtime-core';

import bootstrap from "bootstrap/dist/js/bootstrap.js";
import {CheckCA,SignPKCS1,SelectSignerEx,ResetKey} from "../utility/condca.js";
import convert from "../utility/convert";

export default {
  components: {
    OrderSelect,
    OrderTable,
    SearchSelect,
    SearchTable,
  },
  setup(){
    //variable
    const store = useStore();
    const userId = store.state.CustObj.ID; 
    const cust = store.state.FilterAccData.cust;
    var isSearchQuery= ref(false); //搜尋查詢畫面
    var tempquery = ref({});    //暫存歷史查詢
    var senddatas = ref([]);    //條件單下單資料
    var isSingleOrder = ref(true);//是否為單筆下單   
    var checkOrder = ref('');   //條件單單筆顯示
    var checkOrders = ref([]);  //條件單多筆顯示
    var isKeepOrder = ref(true) //hold住該筆下單資料
    var isUpdating = ref(false); //更新中
    var isUpdated = ref(false); //是否更新完//多筆狀態更新，1是否更新(預設)、2更新中、3更新後
    var IsSigner = ref(false) ; //是否有簽章通過
    var certPIN = ref('');      //憑證保護密碼
    var msgError = ref('');     //錯誤訊息
    var pwError = ref('');      //密碼錯誤訊息
    var alertModal = ref(null); //錯誤訊息Modal
    var certPINModal =ref(null);//輸入Pin Modal
    var orderModal = ref(null); //下單確認 Modal
    var ordersModal = ref(null); //多筆下單確認 Modal
    //商品
    var GTDRecordQC =  computed(()=>{
      return{
        "accountID": {
          "SessionKey": store.state.CustObj.sessionkey,
          "account": store.state.CustObj.Ac,
          "company": store.state.CustObj.Fm,
          "srctype": store.state.CustObj.sr
        }
      }
    });
    //今日回報
    var TodayGTDorders = ref({});
    var TodayGTDordersQC = computed(()=>{
      return{
        "accountID": {
            "SessionKey": store.state.CustObj.sessionkey,
            "account": store.state.CustObj.Ac,
            "company": store.state.CustObj.Fm,
            "srctype": store.state.CustObj.sr
        }
      }
    });
    //搜尋歷史
    var OldGTDSearchs = ref({});
    //歷程查詢
    var OrderRecord =ref({})
    var SearchRecord = ref({});
    //畫面控制
    var firsttime =ref(true);
    var ordersErrorCount=ref(0);  //更改狀態錯誤數量
    var ordersOkCount=ref(0);     //更改狀態正確數量
    var action = ref('');

    //methods
    //下單主流程 :  轉換確認資訊 >  顯示下單確認頁面 > 確認憑證 > 加簽 > 下單
    const GetOrders=(orders)=>{
      isKeepOrder.value = true;
      //清空下單確認資訊
      ordersErrorCount.value=0;
      ordersOkCount.value=0;
      checkOrders.value.length = 0;
      checkOrder.value = '';
      //轉換下單確認資訊
      // console.log('isCA_store', store.state.CustObj.IsCA,'orders',orders);
      ConvertOrders(orders.data,orders.cmd);
      
      if(store.state.CustObj.IsCA)
      {
        //是否內存有憑證資訊並且有通過簽章
        if(store.state.HaveCheckCertExist && IsSigner.value){
          //單筆or多筆資訊
          if(orders.single) {
            if(orderModal.value!=null)orderModal.value.show();
            isSingleOrder.value = true;
          }else {
            if(ordersModal.value!=null)ordersModal.value.show();
            isSingleOrder.value = false;
            isUpdated.value=false;
          }
        }
        else
        {
          //輸入密碼
          certPIN.value ='';
          if(certPINModal.value!=null)certPINModal.value.show();
        }
      }
      else
      {
        //不需要憑證直接確認條件單
        if(orders.single) {
          if(orderModal.value!=null)orderModal.value.show();
          isSingleOrder.value = true;
        }else {
          if(ordersModal.value!=null)ordersModal.value.show();
          isSingleOrder.value = false;
          isUpdated.value=false;
        }
      }
      senddatas.value=orders.data;
      // console.log('senddatas',senddatas.value,'orders',orders.data);
    }
    //轉換Modal顯示確認資訊
    const ConvertOrders=(data,_cmd)=>{
      action.value = convert.condcmd[_cmd];
      for(let index=0;index<data.length;index++){
        checkOrders.value[index] = JSON.parse(JSON.stringify(data[index]));
        //判斷操作別
        switch (_cmd) {
          case 4://啟動
            if(checkOrders.value[index].condstatus==7)
            {
              data[index].condcmd = 4;
              checkOrders.value[index].isChange=true;
              checkOrders.value[index].condstatus==4;
              ordersOkCount.value++;
            }
            else
            {
              checkOrders.value[index].isChange=false;
              ordersErrorCount.value++;
            }
            break;
          case 3://暫停
            if(checkOrders.value[index].condstatus==2)
            {
              data[index].condcmd = 3;
              checkOrders.value[index].isChange=true;
              ordersOkCount.value++;
            }
            else
            {
              checkOrders.value[index].isChange=false;
              ordersErrorCount.value++;
            }
            break;
          case 2://刪除
            if(checkOrders.value[index].condstatus!=9)
            {
              data[index].condcmd = 2;
              checkOrders.value[index].isChange=true;
              ordersOkCount.value++;
            }
            else
            {
              checkOrders.value[index].isChange=false;
              ordersErrorCount.value++;
            }
            break;
        }
        //建立時間
        checkOrders.value[index].outOrdtm=convert.fulltimeformat(data[index].ordtm);
        //目前狀態
        checkOrders.value[index].condstatus=convert.condstatus[data[index].condstatus];
        //交易所
        if(data[index].exh!=undefined && data[index].exh!=''){
          var selectedexh = store.state.NoFilterComData.ExhData_list.find((item) => item.Exhno == data[index].exh);
          checkOrders.value[index].exh = selectedexh.Exhname+'('+selectedexh.Exhno+')';
        }
        //商品
        checkOrders.value[index].cp = convert.cp[data[index].cp];
        if(data[index].com!=undefined && data[index].com!=''){
          var selectedcom = store.state.NoFilterComData.ComData_list.find((item) => item.Comno == data[index].com);
          checkOrders.value[index].com = selectedcom.ComName+'('+selectedcom.Comno+')';
        }
        //商品別
        checkOrders.value[index].comtype = convert.comtype[data[index].ctyp];
        //當沖
        checkOrders.value[index].dtrd = convert.dtrd[data[index].dtrd];
        
        //買賣
        checkOrders.value[index].ps = convert.ps[data[index].ps];
        //委託別
        checkOrders.value[index].outordtyp = convert.ordtyp[data[index].ordtyp];
        //委託單價
        checkOrders.value[index].price = convert.price(data[index].p1,data[index].p2,data[index].p3);
        //停損價
        checkOrders.value[index].StpPrice = convert.stpprice(data[index].p4,data[index].p5,data[index].p6);
        //觸發價
        checkOrders.value[index].TPrice = convert.tprice(data[index].tp1,data[index].tp2,data[index].tp3);
      }
       checkOrder.value = checkOrders.value[0];
    }

    //獲取憑證是否通過與提示訊息
    const GetCheckCA=()=>{
      if (store.state.CustObj.IsCA)
      {
        CheckCA(store.state.CustObj.ID,function(isCheckCA, msg){ //isCheckCA憑證通過，msg modal訊息文字
          console.log('確認憑證'+ isCheckCA );
          store.commit('SetHaveCheckCertExist',isCheckCA);
          showAlertModal(msg);
        })
      }
    }

    //憑證保護密碼審核
    const OnCertPIN = () => {
      pwError.value='';
      console.log(certPIN.value)
      if(certPIN.value ==="" || certPIN.value ===null)
      {
        pwError.value='憑證保護密碼，不得為空值!';
      }
      else
      {
        //PIN碼規格輸入正確，輸入Modal消失，並挑選憑證
        certPINModal.value.hide();
        GetSelectSignerEx();
      }
    }

    //挑選憑證
    const GetSelectSignerEx=()=>{
      SelectSignerEx(userId.value, certPIN.value ,function(signer,msg,data){ //iscert內存密碼，msg modal訊息文字，data憑證資訊
        //判斷是否已挑選憑證
        IsSigner.value =signer;
        if(signer){
          //獲取憑證(下單顯示)
          if(isSingleOrder.value) {if(orderModal.value!=null)orderModal.value.show();}
          else {if(ordersModal.value!=null)ordersModal.value.show();}
        }else{
          //未獲取報錯
          showAlertModal(msg);
        }
      });
      console.log('cert',IsSigner.value,'pin',certPIN.value);
    }
   
    //加簽動作(Button)
    const OnOrderPKCS1 = () =>{ 
      let orders =senddatas.value;

      var time = 0;
      if(store.state.CustObj.IsCA){
        //明文、憑證序號、密文進行下單
        for(let i= 0;i<orders.length;i++)
        {
          time+=JudgeToTime(checkOrders.value,i);

          window.setTimeout(function() {
            SignPKCS1(orders[i], function(msg, data){
              if(data){
                //加簽成功，進行下單
                if(!isSingleOrder.value && i==orders.length-1)  //多筆模式判斷是否為最後一個
                {
                  SendTrade(orders[i],true,data);
                }else{
                  SendTrade(orders[i],false,data);
                }
              }else{
                //加簽失敗，下單異常
                if(isSingleOrder){
                  showAlertModal(msg);
                }else{
                  //多筆加簽失敗顯示錯誤
                  let selectObj = checkOrders.value.find((item)=>item.condno == orders[i].condno);
                  selectObj.sendStatus=0;
                }
              }
            })
          },  500 * i + 1000 * time)
        }
      }else{
        // 明文即可下單，不須加簽
        for(let i= 0;i<orders.length;i++)
        {
          time+=JudgeToTime(checkOrders.value,i);

          window.setTimeout(function() {
            if(!isSingleOrder.value && i==orders.length-1)  //多筆模式判斷是否為最後一個
            {
              SendTrade(orders[i],true);
            }else{
              SendTrade(orders[i]);
            }
          }, 500 * i + 1000 * time)
        }
      }
    }

    //判斷切換狀態並給予時間
    const JudgeToTime = (orders,i) =>{
      if(i!=0 && orders[i-1].isChange==true)
      {
        return 1;
      }else{
        return 0;
      }
    }
    //多筆狀態開始更新
    const BtnUpdate=()=>{
      let btn = document.getElementById('ChecksUpdate');
      if(btn.value == '確定'){
        btn.value = '更新';
        btn.innerHTML ="更新中..."
        btn.disabled=true;
      }
      isUpdating.value=true;
    }
    //多筆狀態更新結束
    const UpdateEnd = ()=>{
      let btn = document.getElementById('ChecksUpdate');
      if(btn.value == '更新'){
        btn.value = '確定';
        btn.innerHTML ="確定"
        btn.disabled=false;
      }
      isUpdating.value=false;
      isUpdated.value=true;
    }
    //呈現錯誤訊息
    const showAlertModal=(msg)=>{
      console.log('show',msg);
      if(alertModal.value!=null){
        alertModal.value.show();
        msgError.value=msg;
      }
    }

    //下單
    //下單API
    const SendTrade = async(conddata,end,ca) =>{
      if(!isSingleOrder.value){ //判斷多筆，呈現為不更動圖示
        let selectObj = checkOrders.value.find((item)=>item.condno == conddata.condno);
        if(selectObj.isChange==false)
        {
          selectObj.sendStatus=2;
          if(end)UpdateEnd();
          return;
        }
      }
      // console.log('下單囉',conddata);
      conddata.src=store.state.CustObj.sr;
      try{
        var data = {
          "accountID": {
            "SessionKey": store.state.CustObj.sessionkey,
            "account": store.state.CustObj.Ac,
            "company": store.state.CustObj.Fm,
            "srctype": store.state.CustObj.sr
          },
          "SGTPCond":conddata,
        };
        if(store.state.CustObj.IsCA)
        {
          data.CAInfo.scrypttxt=( ca== null|| typeof(ca) == 'undefined' ) ?'':ca.signature;
          data.CAInfo.unscrypttxt=( ca== null|| typeof(ca) == 'undefined' ) ?'':JSON.stringify(conddata);
          data.CAInfo.cano=( ca== null|| typeof(ca) == 'undefined' ) ?'':ca.sn;
          data.CAInfo.src=( ca== null|| typeof(ca) == 'undefined' ) ?'':store.state.CustObj.sr;
        }
        
        var result = await GTDTrade(JSON.stringify(data));
        // console.log('回報',result);
        //下單正確以外Refresh，正確則等回報再畫單
        if(result.data.CondCmd == 1 && (result.data.TradeReplyCode!=999 || result.data.TradeReplyCode!=0)){
          CallCondOrderApi();
        }

        if(result.status=='200'&&result.data.TradeReplyCode==999){
          isKeepOrder.value =false;
          if(!isSingleOrder.value){ //判斷多筆，呈現為正確圖示
            let selectObj = checkOrders.value.find((item)=>item.condno == result.data.Condno);
            selectObj.sendStatus=1;
            if(end)UpdateEnd();
          }
        }
        else
        {
          if(!isSingleOrder.value){ //判斷多筆，呈現為錯誤圖示
            let selectObj = checkOrders.value.find((item)=>item.condno == result.data.Condno);
            selectObj.sendStatus=0;
            if(end)UpdateEnd();
          }
        }
        CondFeedBack(result);
      }
      catch(err){
        console.log(err)
      }
    }

    //送單成功回報
    const CondFeedBack=(result)=>{
      // console.log('CondFeedBack',result);
      CreateAlert( TradeTostHtml(result.data),styleCTRL(result.data.CondCmd) );
    };
    const CreateAlert= ( html ,color)=>{
        var bootstrap = require('bootstrap');
        var style = color;
        var alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        alertPlaceholder.style="z-index:999;position: fixed;right: 10px;bottom: 90px;";
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        alertPlaceholder.append(wrapper);
        var New_toast = wrapper.querySelector('.toast');
        var new_toastHead = wrapper.querySelector('.toast-header');
        new_toastHead.style.color = 'white';
        new_toastHead.style.backgroundColor = 'rgba(' + style.BGColor_R + ',' + style.BGColor_G + ',' + style.BGColor_B +', '+ style.BGColor_op +')';
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
                style.BGColor_B = 9;
                style.BGColor_op=0.8;
                style.color = 'white';
                break;
            case 1: 
            case 2: 
                style.BGColor_R = 237;
                style.BGColor_G = 90;
                style.BGColor_B = 90;
                style.BGColor_op=0.9;
                style.color = 'white'; 
                break;
            case 3:
                style.BGColor_R = 108;
                style.BGColor_G = 117;
                style.BGColor_B = 125;
                style.BGColor_op=0.9;
                style.color = 'white'; 
                break;
            case 4:
                style.BGColor_R = 21;
                style.BGColor_G = 115;
                style.BGColor_B = 71;
                style.BGColor_op=0.9;
                style.color = 'white'; 
                break;
            case 5: 
            case 6: 
            case 7: 
            case 8:
                style.BGColor_R = 247;
                style.BGColor_G = 187;
                style.BGColor_B = 7;
                style.BGColor_op=0.9;
                style.color = 'white';  
                break;
            case 9: 
            case 10:
            case 11:
            case 12:
                style.BGColor_R = 105;
                style.BGColor_G = 113;
                style.BGColor_B = 121;
                style.BGColor_op=0.9;
                style.color = 'white';  
                break;
            default:
                break;
        }
        return style;
    }
    const TradeTostHtml=( trademsg )=>{
        var status = convert.condstatus[trademsg.CondStatus];
        var action = convert.condcmd[trademsg.CondCmd] 
        var condno = trademsg.Condno;
        var msg = '';
        var Tostmsg = '';
        if(trademsg.TradeReplyCode==0 || trademsg.TradeReplyCode==999){
            msg ='<span style="color:white"> 成功</span>';
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

    //查詢
    //歷程
    const GetOCondno=(event)=>{
      OrderRecord.value = {};
      CallReCondOrderApi(event,'order');
    }
    const GetSCondno=(event)=>{
      SearchRecord.value = {};
      CallReCondOrderApi(event,'search');
    }
    //歷史查詢
    const GetQueryList=(event)=>{
      tempquery.value={};
      tempquery.value=event;
      // console.log('temp',tempquery.value,event);
      firsttime.value = false;
      isSearchQuery.value=true;
      CallCondOueryApi(tempquery.value);
    }
    const GetNextQuery=(event)=>{
      isSearchQuery.value = true;
      CallCondOueryApi(tempquery.value);
    }

    //查詢API
    //取得條件回報資訊
    const CallCondOrderApi = async() =>{
      //深層拷貝，缺點nan,infinity,regexp會轉成null值
      var GTDOrderQC = {...TodayGTDordersQC.value};
      var qc =  {
        "acc":store.state.CustObj.Ac,
        "co":store.state.CustObj.Fm,
        "subacc":'',
        "subco":'',
        "gtdcond":{"CondStatus":"0"},
        "mode":{amount:0,index:0,type:0},
        "ctyp":"8",
        "pdtyp":0,
      };
      GTDOrderQC.qc=qc;
      try{      
        var data = JSON.stringify(GTDOrderQC);
        var rawdata = await GetCondOrder(data);
        // console.log('查詢回報資訊',rawdata);
        TodayGTDorders.value = rawdata.data.condord;
      }
      catch(err){
          console.log(err)
      }
    };
    //取得條件歷史查詢資訊
    const CallCondOueryApi = async(query) =>{
      var GTDQueryQC = JSON.parse(JSON.stringify(TodayGTDordersQC.value));
      // console.log('GTDQueryQC',GTDQueryQC,'query',query);
      var mode =  {
        "Amount":store.state.Amount,
        "Index":store.state.newIndex,
        "Type":2
      };
      GTDQueryQC.qc = query;
      GTDQueryQC.qc.mode = mode;
      try{      
        var data = JSON.stringify(GTDQueryQC);
        var rawdata = await GetCondOrder(data);
        OldGTDSearchs.value = rawdata.data.condord;
        isSearchQuery.value = false;
      }
      catch(err){
          console.log(err)
      }
    };
    //條件單歷程查詢
    const CallReCondOrderApi = async(condno,page) =>{
      var GTDrecordQC = JSON.parse(JSON.stringify(GTDRecordQC.value));
      var gtdcond = {
        "gtdcond":{
          "Condno":condno
        },
      };
      GTDrecordQC.qc= gtdcond;

      try{      
        var data = JSON.stringify(GTDrecordQC);
        var rawdata = await GetCondRec(data);
        if(page=='order'){
          OrderRecord.value = rawdata.data.condrec;
        }else if(page=='search'){
          SearchRecord.value = rawdata.data.condrec;
        }
      }
      catch(err){
          console.log(err)
      }
    }

    //Lifecycle
    onBeforeMount(()=>{
      store.dispatch('GetInitialData');
      CallCondOrderApi();
    })

    onMounted(()=>{
      var tempAlertModal = new bootstrap.Modal(document.getElementById('AlertModal'));
      var tempCertPINModal = new bootstrap.Modal(document.getElementById('CertPINModal'));
      var tempOrderModal = new bootstrap.Modal(document.getElementById('OrderModal'));
      var tempOrdersModal = new bootstrap.Modal(document.getElementById('OrdersModal'));
      //Modal實體化
      alertModal.value=tempAlertModal;
      certPINModal.value=tempCertPINModal;
      orderModal.value=tempOrderModal;
      ordersModal.value=tempOrdersModal;
      GetCheckCA();
    })
    
    return{
      isSearchQuery,certPIN,isKeepOrder,isSingleOrder,checkOrders,checkOrder,action,ordersErrorCount,ordersOkCount,msgError,pwError,
      TodayGTDorders,OldGTDSearchs,OrderRecord,SearchRecord,
      GetCheckCA,GetOCondno,GetSCondno,GetQueryList,GetOrders,
      OnCertPIN,OnOrderPKCS1,
      SendTrade,CallCondOrderApi,CallReCondOrderApi,
      firsttime,cust,GetNextQuery,BtnUpdate,isUpdating,isUpdated
    }
  },
  beforeRouteEnter(to, from, next){
    next(vm=>{
      if(vm.$store.state.CustObj.sessionkey==''){
        vm.$router.push({name:'DataLoadingPage'});
      }
    })
  },
  beforeUnmount(){
    ResetKey();
  },
};
</script>
<style lang="scss" scoped>
  @import "@/ColorStyle/scss/styleconfig.scss";
  @import "@/ColorStyle/scss/SGTP.scss";
  @media screen and (max-width: 992px){
    .dateto{
      display: none;
    }
    .startdate{
      margin-bottom: 10px;
    }
  }
  .nav-link:not(.active){
      color: #495057;
  }

  .alert{
    display: none;
  }

  .alert.show{
    display: block;
    padding:10px 0 !important;
  }

  .bgstart
  {
    background: #74bb74;
  }
  .bgpause
  {
    background: #b8b8b8b2;
  }
  .bgcancel
  {
    background: #eb9090;
  }
  .modalTable tbody td
  {
    font-size:16px;
    font-family: Microsoft JhengHei;
    padding: 14px 8px 14px 8px;
  }
</style>
