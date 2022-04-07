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
            // console.log('WC連線成功');
            do {
                this.websocketsend();
            }
            while (this.ws.readyState !== 1);
        },
        websocketonerror(e) {
            this.ws = null;
            // console.log('WC連線失敗', e);
        },
        websocketonmessage(e) {
            let _data = e.data;
            store.commit("SetWsMSG", JSON.parse(_data));
            // console.log('Message',_data);
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
            this.ws = null;
            // console.log('ws 關閉連線');
        },
        async Close() {
            this.ws = null;
            await this.Sleep(2000);
            this.initWebsocket();
        },
        async Sleep(ms = 0) {
            return new Promise(r => setTimeout(r, ms));
        }
    }
}