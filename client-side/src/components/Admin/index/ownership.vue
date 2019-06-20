<template>
    <div>
        <form @submit.prevent="transfer">
            <fieldset :disabled="status.isLoading">
                <div style="min-height: 100px">
                    <div class="form-group m-0">
                        <label>New Owner Address</label>
                        <input type="text"
                               class="form-control"
                               v-model="form.newOwner"
                               required="required"
                               placeholder="New Owner Address" />
                    </div>
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

                    <!-- success message -->
                    <div v-if="status.successMessage"
                         style="overflow: auto"
                         class="alert alert-success mb-0 mt-3">
                        <button class="close"
                                @click.prevent="status.successMessage = ''"
                                type="button">&times;</button>
                        <p class="m-0">{{ status.successMessage }}</p>
                    </div>
                </div>

                <button type="submit" class="btn btn-lg btn-primary w-100">
                    <span v-if="status.isLoading" class="loader-ellipsis">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <span v-else>Transfer</span>
                </button>
            </fieldset>
        </form>
    </div>
</template>

<script>
    const web3utils = require('web3-utils');

    export default {
        data() {
            return {
                form: {
                    newOwner: ''
                },
                status: {
                    isLoading: false,
                    errorMessage: '',
                    successMessage: ''
                }
            };
        },
        methods: {
            async transfer() {
                let status = this.status;
                let form = this.form;
                let Contract = this.$appFPContract;

                status.isLoading = true;
                status.errorMessage = '';
                status.successMessage = '';
                try {
                    if(!web3utils.isAddress(form.newOwner)) throw new Error('Invalid address');
                    let hash = await new Promise((resolve, reject) => {
                        Contract.transferOwnership(form.newOwner, {}, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });
                    form.newOwner = '';
                    status.successMessage = `Transaction submitted! Your transaction hash is: ${hash}`;

                }
                catch (error) {
                    status.errorMessage = this.$appUtil.getErrorMessage(error);
                }
                status.isLoading = false;
            }
        }
    }
</script>