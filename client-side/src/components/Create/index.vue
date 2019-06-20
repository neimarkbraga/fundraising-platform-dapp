<template>
    <div class="bg-well occupy-view">
        <div class="container py-5" style="max-width: 700px">
            <div class="bg-white rounded shadow-sm">

                <!-- title -->
                <div class="px-4 py-3 border-bottom">
                    <h3 class="m-0">Create a Campaign</h3>
                </div>

                <!-- content -->
                <div class="p-4">

                    <!-- create form -->
                    <form v-if="user" @submit.prevent="submitForm">
                        <fieldset :disabled="status.isLoading">

                            <!-- display image -->
                            <div class="form-group">
                                <label>Display Image</label>
                                <div class="pb-2">
                                    <app-image-box class="rounded bg-muted"
                                                   :src="form.imageSrc"
                                                   style="overflow: hidden" />
                                </div>
                                <div class="input-group">
                                    <div class="custom-file">
                                        <input type="file"
                                               ref="ImageFileSelect"
                                               @change="updateImageFile"
                                               class="custom-file-input"
                                               accept="image/*" />
                                        <label class="custom-file-label" style="overflow: hidden">{{ form.imageFile? form.imageFile.name : 'Choose Image'}}</label>
                                    </div>
                                </div>
                            </div>

                            <!-- name -->
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text"
                                       class="form-control"
                                       maxlength="32"
                                       v-model="form.name"
                                       required="required"
                                       placeholder="Name" />
                                <small class="form-text text-muted text-right m-0">
                                    {{ form.name.length }} / 32
                                </small>
                            </div>

                            <!-- category -->
                            <div class="form-group">
                                <label>Category</label>
                                <app-select-category v-model="form.category" :show-description="true" />
                            </div>

                            <!-- story -->
                            <div class="form-group">
                                <label>Story</label>
                                <textarea placeholder="Story"
                                          v-model="form.story"
                                          class="form-control"
                                          rows="5"></textarea>
                            </div>

                            <!-- goal -->
                            <div class="form-group">
                                <label>Goal Value</label>
                                <div class="input-group">
                                    <input type="number"
                                           required="required"
                                           step="any"
                                           v-model="form.goal"
                                           placeholder="Goal Value"
                                           class="form-control">
                                    <div class="input-group-append">
                                        <select class="btn btn-outline-secondary"
                                                v-model="form.goalUnit">
                                            <option v-for="unit in ethUnits" :key="unit">{{ unit }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- duration -->
                            <div class="form-group">
                                <label>Donate Duration</label>

                                <div class="row">
                                    <div class="col-6">
                                        <div class="input-group input-group-sm">
                                            <input type="number"
                                                   min="0"
                                                   v-model="form.duration.days"
                                                   class="form-control">
                                            <div class="input-group-append">
                                                <span class="input-group-text">Days</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group input-group-sm">
                                            <select class="form-control" v-model="form.duration.hours">
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
                                            <select class="form-control" v-model="form.duration.minutes">
                                                <option :value="n - 1" v-for="n in 60" :key="n">{{ n - 1 }}</option>
                                            </select>
                                            <div class="input-group-append">
                                                <span class="input-group-text">Minutes</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group input-group-sm">
                                            <select class="form-control" v-model="form.duration.seconds">
                                                <option :value="n - 1" v-for="n in 60" :key="n">{{ n - 1 }}</option>
                                            </select>
                                            <div class="input-group-append">
                                                <span class="input-group-text">Seconds</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- alert messages -->
                            <div class="py-3">

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

                            <!-- submit button -->
                            <button type="submit" class="btn btn-lg btn-primary w-100">
                                <span v-if="status.isLoading" class="loader-ellipsis">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                                <span v-else>Create</span>
                            </button>
                        </fieldset>
                    </form>

                    <!-- require metamask alert -->
                    <div v-else class="text-danger">
                        <h5>No Metamask Account Found</h5>
                        <p>Please make sure you installed metamask on your browser to make transactions in this app.</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import ipfs from '../../library/ipfs';
    import AppSelectCategory from '../Elements/select-category';
    import { mapGetters } from 'vuex';

    const web3utils = require('web3-utils');
    const MINUTE = 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    export default {
        data() {
            return {
                form: {
                    name: '',
                    category: 0,
                    story: '',
                    goal: '',
                    goalUnit: 'ether',
                    imageFile: null,
                    imageSrc: null,
                    duration: {
                        days: 0,
                        hours: 0,
                        minutes: 0,
                        seconds: 0
                    }
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
        components: {
            AppSelectCategory
        },
        methods: {
            setFormImageFile(file) {
                let form = this.form;
                if(!file || !/^image\//.test(file.type)) file = null;
                form.imageFile = file;
                form.imageSrc = file? URL.createObjectURL(file) : null;
            },
            updateImageFile() {
                let vm = this;
                let file = vm.$refs.ImageFileSelect.files[0] || null;
                vm.setFormImageFile(file);
            },
            async submitForm() {
                let vm = this;
                let form = vm.form;
                let status = vm.status;
                let Contract = vm.$appFPContract;

                status.isLoading = true;
                status.errorMessage = '';
                status.successMessage = '';
                try {
                    let args = {
                        _name: web3utils.stringToHex(form.name),
                        _category: form.category,
                        _story: web3utils.stringToHex(form.story),
                        _imageHash: '',
                        _targetAmount: web3utils.toWei(form.goal.toString(), form.goalUnit),
                        _duration: form.duration.seconds
                    };
                    args._duration += form.duration.minutes * MINUTE;
                    args._duration += form.duration.hours * HOUR;
                    args._duration += form.duration.days * DAY;

                    if(!form.imageFile) throw new Error('Display Image is required.');
                    if(form.goal <= 0) throw new Error('Invalid goal.');
                    if(args._duration <= 0) throw new Error('Invalid duration.');
                    let imageHash = (await ipfs.add(form.imageFile))[0].hash;
                    args._imageHash = web3utils.stringToHex(imageHash);

                    let hash = await new Promise((resolve, reject) => {
                        Contract.createCampaign(args._name, args._category, args._story, args._imageHash, args._targetAmount, args._duration, {}, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });

                    form.name = '';
                    form.story = '';
                    form.goal = 0;
                    form.duration.days = 0;
                    form.duration.hours = 0;
                    form.duration.minutes = 0;
                    form.duration.seconds = 0;
                    vm.setFormImageFile(null);
                    status.successMessage = `Your transaction has been successfully submitted. Here is your tx hash: ${hash}`;
                }
                catch (error) {
                    status.errorMessage = vm.$appUtil.getErrorMessage(error);
                }
                status.isLoading = false;
            }
        }
    }
</script>