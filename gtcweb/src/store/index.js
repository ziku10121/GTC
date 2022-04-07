import { createStore } from 'vuex'
import { GetNoFilterComList, GetFilterComList, GetNoFilterCusList, GetFilterCusList } from '../api/Api_manager'

export default createStore({
    state: {
        //正式
        CustObj: {
          Ac: '',
          Fm: '',
          sr: '',
          sessionkey: '',
          ID: '',
          IsBaseAccLogin: false,
          IsCA: false,  //是否要CA驗證
          ActName: '',
          CompanyName: '',
          CanSubAccTrade: false,
        },
        IsTrust: true,             //是否進行Trust機制 
        HaveCheckCertExist: false, //憑證是否存在
        CanTrade:false,
        NoFilterComData: [],
        FilterComData: [],
        NoFilterAccData: [],
        FilterAccData: [],
        //-----------------
        //WS訊息
        WsLogin: [],
        WsCom: [],
        WsCus: [],
        WsCondReply: [],
        WSmutiplyLogin: [],
        //分頁
        Amount:100, //查詢API當頁的筆數
        newIndex:1,
    },
    mutations: {
      RestoreCustObj(state) {
        if (sessionStorage.getItem('CustObj') != null) {
          var data = JSON.parse(sessionStorage.getItem('CustObj'));
          state.CustObj.Ac = data.account;
          state.CustObj.Fm = data.company;
          state.CustObj.sr = data.srctype;
          state.CustObj.sessionkey = data.SessionKey;
          state.CustObj.ID = data.ID;
          state.CustObj.IsCA = data.IsCA;
          state.CustObj.ActName = data.ActName;
          state.CustObj.IsBaseAccLogin = data.IsBaseAccLogin;
          state.CustObj.CompanyName = data.companyName;
          state.CustObj.CanSubAccTrade = data.CanSubAccTrade;
        }
      },
      SetTrustobj(state, playload) {
        if(typeof(playload.account) != 'undefined')  state.CustObj.Ac = playload.account;
        if(typeof(playload.company) != 'undefined') state.CustObj.Fm = playload.company;
        if(typeof(playload.srctype) != 'undefined')   state.CustObj.sr = playload.srctype;
        if(typeof(playload.SessionKey) != 'undefined')   state.CustObj.sessionkey = playload.SessionKey;
        if(typeof(playload.ID) != 'undefined')   state.CustObj.ID = playload.ID;
        if(typeof(playload.IsCA) != 'undefined')   state.CustObj.IsCA = playload.IsCA;
        if(typeof(playload.ActName) != 'undefined')state.CustObj.ActName = playload.ActName;
        if(typeof(playload.IsBaseAccLogin) != 'undefined') state.CustObj.IsBaseAccLogin = playload.IsBaseAccLogin;
        if(typeof(playload.companyName) != 'undefined')state.CustObj.CompanyName = playload.companyName
        if(typeof(playload.CanSubAccTrade) != 'undefined') state.CustObj.CanSubAccTrade = playload.CanSubAccTrade;
        //存進記憶體
        sessionStorage.setItem('CustObj', JSON.stringify(playload));
      },
      SetHaveCheckCertExist(state, playload) {
          state.HaveCheckCertExist = playload
      },
      SetWsMSG(state, msg) {
        switch (msg.ReplyType) {
          case 0:
            //未定義
            break;
          case 1:
            //登入回報
            state.WsLogin = msg.LoginRequest;
            break;
          case 2:
            //商品更新
            state.WsCom = msg.ReplyType;
            break;
          case 3:
            //條件單回報
            // console.log("條件單")
            state.WsCondReply = msg.SGTPCondition;
            break;
          case 4:
            //客戶資訊更新
            state.WsCus = msg.CustomerRefreshData;
            break;
          case 5:
            //重複登入
            state.WSmutiplyLogin = msg.ReplyType;
            break;
          default:
            break;
        }
      },
      SetFilterComData(state, new_FilterComData) {
        state.FilterComData = new_FilterComData;
      },
      SetNoFilterComData(state, new_NoFilterComData) {
        state.NoFilterComData = new_NoFilterComData;
      },
      SetFilterAccData(state, new_FilterAccData) {
        state.FilterAccData = new_FilterAccData;
      },
      SetNoFilterAccData(state, new_NoFilterAccData) {
        state.NoFilterAccData = new_NoFilterAccData;
      },
      SetCanTrade(state,isCanTrade){
        state.CanTrade = isCanTrade;
      },
      SetModeIndex(state,index){
        state.newIndex = index;
      }
    },
    actions: {
        DoSetTrustobj(context, trustobj) {
          // console.log(trustobj);
          context.commit('SetTrustobj', trustobj);
        },
        async DoSetNoFilterComData(context) {
          try {
            var Jsondata = JSON.stringify({
              "accountID": {
                "SessionKey": context.state.CustObj.sessionkey,
                "account": context.state.CustObj.Ac,
                "company": context.state.CustObj.Fm,
                "srctype": context.state.CustObj.sr
              },
            });
            var rawdata = await GetNoFilterComList(Jsondata);
            // console.log('rawdata' + rawdata)
            if (rawdata.statusText == 'OK' && rawdata.data != null) {
              context.commit('SetNoFilterComData', rawdata.data);
              return true;
            }
            return false;
          } catch (err) {
            console.log(err);
            return false;
          }
        },
        async DoSetFilterComData(context) {
          try {
            var Jsondata = JSON.stringify({
                "accountID": {
                  "SessionKey": context.state.CustObj.sessionkey,
                  "account": context.state.CustObj.Ac,
                  "company": context.state.CustObj.Fm,
                  "srctype": context.state.CustObj.sr
                },
            });
            var rawdata = await GetFilterComList(Jsondata);
            // console.log('rawdata' + rawdata)
            if (rawdata.statusText == 'OK' && rawdata.data != null) {
              context.commit('SetFilterComData', rawdata.data);
              return true;
            }
            return false;
          } catch (err) {
            console.log(err);
            return false;
          }
        },
        async DoSetNoFilterAccData(context) {
          try {
            var Jsondata = JSON.stringify({
              "accountID": {
                "SessionKey": context.state.CustObj.sessionkey,
                "account": context.state.CustObj.Ac,
                "company": context.state.CustObj.Fm,
                "srctype": context.state.CustObj.sr
              },
            });
            var rawdata = await GetNoFilterCusList(Jsondata);
            // console.log('rawdata' + rawdata)
            if (rawdata.statusText == 'OK' && rawdata.data != null) {
              context.commit('SetNoFilterAccData', rawdata.data);
              return true;
            }
            return false;
          } catch (err) {
              console.log(err);
              return false;
          }
        },
        async DoSetFilterAccData(context) {
          try {
            var Jsondata = JSON.stringify({
              "accountID": {
                "SessionKey": context.state.CustObj.sessionkey,
                "account": context.state.CustObj.Ac,
                "company": context.state.CustObj.Fm,
                "srctype": context.state.CustObj.sr
              },
            });
            var rawdata = await GetFilterCusList(Jsondata);
            // console.log('rawdata' + rawdata)
            if (rawdata.statusText == 'OK' && rawdata.data != null) {
              context.commit('SetFilterAccData', rawdata.data);
              return true;
            }
            return false;
          } catch (err) {
            console.log(err);
            return false;
          }
        },
        async GetInitialData({ dispatch, state }) {
          if (JSON.stringify(state.NoFilterComData) == '[]' || JSON.stringify(state.NoFilterComData) == '{}') {
            await dispatch('DoSetNoFilterComData').then((new_data) => {
              // console.log('NoComData:',new_data);
            });
          }
          if (JSON.stringify(state.FilterComData) == '[]' || JSON.stringify(state.FilterComData) == '{}') {
            await dispatch('DoSetFilterComData').then((new_data) => {
              // console.log('ComData:',new_data);
            });
          }
          if (JSON.stringify(state.NoFilterAccData) == '[]' || JSON.stringify(state.NoFilterAccData) == '{}') {
            await  dispatch('DoSetNoFilterAccData').then((new_data) => {
              // console.log('NoAccData:',new_data);
            });
          }
          if (JSON.stringify(state.FilterAccData) == '[]' || JSON.stringify(state.FilterAccData) == '{}') {
            await  dispatch('DoSetFilterAccData').then((new_data) => {
              // console.log('AccData:',new_data);
            });
          }
          //判斷是否能下單
          if(state.CustObj.IsBaseAccLogin){ //母帳
            if(state.FilterAccData.cust.length!=0){
              this.commit('SetCanTrade',true);
            }else{
              this.commit('SetCanTrade',false);
            }
          }else{//子帳、一般
            if(state.CustObj.CanSubAccTrade){
              if(state.NoFilterAccData.cust.gtdflag==1&&state.NoFilterAccData.tdflg=='Y'){
                this.commit('SetCanTrade',true);
              }else{
                this.commit('SetCanTrade',true);
              }
            }else{
              this.commit('SetCanTrade',false);
            }
          }

          return true;
        },
        RefreshInitialComData({ dispatch }) {
          dispatch('DoSetNoFilterComData').then((new_data) => {
            // console.log(new_data);
          });
          dispatch('DoSetFilterComData').then((new_data) => {
            // console.log(new_data);
          });
        },
        RefreshInitialCusData({ dispatch }) {
          dispatch('DoSetNoFilterAccData').then((new_data) => {
            // console.log(new_data);
          });

          dispatch('DoSetFilterAccData').then((new_data) => {
            // console.log(new_data);
          });
        }
    },
    modules: {}
})