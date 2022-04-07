import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue';
import DataLoadingPage from '../views/DataLoadingPage.vue';
import TrustError from '../views/TrustError.vue';
import Test from '../views/Test.vue';
import CondLarge from '../views/CondLarge.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: route => ({ query: route.query })
  },
  {
    path: "/Test",
    name: "Test",
    component: Test,
    meta: {test:true}
  },
  {
    path: "/CondLarge",
    name: "CondLarge",
    component:CondLarge,
  },
  {
    path: "/TrustError",
    name: "TrustError",
    component: TrustError,
  },
  {
    path: '/DataLoadingPage',
    name: 'DataLoadingPage',
    component: DataLoadingPage
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
