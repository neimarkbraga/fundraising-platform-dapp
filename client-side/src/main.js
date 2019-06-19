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
import AppJazzicon from 'vue-jazzicon';

const web3utils = require('web3-utils');

// configs
Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://localhost:86';

// prototypes
Vue.prototype.$appUtil = util;
Vue.prototype.$appFPContract = FPContract;
Vue.prototype.$loadPlatformInfo = () => {
    /*store.dispatch('user/data', {
        address: address
    });*/
    let status = store.state.platform['platform/status'];
    if(status.cancelToken) status.cancelToken.cancel();
    setTimeout(async() => {
        status.cancelToken = axios.CancelToken.source();
        status.isLoading = true;
        status.errorMessage = '';
        store.dispatch('platform/status', status);
        try {
            let response = await axios.get('/platform/info');
            store.dispatch('platform/info', response.data);
        }
        catch (error) {
            if(!axios.isCancel(error)) status.errorMessage = util.getErrorMessage(error);
        }
        status.isLoading = false;
        store.dispatch('platform/status', status);
    });
};
Vue.prototype.$loadPlatformInfo();




// components
Vue.component('AppImageBox', AppImageBox);
Vue.component('AppAffix', AppAffix);
Vue.component('AppJazzicon', AppJazzicon);


// filters
Vue.filter('fromWei', function (value, unit) {
    try {
        return web3utils.fromWei(value, unit || 'ether');
    } catch (error) {
        return 'Convert Error';
    }
});
Vue.filter('moment', function (value, format) {
    format = format || 'MMM DD, YYYY hh:mm a';
    let momentDate = moment(value);
    return momentDate.format(format);
});


// create vue instance
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

    FPContract.UpdateCampaignStory().watch((error, log) => {
        if(!error) {
            let args = log.args;
            EventBus.$emit('UpdateCampaignStory', {
                campaignId: args.campaignId.toNumber(),
                newStory: web3utils.hexToString(args.newStory.toString())
            });
        }
    });
}