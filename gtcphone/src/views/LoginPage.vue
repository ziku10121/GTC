<template>
    <div class="container vh-100">
        <div class="row vh-100 text-center align-items-center">
            <div >
                <div >
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
import {mixinWebSocket} from '../utility/ws';
import {Trust,Login} from '../api/Api_manager.js'
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
            var IsLoginSuccess = await this.geturlparam();
            if(IsLoginSuccess){
                this.initWebsocket();
            }
            else{
                this.$router.push({name:'loginfail'});
            }
        },
        //取得URL parameter
        async geturlparam(){
            const queryString = window.location.search;
            const geturlParams = new URLSearchParams(queryString);
            if(queryString==''){
                this.$router.push({name:'loginfail'});
                return false;
            }
            else{
                var result;
                this.urlparam = {
                    "actno": geturlParams.get('Ac'),
                    "company": geturlParams.get('Fm'),
                    "timestamp": geturlParams.get('Tm'),
                    "srctype": geturlParams.get('Sr'),
                    "encrypt": geturlParams.get('En')
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
        //trustAPI
        async PostEncryptApi(){
            try{
                sessionStorage.clear();
                var data = JSON.stringify(this.urlparam);
                var rawdata = await Trust(data);
                if(rawdata.statusText=='OK'){
                     //登入成功
                    if(rawdata.data.status==1){
                        this.$store.commit('SetCustObj',rawdata.data);
                        return true;
                    }
                    //登入失敗
                    else{
                        return false;
                    }
                }
                else{
                    this.$router.push({name:'loginfail'});
                    return false;
                }
            }
            catch(err){
                console.log(err);
                return false;
            }
        },
        //Api Login API 不用trust
        async LoginApi(){
            try{
                var data = JSON.stringify(this.urlparam);
                var rawdata = await Login(data);
                if(rawdata.status=='OK'){
                    if(rawdata.data.status==1){
                        this.$store.dispatch('DoSetTrustobj',rawdata.data);
                        return true;
                    }
                    //登入失敗
                    else{
                        return false;
                    }
                }
                else{
                    this.router.push({name:'loginfail'});
                    return false;
                }
            }
            catch(err){
                console.log(err);
            }
        },
    },
}
</script>