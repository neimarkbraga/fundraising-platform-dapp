<template>
    <div class="bg-well occupy-view">
        <div class="container pb-5">

            <div class="py-4">
                <h3 class="m-0">Admin Dashboard</h3>
            </div>

            <div v-if="platformInfoStatus.isLoading || platformInfoStatus.errorMessage">

                <div v-if="platformInfoStatus.isLoading" class="text-center">
                    <div>
                        <div class="loader-ellipsis">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div>Updating Platform Info</div>
                </div>

                <div v-if="platformInfoStatus.errorMessage" class="text-center">
                    <img src="../../assets/img/error.png"
                         style="max-width: 7em"
                         alt="Error">
                    <h5>Error</h5>
                    <p>{{ platformInfoStatus.errorMessage }}</p>
                    <div>
                        <button type="button"
                                class="btn btn-sm btn-primary"
                                @click="reloadPlatformInfo">Reload</button>
                    </div>
                </div>
            </div>

            <div v-else class="">
                <div v-if="isPlatformOwner" class="row">
                    <div class="col mb-5">
                        <div class="bg-white rounded border shadow-sm">
                            <div class="px-4 py-3 border-bottom">
                                <h5 class="m-0">Received Donations</h5>
                            </div>
                            <div class="p-4">
                                <donations-section />
                            </div>
                        </div>
                    </div>

                    <div class="col mb-5">
                        <div class="bg-white rounded border shadow-sm">
                            <div class="px-4 py-3 border-bottom">
                                <h5 class="m-0">Transfer Platform Ownership</h5>
                            </div>
                            <div class="p-4">
                                <ownership-section />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-4 bg-white rounded border shadow-sm text-center" v-else>
                    You are not allowed to access this page. Only the platform owner can manage this page.
                </div>
            </div>


        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import DonationsSection from './index/donations';
    import OwnershipSection from './index/ownership';
    import EventBus from '../../library/EventBus';

    export default {
        computed: {
            ...mapGetters({
                user: 'user/data',
                platformInfoStatus: 'platform/status',
                platformInfo: 'platform/info'
            }),
            isPlatformOwner() {
                let user = this.user;
                let info = this.platformInfo;
                if(user && info) return user.address.toLowerCase() === info.owner.toLowerCase();
                return false;
            }
        },
        methods: {
            reloadPlatformInfo() {
                this.$loadPlatformInfo();
            }
        },
        created() {
            this.reloadPlatformInfo();

            EventBus.$on('OwnershipTransferred', this.reloadPlatformInfo);
        },
        destroyed() {
            EventBus.$off('OwnershipTransferred', this.reloadPlatformInfo);
        },
        components: {
            DonationsSection,
            OwnershipSection
        }
    }
</script>