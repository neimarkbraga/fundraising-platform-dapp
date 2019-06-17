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
                        <router-link tag="li" to="/donate" class="nav-item" exact>
                            <a class="nav-link">
                                <i class="fas fa-donate"></i>
                                <span class="ml-2">Donate to Platform</span>
                            </a>
                        </router-link>
                        <router-link tag="li" to="/dashboard" v-if="user" class="nav-item ml-4" exact>
                            <a class="nav-link">
                                <div class="d-flex">
                                    <div>
                                        <app-jazzicon :address="user.address" :diameter="25" />
                                    </div>
                                    <div class="ml-2">{{ userDisplay }}</div>
                                </div>
                            </a>
                        </router-link>
                    </ul>
                    <!--<form class="form-inline my-2 my-lg-0">
                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>-->
                </div>
            </div>
        </nav>
        <div ref="Spacer" :style="space_style"></div>
        <div v-if="!user" class="alert alert-warning rounded-0 m-0">
            <h5 class="m-0">No Metamask Account Found</h5>
            <p class="m-0">Please make sure you installed metamask on your browser to make transactions in this app.</p>
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
            }),
            userDisplay() {
                let user = this.user;
                let result = '';
                if(user) {
                    result += user.address.slice(0, 6);
                    result += '...';
                    result += user.address.slice(-4);
                }
                return result;
            }
        },
        methods: {
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
