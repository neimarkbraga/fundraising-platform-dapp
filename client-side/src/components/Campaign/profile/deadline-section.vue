<template>
    <div>

        <div class="d-flex">
            <div class="container-fluid p-0">
                <h5>Donation Deadline</h5>
            </div>
            <div>
                <button type="button"
                        v-if="!profile.finished && isOwner && !updateMode"
                        @click.prevent="setUpdateMode(true)"
                        class="btn btn-sm btn-link text-nowrap">Extend Deadline</button>
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


            <form v-if="updateMode" @submit.prevent="saveExtend">
                <fieldset :disabled="status.isLoading">
                    <div class="form-group">
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group input-group-sm">
                                    <input type="number"
                                           min="0"
                                           v-model="form.days"
                                           class="form-control">
                                    <div class="input-group-append">
                                        <span class="input-group-text">Days</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group input-group-sm">
                                    <select class="form-control" v-model="form.hours">
                                        <option :value="n - 1" v-for="n in 24" :key="n">{{ n - 1 }}</option>
                                    </select>
                                    <div class="input-group-append">
                                        <span class="input-group-text">Hours</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-6">
                                <div class="input-group input-group-sm">
                                    <select class="form-control" v-model="form.minutes">
                                        <option :value="n - 1" v-for="n in 60" :key="n">{{ n - 1 }}</option>
                                    </select>
                                    <div class="input-group-append">
                                        <span class="input-group-text">Minutes</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group input-group-sm">
                                    <select class="form-control" v-model="form.seconds">
                                        <option :value="n - 1" v-for="n in 60" :key="n">{{ n - 1 }}</option>
                                    </select>
                                    <div class="input-group-append">
                                        <span class="input-group-text">Seconds</span>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                <span v-else>Extend</span>
                            </button>
                        </div>
                    </div>
                </fieldset>
            </form>
            <div class="py-2" v-else>
                <i class="fas fa-calendar-times"></i>
                <span class="ml-2">{{ profile.deadlineEpoch * 1000 | moment }}</span>
            </div>
        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex';

    const MINUTE = 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

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
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
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
                    this.form.days = 0;
                    this.form.hours = 0;
                    this.form.minutes = 0;
                    this.form.seconds = 0;
                }
            },
            async saveExtend() {
                let form = this.form;
                let status = this.status;
                let profile = this.profile;
                let Contract = this.$appFPContract;

                status.isLoading = true;
                status.errorMessage = '';
                status.successMessage = '';
                try {
                    let duration = form.seconds;
                    duration += form.minutes * MINUTE;
                    duration += form.hours * HOUR;
                    duration += form.days * DAY;
                    let hash = await new Promise((resolve, reject) => {
                        Contract.extendCampaignDeadline(profile.id, duration, {}, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });
                    status.successMessage = `Transaction Sent! Deadline will update if transaction is successful after being mined. Your Tx Hash is: ${hash}`;
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