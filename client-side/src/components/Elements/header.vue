<template>
    <header>
        <nav ref="Navbar" class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
            <div class="container">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#MainNavbarToggler" aria-controls="MainNavbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="MainNavbarToggler">
                    <a class="navbar-brand" href="#">
                        App
                    </a>
                    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li class="nav-item active">
                            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                    <form class="form-inline my-2 my-lg-0">
                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
        <div ref="Spacer" :style="space_style"></div>
    </header>
</template>

<script>
    export default {
        data() {
            return {
                space_style: {}
            };
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
            window.addEventListener('resize', this.updateSpaceStyle);
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        },
        destroyed() {
            window.removeEventListener('resize', this.updateSpaceStyle);
        }
    }
</script>
