<template>
    <div class="bg-well occupy-view">
        <div class="container py-5">
            <div id="ViewContent" class="row">
                <div class="col-8">
                    <div class="bg-white rounded shadow-sm" style="overflow: hidden">


                        <div v-if="status.errorMessage">
                            
                            <div class="p-4 d-flex">
                                <div class="pr-4">
                                    <img src="../../assets/img/error.png"
                                         class="w-100"
                                         style="max-width: 7em"
                                         alt="Error" />
                                </div>
                                <div class="d-flex align-items-center">
                                    <div>
                                        <h4 class="m-0">Error</h4>
                                        <p class="m-0">
                                            <span>{{ status.errorMessage }} </span>
                                            <button type="button" @click.prevent="loadProfile" class="btn btn-sm btn-primary">Retry</button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else>
                            <div v-if="status.isLoading">
                                <app-image-box class="bg-muted" />

                                <div class="p-4 text-center">

                                </div>
                            </div>

                            <div v-else>
                                <app-image-box :src="ipfsGateway + profile.imageHash" />
                                <div class="p-4">
                                    <h1>{{ profile.name }}</h1>
                                    <p class="text-muted">Category Name Here</p>




                                    <div class="pt-5">
                                        <h5>Story</h5>
                                        <div class="border-top pt-2">
                                            <p>{{ profile.story }}</p>
                                        </div>
                                    </div>

                                    <div class="pt-5">
                                        <h5>Owner Address</h5>
                                        <div class="border-top pt-2">
                                            <p>{{ profile.owner }}</p>
                                        </div>
                                    </div>

                                    <div class="pt-5">
                                        <h5>Recent Donations</h5>
                                        <div class="border-top pt-2">
                                            <p>{{ profile }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div v-if="!status.isLoading && !status.errorMessage && profile">
                        <app-affix relative-element-selector="#ViewContent"
                               fixed-navbar-selector="#AppNavbar"
                               :inherit-parent-width="true"
                               :top-offset="25"
                               :bottom-offset="25">

                            <div class="bg-white rounded shadow-sm">

                                <!-- raise and goal status -->
                                <div class="px-4 py-2">
                                    <div class="small text-muted text-right pb-2">
                                        <i class="fas fa-stopwatch"></i>
                                        <span>&nbsp;&nbsp;</span>
                                        <span>{{ profile.deadlineEpoch }}</span>
                                    </div>
                                    <div class="d-flex">
                                        <div>
                                            <h5 class="m-0">
                                                {{ profile.raised | fromWei }}
                                            </h5>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <img src="../../assets/img/ethereum.png"
                                                 style="width: 1.2em"
                                                 alt="ETH" /> <span class="small text-muted">Raised</span>
                                        </div>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar"
                                             :style="{width: `${(profile.raised / profile.goal) * 100}%`}"
                                             role="progressbar"></div>
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        <div>{{ profile.goal | fromWei }}</div>
                                        <div class="d-flex align-items-center">
                                            <img src="../../assets/img/ethereum.png"
                                                 style="width: 1em"
                                                 alt="ETH" /> <span class="small text-muted">Goal</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- donate section -->
                                <div class="border-top p-4">

                                    <!-- donate form -->
                                    <form @submit.prevent="execDonate">
                                        <fieldset :disabled="disableReason || donating.status.isLoading">
                                            <div class="form-group">
                                                <div class="input-group">

                                                    <!-- donate value -->
                                                    <input type="number"
                                                           required="required"
                                                           step="any"
                                                           v-model="donating.form.value"
                                                           placeholder="Value"
                                                           class="form-control">

                                                    <!-- donate value unit -->
                                                    <div class="input-group-append">
                                                        <select class="btn btn-outline-secondary"
                                                                v-model="donating.form.unit">
                                                            <option v-for="unit in ethUnits">{{ unit }}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- execute donation button -->
                                            <button type="submit" class="btn btn-lg btn-primary w-100">
                                                <span v-if="donating.status.isLoading" class="loader-ellipsis">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </span>
                                                <span v-else>Donate</span>
                                            </button>

                                            <!-- donate error message -->
                                            <div v-if="donating.status.errorMessage"
                                                 style="overflow: auto"
                                                 class="alert alert-danger mb-0 mt-3">
                                                <button class="close"
                                                        @click.prevent="donating.status.errorMessage = ''"
                                                        type="button">&times;</button>
                                                <p class="m-0">{{ donating.status.errorMessage }}</p>
                                            </div>

                                            <!-- donate success message -->
                                            <div v-if="donating.status.successMessage"
                                                 style="overflow: auto"
                                                 class="alert alert-success mb-0 mt-3">
                                                <button class="close"
                                                        @click.prevent="donating.status.successMessage = ''"
                                                        type="button">&times;</button>
                                                <p class="m-0">{{ donating.status.successMessage }}</p>
                                            </div>

                                            <!-- donate disable reason -->
                                            <p v-if="disableReason" class="text-center mb-0 mt-2 text-danger">{{ disableReason }}</p>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </app-affix>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { mapGetters } from 'vuex';
    import EventBus from '../../library/EventBus';

    const ethunit = require('ethjs-unit');

    export default {
        data() {
            return {
                donating: {
                    form: {
                        value: 0,
                        unit: 'ether'
                    },
                    status: {
                        isLoading: false,
                        errorMessage: '',
                        successMessage: ''
                    }
                },
                status: {
                    isLoading: true,
                    errorMessage: ''
                },
                profile: null
            };
        },
        computed: {
            ...mapGetters({
                user: 'user/data',
                ipfsGateway: 'config/ipfsGateway',
                ethUnits: 'config/ethUnits'
            }),
            disableReason() {
                let profile = this.profile;
                let user = this.user;

                if(!user) return 'No Metamask Account Found or Metamask is not installed.';
                if(!profile) return 'Profile is not yet loaded';
                if(profile.finished) return 'Donation time already finished';
                return false;
            }
        },
        methods: {
            async execDonate() {
                let vm = this;
                let params = vm.$route.params;
                let status = vm.donating.status;
                let form = vm.donating.form;
                let Contract = vm.$appFPContract;

                status.isLoading = true;
                status.errorMessage = '';
                status.successMessage = '';
                try {
                    let hash = await new Promise((resolve, reject) => {
                        Contract.donate(Number(params.id), {
                            value: ethunit.toWei(form.value.toString(), form.unit)
                        }, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });
                    form.value = 0;
                    status.successMessage = `Thank You! Your transaction has been successfully submitted. Here is your tx hash: ${hash}`;
                }
                catch (error) {
                    status.errorMessage = vm.$appUtil.getErrorMessage(error);
                }
                status.isLoading = false;
            },
            async loadProfile() {
                let vm = this;
                let status = vm.status;
                let params = vm.$route.params;
                try {
                    status.isLoading = true;
                    status.errorMessage = '';

                    let response = await axios.get(`/campaign/${params.id}`);
                    vm.profile = response.data;
                }
                catch (error) {
                    status.errorMessage = vm.$appUtil.getErrorMessage(error);
                }
                status.isLoading = false;
            },
            newDonateEventHandler(data) {
                let vm = this;
                let profile = vm.profile;
                if(profile.id.toString() === data.campaignId.toString()) {
                    profile.raised = data.totalRaised;
                }
            }
        },
        created() {
            this.loadProfile();
            EventBus.$on('NewCampaignDonate', this.newDonateEventHandler);
        },
        destroyed() {
            EventBus.$off('NewCampaignDonate', this.newDonateEventHandler);
        }
    }
</script>

<style lang="scss" scoped>

</style>