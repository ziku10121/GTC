<template>
  <router-view v-slot="{Component}">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive"></component>
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive"></component>
  </router-view>
</template>
<script>
export default {
  data(){
    return{
      beforeUnload_time:'',
      gap_time:'',
      bo:1
    }
  },
  created(){
  },
  mounted(){
    this.test()
    window.addEventListener('beforeunload', e=> this.beforeunloadHandler(e));
    window.addEventListener('unload',e=>this.unloadHandler(e));
  },
  beforeUnmount(){
    window.removeEventListener('beforeunload',e=> this.beforeunloadHandler(e))
    window.removeEventListener('unload',e=>this.unloadHandler(e))
  },
  methods:{
    test(){
      var int1=0;
      var int2=0;
      console.log(int1.toFixed(int2));
    },
    beforeunloadHandler () {
      this.beforeUnload_time = new Date().getTime();
      this.logwrite('beforeunloadHandler');
    },
    unloadHandler(){
      this.gap_time = new Date().getTime()-this.beforeUnload_time;
      this.logwrite('unloadHandler');
      if(this.gap_time<=5){
        //關閉視窗
        localStorage.clear();
      }
      else{
        var num = localStorage.getItem('test');
        if(num!=null){
          localStorage.setItem('test',num +1);
        }
        this.$router.push({name:'test'});
      }
    },
    // eslint-disable-next-line no-unused-vars
    logwrite(str){
      //console.log(str)
    }
  },
  
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
</style>
