<template>
  <div class="responsive">
    <div class="row text-start">
      <div class="col-12 col-lg-5 col-xl-4">
        <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off" @click="OpenBatch">
        <label v-if="canTrade && (!isCA || HaveCheckCertExist)" class="btn btn-outline-primary" for="btncheck1">批次處理</label>
        <div  v-if="isBatch && canTrade && (!isCA || HaveCheckCertExist)" class="btn-group">
          <button type="button" class="btn SGTP-BtnStyle-confirm ms-3" :disabled="selectData==''?true:false" @click="StartBatch()">啟動</button>
          <button type="button" class="btn SGTP-BtnStyle-pause ms-3" :disabled="selectData==''?true:false" @click="PauseBatch()">暫停</button>
          <button type="button" class="btn SGTP-BtnStyle-cancel ms-3" :disabled="selectData==''?true:false" @click="CloseBatch()">取消</button>
        </div>
      </div>
      <!-- 搜尋部分 -->
      <div class="col-12 col-lg-7 col-xl-8 mt-3 mt-lg-1 mb-3">
        <div class="row justify-content-end">
          <div class="col-auto text-end">
            <button class="rounded-2 border btn-outline-secondary h-100" style="width:50px" @click="Requery">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
          <div v-show="IsBaseAccLogin" class="col-5 col-sm-auto col-xl-2">
            <div class="input-group w-100">
              <select id="condstatus" class="form-select" v-model="filterSubacc">
                  <option value="" selected>子帳號(全選)</option>
                  <option v-for="item in cust" :key="item" :value="item">{{item.acc}}</option>
              </select>
            </div>  
          </div>
          <div class="col-5 col-sm-auto col-xl-2">
            <div class="input-group w-100">
              <select id="condstatus" class="form-select" v-model="filterCondStatus">
                  <option value="0" selected>目前狀態(全選)</option>
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
          <div class="col-8 col-sm-5 col-md-5 col-lg-4 mt-3 mt-sm-0">
            <div class="input-group w-100">
              <input type="text" class="form-control border-end-0" placeholder="查詢交易所、商品" aria-label="Search" aria-describedby="addon-wrapping" v-model="searchText" @blur="GoFilter" @keyup.enter="GoFilter">
              <span class="overflow input-group-text border-start-0" style="background:white;"><i class="bi bi-search"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 資料查詢中 -->
    <div v-show="isSearchQuery" class="pt-3 pb-5">
        <div class="spinner-border" style="width:3rem; height:3rem;" role="status" aria-hidden="true"></div>
        <span class="ms-3" style="font-size:18px">資料查詢中...</span>
    </div>
    <!-- 表單區域 -->
    <table v-show="!isSearchQuery" id="OrderTable" class="table table-striped align-middle SGTP-TableStyle" style="width:100%">
        <thead class="border-1">
          <tr>
            <th v-if="canTrade && (!isCA || HaveCheckCertExist)" rowspan="2" class="table-title-bottom">
              <input type="checkbox" v-if="isBatch" v-model="check_All" @change="Change_All"/>
            </th>
            <th rowspan="2">目前狀態</th>
            <th rowspan="2">帳號</th>
            <th rowspan="2">條件序號</th>
            <th rowspan="2">建立時間</th>
            <th rowspan="2">有效區間</th>
            <th rowspan="2">交易所</th>
            <th rowspan="2">商品</th>
            <th rowspan="2">種類</th>
            <th rowspan="2">當沖</th>
            <th rowspan="2">來源別</th>
            <th rowspan="2">買賣</th>
            <th rowspan="2">委託別</th>
            <th rowspan="2">委託價</th>
            <th rowspan="2">停損價</th>
            <th rowspan="2" class="table-title-detailend">觸發價</th>
            <th class="table-title-detailend table-title-bottom" colspan="4">口數</th>
            <th rowspan="2"></th>
          </tr>
          <tr>
            <th>委託</th>
            <th>剩餘</th>
            <th>成交</th>
            <th class="table-title-detailend">取消</th>
          </tr>
        </thead>
        <tbody style="font-size:15px">
          <tr v-show="this.GTDOrders.length!=0" class="border border" v-for="item in tableData[pageIndex-1]" :key="item.condno">
            <td v-if="canTrade && (!isCA || HaveCheckCertExist)">
              <!-- 批次checkbox -->
              <div v-if="isBatch">
                <input name="status" type="checkbox" :value="item.condno" v-model="selectData"/>
              </div>
              <!-- 單次狀態按鈕 -->
              <div v-if="!isBatch" id="SingleGroups"  class="text-start" style="white-space:nowrap">
                <!-- data-bs-toggle="modal" data-bs-target="#OrderModal" -->
                <button type="button" class="ms-2 btn SGTP-BtnStyle-confirm" v-if="item.condstatus==7?true:false" @click="Start(item)">啟動</button>
                <button type="button" class="ms-2 btn SGTP-BtnStyle-pause" v-if="item.condstatus==2?true:false" @click="Pause(item)">暫停</button>
                <button type="button" class="ms-2 btn SGTP-BtnStyle-cancel" v-if="(item.condstatus==9||item.condstatus==10||item.condstatus==11||item.condstatus==12)?false:true" @click="Close(item)">取消</button>
              </div>
            </td>
            <td>{{item.outcondstatus}}</td>
            <td style="width:80px">{{item.outacc}}</td>
            <td>{{item.condno}}</td>
            <td>{{item.outOrdtm}}</td>
            <td>{{item.startdt}}<br>{{item.enddt}}</td>
            <td>{{item.exh}}</td>
            <td>{{item.outComno}}</td>
            <td>{{item.outCtype}}</td>
            <td>{{item.outDtrade}}</td>
            <td>{{item.src}}</td>
            <td>{{item.outSide}}</td>
            <td>{{item.outOrdtype}}</td>
            <td>{{item.outPrice}}</td>
            <td>{{item.outStpPrice}}</td>
            <td>{{item.outTPrice}}</td>
            <td>{{item.qty}}</td>
            <td>{{item.resqty}}</td>
            <td>{{item.cumfillqty}}</td>
            <td>{{item.cxlqty}}</td>
            <td style="padding-right:5px">
              <button class="btn btn-primary" type="button"  data-bs-toggle="modal" data-bs-target="#LogCourse" @click="OnRecord(item)">歷程</button>
            </td>
          </tr>
          <tr v-show="GTDOrders.length<1 || pageCount==0">
            <td colspan="21" class="border">無資料</td>
          </tr>
        </tbody>
    </table>
  </div>
  <!-- 分頁部分 -->
  <div class="d-flex justify-content-end">
      <nav aria-label="Page navigation example">
          <ul class="pagination">
              <button class="btn page-item border-0 rounded-start bg-white p-0" :disabled="pageIndex==1" @click="PrePageset()">
                  <a class="page-link ps-3 pe-3" aria-label="Previous" style="font-size:18px;">
                      <span aria-hidden="true">上{{perPageDataCtn}}筆</span>
                  </a>
              </button>
              <button class="btn page-item border-0 rounded-end bg-white p-0" :disabled="pageIndex==pageCount && pageCount!=0" @click="NextPageset()">
                    <a class="page-link ps-3 pe-3"  aria-label="Previous" style="font-size:18px;">
                      <span aria-hidden="true">下{{perPageDataCtn}}筆</span>
                    </a>
              </button>
          </ul>
      </nav>
  </div>

  <!-- 歷程 -->
  <div class="modal fade" id="LogCourse" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">歷程</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="text-start ms-1 mb-2" style="font-size:18px;">
            條件序號：{{RecCondno}}
          </div>
          <div>
            <table class="table table-striped align-middle SGTP-TableStyle">
            <thead>
              <tr>
                <th rowspan="2">更新時間</th>
                <th rowspan="2">異動</th>
                <th rowspan="2">目前狀態</th>
                <th rowspan="2">帳務日期</th>
                <th rowspan="2">中台單號</th>
                <th rowspan="2">委託書號</th>
                <th rowspan="2">下單人</th>
                <th rowspan="2" class="table-title-detailend">來源</th>
                <th class="table-title-bottom" colspan="4">口數</th>
              </tr>
              <tr>
                <th>委託</th>
                <th>剩餘</th>
                <th>成交</th>
                <th>取消</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in recData" :key="index">
                <td>{{item.outdbdt}}</td>
                <td>{{item.outOrdertype}}</td>
                <td>{{item.outcondstatus}}</td>
                <td>{{item.outOrddt}}</td>
                <td>{{item.seqno}}</td>
                <td>{{item.ordno}}</td>
                <td>{{item.outop}}</td>
                <td>{{item.src}}</td>
                <td>{{item.qty}}</td>
                <td>{{item.resqty}}</td>
                <td>{{item.cumfillqty}}</td>
                <td>{{item.cxlqty}}</td>
              </tr>
            </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import convert from "../utility/convert";
export default {
  props:{
    GTDOrders:{
      type:Object,
    },
    OrderRecord:{
      type:Object,
    },
    isUpdated:{
      type:Boolean,
    }
  },
  emits: ["sendorder","record","requery"],
  
  data(){
    return{
      orderData:[],   //轉換呈現資料
      recData:[],     //歷程轉換呈現資料
      isSearchQuery:false,  //查詢中 
      selectData:[],  //選擇資料
      check_All:false,//多選
      isBatch:false,  //是否批次動作
      isAddCond:false,//是否新增一筆條件單

      RecCondno:"",   //條件序號
      modalData:{},   //顯示modal單筆確認資料
      modalsData:[],  //顯示modal多筆確認資料
      
      allData:[],         //整體資料(不斷擴大)
      searchText:"",      //即時搜尋文字
      filterData:[],      //篩選資料
      tableData:[],       //呈現資料
      pageIndex:1,        //目前頁數
      perPageDataCtn:10,  //每頁幾筆
      pageCount:0,        //共可分幾頁
      filterSubacc:'',    //篩選目前子帳號
      filterCondStatus:0, //篩選目前狀態
    }
  },
  computed:{
    IsBaseAccLogin(){
			return this.$store.state.CustObj.IsBaseAccLogin;
		},
    cust(){
      return this.$store.state.FilterAccData.cust;
    },
    check_All_flag(){
      for(let i in this.tableData[this.pageIndex-1]){
        var index = this.selectData.indexOf(this.tableData[this.pageIndex-1][i].condno);
        if(index<0)
        {
          return false;
        }
      }
      return true;
    },
    ComputedCondReply(){
      return this.$store.state.WsCondReply;
    },
    canTrade(){
      return this.$store.state.CanTrade;
    },
    //有無憑證
    HaveCheckCertExist(){
      return this.$store.state.HaveCheckCertExist;
    },
    isCA(){
      return this.$store.state.CustObj.IsCA;
    }
  },
  watch:{
    GTDOrders(){
      this.isSearchQuery=false;
      this.SetAllData();
    },
    check_All_flag()
    { 
      if(this.check_All_flag == true)
      {
        this.check_All = true;
      }
      else{
        this.check_All = false;
      }
    },

    isUpdated(){
      if(this.isUpdated){
        while(this.selectData.length){
          this.selectData.pop();
        }
      }
    },
    
    OrderRecord(){
      this.RecConvertData();
    },

    ComputedCondReply(_data){
      let self=this;
      console.log('Websocket CondReply:',_data);
      
      if(JSON.stringify(_data)!='[]' && this.allData!='undefined'){
        var count = 0;
        this.isAddCond=false;
        window.setTimeout(function() {
          for(let i=0;i<self.tableData.length;i++){
            let selectObj = self.tableData[i].find((item)=>item.condno == _data.condno);
            if(selectObj!=undefined){
              selectObj.condcmd=_data.condcmd;
              selectObj.condstatus=_data.condstatus;
              selectObj.outcondstatus =convert.condstatus[_data.condstatus];
            }
          }
          self.allData.forEach(function(item){
            if(item.condno.trim() == _data.condno.trim())
            {
              count++;
              item.condstatus =_data.condstatus;
            }
          })
          //新增訂單
          if(count==0)
          {
            self.isAddCond=true;
            self.allData.unshift(_data);
            self.GTCConvertData();
          }
        },150)
      }
    },

    filterSubacc(){
      this.GoFilter();
    },

    filterCondStatus(){
      this.GoFilter();
    }
  },
  methods:{
    //歷程Convert
    RecConvertData(){
      this.recData.length=0;
      for(let record=0;record<this.OrderRecord.length;record++){
        this.recData[record] = this.OrderRecord[record];
        //更新時間
        this.recData[record].outdbdt=convert.fulltimeformat(this.recData[record].dbdt);
        //委託條件
        this.recData[record].outOrdertype=convert.condcmd[this.recData[record].condcmd];
        //當前條件狀態
        this.recData[record].outcondstatus=convert.condstatus[this.recData[record].condstatus];
        //帳務日期
        this.recData[record].outOrddt=convert.fulltimeformat[this.recData[record].orddt];
        //操作者
        this.recData[record].outop = convert.orderop(this.recData[record].op);
      }
    },
    
    //操作按鈕
    OpenBatch(){
      while(this.selectData.length){
        this.selectData.pop();
      }
      this.isBatch=!this.isBatch;
    },
    BackProcess(){
      this.isProcess=false;
      this.isSingle=false;
    },
    Start(selecteditem){
      let selectCond = this.allData.find((item) => item.condno == selecteditem.condno);
      let order ={
        cmd:4,
        data:[selectCond],
        single:true,
      };
      this.$emit("sendorder", order);
    },
    Pause(selecteditem){
      let selectCond = this.allData.find((item) => item.condno == selecteditem.condno);
      let order ={
        cmd:3,
        data:[selectCond],
        single:true,
      };
      this.$emit("sendorder", order);
    },
    Close(selecteditem){
      let selectCond = this.allData.find((item) => item.condno == selecteditem.condno);
      let order ={
        cmd:2,
        data:[selectCond],
        single:true,
      };
      this.$emit("sendorder", order);
    },
    StartBatch(){
      this.MuchSelect();
      let order ={
        cmd:4,
        data:this.modalsData,
        single:false,
      }
      this.$emit("sendorder",order);
    },
    PauseBatch(){
      this.MuchSelect();
      let order ={
        cmd:3,
        data:this.modalsData,
        single:false,
      }
      this.$emit("sendorder",order);
    },
    CloseBatch(){
      this.MuchSelect();
      let order ={
        cmd:2,
        data:this.modalsData,
        single:false,
      }
      this.$emit("sendorder",order);
    },

    //操作處理呈現
    MuchSelect(){
      //清空陣列
      while(this.modalsData.length){
        this.modalsData.pop();
      }
      this.selectData.sort();
      this.selectData.reverse();

      for(let i=0;i<this.selectData.length;i++){
        this.modalsData.push(this.orderData.find((item) => item.condno == this.selectData[i]));
        
      }
    },
    
    //全選開關功能
    Change_All(){
      if(this.check_All==true){
        for(let i in this.tableData[this.pageIndex-1]){
          if(this.selectData.indexOf(this.tableData[this.pageIndex-1][i].condno)<0)
          {
           this.selectData.push(this.tableData[this.pageIndex-1][i].condno);
          }
        }
      }else{
        for(let i in this.tableData[this.pageIndex-1]){
          var index = this.selectData.indexOf(this.tableData[this.pageIndex-1][i].condno);
          if(index>=0)
          {
            this.selectData.splice(index,1);
          }
        }
      }
    },

    //回報更新
    Requery(){
      this.isSearchQuery=true;
      this.pageIndex=1;
      this.filterCondStatus=0;
      this.selectData=[];
      this.$emit('requery');
    },
    
    //點選歷程
    OnRecord(item){
      this.RecCondno = item.condno;
      this.$emit('record',item.condno);
    },
    
    //取得總資料 畫面資料呈現切割
    SetAllData(){
      this.allData=[];
      if(this.GTDOrders!=undefined && this.GTDOrders!=''){
        //篩新資料
        for( let index=0 ; index<this.GTDOrders.length;index++ ){
            this.allData.push(this.GTDOrders[index])
        }
        this.GTCConvertData();
      }
    },

    //今日回報Convert
    GTCConvertData(){
      this.orderData=[];
      for(let record=0;record<this.allData.length;record++){
        this.orderData[record] = JSON.parse(JSON.stringify(this.allData[record]));
        //帳號
        if (this.orderData[record].subco != null && this.orderData[record].subco != '') {
            this.orderData[record].outacc = this.orderData[record].acc.trim() + ' (' + this.orderData[record].subacc.trim() + ')';
        }
        else {
            this.orderData[record].outacc = this.orderData[record].acc.trim();
        }
        //當前條件狀態
        this.orderData[record].outcondstatus=convert.condstatus[this.orderData[record].condstatus];
        //建立時間
        this.orderData[record].outOrdtm=convert.fulltimeformat(this.orderData[record].ordtm);
        //商品
        this.orderData[record].outCallPut = convert.cp[this.orderData[record].cp];
        this.orderData[record].outComno=convert.comno(this.orderData[record].ctyp,this.orderData[record].com,this.orderData[record].ym,this.orderData[record].stkprc,this.orderData[record].outCallPut);
        //商品別
        this.orderData[record].outCtype=convert.comtype[this.orderData[record].ctyp];
        //當沖
        this.orderData[record].outDtrade = convert.dtrd[this.orderData[record].dtrd];
        
        //買賣
        this.orderData[record].outSide = convert.ps[this.orderData[record].ps];
        //委託別
        this.orderData[record].outOrdtype=convert.ordtyp[this.orderData[record].ordtyp];
        //委託單價
        this.orderData[record].outPrice = convert.price(this.orderData[record].p1,this.orderData[record].p2,this.orderData[record].p3);
        //停損價
        this.orderData[record].outStpPrice = convert.stpprice(this.orderData[record].p4,this.orderData[record].p5,this.orderData[record].p6);
        //觸發價
        this.orderData[record].outTPrice = convert.tpprice(this.orderData[record].tpl,this.orderData[record].tp1,this.orderData[record].tp2,this.orderData[record].tp3);
        //操作者
        this.orderData[record].op = convert.orderop(this.orderData[record].op);
      }
      this.SetFilterData();
    },

    SetFilterData(){
      if(this.orderData!=undefined && this.orderData!=''){
        //清空
        while(this.filterData.length){
          this.filterData.pop()
        }
        this.GoFilter();
      }
      else
      {
        if(this.filterData==[])this.filterData.length==0;
      }
    },
    
    //篩選判斷
    GoFilter(){
      if(!this.isAddCond){
        this.pageIndex=1;
      }
      
      if(this.filterData!=null){
        //即查沒值&&狀態全部
        if(this.searchText=='' && this.filterCondStatus==0 && this.filterSubacc==''){
          this.filterData = this.orderData;
        }else{
          var subaccount_result = this.DoSubaccountFilter( this.orderData);
          var state_result = this.DoStateFilterItem(subaccount_result);
          var result = this.DoKeywordFilterItem(state_result);
          this.filterData = result;
        }
        console.log(this.filterData);
        this.SetTableData();
      }
    },
    //篩選動作查詢
    DoSubaccountFilter(lists){
      if(this.filterSubacc=='')
      {
        return lists;
      }
      else
      {
        if(this.cust.length>0){
          return lists.filter((item)=>item.subacc == this.filterSubacc.acc);
        }
      }
    },
    DoStateFilterItem(lists){
      if(this.filterCondStatus==0)
      {
        return lists;
      }
      else
      {
        return lists.filter((item)=>item.condstatus == this.filterCondStatus);
      }
    },
    DoKeywordFilterItem(lists){
      if(this.searchText=='')
      {
        return lists;
      }
      else
      {
        let result=[];
        let input = this.searchText.trim().toLowerCase();
        var SearchExh = this.mappingEXH(input);
        var SearchCom = this.mappingCom(input);
        var MixArray = [];
        MixArray=SearchCom.concat(SearchExh);

        //交易所、商品
        lists.filter((item)=>{
          for( let i=0;i<MixArray.length;i++ ){
              var IsTrue = item.exh.toLowerCase().includes(MixArray[i])||item.com.toLowerCase().includes(MixArray[i]); 
              if( IsTrue)
              {
                result.push(item);
                break;
              }
          }
        })
        console.log('模糊挑選',result);
        return result;
      }
    },
    //拿輸入的字找到帶有這字眼的交易所
    mappingEXH(str){
        var result = [];
        var lowstr = str.toLowerCase();
        var rawdata = this.$store.state.NoFilterComData.ExhData_list;
        for( var item in rawdata ){
          //交易所No、交易所名稱 
          if(rawdata[item].Exhno.toLowerCase().includes(lowstr)|| rawdata[item].Exhname.toLowerCase().includes(lowstr)){
              result.push(rawdata[item].Exhno.toLowerCase());
          }   
        }
        return result;
    },
    //拿輸入的字找到帶有這字眼的商品
    mappingCom(str){
        var result = [];
        var lowstr = str.toLowerCase();
        var rawdata = this.$store.state.NoFilterComData.ComData_list;
        for( var item in rawdata ){
          //商品No、商品名稱
            if(rawdata[item].Comno.toLowerCase().includes(lowstr)|| rawdata[item].ComName.toLowerCase().includes(lowstr) ){
                result.push(rawdata[item].Comno.toLowerCase());
            }   
        }
        return result;
    },
    //製作頁面
    SetTableData(){
      this.pageCount = Math.ceil(this.filterData.length/this.perPageDataCtn);
      var start=0;
      var end=0;
      //清空
      while(this.tableData.length){
        this.tableData.pop()
      }
      for(let i=0;i<this.pageCount;i++){
        var tempdata=[];
        end = (i+1)*this.perPageDataCtn;
        var data = this.filterData.slice(start,end);

        for(let index=0;index<data.length;index++)
        {
          tempdata.push(data[index]);
        }
        this.tableData.push(tempdata);

        start = start + this.perPageDataCtn;
      }
    },

    //上下頁切換
    PrePageset(){
      if( this.pageIndex>1 ) 
      {
        this.pageIndex--
      }
      else 
      { 
        this.pageIndex=1;
      }
    },
    NextPageset(){
      if( this.pageIndex < this.pageCount )
      {
        this.pageIndex++
      }
      else
      {
        this.pageIndex = this.pageCount;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/ColorStyle/scss/styleconfig.scss";
  @import "@/ColorStyle/scss/SGTP.scss";
  .responsive{
    overflow-x:auto;
  }
  .table tbody td
  {
    font-size:14px;
    // font-family: Microsoft JhengHei;
    padding: 16px 8px 16px 8px;
  }
  .hide{
    display: none !important;
  }
  .table thead
  {
    vertical-align:middle !important;
  }
  .table-title-detailend
  {
    border-right:1px solid #dee2e6;
  }
  .table-title-bottom
  {
    border-bottom:0px solid #dee2e6;
  }
  .modal-content-self
  {
    padding: 10px 50px 15px 80px ;
  }
  
</style>