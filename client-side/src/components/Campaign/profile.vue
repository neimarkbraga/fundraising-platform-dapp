<template>
    <div class="bg-well occupy-view">
        <div class="container py-5">
            <div id="ViewContent" class="row">

                <!-- main content -->
                <div class="col-8">
                    <div class="bg-white rounded shadow-sm" style="overflow: hidden">

                        <!-- has error -->
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

                        <!-- no error -->
                        <div v-else>

                            <!-- loading -->
                            <div v-if="status.isLoading">
                                <app-image-box class="bg-muted" />
                                <div class="p-4 text-center"></div>
                            </div>

                            <!-- ready -->
                            <div v-else>

                                <!-- image -->
                                <image-section :profile="profile" />

                                <div class="p-4">

                                    <!-- name and category -->
                                    <div>
                                        <h1>{{ profile.name }}</h1>
                                        <p class="text-muted">{{ profile.category.name }}</p>
                                    </div>


                                    <!-- story -->
                                    <div class="pt-5">
                                        <story-section :profile="profile" />
                                    </div>


                                    <!-- category -->
                                    <div class="pt-5">
                                        <h5>Category</h5>
                                        <div class="border-top pt-2">
                                            <p>
                                                <b>{{ profile.category.name }}</b>
                                                <span> - {{ profile.category.description }}</span>
                                            </p>
                                        </div>
                                    </div>


                                    <!-- owner -->
                                    <div class="pt-5">
                                        <owner-section :profile="profile" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- side content -->
                <div class="col-4">
                    <div v-if="!status.isLoading && !status.errorMessage && profile">
                        <app-affix relative-element-selector="#ViewContent"
                                   fixed-navbar-selector="#AppNavbar"
                                   :inherit-parent-width="true"
                                   :top-offset="25"
                                   :bottom-offset="25">

                            <!-- donation status + donate -->
                            <div class="bg-white rounded shadow-sm">

                                <!-- donation status -->
                                <div class="px-4 py-2">

                                    <!-- deadline date time -->
                                    <div class="small text-right pb-2" :class="profile.finished? 'text-danger' : 'text-success'">
                                        <i class="fas fa-calendar-times"></i>
                                        <span>&nbsp;&nbsp;</span>
                                        <span>{{ profile.deadlineEpoch * 1000 | moment }}</span>
                                    </div>

                                    <!-- raised status -->
                                    <div class="d-flex">
                                        <div>
                                            <h5 class="m-0">{{ profile.raised | fromWei }}</h5>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <img src="../../assets/img/ethereum.png"
                                                 style="width: 1.2em"
                                                 alt="ETH" /> <span class="small text-muted">Raised</span>
                                        </div>
                                    </div>

                                    <!-- progress bar -->
                                    <div class="progress">
                                        <div class="progress-bar"
                                             :style="{width: `${(profile.raised / profile.goal) * 100}%`}"
                                             role="progressbar"></div>
                                    </div>

                                    <!-- goal status -->
                                    <div class="d-flex justify-content-end">
                                        <div>{{ profile.goal | fromWei }}</div>
                                        <div class="d-flex align-items-center">
                                            <img src="../../assets/img/ethereum.png"
                                                 style="width: 1em"
                                                 alt="ETH" /> <span class="small text-muted">Goal</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- donate -->
                                <donate-section :profile="profile" />
                            </div>

                            <!-- withdraw -->
                            <div v-if="isOwner" class="mt-4">
                                <withdraw-widget :profile="profile" />
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

    import ImageSection from './profile/image-section';
    import StorySection from './profile/story-section';
    import OwnerSection from './profile/owner-section';
    import DonateSection from './profile/donate-section';
    import WithdrawWidget from './profile/withdraw-widget';


    export default {
        data() {
            return {
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
                ipfsGateway: 'config/ipfsGateway'
            }),
            isOwner() {
                let vm = this;
                let user = vm.user;
                let profile = vm.profile;
                return user && profile && user.address.toLowerCase() === profile.owner.toLowerCase();
            }
        },
        methods: {
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
                if(profile && profile.id.toString() === data.campaignId.toString()) {
                    profile.raised = data.totalRaised;
                }
            },
            withdrawBalanceEventHandler(data) {
                let vm = this;
                let profile = vm.profile;
                if(profile && profile.id.toString() === data.campaignId.toString()) {
                    profile.balance = '0';
                }
            },
            updateStoryEventHandler(data) {
                let vm = this;
                let profile = vm.profile;
                if(profile && profile.id.toString() === data.campaignId.toString()) {
                    profile.story = data.newStory;
                }
            },
            transferEventHandler(data) {
                let vm = this;
                let profile = vm.profile;
                if(profile && profile.id.toString() === data.campaignId.toString()) {
                    profile.owner = data.to;
                }
            },
            updateImageHashEventHandler(data) {
                let vm = this;
                let profile = vm.profile;
                if(profile && profile.id.toString() === data.campaignId.toString()) {
                    profile.imageHash = data.newImageHash;
                }
            }
        },
        created() {
            this.loadProfile();
            EventBus.$on('NewCampaignDonate', this.newDonateEventHandler);
            EventBus.$on('WithdrawCampaignBalance', this.withdrawBalanceEventHandler);
            EventBus.$on('UpdateCampaignStory', this.updateStoryEventHandler);
            EventBus.$on('Transfer', this.transferEventHandler);
            EventBus.$on('UpdateCampaignImageHash', this.updateImageHashEventHandler);
        },
        destroyed() {
            EventBus.$off('NewCampaignDonate', this.newDonateEventHandler);
            EventBus.$off('WithdrawCampaignBalance', this.withdrawBalanceEventHandler);
            EventBus.$off('UpdateCampaignStory', this.updateStoryEventHandler);
            EventBus.$off('Transfer', this.transferEventHandler);
            EventBus.$off('UpdateCampaignImageHash', this.updateImageHashEventHandler);
        },
        components: {
            ImageSection,
            StorySection,
            OwnerSection,
            DonateSection,
            WithdrawWidget
        }
    }
</script>