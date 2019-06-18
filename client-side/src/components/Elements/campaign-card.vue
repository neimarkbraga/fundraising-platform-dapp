<template>
    <div class="card shadow-sm" style="overflow: hidden;">
        <div v-if="data">
            <app-image-box :src="ipfsGateway + data.imageHash" />
            <div class="card-body">
                <h5 class="card-title">{{ data.name }}</h5>
                <p class="card-text text-muted">{{ data.category.name }}</p>

                <div>
                    <div class="progress">
                        <div class="progress-bar"
                             :style="{width: `${(data.raised / data.goal) * 100}%`}"
                             role="progressbar"></div>
                    </div>
                    <div class="small text-right">
                        {{ data.raised | fromWei }} of {{ data.goal | fromWei }} <b>ETH</b>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <app-image-box class="bg-muted" />
            <div class="card-body">
                <h5 class="card-title bg-muted">&nbsp;</h5>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        props: {
            data: {
                type: Object,
                default() {
                    return null;
                }
            }
        },
        computed: {
            ...mapGetters({
                ipfsGateway: 'config/ipfsGateway'
            })
        },
    }
</script>

<style lang="scss" scoped>

</style>