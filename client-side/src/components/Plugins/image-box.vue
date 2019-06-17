<template>
    <div class="image-wrapper">
        <div class="image-box"
             :data-src="src"
             :style="{backgroundImage: `url(${finalSrc})`}">
            <slot></slot>
        </div>

        <div v-if="isLoading" class="image-center-overlay text-white small">
            <div class="loader-ellipsis">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                finalSrc: '',
                isLoading: false,
                image: new Image()
            };
        },
        props: {
            src: {
                type: String,
                default: ''
            }
        },
        watch: {
            src() {
                if(this.finalSrc !== this.src) {
                    this.loadImage(this.src);
                }
            }
        },
        methods: {
            loadImage(src) {
                this.finalSrc = '';
                if(src) {
                    this.isLoading = true;
                    this.image.src = src;
                }
            }
        },
        created() {
            let vm = this;
            let image = vm.image;
            image.onload = function () {
                vm.finalSrc = image.src;
                vm.isLoading = false;
            };
            image.onerror = function () {
                vm.isLoading = false;
            };
            vm.loadImage(this.src);
        }
    }
</script>

<style lang="scss" scoped>
    .image-wrapper {
        display: block;
        position: relative;
        width: 100%;
        padding-top: 56.25%;
        background-color: black;

        .image-box {
            width:  100%;
            height: 100%;
            background-size: cover;
            padding: 0;
            margin: 0;
            overflow: hidden;
            position: absolute;
            top: 0;
            right: auto;
            bottom: auto;
            left: 0;
            z-index: 0;
        }

        .image-center-overlay {
            position: absolute;
            z-index: 1;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
    }
</style>