import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import util from './library/util';


import AppImageBox from './components/Plugins/image-box';


Vue.config.productionTip = false;
Vue.prototype.$appUtil = util;
Vue.component('AppImageBox', AppImageBox);

axios.defaults.baseURL = 'http://localhost:86';

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
    let address = getCurrentUserAddress();
    if(address) store.dispatch('user/data', {
        address: address
    });
    else store.dispatch('user/data', null);
};

updateCurrentUser();
setInterval(updateCurrentUser, 500);