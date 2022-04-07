//檔案路徑 src/api/檔案名.js
//先行安裝 AXIOS，終端機輸入 npm install axios
const axios = require('axios').default;

const GTDAPI = axios.create({
    //CA開啟
    // baseURL: 'http://10.10.56.244:8082/',
    //CA關閉
    baseURL: GTDAPIUrl,
    headers: {
        'Content-Type': 'application/json'
    },
});

//取的不篩選商品資訊
export const GetNoFilterConList = (Json) => GTDAPI.post('api/ComData/ComData/1', Json);

//取的篩選商品資訊
export const GetFilterConList = (Json) => GTDAPI.post('api/ComData/ComData/2', Json);

//取的不篩選客戶資訊
export const GetNoFilterCusList = (Json) => GTDAPI.post('api/Account/GetAccData/1', Json);

//取的篩選客戶資訊
export const GetFilterCusList = (Json) => GTDAPI.post('api/Account/GetAccData/2', Json);

//Login by Trust
export const Trust = (Json) => GTDAPI.post('api/Trust/trust', Json);

//Login
export const Login = (Json) => GTDAPI.post('api/Login/login', Json);

//條件單查詢
export const GetCondOrder = (Json) => GTDAPI.post('api/GTDConOrder/gtdorder', Json);

//條件單歷程查詢
export const GetCondRec = (Json) => GTDAPI.post('api/GTDConRec/gtdconrec', Json);

//下單
export const GTDTrade = (Json) => GTDAPI.post('api/GTDTrade/gtdtrade', Json);