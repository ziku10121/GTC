import { createStore } from 'vuex'
import { GetNoFilterConList, GetFilterConList, GetNoFilterCusList, GetFilterCusList } from '../api/Api_manager'

export default createStore({
    state: {
        //正式
        CustObj: {
            Ac: '',
            Fm: '',
            sr: '',
            sessionkey: '',
            ID: '',
            ActName: '',
            IsBaseAccLogin: false,
            IsCheckCA: false, //要進行CA驗證嗎
            CompanyName: '',
            CanSubAccTrade: false
        },
        IsTrust: true, //進行Trust機制嗎  
        HaveCheckCertExist: false, //有內存憑證嗎
        certPIN: '', //前端輸入的Pin碼
        //憑證 未用到先保留
        CertObj: {
            SN: '',
            signature: '',
        },
        //-----------------------------
        NoFilterComData: [], //未篩選商品資料
        FilterComData: [], //篩選商品資料
        NoFilterAccData: [], //未篩選客戶資料
        FilterAccData: [], //篩選客戶資料
        //-----------------
        //WS訊息
        //登入
        WsLogin: [],
        //商品
        WsCom: [],
        //客戶
        WsCus: [],
        //回報
        WsCondReply: [],
        //重複登入
        WSmutiplyLogin: [],
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
                state.CustObj.IsCheckCA = data.IsCA;
                state.CustObj.ActName = data.ActName;
                state.CustObj.CanTrade = data.IsBaseAccLogin;
                state.CustObj.CompanyName = data.companyName;
                state.CustObj.CanSubAccTrade = data.CanSubAccTrade;
            }
        },
        SetCustObj(state, playload) {
            state.CustObj.Ac = playload.account;
            state.CustObj.Fm = playload.company;
            state.CustObj.sr = playload.srctype;
            state.CustObj.sessionkey = playload.SessionKey;
            state.CustObj.ID = playload.ID;
            state.CustObj.IsCheckCA = playload.IsCA;
            state.CustObj.ActName = playload.ActName;
            state.CustObj.IsBaseAccLogin = playload.IsBaseAccLogin;
            state.CustObj.CompanyName = playload.companyName;
            state.CustObj.CanSubAccTrade = playload.CanSubAccTrade;
            //存進記憶體
            sessionStorage.setItem('CustObj', JSON.stringify(playload));
        },
        SetHaveCheckCertExist(state, playload) {
            state.HaveCheckCertExist = playload
        },
        SetCertObj(state, playload) {
            state.CertObj = playload;
        },
        SetCertPIN(state, playload) {
            state.certPIN = playload;
        },
        SetWsCondReply(state, playload) {
            state.WsCondReply = playload;
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
    },
    actions: {
        DoSetTrustobj(context, trustobj) {
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
                var rawdata = await GetNoFilterConList(Jsondata);
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
                var rawdata = await GetFilterConList(Jsondata);
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
            var IsGetDataSuccess = false;
            if (JSON.stringify(state.NoFilterComData) == '[]' || JSON.stringify(state.NoFilterComData) == '{}') {
                IsGetDataSuccess = await dispatch('DoSetNoFilterComData');
            }
            if (JSON.stringify(state.FilterComData) == '[]' || JSON.stringify(state.FilterComData) == '{}') {
                IsGetDataSuccess = await dispatch('DoSetFilterComData');
            }
            if (JSON.stringify(state.NoFilterAccData) == '[]' || JSON.stringify(state.NoFilterAccData) == '{}') {
                IsGetDataSuccess = await dispatch('DoSetNoFilterAccData');
            }
            if ((JSON.stringify(state.FilterAccData) == '[]' || JSON.stringify(state.FilterAccData) == '{}') && state.CustObj.IsBaseAccLogin == true) {
                IsGetDataSuccess = await dispatch('DoSetFilterAccData');
            }
            return IsGetDataSuccess;
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