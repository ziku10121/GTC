import store from '../store'

export const mixinWebSocket = {
    data() {
        return {
            ws: null,
            wsURL: wsUrl
        }
    },
    methods: {
        initWebsocket() {
            this.ws = new WebSocket(this.wsURL);
            this.ws.onopen = this.websocketonopen;
            this.ws.error = this.websocketonerror;
            this.ws.onmessage = this.websocketonmessage;
            this.ws.onclose = this.websocketclose;
        },
        websocketonopen() {
            //this.CheckWebSocketConnect();
            localStorage.setItem('websocketopen', true);
            do {
                // console.log('送出登入訊息');
                this.websocketsend();
            }
            while (this.ws.readyState !== 1);
        },
        websocketonerror(e) {
            // console.log('連線失敗', e);
            this.Close();
        },
        websocketonmessage(e) {
            let _data = e.data;
            store.commit("SetWsMSG", JSON.parse(_data));
        },
        websocketsend() {
            var LoginData = JSON.stringify({
                account: store.state.CustObj.Ac,
                company: store.state.CustObj.Fm,
                srctyp: store.state.CustObj.sr,
                SessionKey: store.state.CustObj.sessionkey
            });
            this.ws.send(LoginData);
        },
        websocketclose() {
            // console.log('ws 關閉連線');
            this.ws = null;
        },
        async Close() {
            this.ws = null;
            await this.Sleep(2000);
            this.initWebsocket();
        },
        async Sleep(ms = 0) {
            return new Promise(r => setTimeout(r, ms));
        },
        IsWebSocketConnected() {
            return this.ws.readyState == 1;
        },
        CheckWebSocketConnect() {
            //連線DeBug
            window.setInterval((() => {
                console.log('WS連線狀態: ', this.ws.readyState == 1);
            }), 5000);
        }
    }
}