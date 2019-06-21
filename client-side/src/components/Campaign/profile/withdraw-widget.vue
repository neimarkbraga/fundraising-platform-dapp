<template>
    <div class="p-4 bg-white rounded shadow-sm">

        <!-- balance -->
        <div class="mb-3 text-center">
            <h4 class="m-0">
                <span>{{ profile.balance | fromWei }}</span>
                <img src="../../../assets/img/ethereum.png" class="mb-1" style="width: 1em" alt="ETH" />
            </h4>
        </div>

        <!-- withdraw button -->
        <button type="button"
                @click.prevent="withdraw"
                :disabled="disableReason || status.isLoading"
                class="btn btn-lg btn-primary w-100">
            <span v-if="status.isLoading" class="loader-ellipsis">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </span>
            <span v-else>Withdraw Balance</span>
        </button>

        <!-- error message -->
        <div v-if="status.errorMessage"
             style="overflow: auto"
             class="alert alert-danger mb-0 mt-3">
            <button class="close"
                    @click.prevent="status.errorMessage = ''"
                    type="button">&times;</button>
            <p class="m-0">{{ status.errorMessage }}</p>
        </div>

        <!-- success message -->
        <div v-if="status.successMessage"
             style="overflow: auto"
             class="alert alert-success mb-0 mt-3">
            <button class="close"
                    @click.prevent="status.successMessage = ''"
                    type="button">&times;</button>
            <p class="m-0">{{ status.successMessage }}</p>
        </div>

        <!-- disable reason -->
        <p v-if="disableReason" class="mt-2 mb-0 text-center text-muted">{{ disableReason }}</p>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                status: {
                    isLoading: false,
                    errorMessage: '',
                    successMessage: ''
                }
            };
        },
        props: ['profile'],
        computed: {
            disableReason() {
                let vm = this;
                let profile = vm.profile;

                if(!profile.finished) return 'Donation period is still on-going.';
                if(Number(profile.raised) === 0) return 'No donations received during donation period.';
                if(profile.raised !== profile.balance) return 'Balance already withdrawn';
                return false;
            }
        },
        methods: {
            async withdraw() {
                let vm = this;
                let status = vm.status;
                let profile = vm.profile;
                let Contract = vm.$appFPContract;

                try {
                    status.isLoading = true;
                    status.errorMessage = '';
                    status.successMessage = '';
                    let hash = await new Promise((resolve, reject) => {
                        Contract.withdrawCampaignBalance(Number(profile.id), {}, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });
                    status.successMessage = `Transaction Sent! Balance will update if transaction is successful after being mined. Your Tx Hash is: ${hash}`;
                }
                catch (error) {
                    status.errorMessage = vm.$appUtil.getErrorMessage(error);
                }
                status.isLoading = false;
            }
        }
    };
</script>