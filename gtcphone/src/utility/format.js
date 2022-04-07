export default {
    //時間字串轉換
    fulltimeformat: function(dateString) {
        if (
            dateString != undefined &&
            dateString != null &&
            this.TrimEmpt(dateString) != ""
        ) {
            var date = this.ParseJsonDate(dateString);
            var YY = date.getFullYear();
            var MM = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
            var dd = (date.getDate() < 10 ? "0" : "") + date.getDate();
            var hh = (date.getHours() < 10 ? "0" : "") + date.getHours();
            var mm = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
            var ss = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
            var sss =
                date.getMilliseconds() != 0 ?
                "." + this.padLeftZero(date.getMilliseconds().toString(), 3) :
                "";
            var day = YY + "/" + MM + "/" + dd;
            var time = "  " + hh + ":" + mm + ":" + ss + sss;
            var dateStringResult = day + time;
            return dateStringResult;
        }
        return "";
    },
    dayformat: function(dateString) {
        if (
            dateString != undefined &&
            dateString != null &&
            this.TrimEmpt(dateString) != ""
        ) {
            var date = this.ParseJsonDate(dateString);
            var YY = date.getFullYear();
            var MM = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
            var dd = (date.getDate() < 10 ? "0" : "") + date.getDate();
            var day = YY + "-" + MM + "-" + dd;
            var dateStringResult = day;
            return dateStringResult;
        }
        return "";
    },
    ParseJsonDate: function(dateString) {
        var date = new Date(parseInt(dateString.toString().substr(6)));
        return date;
    },
    TrimEmpt: function(_str) {
        if (typeof _str == "number") return _str;
        if (typeof _str == "undefined") return "";
        return _str.toString().replace(/^\s+|\s+$/g, "");
    },
    padLeftZero: function(str, lenght) {
        if (str.length >= lenght) return str;
        else return this.padLeftZero("0" + str, lenght);
    },
    ToJsonDate: function(day, time) {
        var offset = new Date().getTimezoneOffset() * 60 * 1000;
        var date = null;
        if (typeof(time) != "undefined") {
            date = new Date(day + ' ' + time + ':00');
        } else {
            date = new Date(day + ' 00:00:00');
        }
        return '/Date(' + date.getTime() + offset + ')/';
    },
    
}