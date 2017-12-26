<template class="Toolbar">
    <v-toolbar fixed app color="primary">
        <v-toolbar-title v-text="title" class="white--text"></v-toolbar-title>
    </v-toolbar>
</template>

<script>
    export default {
        name: "toolbar",
        data() {
            return {
                title: 'ESP module Manager'
            }
        },
        methods: {
        }
    }
</script>

<style scoped>
</style>