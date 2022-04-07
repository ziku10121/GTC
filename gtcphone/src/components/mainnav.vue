<template>
    <nav class="navbar navbar-expand-lg border-bottom SGTP-NavStyle">
        <div class="container-fluid">
        <!-- 標題 -->
        <a class="navbar-brand" id="NavTitle">
            <span @click="OnclickMain()">期貨條件單</span>
            <button
            class="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <i class="bi bi-caret-down-fill"></i>
            </button>
        </a>
        <!-- 帳號 -->
        <div class="navbar-brand">
            <i class="bi bi-person-circle"></i>
            <span class="navbar-text fs-6">  &nbsp;{{Company}}&nbsp;-&nbsp;{{ActName}}</span>
        </div>

        <!-- 下拉選單 -->
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav">
            <li
                class="nav-item d-flex justify-content-between"
                @click="OnClickOrderBTN()"
            >
                <a class="nav-link">
                下單專區
                </a>
                <i class="bi bi-chevron-right"></i>
            </li>
            <li><hr class="dropdown-divider py-0" /></li>
            <li
                class="nav-item d-flex justify-content-between"
                @click="OnClickQueryBTN()"
            >
                <a class="nav-link">
                回報 / 查詢專區
                </a>
                <i class="bi bi-chevron-right"></i>
            </li>
            <li><hr class="dropdown-divider py-0" /></li>
            </ul>
        </div>
        </div>
    </nav>
</template>
<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed } from '@vue/reactivity';

export default {
    setup(){
        //variable
        const store = useStore();
        const router = useRouter();
        
        //computed
        const ActName = computed(()=>{
            return store.state.CustObj.ActName;
        })
        const Company = computed(()=>{
            return store.state.CustObj.CompanyName;
        })
        //Button
        const OnClickOrderBTN=()=>{
            router.push({name: "Order"});
        }
        const OnClickQueryBTN=()=>{
            router.push({name: "Report"});
        }
        const OnclickMain=()=>{
            router.push({name: "Home"});
        }

        return{
            ActName,Company,OnClickOrderBTN,OnClickQueryBTN,OnclickMain
        }
    },
};
</script>
<style scoped>
#Nav-Order-Icon {
    height: 1rem;
}
</style>

