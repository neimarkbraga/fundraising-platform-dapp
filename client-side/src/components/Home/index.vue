<template>
    <div class="bg-well occupy-view">
        <div class="container">

        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        computed: {
            ...mapGetters({
                user: 'user/data'
            })
        }
    }
</script>


<style lang="scss" scoped>
    .info-section {
        padding: 5em 0;
    }
</style>