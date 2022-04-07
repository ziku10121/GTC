import CryptoJS from "crypto-js";

//查詢本機憑證狀態，提供後續建議
export function CheckCA(userId, callback) {
    var filter = "//S_CN=" + userId + "//"; //憑證篩選
    //測試環境
    filter="//S_C=TW,O=TaiCA Secure CA - Evaluation Only,S_O=Certificate Service Provider - Evaluation Only,S_OU=RA-ECTestRA,S_OU=ECPL,S_CN="+userId+"//"
    //正式環境
    // filter="//S_C=TW,O=TaiCA Secure CA,S_O=Certification Service Provider,S_OU=RA-FubonECRA,S_OU=ECPL,S_CN="+userId+"//"
    WebCAQueryCertState(userId, filter, function(code, msg, token, data){
      let codeback;
      if (code === 0 && data) {
        codeback =JSON.parse(data);
        if(codeback.suggesAction ==="None")
        {
            callback(true, '憑證連線成功!');
            return;
        }
        else if(codeback.suggesAction ==="ApplyCert")
        {
            callback(false, '憑證未申請，請您進行憑證申請工作後再進行連線。');
            return;
        }
        else if(codeback.suggesAction ==="RenewCert")
        {
            callback(false, '憑證已過期，請您進行憑證展延工作後再進行連線。');
            return;
        }
        else
        {
            callback(false, '簽章元件不存在 !');
            return;
        }
      }else{
        callback(false, '參數有誤(5005)');
        return;
      }
    });
}

//挑選憑證
export function SelectSignerEx(userId, certPIN, callback) {
    //compareDate為空字串才會使用dwFlags(挑選憑證選項)
    let certFilter="//S_C=TW//";
    let isSigner = false;
    if(userId){
        certFilter="//S_CN="+userId+"//";     //憑證篩選
        //測試環境
        // certFilter="//S_C=TW,O=TaiCA Secure CA - Evaluation Only,S_O=Certificate Service Provider - Evaluation Only,S_OU=RA-ECTestRA,S_OU=ECPL,S_CN="+userId+"//"
        //正式環境
        // certFilter="//S_C=TW,O=TaiCA Secure CA,S_O=Certification Service Provider,S_OU=RA-FubonECRA,S_OU=ECPL,S_CN="+userId+"//"
    }
    twcaLib.SelectSignerEx(certFilter, "", "", certPIN, "", 0x04 | 0x08, 0, null, function(code, msg, token, data) {
        console.log("txtSelectSignerEX", code + "," + msg, '挑選', typeof(data));
        if (code === 0 && data) {
            var certData = JSON.parse(data);
            console.log("CN = " + certData.cn + ", SN = " + certData.sn + ", NTA = " + certData.nta);
            isSigner = true;
            callback(isSigner, msg, certData);
            return;
        } else {
            isSigner = false;
            callback(isSigner,msg+'('+code+')'+'!');
            return;
        }
    });
}

//簽章
export function SignPKCS1(_data, callback) {
    let data = CryptoJS.enc.Utf16LE.parse(_data);
    twcaLib.SignPkcs1(data, 0x2000, function(code, msg, token, data) {
        if (code === 0 && data) {
            var certData = JSON.parse(data);
            callback("簽章成功！！", certData);
        } else {
            callback("簽章失敗！！");
        }
    });
}

//卸載憑證金鑰
export function ResetKey() {
    // eslint-disable-next-line no-unused-vars
    twcaLib.ResetKey(function(code, msg, token, data) {
        alert("錯誤代碼:" + code + "\n" + "錯誤訊息:" + msg);
    });
}