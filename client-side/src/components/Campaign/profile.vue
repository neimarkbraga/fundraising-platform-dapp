<template>
    <div class="bg-well occupy-view">
        <div class="container py-5">
            <div id="ViewContent" class="row">
                <div class="col-8">
                    <div class="bg-white rounded shadow-sm" style="overflow: hidden">

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
                <div class="col-4">
                    <div>
                        <app-affix relative-element-selector="#ViewContent"
                               fixed-navbar-selector="#AppNavbar"
                               :inherit-parent-width="true"
                               :top-offset="25"
                               :bottom-offset="25">

                            <div class="bg-white rounded shadow-sm">
                                <div class="p-4 text-center" v-if="status.isLoading">
                                    <div class="loader-ellipsis">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>

                                <div v-else>
                                    <div class="px-4 py-2">
                                        <div class="small text-muted text-right">
                                            <i class="fas fa-stopwatch"></i>
                                            <span>&nbsp;&nbsp;</span>
                                            <span>{{ profile.deadlineEpoch }}</span>
                                        </div>
                                        <div class="d-flex">
                                            <div>
                                                <h2 class="m-0">
                                                    {{ profile.raised | fromWei }}
                                                </h2>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <img src="../../assets/img/ethereum.png"
                                                     style="width: 1.5em"
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


                                    <div class="border-top p-4">
                                        <div class="form-group">
                                            <div class="input-group">
                                                <input type="number"
                                                       min="1"
                                                       placeholder="Value"
                                                       class="form-control">
                                                <div class="input-group-append">
                                                    <select class="btn btn-outline-secondary">
                                                        <option v-for="unit in ethUnits">{{ unit }}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <button type="button" class="btn btn-lg btn-primary w-100">
                                            Donate
                                        </button>
                                    </div>

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
                ipfsGateway: 'config/ipfsGateway',
                ethUnits: 'config/ethUnits'
            })
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

                }
                status.isLoading = false;
            }
        },
        created() {
            this.loadProfile();
        }
    }
</script>

<style lang="scss" scoped>

</style>