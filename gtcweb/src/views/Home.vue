<template>
  <div class="container vh-100">
    <div class="row vh-100 align-items-center">
      <div>
        <div>
          <img alt="Vue logo" src="../assets/Fubon_Group.png" width="250" height="250"/>
        </div>
        <div class="pt-3">
          <div class="spinner-border me-2" style="width:2.5rem; height:2.5rem;" role="status" aria-hidden="true"></div>
          <span style="font-size:26px">資料載入中...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {Trust,Login} from '../api/Api_manager.js';
import {mixinWebSocket} from '../utility/websocket';
export default {
  mixins:[mixinWebSocket],
  
  data(){
    return{
      urlparam:{},
    }
  },
  created(){
    this.LoginOrTrustProcess();
  },
  methods:{
    async LoginOrTrustProcess(){
      sessionStorage.clear();
      var IsLoginSuccess = await this.GetUrlParam();
      if(IsLoginSuccess){
        this.initWebsocket();
      }
      else{
        this.$router.push({name:'TrustError'});
      }
    },
    
    async GetUrlParam(){
        const queryString = window.location.search;
        if(queryString==''){
          this.$router.push({name:'TrustError'});
          return false;
        }
        else{
          var result;
          this.urlparam = {
            "actno": this.getParameterByName('Ac'),
            "company": this.getParameterByName('Fm'),
            "timestamp": this.getParameterByName('Tm'),
            "srctype": this.getParameterByName('Sr'),
            "encrypt": this.getParameterByName('En')
          };

          if(this.$store.state.IsTrust){
              result = await this.PostEncryptApi()
              return result;
          }
          else{
              result = await this.LoginApi()
              return result;
          }
        }   
    },

    getParameterByName(name,url){
      if (!url) url = window.location.href;
      name = name.replace(/[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2]);
    },

    //Trust API
    async PostEncryptApi(){
      try{
        sessionStorage.clear();
        var params = JSON.stringify(this.urlparam);
        var result = await Trust(params);
        //處理登入資訊
        if(result.statusText=='OK'){
          //登入成功
          if(result.data.status==1){
            this.$store.dispatch('DoSetTrustobj',result.data);
            return true;
          }
          //登入失敗
          else{
            return false;
          }
        }
        else{
          this.$router.push({name:'TrustError'});
          return false;
        }
      }
      catch(err){
        console.log(err);
        return false;
      }
    },
    //Login API (不用trust)
    async LoginApi(){
      try{
        var params = JSON.stringify(this.urlparam);
        var rawdata = await Login(params);
        if(rawdata.status=='OK'){
          if(rawdata.data.status==1){
            this.$store.dispatch('DoSetTrustobj',rawdata.data);
            return true;
          }
          //登入失敗
          else{
            return false;
          }
        }else{
          this.$router.push({name:'loginfail'});
          return false;
        }
      }
      catch(err){
          console.log(err);
      }
    },
  },
};
</script>
