<template class="Toolbar">
    <v-toolbar fixed app color="primary">
        <v-btn icon v-on:click="miniVariant = !miniVariant">
            <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
        </v-btn>
        <v-toolbar-title v-text="title" class="white--text"></v-toolbar-title>
    </v-toolbar>
</template>

<script>
    export default {
        name: "toolbar",
        data() {
            return {
                miniVariant: false,
                title: 'Handle you ESP module'
            }
        },
        methods: {
        }
    }
</script>

<style scoped>
</style>