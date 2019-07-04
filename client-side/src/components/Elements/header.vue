<template>
    <header>
        <nav ref="Navbar"
             id="AppNavbar"
             class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
            <div class="container">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#MainNavbarToggler" aria-controls="MainNavbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="MainNavbarToggler">
                    <a class="navbar-brand d-flex" href="#/">
                        <div>
                            <img src="../../assets/img/logo.png"
                                 style="width: 2em"
                                 alt="Logo" />
                        </div>
                        <div class="px-2" style="line-height: 0.5em">
                            <h6 class="m-0">Fundraising</h6>
                            <p class="small m-0">Platform</p>
                        </div>
                    </a>
                    <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                        <router-link tag="li" to="/" class="nav-item" exact>
                            <a class="nav-link">
                                <i class="fas fa-th"></i>
                                <span class="ml-2">Browse Campaigns</span>
                            </a>
                        </router-link>
                        <router-link tag="li" to="/create" class="nav-item" exact>
                            <a class="nav-link">
                                <i class="fas fa-plus"></i>
                                <span class="ml-2">Create a Campaign</span>
                            </a>
                        </router-link>
                        <router-link tag="li" to="/donate" class="nav-item" exact>
                            <a class="nav-link">
                                <i class="fas fa-donate"></i>
                                <span class="ml-2">Donate to Creator</span>
                            </a>
                        </router-link>
                        <router-link tag="li" :to="'/address/' + user.address" v-if="user" class="nav-item ml-4" exact>
                            <a class="nav-link">
                                <div class="d-flex">
                                    <div>
                                        <app-jazzicon :address="user.address" :diameter="25" />
                                    </div>
                                    <div class="ml-2">{{ user.address | shortAddress }}</div>
                                </div>
                            </a>
                        </router-link>
                    </ul>
                </div>
            </div>
        </nav>
        <div ref="Spacer" :style="space_style"></div>

        <div v-if="!user">
            <div class="alert alert-warning rounded-0 m-0">
                <h5 class="m-0">No Metamask Account Found</h5>
                <p class="m-0">Please make sure you installed metamask on your browser to make transactions in this app.</p>
                <p>If you already installed metamask, <a href="#" @click.prevent="enableMetamask">click here!</a></p>
            </div>
        </div>
    </header>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                space_style: {},
                sizeChecker: null
            };
        },
        computed: {
            ...mapGetters({
                user: 'user/data'
            })
        },
        methods: {
            async enableMetamask() {
                if(window.ethereum) await window.ethereum.enable();
            },
            updateSpaceStyle() {
                let navbar = this.$refs.Navbar;
                let height = 0;
                if(navbar) height = navbar.clientHeight;
                this.space_style = {
                    height: `${height}px`
                };
            },
        },
        mounted() {
            this.updateSpaceStyle();
            this.sizeChecker = setInterval(this.updateSpaceStyle, 1000);
        },
        destroyed() {
            if(this.sizeChecker) clearInterval(this.sizeChecker);
        }
    }
</script>
