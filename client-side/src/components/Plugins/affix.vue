<template>
    <div ref="Affix"
         :class="affix_class"
         :style="affix_style">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                affix_class: '',
                affix_top_offset: null,
                is_realm_reached: false,
                last_top_of_screen: 0,
                affix_style: {
                    width: '',
                    top: 0,
                    position: ''
                }
            };
        },
        props: {
            scrollContainerSelector: {
                type: String,
                default: null
            },
            relativeElementSelector: {
                type: String,
                required: true
            },
            fixedNavbarSelector: {
                type: String,
                default: null
            },
            topOffset: {
                type: Number,
                default: 0
            },
            bottomOffset: {
                type: Number,
                default: 0
            },
            enabled: {
                type: Boolean,
                default: true
            },
            inheritParentWidth: {
                type: Boolean,
                default: false
            },
            topClass: {
                type: String,
                default: 'affix-top'
            },
            middleClass: {
                type: String,
                default: 'affix-middle'
            },
            bottomClass: {
                type: String,
                default: 'affix-bottom'
            }
        },
        computed: {
            scroll_container() {
                if(this.scrollContainerSelector) {
                    let element = document.querySelector(this.scrollContainerSelector);
                    if(element) return element;
                }
                return window;
            },
            relative_element() {
                if(this.relativeElementSelector) {
                    let element = document.querySelector(this.relativeElementSelector);
                    if(element) return element;
                }
                return document.querySelector('*');
            },
            navbar_height() {
                if(this.fixedNavbarSelector) {
                    let element = document.querySelector(this.fixedNavbarSelector);
                    if(element) return element.clientHeight || 0;
                }
                return 0;
            }
        },
        methods: {
            resizeHandler() {
                let plugin = this;
                plugin.resetAffix();
                setTimeout(() => {
                    plugin.affix_top_offset = plugin.getOffsetTop(plugin.$refs.Affix);
                    plugin.scrollHandler();
                });
            },
            resetAffix() {
                this.is_realm_reached = false;
                this.affix_style.top = '';
                this.affix_style.position = '';
                this.affix_style.width = '';
                this.affix_class = '';
            },
            scrollHandler() {
                if(!this.$refs.Affix) {
                    return false;
                }
                if(!this.enabled) {
                    this.resetAffix();
                    return false;
                }

                let plugin = this;
                let top_offset = plugin.topOffset + plugin.navbar_height;
                let bottom_offset = plugin.bottomOffset;
                let affix_inner_height = plugin.$refs.Affix.clientHeight;
                let affix_outer_height = affix_inner_height + top_offset + bottom_offset;
                let realm_start_point = plugin.getOffsetTop(plugin.relative_element);
                let realm_end_point = realm_start_point + plugin.relative_element.clientHeight;
                let realm_height = realm_end_point - realm_start_point;
                let screen_height = plugin.scroll_container.clientHeight || window.innerHeight;
                let top_of_screen = plugin.scroll_container.scrollTop || window.pageYOffset;
                let scroll_top = top_of_screen + top_offset;
                let scrolling_up = plugin.last_top_of_screen > top_of_screen;
                let scrolling_down = plugin.last_top_of_screen < top_of_screen;
                let scroll_distance = Math.abs(top_of_screen - plugin.last_top_of_screen);
                if(plugin.affix_top_offset !== null) {
                    realm_start_point += (plugin.affix_top_offset - realm_start_point);
                    realm_height = realm_end_point - realm_start_point;
                }


                // reached start
                if(scroll_top > realm_start_point && realm_height > affix_outer_height) {
                    let top = parseFloat(plugin.affix_style.top || 0);
                    plugin.affix_style.position = 'fixed';
                    if(plugin.inheritParentWidth) {
                        plugin.affix_style.width = plugin.$refs.Affix.parentElement.clientWidth + 'px';
                    }

                    // scrolling affix
                    if(affix_outer_height > screen_height) {

                        // reached end
                        if((top + affix_outer_height - top_offset) + top_of_screen >= realm_end_point) {
                            top = realm_end_point - (affix_outer_height + top_of_screen) + top_offset;
                            plugin.affix_class = plugin.bottomClass;
                        }

                        // scrolling up
                        else if(scrolling_down) {
                            let min_top = (screen_height - affix_outer_height) + top_offset;
                            top -= scroll_distance;
                            if(top < min_top) top = min_top;
                            plugin.affix_class = plugin.middleClass;
                        }

                        // scrolling down
                        else if(scrolling_up) {
                            top += scroll_distance;
                            if(top > top_offset) top = top_offset;
                            plugin.affix_class = plugin.middleClass;
                        }
                    }

                    // no scrolling affix
                    else {

                        // reached end
                        if(affix_outer_height + top_of_screen >= realm_end_point) {
                            top = realm_end_point - (affix_outer_height + top_of_screen) + top_offset;
                            plugin.affix_class = plugin.bottomClass;
                        }

                        else {
                            top = top_offset;
                            plugin.affix_class = plugin.middleClass;
                        }
                    }



                    plugin.last_top_of_screen = top_of_screen;
                    plugin.affix_style.top = top + 'px';
                }
                else {
                    plugin.resetAffix();
                    plugin.affix_class = plugin.topClass;
                }

                // set affix top offset
                setTimeout(() => {
                    if(plugin.$refs.Affix.style.position !== 'fixed') {
                        plugin.affix_top_offset = plugin.getOffsetTop(plugin.$refs.Affix);
                    }
                });
            },
            getOffsetTop(element) {
                let yPosition = 0;
                let nextElement = element;
                while (nextElement) {
                    yPosition += (nextElement.offsetTop);
                    nextElement = nextElement.offsetParent;
                }
                return yPosition;
            }
        },
        mounted() {
            this.affix_top_offset = this.getOffsetTop(this.$refs.Affix);
            this.last_top_of_screen = this.scroll_container.scrollTop || window.pageYOffset;
            this.scrollHandler();

            this.scroll_container.addEventListener('scroll', this.scrollHandler);
            window.addEventListener('resize', this.resizeHandler);
        },
        beforeDestroy() {
            this.scroll_container.removeEventListener('scroll', this.scrollHandler);
            window.removeEventListener('scroll', this.resizeHandler);
        }
    }
</script>