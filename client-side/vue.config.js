module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/assets/scss/_variables.scss";
                    @import "@/assets/scss/bootstrap/_functions.scss";
                    @import "@/assets/scss/bootstrap/_variables.scss";
                    @import "@/assets/scss/bootstrap/_mixins.scss";
                `
            }
        }
    }
};