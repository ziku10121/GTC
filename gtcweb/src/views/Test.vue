<template>
    <div>
       公司：<input type="text" v-model="source.company"  >
       帳號：<input type="text" v-model="source.actno"  >
       來源：
        <select v-model="source.srctype" style="height:30px;width:203px;margin-top:0.5rem">
          <option value="20" selected>20(精誠網頁)</option>
          <option value="21">21(精誠網頁2)</option>
          <option value="22">22(精誠網頁3)</option>
          <option value="23">23(精誠網頁4)</option>
        </select>
       <input type="button" @click="open" value="開啟" >
    </div>
    <hr>
    <div>
      <iframe id="myFrame" :src='URLsrc' :style="frameStyle" ref="iframe" ></iframe>
    </div>
</template>
<script>
import {aesEncrypt} from '../utility/encrypt';
export default {
    name:'測試網頁',
    components:{},
    data(){
        return{
            frameStyle:{
                width:'100%',
                height:'100vh'
            },
            URLsrc:'',

            source :{
              actno :'0000000',
              company :'F000000',
              timestamp :'',
              srctype :'20',
              encrypt:'',
            },
        }
    },
    mounted(){
      this.source.timestamp= new Date().getTime();
    },
    methods:{
      open()
      {
        let host = window.location.host;
        //encodeURIComponent(aesEncrypt(this.source))
        this.source.encrypt=aesEncrypt(this.source);
        this.URLsrc = 'http://'+ host + '/Home?Ac='+this.source.actno+'&Fm='+this.source.company+'&Tm='+this.source.timestamp+'&Sr='+this.source.srctype+'&En='+this.source.encrypt
        console.log('Test頁面的URL',this.URLsrc);
      }
    },
}
</script>

<style>

</style>