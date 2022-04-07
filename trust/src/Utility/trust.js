const CryptoJS = require('crypto-js');

//加密
export function aesEncrypt(_source) {
    var cryptokey = "Copyright © 2021 Systex. All rights reserved" + _source.actno;
    const key = CryptoJS.SHA256(cryptokey);
    const iv = CryptoJS.MD5(cryptokey);
    //json to string to utf8
    let src = CryptoJS.enc.Utf8.parse(JSON.stringify(_source));
    //Encrypt proccessing
    let encrypted = CryptoJS.AES.encrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    //encrpted to Base64 format
    var encrptedBase64Str = encrypted.toString();
    return encrptedBase64Str;
}