import { createStore } from 'vuex'

export default createStore({
    state: {
        test: 0
    },
    mutations: {
        Addtest(state) {
            state.test++;
        }
    },
    actions: {},
    modules: {}
})