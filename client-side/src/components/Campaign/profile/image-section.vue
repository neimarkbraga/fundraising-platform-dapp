<template>
    <div>

        <!-- update -->
        <div v-if="updateMode">

            <!-- image preview -->
            <app-image-box :src="form.imageSrc" class="bg-muted" />

            <!-- update form -->
            <form @submit.prevent="saveImage" class="py-3 px-4 border-bottom">
                <fieldset :disabled="status.isLoading">

                    <!-- image file input -->
                    <div class="form-group">
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

                    <!-- error message -->
                    <div v-if="status.errorMessage"
                         style="overflow: auto"
                         class="alert alert-danger mt-3">
                        <button class="close"
                                @click.prevent="status.errorMessage = ''"
                                type="button">&times;</button>
                        <p class="m-0">{{ status.errorMessage }}</p>
                    </div>

                    <!-- action buttons -->
                    <div class="row">
                        <!-- cancel -->
                        <div class="col-4">
                            <button type="button"
                                    @click.prevent="setUpdateMode(false)"
                                    class="btn btn-outline-primary w-100">Cancel</button>
                        </div>

                        <!-- save -->
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
                                <span v-else>Save Image</span>
                            </button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>

        <!-- display -->
        <div class="position-relative" v-else>

            <!-- image -->
            <app-image-box :src="ipfsGateway + profile.imageHash" />

            <!-- update button -->
            <button type="button"
                    v-if="isOwner && !updateMode"
                    @click.prevent="setUpdateMode(true)"
                    class="btn btn-sm btn-primary position-absolute shadow-sm"
                    style="top: 1em; right: 1em;">
                Update Image
            </button>
        </div>

        <!-- success message -->
        <div v-if="status.successMessage" class="pt-3 px-4">
            <div style="overflow: auto" class="alert alert-success">
                <button class="close"
                        @click.prevent="status.successMessage = ''"
                        type="button">&times;</button>
                <p class="m-0">{{ status.successMessage }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import ipfs from '../../../library/ipfs';
    import { mapGetters } from 'vuex';

    const web3utils = require('web3-utils');

    export default {
        props: ['profile'],
        data() {
            return {
                updateMode: false,
                form: {
                    imageFile: null,
                    imageSrc: null
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
                ipfsGateway: 'config/ipfsGateway'
            }),
            isOwner() {
                let user = this.user;
                let profile = this.profile;
                if(user && profile) return user.address.toLowerCase() === profile.owner.toLowerCase();
                return false;
            }
        },
        methods: {
            setUpdateMode(update) {
                this.updateMode = update;
                if(update) {
                    this.status.errorMessage = '';
                    this.status.successMessage = '';
                    this.setFormImageFile(null);
                }
            },
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
            async saveImage() {
                let form = this.form;
                let status = this.status;
                let profile = this.profile;
                let Contract = this.$appFPContract;

                status.isLoading = true;
                status.errorMessage = '';
                status.successMessage = '';
                try {
                    if(!form.imageFile) throw new Error('Image file is required.');
                    let imageHash = (await ipfs.add(form.imageFile))[0].hash;
                    let hash = await new Promise((resolve, reject) => {
                        Contract.updateImageHash(profile.id, web3utils.stringToHex(imageHash), {}, (error, result) => {
                            if(error) reject(error);
                            else resolve(result);
                        });
                    });
                    status.successMessage = `Transaction sent! Image will update if transaction is successful after being mined. Your Tx Hash is ${hash}`;
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