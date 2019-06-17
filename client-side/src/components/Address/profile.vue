<template>
    <div class="bg-well occupy-view">
        <div v-if="user" class="container pb-5">
            <div class="d-flex py-4">
                <div class="pr-2">
                    <app-jazzicon :address="user.address" :diameter="50" />
                </div>
                <div class="d-flex align-items-center">
                    <h4 class="m-0">{{ user.address }}</h4>
                </div>
            </div>

            <div class="bg-white rounded shadow-sm">
                <div class="p-5">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { mapGetters } from 'vuex';


    export default {
        computed: {
            ...mapGetters({
                user: 'user/data'
            })
        }
    }
</script>