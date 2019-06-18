<template>
    <div class="bg-well occupy-view d-flex align-items-center">
        <div class="container py-5">
            <div class="row">
                <div class="col">
                    <div class="p-4 bg-white rounded border shadow-sm">
                        <h2>Hello There!</h2>
                        <p>
                            <span>If you like the platform, feel free to give some </span>
                            <img src="../../assets/img/ethereum.png"
                                 style="height: 1em"
                                 alt="ETH" />
                            <span> to the Owner!</span>
                        </p>

                        <form class="mt-4" @submit.prevent="donate">
                            <fieldset :disabled="status.isLoading">
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
                                                <option v-for="unit in ethUnits">{{ unit }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <!-- submit button -->
                                <button type="submit"
                                        :disabled="form.value <= 0"
                                        class="btn btn-lg btn-primary w-100">
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
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div class="col d-flex align-items-center justify-content-centerss">
                    <div class="d-flex">
                        <div class="pr-3">
                            <img src="../../assets/img/logo.png"
                                 style="max-width: 100px"
                                 class="w-100"
                                 alt="Logo">
                        </div>
                        <div>
                            <h1 class="m-0">Fundraising</h1>
                            <h4 class="m-0">Platform</h4>
                            <p class="m-0">Project of Neimark Junsay Braga</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    const web3utils = require('web3-utils');

    export default {
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
            })
        },
        methods: {
            async donate() {
                let vm = this;
                let form = vm.form;
                let status = vm.status;
                let Contract = vm.$appFPContract;

                status.isLoading = true;
                status.errorMessage = '';
                status.successMessage = '';
                try {
                    await new Promise((resolve, reject) => {
                        Contract.donateToPlatform({
                            value: web3utils.toWei(form.value.toString(), form.unit)
                        }, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });
                    form.value = 0;
                    status.successMessage = `Awesome! Thank you for your donation!`;
                }
                catch (error) {
                    status.errorMessage = vm.$appUtil.getErrorMessage(error);
                }
                status.isLoading = false;
            }
        }
    }
</script>