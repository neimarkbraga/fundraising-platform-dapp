<template>
    <div class="bubble-wrapper">


        <div v-show="isOpen" class="bubble-content bg-dark rounded text-white">
            <div class="px-3 py-2">
                <h5 class="m-0">Configurations</h5>
            </div>
            <div class="p-4">
                <form @submit.prevent="save">
                    <div class="form-group">
                        <label>IPFS Gateway</label>
                        <input type="url"
                               required="required"
                               v-model="form.ipfsGateway"
                               placeholder="IPFS Gateway"
                               list="IpfsGateways"
                               class="form-control" />
                    </div>

                    <div class="form-group">
                        <label>IPFS Client</label>
                        <select class="form-control" v-model="form.ipfsClient">
                            <option v-for="option in ipfsClientOptions"
                                    :value="option"
                                    :key="option">
                                {{ option }}
                            </option>
                        </select>
                    </div>

                    <div class="row mt-4">
                        <div class="col-5">
                            <button type="button"
                                    @click.prevent="setOpen(false)"
                                    class="btn btn-sm btn-outline-light w-100">
                                Cancel
                            </button>
                        </div>
                        <div class="col-7">
                            <button type="submit"
                                    class="btn btn-sm btn-primary w-100">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <datalist id="IpfsGateways">
            <option value="https://ipfs.infura.io/ipfs/"></option>
            <option value="https://cloudflare-ipfs.com/ipfs/"></option>
            <option value="https://ipfs.iamneimark.com/ipfs/"></option>
            <option value="https://gateway.ipfs.io/ipfs/"></option>
            <option value="https://ipfs.io/ipfs/"></option>
            <option value="http://localhost:8080/ipfs/"></option>
        </datalist>

        <div class="bubble shadow-sm"
             @click.prevent="setOpen(true)"
             v-show="!isOpen">
            <i class="fas fa-sliders-h"></i>
        </div>
    </div>
</template>

<script>
    import AppIPFS from '../../library/ipfs';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                isOpen: false,
                form: {
                    ipfsGateway: '',
                    ipfsClient: ''
                },
                ipfsClientOptions: Object.keys(AppIPFS.clients)
            };
        },
        computed: {
            ...mapGetters({
                user: 'user/data',
                ipfsGateway: 'config/ipfsGateway'
            })
        },
        methods: {
            setOpen(open) {
                this.isOpen = open;
                if(open) {
                    this.form.ipfsGateway = this.ipfsGateway;
                    this.form.ipfsClient = AppIPFS.getSelectedClientName();
                }
            },
            save() {
                let form = this.form;
                let store = this.$store;


                // ipfs gateway
                let ipfsGateway = form.ipfsGateway;
                if(!/\/$/.test(ipfsGateway)) ipfsGateway += '/';
                window.localStorage.setItem('ipfsGateway', ipfsGateway);
                store.dispatch('config/ipfsGateway', ipfsGateway);

                // ipfs client
                AppIPFS.setSelectedClientName(form.ipfsClient);

                this.setOpen(false);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bubble-wrapper {
        width: 0;
        height: 0;
        position: fixed;
        bottom: 3.5em;
        right: 2em;
        z-index: 1000;

        .bubble {
            @include transition();
            cursor: pointer;
            position: absolute;
            width: 2.5em;
            height: 2.5em;
            border-radius: 2.5em;
            bottom:  100%;
            right: 100%;
            background-color: $dark;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: scale(0.9);

            &:hover {
                transform: scale(1);

            }
        }

        .bubble-content {
            position: absolute;
            bottom:  100%;
            right: 100%;
            width: 400px;
            max-width: 85vw;
            max-height: 70vh;
        }
    }
</style>