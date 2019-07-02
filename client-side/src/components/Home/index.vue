<template>
    <div class="d-flex bg-well occupy-view">
        <div class="browser-body" id="ViewContent">

            <!-- filter content -->
            <div class="filter-container p-4 border-right shadow-sm">
                <div>
                    <app-affix relative-element-selector="#ViewContent"
                               fixed-navbar-selector="#AppNavbar"
                               :inherit-parent-width="true"
                               :top-offset="25"
                               :bottom-offset="25">
                        <form @submit.prevent="loadCampaigns">

                            <!-- category filter -->
                            <div class="form-group">
                                <label>Filter Category</label>
                                <app-select-category v-model="campaigns.query.category" null-name="All" />
                            </div>

                            <!-- status filter -->
                            <div class="form-group">
                                <label>Filter Status</label>
                                <select class="form-control" v-model="campaigns.query.finished">
                                    <option :value="option.value" v-for="option in campaigns.finishedOptions" :key="option.value">
                                        {{ option.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- sort by -->
                            <div class="form-group">
                                <label>Sort By</label>
                                <select class="form-control" v-model="campaigns.query.sort">
                                    <option value="latest">Latest</option>
                                    <option value="oldest">Oldest</option>
                                </select>
                            </div>

                            <!-- action buttons -->
                            <div class="row">
                                <div class="col-4 pr-0">
                                    <button type="button"
                                            @click.prevent="resetFilters"
                                            class="btn btn-outline-primary w-100">
                                        Reset
                                    </button>
                                </div>
                                <div class="col-8">
                                    <button type="submit" class="btn btn-primary w-100">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </form>
                    </app-affix>
                </div>
            </div>

            <!-- result content -->
            <div class="result-container">
                <div class="container pr-0">

                    <!-- has error -->
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

                    <!-- no error -->
                    <div v-else>

                        <!-- loading -->
                        <div class="row m-0" v-if="campaigns.status.isLoading">
                            <div class="col-6 col-lg-4 mt-4 pl-0" v-for="n in 6" :key="n">
                                <app-campaign-card />
                            </div>
                        </div>

                        <!-- ready -->
                        <div class="row m-0" v-else>

                            <!-- result item -->
                            <div class="col-6 col-lg-4 mt-4 pl-0"
                                 v-for="campaign in campaigns.result"
                                 :key="campaign.id">
                                <a :href="'#/campaign/' + campaign.id"
                                   style="text-decoration: none"
                                   class="d-block text-body">
                                    <app-campaign-card :data="campaign" />
                                </a>
                            </div>

                            <!-- no result -->
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
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { mapGetters } from 'vuex';
    import AppCampaignCard from '../Elements/campaign-card';
    import AppSelectCategory from '../Elements/select-category';


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
                        category: null,
                        finished: null,
                        sort: 'latest'
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
            },

            resetFilters() {
                let query = this.campaigns.query;
                query.category = null;
                query.finished = null;
                query.sort = 'latest';
                this.loadCampaigns();
            }
        },
        created() {
            this.loadCampaigns();
        },
        components: {
            AppCampaignCard,
            AppSelectCategory
        }
    }
</script>


<style lang="scss" scoped>
    .browser-body {
        width: 100%;
        display: flex;
        flex: 1 0 auto;

        .filter-container {
            display: none;
            background-color: white;
            width: 325px;
            z-index: 0;

            @include media-breakpoint-up('md') {
                display: block;
            }
        }

        .result-container {
            flex: 1 0 0;
            padding-bottom: 4.5em;
        }
    }
</style>