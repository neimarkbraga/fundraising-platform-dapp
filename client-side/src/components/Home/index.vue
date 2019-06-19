<template>
    <div class="bg-well occupy-view">
        <div class="container py-4">

            <nav class="nav nav-pills flex-column flex-sm-row">
                <a class="flex-sm-fill text-sm-center nav-link"
                   v-for="option in campaigns.finishedOptions"
                   @click.prevent="setCampaignsQueryFinished(option.value)"
                   :class="{active: campaigns.query.finished === option.value }"
                   :key="option.value"
                   href="#">{{ option.name }}</a>
            </nav>

            <div v-if="campaigns.status.errorMessage">
                <div class="p-5 text-center">
                    <img src="../../assets/img/error.png"
                         style="max-width: 7em"
                         alt="Error">
                    <h5>Error</h5>
                    <p>{{ campaigns.status.errorMessage }}</p>
                    <div>
                        <button type="button"
                                class="btn btn-sm btn-primary"
                                @click="loadCampaigns">Reload</button>
                    </div>
                </div>
            </div>

            <div v-else>

                <div class="row" v-if="campaigns.status.isLoading">
                    <div class="col-6 col-md-4 mt-4" v-for="n in 6" :key="n">
                        <app-campaign-card />
                    </div>
                </div>

                <div class="row" v-else>
                    <div class="col-6 col-md-4 mt-4"
                         v-for="campaign in campaigns.result"
                         :key="campaign.id">
                        <a :href="'#/campaign/' + campaign.id"
                           style="text-decoration: none"
                           class="d-block text-body">
                            <app-campaign-card :data="campaign" />
                        </a>
                    </div>

                    <div class="col-12 mt-4" v-if="!campaigns.result.length">
                        <div class="p-5 text-center">
                            <img src="../../assets/img/empty-box.png"
                                 style="max-width: 7em"
                                 alt="Error">
                            <h5>No Result</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { mapGetters } from 'vuex';
    import AppCampaignCard from '../Elements/campaign-card';


    export default {
        data() {
            return {
                campaigns: {
                    finishedOptions: [
                        {value: null, name: 'All'},
                        {value: false, name: 'On-going'},
                        {value: true, name: 'Done'}
                    ],
                    query: {
                        finished: null
                    },
                    status: {
                        isLoading: false,
                        errorMessage: ''
                    },
                    result: [],
                    cancelToken: axios.CancelToken.source()
                }
            };
        },
        computed: {
            ...mapGetters({
                user: 'user/data',
                ipfsGateway: 'config/ipfsGateway'
            })
        },
        methods: {
            setCampaignsQueryFinished(value) {
                this.campaigns.query.finished = value;
                this.loadCampaigns();
            },

            loadCampaigns() {
                let vm = this;
                vm.campaigns.cancelToken.cancel();

                setTimeout(async () => {
                    vm.campaigns.status.isLoading = true;
                    vm.campaigns.status.errorMessage = '';
                    vm.campaigns.cancelToken = axios.CancelToken.source();
                    try {
                        let response = await axios.get('/campaign', {
                            params: vm.campaigns.query,
                            cancelToken: vm.campaigns.cancelToken.token
                        });
                        vm.campaigns.result = response.data;
                    }
                    catch (error) {
                        if(!axios.isCancel(error)) vm.campaigns.status.errorMessage = vm.$appUtil.getErrorMessage(error);
                    }
                    vm.campaigns.status.isLoading = false;
                });
            }
        },
        created() {
            this.loadCampaigns();
        },
        components: {
            AppCampaignCard
        }
    }
</script>


<style lang="scss" scoped>
    .info-section {
        padding: 5em 0;
    }
</style>