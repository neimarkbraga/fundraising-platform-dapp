<template>
    <div>
        <div class="form-control text-muted" v-if="status.isLoading || status.isError">
            <div v-if="status.isLoading">
                <span class="loader-ellipsis">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>

            <div v-if="status.isError">
                Something went wrong.
                <a href="#" @click.prevent="loadCategories">
                    Retry
                </a>
            </div>
        </div>
        <div v-else>
            <select class="form-control"
                    @change="$emit('input', selected)"
                    v-model="selected">
                <option v-if="nullName" :value="null">{{ nullName }}</option>
                <option :value="id" v-for="(category, id) in categories" :key="id">{{ category.name }}</option>
            </select>
            <small v-if="showDescription && selectedCategory && selectedCategory.description" class="form-text text-muted">{{ selectedCategory.description }}</small>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        props: ['value', 'showDescription', 'nullName'],
        data() {
            return {
                selected: null,
                status: {
                    isLoading: true,
                    isError: false
                },
                categories: {}
            };
        },
        computed: {
            selectedCategory() {
                let vm = this;
                let categories = vm.categories;
                let selected = vm.selected;
                return categories[selected] || null;
            }
        },
        watch: {
            value() {
                this.updateSelected();
            }
        },
        methods: {
            updateSelected() {
                if(this.selected !== this.value) {
                    this.selected = this.value;
                }
            },
            async loadCategories() {
                let vm = this;
                let status = vm.status;
                status.isLoading = true;
                status.isError = false;
                try {
                    let response = await axios.get('/category');
                    vm.categories = {};
                    response.data.forEach(category => vm.categories[category.id] = category);
                }
                catch (error) {
                    status.isError = true;
                }
                status.isLoading = false;
            }
        },
        created() {
            this.updateSelected();
            this.loadCategories();
        }
    }
</script>