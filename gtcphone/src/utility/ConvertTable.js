export default {
    // 條件單各狀態 數值對應中文解釋表
    // 條件單對應表
    condstatus: {
        0: '未定義',
        1: '未啟動',
        2: '啟動',
        3: '啟動中',
        4: '已送出',
        5: '系統暫停',
        6: '系統暫停中',
        7: '人工暫停',
        8: '人工暫停中',
        9: '結案',
        10: '結案中',
        11: '預約結案中',
        12: '已預約結案'
    },
    //條件命令別
    condcmd: {
        0: '未定義',
        1: '新增條件',
        2: '刪除條件',
        3: '暫停條件',
        4: '重啟條件',
        5: '條件回報',
        6: '委託回報',
        7: '成交回報'
    },
    // 條件種類
    condtyp: {
        0: '一般長效單',
        1: 'OCO',
    },
    // 條件種類
    comtype: {
        0: '期貨',
        1: '選擇權',
    },
    //買/賣
    ps: {
        0: '買',
        1: '賣',
        9: '未定義',
    },
    //買賣權
    cp: {
        0: '期貨',
        1: '買權',
        2: '賣權',
        9: '未定義',
    },
    //是否當沖
    dtrd: {
        0: '否',
        1: '是',
        2: '自動',
        9: '未定義',
    },
    // 委託方式
    ordtyp: {
        0: '限價', //LMT
        1: '市價', //MKT
        2: '停損限價', //SWL
        3: '停損市價', //STP
        4: 'MTL',
        5: 'MTP',
        6: 'MWL',
        7: 'STL',
        8: 'MMTL',
        9: '未定義'
    },
    // 錯誤代碼
    code: {
        0: 'OCO',
        1: 'OCO',
        2: 'OCO',
        3: 'OCO',
        4: 'OCO',
        5: 'OCO',
        6: 'OCO',
        7: 'OCO',
        8: 'OCO',
    },
    //觸發價邏輯
    PriceLogic: {
        0: '等於',
        1: '大於',
        2: '大於等於',
        3: '小於',
        4: '小於等於',
    },
    //委託單價
    price(p1,p2,p3){
        let outPrice;
        if(p2!=0){
            outPrice = (p1<0?'-':'') + Math.abs(p1) + ' ' + Math.abs(p2) + '/' +p3;
            return outPrice;
        }else{
            outPrice = (p1<0?'-':'') + Math.abs(p1);
            return outPrice;
        }
    },
    //觸發價
    tprice(tp1,tp2,tp3){
        let outTPrice;
        if(tp2!=0){
            outTPrice = (tp1<0?'-':'') + Math.abs(tp1) + ' ' + Math.abs(tp2) + '/' +tp3;
            return outTPrice;
        }else{
            outTPrice = (tp1<0?'-':'') + Math.abs(tp1);
            return outTPrice;
        }
    },
    //觸發價
    tpprice(tpl,tp1,tp2,tp3){
        let outtpl;
        let outTPrice;
        //觸發價邏輯
        switch(parseInt(tpl)){
            case 0:
                outtpl = '\u003D';  //等於
                break;
            case 1:
                outtpl = '\u003E';  //大於
                break;
            case 2:
                outtpl = '\u2265'; //大於等於
                break;
            case 3:
                outtpl = '\u003C';  //小於
                break;
            case 4:
                outtpl = '\u2264'; //小於等於
                break;
        }
        if(tp2!=0){
            outTPrice = '('+outtpl +')'+ (tp1<0?'-':'') + Math.abs(tp1) + ' ' + Math.abs(tp2) + '/' +tp3;
            return outTPrice;
        }else{
            outTPrice = '('+outtpl +')'+ (tp1<0?'-':'') + Math.abs(tp1);
            return outTPrice;
        }
    },
    //停損價
    stpprice(p4,p5,p6){
        let outStpPrice;
        if(p5!=0){
            outStpPrice = (p4<0?'-':'') + Math.abs(p4) + ' ' + Math.abs(p5) + '/' + p6;
            return outStpPrice;
        }else{
            outStpPrice = (p4<0?'-':'') + Math.abs(p4);
            return outStpPrice;
        }
    },
}