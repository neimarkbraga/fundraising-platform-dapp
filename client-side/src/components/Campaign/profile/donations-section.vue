<template>
    <div>
        <h5>
            <span>Recent Donations </span>
            <span v-if="status.isLoading" class="loader-ellipsis small">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </span>
        </h5>
        <div class="border-top pt-2">

            <div v-if="status.errorMessage" class="p-2">
                <div class="d-flex">
                    <div>
                        <img src="../../../assets/img/error.png"
                             style="max-width: 6.5em"
                             class="w-100"
                             alt="Error" />
                    </div>
                    <div class="pl-3">
                        <h4 class="m-0">Error</h4>
                        <p class="m-0">{{ status.errorMessage }}</p>
                        <div class="mt-2">
                            <button type="button"
                                    @click.prevent="loadDonations"
                                    class="btn btn-sm btn-primary">
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-if="!status.isLoading">


                    <table v-if="donations.length" class="table table-borderless">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Value</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(donation, index) in donations" :key="index">
                                <td>
                                    <div class="d-flex">
                                        <div>
                                            <app-jazzicon :address="donation.donor" :diameter="30" />
                                        </div>
                                        <div class="d-flex align-items-center pl-2 pb-2">
                                            {{ donation.donor | shortAddress}}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {{ donation.value | fromWei }} ETH
                                </td>
                                <td>
                                    {{ donation.message }}
                                </td>
                            </tr>
                        </tbody>
                    </table>


                    <div class="pt-3" v-else>
                        No Donations Yet.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import EventBus from '../../../library/EventBus';

    export default {
        props: ['profile'],
        data() {
            return {
                donations: [],
                status: {
                    isLoading: false,
                    errorMessage: ''
                }
            };
        },
        methods: {
            async loadDonations() {
                let status = this.status;
                let profile = this.profile;

                status.isLoading = true;
                status.errorMessage = '';
                try {
                    let response = await  axios.get(`/campaign/${profile.id}/donation`);
                    this.donations = response.data;
                }
                catch (error) {
                    status.errorMessage = this.$appUtil.getErrorMessage(error);
                }
                status.isLoading = false;
            },
            newDonationEventHandler(data) {
                let profile = this.profile;
                if(profile && profile.id.toString() === data.campaignId.toString()) {
                    this.loadDonations();
                }
            }
        },
        created() {
            this.loadDonations();
            EventBus.$on('NewCampaignDonation', this.newDonationEventHandler);
        },
        destroyed() {
            EventBus.$off('NewCampaignDonation', this.newDonationEventHandler);
        }
    };
</script>