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
import {mixinWebSocket} from '../utility/websocket';
export default {
    mixins:[mixinWebSocket],
    data(){
        return{
            preRouter:'',
        }
    },  
    methods:{
        async DataReLoad(){
            await this.$store.commit('RestoreCustObj');
            await this.$store.dispatch('GetInitialData');
            await this.initWebsocket();
            this.$router.push({name:this.preRouter});
        }
    },
    mounted(){
        this.DataReLoad();
    },
    beforeRouteEnter(to,from,next){
        next(vm=>{
            vm.preRouter = from.name;
        })
    },
    beforeRouteLeave(to,from){
        if(to.name=='TrustError'){
            return false
        }
    }
}
</script>