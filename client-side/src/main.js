import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';


Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');




// ensure user data
let getCurrentUserAddress = () => {
    let web3 = window.web3 || web3 || null;
    if(web3 && web3.eth && web3.eth.accounts && web3.eth.accounts.length) {
        return web3.eth.accounts[0];
    }
    return null;
};
let updateCurrentUser = () => {
    store.dispatch('user/data', {
        address: getCurrentUserAddress()
    });
};

updateCurrentUser();
setInterval(updateCurrentUser, 500);