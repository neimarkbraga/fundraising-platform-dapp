<template>
    <footer class="bg-white py-2 border-top">
        <div class="container">
            <div class="row">
                <div class="col p-0">
                    &copy; Neimark Junsay Braga
                </div>
                <div class="col p-0 text-right text-muted">
                    <div v-if="platformInfoStatus.isLoading">
                        <span  class="loader-ellipsis">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </div>

                    <div v-else>
                        <div v-if="platformInfoStatus.errorMessage">
                            <p class="m-0">
                                <span>Error Loading. </span>
                                <a href="#" @click.prevent="reloadPlatformInfo">
                                    Reload
                                </a>
                            </p>
                        </div>
                        <div v-else>
                            <router-link v-if="isPlatformOwner" to="/admin">
                                Admin
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
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
        }
    }
</script>
