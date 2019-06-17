import Vue from 'vue';
import axios from 'axios';
import moment from 'moment';
import App from './App.vue';
import router from './router';
import store from './store';
import util from './library/util';
import FPContract from './library/FPContract';
import EventBus from './library/EventBus';

import AppImageBox from './components/Plugins/image-box';
import AppAffix from './components/Plugins/affix';

const ethunit = require('ethjs-unit');


Vue.config.productionTip = false;
Vue.prototype.$appUtil = util;
Vue.prototype.$appFPContract = FPContract;

Vue.component('AppImageBox', AppImageBox);
Vue.component('AppAffix', AppAffix);

Vue.filter('fromWei', function (value, unit) {
    try {
        return ethunit.fromWei(value, unit || 'ether');
    } catch (error) {
        return 'Convert Error';
    }
});
Vue.filter('moment', function (value, format) {
    format = format || 'MMM DD, YYYY hh:mm a';
    let momentDate = moment(value);
    return momentDate.format(format);
});

axios.defaults.baseURL = 'http://localhost:86';


new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');




// ensure user data
let currentUser = null;
let getCurrentUserAddress = () => {
    let web3 = window.web3 || web3 || null;
    if(web3 && web3.eth && web3.eth.accounts && web3.eth.accounts.length) {
        return web3.eth.accounts[0];
    }
    return null;
};
let updateCurrentUser = () => {
    let address = getCurrentUserAddress();
    if(address && currentUser !== address) {
        store.dispatch('user/data', {
            address: address
        });
        currentUser = address;
    }
    else if(!address) {
        store.dispatch('user/data', null);
        currentUser = null;
    }
};

updateCurrentUser();
setInterval(updateCurrentUser, 500);

// listen to contract events
if(FPContract) {
    FPContract.NewCampaignDonate().watch((error, log) => {
        if(!error) {
            let args = log.args;
            EventBus.$emit('NewCampaignDonate', {
                campaignId: args.campaignId.toNumber(),
                value: args.value.toString(),
                totalRaised: args.totalRaised.toString()
            });
        }
    });

    FPContract.WithdrawCampaignBalance().watch((error, log) => {
        if(!error) {
            let args = log.args;
            EventBus.$emit('WithdrawCampaignBalance', {
                campaignId: args.campaignId.toNumber(),
                value: args.value.toString()
            });
        }
    });
}
