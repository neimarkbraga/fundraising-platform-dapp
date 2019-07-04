import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
let createModule = (name, data) => {
    data = data || {};
    let store = { state: {}, getters: {}, mutations: {}, actions: {}};
    let create = (path, value) => {
        store.state[path] = value;
        store.getters[path] = (state) => {
            return state[path];
        };
        store.mutations[path] = (state, data) => {
            state[path] = data;
        };
        store.actions[path] = ({ commit }, data) => {
            commit(path, data);
        };
    };
    for(let property in data) { create(`${name}/${property}`, data[property]); }
    return store;
};

export default new Vuex.Store({
    modules: {
        user: createModule('user', {
            data: null
        }),
        config: createModule('config', {
            ipfsGateway: window.localStorage.getItem('ipfsGateway') || 'https://ipfs.infura.io/ipfs/',
            ethUnits: [
                'wei',
                'gwei',
                'finney',
                'ether'
            ]
        }),
        platform: createModule('platform', {
            info: null,
            status: {
                cancelToken: null,
                isLoading: false,
                errorMessage: ''
            }
        })
    }
});