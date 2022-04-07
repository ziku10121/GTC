<template>
  <div id="MainPage">
    <div id="center" class="container-fluid">
      <div id="context" class="row">
        <div class="col-12 mb-3">
          <div
            class="card border-secondary"
            id="MainPageItem"
            @click="OnClickOrderBTN()"
          >
            <div class="card-body d-flex">
              <div class="align-self-center flex-fill">
                <img id="Order-Icon" class="" :src="OrderIcon" />
                <p class="card-text text-secondary fs-3 mt-2">下單專區</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div
            class="card border-secondary"
            id="MainPageItem"
            @click="OnClickQueryBTN()"
          >
            <div class="card-body d-flex">
              <div class="align-self-center flex-fill">
                <i id="Search-Icon" class="bi bi-search"></i>
                <p class="card-text text-secondary fs-3 mt-2">查詢專區</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ordericon from "../assets/choices.png";
import { useRouter } from 'vue-router'
import { onBeforeMount, } from '@vue/runtime-core';
import { useStore } from 'vuex'
export default {
  name: "Home",
  setup(){
    //variable
    const OrderIcon = ordericon;
    const router = useRouter();
    const store = useStore();
    //#region 按鈕 
    const OnClickOrderBTN = ()=>{
      router.push({ name: "Order" });
    }
    const OnClickQueryBTN=()=> {
      router.push({ name: "Report" });
    }
    //#endregion
    //call methods
    
    //lifecycle
    onBeforeMount(()=>{
    })
    
    return {
      OrderIcon,
      OnClickOrderBTN,OnClickQueryBTN
    }
  },
  beforeRouteEnter(to, from, next){
    next(vm=>{
      if(vm.$store.state.CustObj.sessionkey==''){
        vm.$router.push({name:'DataLoadingPage'});
      }
    })
  }
};
</script>
<style scoped>
/* CSS變數宣告區 */
#MainPage {
  --img-height: 5rem;
}
/* CSS變數宣告區 */

#center {
  width: 100vw;
  margin: auto;
  line-height: 100vh;
  text-align: center;
}
#context {
  display: inline-block;
  height: auto;
  line-height: 1;
  width: 100vw;
  vertical-align: middle;
}
#MainPageItem {
  height: 15rem;
}
#Order-Icon {
  height: 5rem;
}
#Search-Icon {
  font-size: 4rem;
}
</style>
