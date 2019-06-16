<template>
    <div id="app">
        <app-header />
        <main>
            <router-view :key="$route.fullPath" />
        </main>
        <app-footer />
    </div>
</template>

<script>
    import AppHeader from '@/components/Elements/header.vue';
    import AppFooter from '@/components/Elements/footer.vue';

    export default {
        name: 'app',
        components: {
            AppHeader,
            AppFooter
        }
    }
</script>

<style lang="scss">
    @import "assets/scss/main";

    html, body {
        padding: 0;
        margin: 0;
        width: 100%;
        min-height: 100vh;
    }
    #app {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        flex: 0 0 0;

        main {
            display: flex;
            flex-direction: column;
            width: 100%;
            flex: 1 0 auto;
            position: relative;

            .occupy-view {
                flex: 1 0 auto;
            }
        }
    }
</style>
