<template>
    <div>
        <div class="d-flex">
            <div class="container-fluid p-0">
                <h5>Story</h5>
            </div>
            <div>
                <button type="button"
                        v-if="isOwner && !updateMode"
                        @click.prevent="setUpdateMode(true)"
                        class="btn btn-sm btn-link text-nowrap">Update Story</button>
            </div>
        </div>
        <div class="border-top pt-2">

            <!-- success message -->
            <div v-if="status.successMessage"
                 style="overflow: auto"
                 class="alert alert-success mt-3">
                <button class="close"
                        @click.prevent="status.successMessage = ''"
                        type="button">&times;</button>
                <p class="m-0">{{ status.successMessage }}</p>
            </div>


            <form v-if="updateMode" @submit.prevent="saveStory">
                <fieldset :disabled="status.isLoading">
                    <div class="form-group">
                    <textarea placeholder="Story"
                              class="form-control"
                              v-model="form.story"
                              rows="5"></textarea>
                    </div>

                    <!-- error message -->
                    <div v-if="status.errorMessage"
                         style="overflow: auto"
                         class="alert alert-danger mt-3">
                        <button class="close"
                                @click.prevent="status.errorMessage = ''"
                                type="button">&times;</button>
                        <p class="m-0">{{ status.errorMessage }}</p>
                    </div>

                    <div class="row">
                        <div class="col-4">
                            <button type="button"
                                    @click.prevent="setUpdateMode(false)"
                                    class="btn btn-outline-primary w-100">Cancel</button>
                        </div>
                        <div class="col">
                            <button type="submit"
                                    :disabled="profile.story === form.story"
                                    class="btn btn-primary w-100">
                                 <span v-if="status.isLoading" class="loader-ellipsis">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                                <span v-else>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </fieldset>
            </form>
            <p style="white-space: pre-wrap" v-else>{{ profile.story }}</p>
        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex';
    const web3utils = require('web3-utils');

    export default {
        props: ['profile'],
        computed: {
            ...mapGetters({
                user: 'user/data'
            }),
            isOwner() {
                let user = this.user;
                let profile = this.profile;
                if(user && profile) return user.address.toLowerCase() === profile.owner.toLowerCase();
                return false;
            }
        },
        data() {
            return {
                updateMode: false,
                form: {
                    story: ''
                },
                status: {
                    isLoading: false,
                    errorMessage: '',
                    successMessage: ''
                }
            };
        },
        methods: {
            setUpdateMode(update) {
                this.updateMode = update;
                if(update) {
                    this.status.errorMessage = '';
                    this.status.successMessage = '';
                    this.form.story = this.profile.story;
                }
            },
            async saveStory() {
                let form = this.form;
                let status = this.status;
                let profile = this.profile;
                let Contract = this.$appFPContract;

                status.isLoading = true;
                status.errorMessage = '';
                status.successMessage = '';
                try {
                    let hash = await new Promise((resolve, reject) => {
                        Contract.updateStory(Number(profile.id), web3utils.stringToHex(form.story), {}, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });
                    status.successMessage = `Transaction Sent! Changes will appear once the transaction is mined. Your Tx Hash is ${hash}`;
                    this.setUpdateMode(false);
                }
                catch (error) {
                    status.errorMessage = this.$appUtil.getErrorMessage(error);
                }
                status.isLoading = false;
            }
        }
    };
</script>