<template>
  <div id="liveAlertPlaceholder" class="toast-container"  style="z-index:5;position: absolute;top:0px;"></div>
  <router-view />
</template>
<script>
import {mixinWebSocket} from './utility/websocket';
import convertable  from './utility/convert'

export default {
    mixins:[mixinWebSocket],
    data(){
      return{
        request:{
          "accountID": {
            "SessionKey": this.$store.state.CustObj.sessionkey,
            "account": this.$store.state.CustObj.Ac,
            "company": this.$store.state.CustObj.Fm,
            "srctype": this.$store.state.CustObj.sr
          },
        }
      }
    },
    created(){
      
    },
    mounted(){
        window.addEventListener('beforeunload', e=> this.beforeunloadHandler(e));
        window.addEventListener('unload',e=>this.unloadHandler(e));
    },
    unmounted(){
        window.removeEventListener('beforeunload',e=> this.beforeunloadHandler(e));
        window.removeEventListener('unload',e=>this.unloadHandler(e));
    },
    computed:{
      WsLogin:function(){
        return this.$store.state.WsLogin;
      },
      WSmutiplyLogin:function(){
        return this.$store.state.WSmutiplyLogin;
      },
      WsCom:function(){
        return this.$store.state.WsCom;
      },
      WsCus:function(){
        return this.$store.state.WsCus;
      },
      ComputedCondReply:function(){
        return this.$store.state.WsCondReply;
      }
    },
    watch:{
      WsLogin:async function(new_value,old_value){
        console.log('登入 : ', new_value.loginStatus==1?'成功':'失敗');
        // 1:登入成功 其他:登入失敗
        if(new_value.loginStatus==1){
            var result =  await this.$store.dispatch('GetInitialData');
            if(result){
              this.$router.push({name:'CondLarge'});
            }
        }
        else{
            this.$router.push({name:'TrustError'});
        }
      },
      WSmutiplyLogin:function(value){
        if(value==5){
          this.$router.push({name:'TrustError'});
        }
      },
      WsCom:function(){
        console.log('App Call APi com');
        this.$store.dispatch('RefreshInitialComData');
      },
      WsCus:function(){
        console.log('App Call APi cus');
        this.$store.dispatch('RefreshInitialCusData');
      },
      ComputedCondReply:function(_data){
        if(JSON.stringify(_data)!='[]'){
          this.CreateAlert(this.CondReplyTostHtml(_data) , this.styleCTRL(_data.condstatus) );
        }
      }
    },
    methods:{
      //重刷頁面方法
      beforeunloadHandler () {
        console.log('beforeload')
        this.beforeUnload_time = new Date().getTime();
      },
      unloadHandler(){
        console.log('unloadHandler')
        this.gap_time = new Date().getTime()-this.beforeUnload_time;
        if(this.gap_time <= 5){
            //關閉視窗
            //console.log('close tab');
            sessionStorage.clear();
            this.websocketclose();
        }
        else{
            //F5整理
            //console.log('press F5');
        }
      },
      CreateAlert ( html ,status){
        var bootstrap = require('bootstrap');
        var alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        alertPlaceholder.append(wrapper);
        var New_toast = wrapper.querySelector('.toast');
        New_toast.style.cssText += this.styleCTRL(status);
        var toast = new bootstrap.Toast(New_toast);
        window.setTimeout(function(){
        toast.show();
        },300)
        New_toast.addEventListener('hidden.bs.toast',function(){
          wrapper.remove();
        })
        window.setTimeout(function(){
          toast.dispose();
          wrapper.remove();
        },3000)
      },
      styleCTRL(condstatus) {
        var style = '';
        switch(condstatus){
          case 0:
            style = 'background-color: rgba(0,0,0,0.9) !important; color: white;';
            break;
          case 1: 
          case 2: 
          case 3: 
            style = 'background-color: rgba(21,115,71,0.9) !important; color: white;';
            break;
          case 4: 
            style = 'background-color: rgba(21,115,71,0.9) !important; color: white;';
            break;
          case 5: 
          case 6: 
          case 7: 
          case 8: 
            style = 'background-color: rgba(247,187,7,0.9) !important; color: white;';
            break;
          case 9: 
          case 10:
          case 11:
          case 12:
            style = 'background-color: rgba(105,113,121,0.9) !important; color: white;';
            break;
          default:
              break;
        }
        return style;
      },
      CondReplyTostHtml( CondOrder ){
        var action = convertable.condcmd[CondOrder.condcmd]
        var status = convertable.condstatus[CondOrder.condstatus];
        var condno = CondOrder.condno;
        var Tostmsg = '';
        var msg = '';
        if(CondOrder.condcode==0 && CondOrder.code==0 ){
            Tostmsg = condno + '('+ status + ')';
          }
          else{
            msg = '<span style="color:red">異常</span> ' ;
            Tostmsg = condno + "("+ status + ")"+ '<br>'
            if(CondOrder.condcode!=0)
            {
              Tostmsg += CondOrder.condtxt+"("+ CondOrder.condcode + ")";
            }
            else
            {
              Tostmsg += CondOrder.txt+"("+ CondOrder.code + ")";
            }
          }
        var  html =
        '<div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="300000" style="z-index:99999;">'+
          '<div class="toast-header">'+
            '<strong class="me-auto">'+action + msg +'</strong>'+
            '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>'+
          '</div>'+
          '<div class="toast-body">'+Tostmsg+'</div>'+
        '</div>';
        return html;
      },
    }
}
</script>
<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
