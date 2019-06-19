<template>
    <div class="bg-well occupy-view">
        <div class="container py-5">


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

            <div v-else class="bg-white rounded border shadow-sm">
                <div class="p-4">
                    {{ platformInfo }}
                </div>
            </div>


        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

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
        }
    }
</script>