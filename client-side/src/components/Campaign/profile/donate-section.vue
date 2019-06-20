<template>
    <div class="border-top p-4">
        <form @submit.prevent="submit">
            <fieldset :disabled="disableReason || status.isLoading">
                <div class="form-group">
                    <div class="input-group">

                        <!-- value -->
                        <input type="number"
                               required="required"
                               step="any"
                               v-model="form.value"
                               placeholder="Value"
                               class="form-control">

                        <!-- value unit -->
                        <div class="input-group-append">
                            <select class="btn btn-outline-secondary"
                                    v-model="form.unit">
                                <option v-for="unit in ethUnits" :key="unit">{{ unit }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- submit button -->
                <button type="submit" class="btn btn-lg btn-primary w-100">
                    <span v-if="status.isLoading" class="loader-ellipsis">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <span v-else>Donate</span>
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
                <p v-if="disableReason" class="text-center mb-0 mt-2 text-muted">{{ disableReason }}</p>
            </fieldset>
        </form>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    const web3utils = require('web3-utils');

    export default {
        props: ['profile'],
        data() {
            return {
                form: {
                    value: 0,
                    unit: 'ether'
                },
                status: {
                    isLoading: false,
                    errorMessage: '',
                    successMessage: ''
                }
            };
        },
        computed: {
            ...mapGetters({
                user: 'user/data',
                ethUnits: 'config/ethUnits'
            }),
            disableReason() {
                let profile = this.profile;
                let user = this.user;
                if(!user) return 'No Metamask Account Found or Metamask is not installed.';
                if(!profile) return 'Profile is not yet loaded';
                if(profile.finished) return 'Donation period already finished';
                return false;
            }
        },
        methods: {
            async submit() {
                let vm = this;
                let form = vm.form;
                let status = vm.status;
                let profile = vm.profile;
                let Contract = vm.$appFPContract;

                status.isLoading = true;
                status.errorMessage = '';
                status.successMessage = '';
                try {
                    if(form.value <= 0) throw new Error('Empty donation value.');
                    let hash = await new Promise((resolve, reject) => {
                        Contract.donate(Number(profile.id), {
                            value: web3utils.toWei(form.value.toString(), form.unit)
                        }, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });
                    form.value = 0;
                    status.successMessage = `Transaction Sent. Thank You! Raised value will update if transaction is successful after being mined. Your Tx Hash is: ${hash}`;
                }
                catch (error) {
                    status.errorMessage = vm.$appUtil.getErrorMessage(error);
                }
                status.isLoading = false;
            }
        }
    };
</script>