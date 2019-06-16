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
                this.isLoading = true;
                if(src) this.image.src = src;
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

    $tmp_size: 1em;
    @keyframes kf-loader-ellipsis1 {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes kf-loader-ellipsis2 {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate($tmp_size, 0);
        }
    }
    @keyframes kf-loader-ellipsis3 {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }
    .loader-ellipsis {
        display: inline-block;
        position: relative;
        height: $tmp_size * 0.7;
        width: ($tmp_size * 3) - ($tmp_size * 0.3);

        & > * {
            position: absolute;
            top: 0;
            width: $tmp_size * 0.7;
            height: $tmp_size * 0.7;
            border-radius: 50%;
            background: currentColor;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);

            &:nth-child(1) {
                left: 0;
                animation: kf-loader-ellipsis1 0.6s infinite;
            }
            &:nth-child(2) {
                left: 0;
                animation: kf-loader-ellipsis2 0.6s infinite;
            }
            &:nth-child(3) {
                left: $tmp_size;
                animation: kf-loader-ellipsis2 0.6s infinite;
            }
            &:nth-child(4) {
                left: $tmp_size * 2;
                animation: kf-loader-ellipsis3 0.6s infinite;
            }
        }
    }
</style>