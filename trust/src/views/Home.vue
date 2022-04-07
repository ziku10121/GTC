<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="btn-group mt-3 col-3"></div>
        <div class="btn-group mt-3 col-6" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" class="btn-check" name="loginType" id="type1" autocomplete="off" value="web" v-model="loginType">
          <label class="btn btn-outline-primary" for="type1">網頁版(大版)</label>
          <input type="radio" class="btn-check" name="loginType" id="type2" autocomplete="off" value="phone" v-model="loginType">
          <label class="btn btn-outline-primary" for="type2">手機版(小版)</label>
        </div>
        <div class="btn-group mt-3 col-3"></div>
        <div class="btn-group mt-3 col-3"></div>
        <div class="btn-group mt-3 col-6" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" class="btn-check" name="isCA" id="btnradio1" autocomplete="off" value="CAopen" v-model="isCA">
          <label class="btn btn-outline-primary" for="btnradio1">CA開</label>
          <input type="radio" class="btn-check" name="isCA" id="btnradio2" autocomplete="off" value="CAclose" v-model="isCA">
          <label class="btn btn-outline-primary" for="btnradio2">CA關</label>
        </div>
      </div>
        <div class="input-group my-3">
          <span class="input-group-text" id="basic-addon1">帳號</span>
          <input type="text" class="form-control" placeholder="Username" v-model="actno" aria-label="Username" aria-describedby="basic-addon1" >
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">公司</span>
          <input type="text" class="form-control" placeholder="Username" v-model="company" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">時間戳</span>
          <input type="text" class="form-control" placeholder="Username" v-model="timestamp" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div v-if="loginType=='web'" class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">來源別</span>
          <select class="form-select" id="basic-addon1" v-model="srctype">
            <option value="20">20(精誠網頁)</option>
            <option value="21">21(精誠網頁2)</option>
            <option value="22">22(精誠網頁3)</option>
            <option value="23">23(精誠網頁4)</option>
          </select>
        </div>
        <div v-if="loginType=='phone'" class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">來源別</span>
          <select class="form-select" id="basic-addon1" v-model="srctype">
            <option value="10">10(精誠手機)</option>
            <option value="11">11(精誠手機2)</option>
            <option value="12">12(精誠手機3)</option>
          </select>
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">AES</span>
          <input type="text" class="form-control" readonly placeholder="Username" v-model="encrypt" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">結果</span>
          <input type="text" class="form-control" readonly placeholder="Username" v-model="result" aria-label="Username" 
            aria-describedby="basic-addon1" @focus="copyURL"
          >
        </div>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button class="btn btn-primary" @click="Click()" :disabled="!(loginType&&isCA)">Go</button>
        </div>
    </div>
  </div>
</template>
<script>``
import {aesEncrypt} from '../Utility/trust'
export default {
  name: 'Home',
  data(){
    return{
      actno:'0000000',
      company:'F000000',
      timestamp:new Date().getTime().toString(),
      isCA:'',
      srctype:'',
      loginType:'',
      type:'',
    }
  },
  watch:{
    loginType(){
      if(this.loginType=='web')this.srctype='20';
      if(this.loginType=='phone')this.srctype='10';
    }
  },
  computed:{
    result:function(){
      var baseurl ='';
      switch (this.loginType) {
        case 'web':
          // baseurl = 'http://10.10.56.197:8085';
          (this.isCA=="CAopen")?baseurl = WebUrl : baseurl=noWebUrl;
          break;
        case 'phone':
          // baseurl = 'http://10.10.56.197:8084';
          (this.isCA=="CAopen")?baseurl= PhoneUrl : baseurl=noPhoneUrl;
          break;
      }
      var url = baseurl+'/?Ac='+this.actno+'&Fm='+this.company+'&Sr='+this.srctype+'&Tm='+this.timestamp+'&En='+ encodeURIComponent(aesEncrypt(this.custInfo));
      return url;
    },
    custInfo:function(){
      return {
        'actno':this.actno,
        'company':this.company,
        'timestamp':this.timestamp,
        'srctype':this.srctype
      };
    },
    encrypt:function(){
      return aesEncrypt(this.custInfo);
    }
  },
  methods:{
    Click(){
      if(this.loginType!=''){
        this.$router.push({name:'About',query:{url:this.result}});
      }
    },
    focus2(){
      this.$refs.date.removeAttribute('placeholder');
    },
    blur(){
      if(this.timestamp==''){
        this.$refs.date.setAttribute('placeholder','輸入日期');
      }
    },
    copyURL(e){
      if(this.result){
        e.target.select();
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm=>{
      if(localStorage.getItem('test')){
        vm.$router.push({name:'test'});
      }
    });
  },
}
</script>
<style scoped>
input[type="date"]::before{
  color: #ffffff;
  content: attr(placeholder);
}
</style>
