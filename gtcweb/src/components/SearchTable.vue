<template>
  <div class="responsive">
    <!-- 搜尋部分 -->
    <!-- <div class="col-12 mt-3 mt-lg-0 mb-3">
      <div class="row justify-content-end">
        <div class="col-6 col-sm-4 col-md-5 col-lg-3 mt-3 mt-sm-0">
          <div class="input-group w-100">
            <input type="text" class="form-control border-end-0" placeholder="Search" aria-label="Search" aria-describedby="addon-wrapping" v-model="searchText" @blur="GoFilter" @keyup.enter="GoFilter">
            <span class="overflow input-group-text border-start-0" style="background:white;"><i class="bi bi-search"></i></span>
          </div>
        </div>
      </div>
    </div> -->
    <!-- 表單區域 -->
    <div class="responsive">
      <table id="OrderTable" class="table table-striped align-middle maintable" style="width:100%">
          <thead class="border-2 border-bottom-0 border-dark">
            <tr>
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
            <tr class="border border" v-show="this.GTDSearchs.length!=0" v-for="item in tableData[pageIndex-1]" :key="item.condno">
              <td>{{item.outcondstatus}}</td>
              <td style="width:80px">{{item.outacc}}</td>
              <td>{{item.condno}}</td>
              <td>{{item.outOrdtm}}</td>
              <td>{{item.startdt}}<br>{{item.enddt}}</td>
              <td>{{item.exh}}</td>
              <td>{{item.outComno}}</td>
              <td>{{item.outCtype}}</td>
              <td>
                <div v-if="item.outDtrade == '非當沖'">
                  <i class="bi bi-x-lg"></i>
                </div>
                <div v-else-if="item.outDtrade == '當沖'">
                  <i class="bi bi-check-lg"></i>
                </div>
                <div v-else>
                  {{item.outDtrade}}
                </div>
              </td>
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
                <button class="btn btn-primary" type="button"  data-bs-toggle="modal" data-bs-target="#LogSearch" @click="OnRecord(item)">歷程</button>
              </td>
            </tr>
            <tr v-show="GTDSearchs.length==0">
              <td colspan="20" class="border">無資料</td>
            </tr>
          </tbody>
      </table>
      <div v-show="GTDSearchs.length!=0 && isEnd && pageIndex==pageCount" class="pt-3 pb-5">
        <span class="ms-3" style="color:lightgray;font-weight: 600;font-size:20px;letter-spacing:3px;">- - - 已經查無資料 - - -</span>
      </div>
    </div>
    <!-- 分頁部分 -->
    <div v-if="!(pageIndex==1 && GTDSearchs.length==0)" class="d-flex justify-content-end">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
              <button class="btn page-item border-0 rounded-start bg-white p-0 " @click="PrePageset()" :disabled="pageIndex==1">
                  <a class="page-link ps-3 pe-3" aria-label="Previous" style="font-size:18px;">
                      <span aria-hidden="true">上{{perPageDataCtn}}筆</span>
                  </a>
              </button>
              <button class="btn page-item border-0 rounded-end bg-white p-0" :disabled="isEnd && pageIndex==pageCount" @click="NextPageset()">
                    <a class="page-link ps-3 pe-3"  aria-label="Previous" style="font-size:18px;">
                      <span aria-hidden="true">下{{perPageDataCtn}}筆</span>
                    </a>
              </button>
          </ul>
      </nav>
    </div>
    <!-- 歷程 -->
    <div class="modal fade" id="LogSearch" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
            <div id="RecLog">
              <table id="LogTable" class="table table-striped align-middle maintable">
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
                <tr v-for="item in recData" :key="item.condno">
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
  </div>
</template>

<script>
import convert from "../utility/convert";
export default {
  props:{
    GTDSearchs:{
      type:Object,
    },
    SearchRecord:{
      type:Object,
    }
  },
  emits: ["record","callsearch"],
  data(){
    return{
      orderData:[],     //轉換呈現資料
      recData:[],       //歷程轉換呈現資料
      RecCondno:"",     //條件序號

      isEnd:false,      //是否下次就查無資料
      allData:[],         //整體資料(不斷擴大)
      // searchText:"",      //即時搜尋文字
      // noFilter:false,     //未搜到
      // filterData:[],      //篩選資料
      tableData:[],       //呈現資料
      pageIndex:1,        //目前頁數
      perPageDataCtn:10,  //每頁幾筆
      pageCount:0,        //共可分幾頁
    }
  },
  watch:{
    GTDSearchs(){
      console.log('watch',this.GTDSearchs,this.GTDSearchs.length);
      //判斷資料清空
      if(this.$store.state.newIndex==1){
        this.pageIndex=1;
        this.allData=[];
      }
      //判斷下一筆
      var amount = this.$store.state.Amount;
      if(this.GTDSearchs.length<amount)
      {
        this.isEnd=true;
      }else{
        this.isEnd=false;
      }
      
      this.SetAllData();
    },
    SearchRecord:function(){
      this.RecConvertData();
    },
  },
  methods:{
    //歷程Convert
    RecConvertData(){
      this.recData.length=0;
      for(let record=0;record<this.SearchRecord.length;record++){
        this.recData[record] = this.SearchRecord[record];
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
    //點選歷程
    OnRecord(item){
      this.RecCondno = item.condno;
      this.$emit('record',item.condno);
    },

    //取得總資料 畫面資料呈現切割
    SetAllData(){
      if(this.GTDSearchs!=undefined && this.GTDSearchs!=''){
        //篩新資料
        for( let index=0 ; index<this.GTDSearchs.length;index++ ){
            this.allData.push(this.GTDSearchs[index])
        }
        this.GTCConvertData();
      }
    },

    //歷史回報Convert
    GTCConvertData(){
      this.orderData.length=0;
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
      
      this.SetTableData();
    },
    
    //製作頁面
    SetTableData(){

      this.pageCount = Math.ceil(this.orderData.length/this.perPageDataCtn);
      var start=0;
      var end=0;
      //清空
      while(this.tableData.length){
        this.tableData.pop()
      }
      for(let i=0;i<this.pageCount;i++){
        var tempdata=[];
        end = (i+1)*this.perPageDataCtn;
        var data = this.orderData.slice(start,end);

        for(let index=0;index<data.length;index++)
        {
          tempdata.push(data[index]);
        }
        this.tableData.push(tempdata);

        start = start + this.perPageDataCtn;
      }
      console.log(this.tableData);
    },

    //上下頁切換
    PrePageset(){
      if( this.pageIndex>1 ) 
      {
        this.pageIndex--
      }
      else 
      { 
        this.pageIndex=1
      }
    },
    NextPageset(){
      if( this.pageIndex < this.pageCount )
      {
        this.pageIndex++
      }
      else
      {
        this.pageIndex++
        console.log(this.$store.state.newIndex+1);
        //CallAPI++，沒直就保持原狀
        this.$store.commit("SetModeIndex", this.$store.state.newIndex+1); 
        this.$emit('callsearch');
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
  .maintable th {
    background-color: #2f5fa7 !important;
    color: #e7f1ff;
    font: bold 16px "微軟雅黑";
  }
  .table tbody td
  {
    font-size:14px;
    font-family: Microsoft JhengHei;
    padding: 16px 8px 16px 8px;
  }
  .hide{
    display: none !important;
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
</style>