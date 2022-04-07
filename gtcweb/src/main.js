import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//bootstrap套件
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


createApp(App).use(store).use(router).mount("#app");

// Node.js 版本:v14.17.6