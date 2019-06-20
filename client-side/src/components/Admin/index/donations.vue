<template>
    <div>
        <div class="text-center">
            <div class="d-flex align-items-center" style="min-height: 100px">
                <h2 class="m-0 w-100">
                <span v-if="status.isGettingValue" class="loader-ellipsis">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
                    <span v-else>{{ value | fromWei }}</span>
                    <img src="../../../assets/img/ethereum.png"
                         alt="ETH"
                         class="mb-1"
                         style="width: 1em;">
                </h2>
            </div>


            <div class="py-2">
                <!-- error message -->
                <div v-if="status.errorMessage"
                     style="overflow: auto"
                     class="alert alert-danger mb-0 mt-3">
                    <button class="close"
                            @click.prevent="status.errorMessage = ''"
                            type="button">&times;</button>
                    <p class="m-0">{{ status.errorMessage }}</p>
                </div>
            </div>

            <button type="button"
                    @click.prevent="withdrawDonations"
                    :disabled="status.isWithdrawing || status.isGettingValue"
                    class="btn btn-lg btn-primary w-100">
                    <span v-if="status.isWithdrawing" class="loader-ellipsis">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                <span v-else>Withdraw</span>
            </button>
        </div>
    </div>
</template>

<script>
    import EventBus from '../../../library/EventBus';

    export default {
        data() {
            return {
                value: '0',
                status: {
                    isGettingValue: false,
                    isWithdrawing: false,
                    errorMessage: '',
                    successMessage: ''
                }
            };
        },
        methods: {
            async loadReceivedDonations() {
                let status = this.status;
                let Contract = this.$appFPContract;
                status.isGettingValue = true;
                status.errorMessage = '';
                status.successMessage = '';
                try {
                    let data = await new Promise((resolve, reject) => {
                        Contract.getReceivedDonation({}, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });
                    this.value = (data || 0).toString();
                }
                catch (error) {
                    status.errorMessage = this.$appUtil.getErrorMessage(error);
                }
                status.isGettingValue = false;
            },
            async withdrawDonations() {
                let status = this.status;
                let Contract = this.$appFPContract;
                status.isWithdrawing = true;
                status.errorMessage = '';
                status.successMessage = '';
                try {
                    let hash = await new Promise((resolve, reject) => {
                        Contract.withdrawReceivedDonation({}, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });
                    status.successMessage = `Transaction Sent! Balance will update if transaction is successful after being mined. Your Tx Hash is: ${hash}`;
                }
                catch(error) {
                    status.errorMessage = this.$appUtil.getErrorMessage(error);
                }
                status.isWithdrawing = false;
            },
            withdrawDonationEventHandler() {
                this.loadReceivedDonations();
            },
            newDonationEventHandler(data) {
                this.value = data.totalReceived;
            }
        },
        created() {
            this.loadReceivedDonations();

            EventBus.$on('WithdrawPlatformDonation', this.withdrawDonationEventHandler);
            EventBus.$on('NewPlatformDonation', this.newDonationEventHandler);
        },
        destroyed() {
            EventBus.$off('WithdrawPlatformDonation', this.withdrawDonationEventHandler);
            EventBus.$off('NewPlatformDonation', this.newDonationEventHandler);
        }
    }
</script>