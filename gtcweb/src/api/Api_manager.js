//檔案路徑 src/api/檔案名.js
//先行安裝 AXIOS，終端機輸入 npm install axios
const axios = require('axios').default;

const GTDAPI = axios.create({
    //設定最基本網址，比如 http://10.10.52.36:8080/
    //8084不驗CA ，8082驗CA
    baseURL: GTDAPIUrl,
    timeout: 15*1000,
    headers: {
        'Content-Type': 'application/json'
    },
});

//設定你要獲取的API，

//取的不篩選商品資訊
export const GetNoFilterComList = (Json) => GTDAPI.post('api/ComData/ComData/1', Json);

//取的篩選商品資訊
export const GetFilterComList = (Json) => GTDAPI.post('api/ComData/ComData/2', Json);

//下單
export const GTDTrade = (Json) => GTDAPI.post('api/GTDTrade/gtdtrade', Json);

//條件單查詢
export const GetCondOrder = (Json) => GTDAPI.post('api/GTDConOrder/gtdorder', Json);

//條件單歷程查詢
export const GetCondRec = (Json) => GTDAPI.post('api/GTDConRec/gtdconrec', Json);

//Login by Trust
export const Trust = (Json) => GTDAPI.post('api/Trust/trust', Json);

//Login
export const Login = (Json) => GTDAPI.post('api/Login/login', Json);

//篩選陣列cust...判斷是否有值->false沒有辦法下長效單true一筆record是否包含子帳號
//取的不篩選客戶資訊
export const GetNoFilterCusList = (Json) => GTDAPI.post('api/Account/GetAccData/1', Json);

//取的篩選客戶資訊
export const GetFilterCusList = (Json) => GTDAPI.post('api/Account/GetAccData/2', Json);
 