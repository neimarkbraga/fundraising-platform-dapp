<template>
    <div class="bg-well occupy-view">
        <div class="container">

            <div v-if="campaigns.status.isLoading">
                Loading campaigns
            </div>
            <div v-else>

                <div v-if="campaigns.status.errorMessage">
                    Error: {{ campaigns.status.errorMessage }}
                    <button type="button" @click="loadCampaigns">Reload</button>
                </div>

                <div v-else class="row">

                    <div class="col-6 col-md-4 mt-4" v-for="campaign in campaigns.result">
                        <div class="card shadow-sm">
                            <app-image-box :src="'https://ipfs.iamneimark.com/ipfs/' + campaign.imageHash" />

                            <div class="card-body">
                                <h5 class="card-title">{{ campaign.name }}</h5>
                                <p class="card-text">{{ campaign.story }}</p>

                                <div>
                                    <div class="progress">
                                        <div class="progress-bar"
                                             :style="{width: `${(campaign.raised / campaign.goal) * 100}%`}"
                                             role="progressbar"></div>
                                    </div>
                                    <div class="small text-right">
                                        {{ campaign.raised | fromWei('ether') }} of {{ campaign.goal | fromWei('ether') }} <b>ETH</b>
                                    </div>
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


    export default {
        data() {
            return {
                campaigns: {
                    query: {
                        finished: null
                    },
                    status: {
                        isLoading: false,
                        errorMessage: ''
                    },
                    result: []
                }
            };
        },
        computed: {
            ...mapGetters({
                user: 'user/data'
            })
        },
        methods: {
            async loadCampaigns() {
                this.campaigns.status.isLoading = true;
                this.campaigns.status.errorMessage = '';
                try {
                    let response = await axios.get('/campaign', {params: this.campaigns.query});
                    this.campaigns.result = response.data;
                }
                catch (error) {
                    this.campaigns.status.errorMessage = this.$appUtil.getErrorMessage(error);
                }
                this.campaigns.status.isLoading = false;
            }
        },
        created() {
            this.loadCampaigns();
        }
    }
</script>


<style lang="scss" scoped>
    .info-section {
        padding: 5em 0;
    }
</style>