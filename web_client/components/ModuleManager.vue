<template>
    <v-container grid-list-md>
        <component-row v-for="component in module.components"
                       v-bind:component="component"
                       v-bind:key="component.name"
                       v-bind:module="module"
                       v-bind:disabled="disabled" />
    </v-container>
</template>

<script>
    import Api from '../services/Api';
    import Module, {Component} from '../modules/Module';

    export default {
        name: "module-manager",
        props: {
            /** @type Module */
            module: {
                type: Module,
                required: false
            },
        },
        created() {
            this.moduleApi = Api.ModuleHub.getClients([this.module.name]);
            this.refreshComponents()
        },
        data() {
            return {
                disabled: false,
            };
        },
        methods: {
            refreshComponents: async function() {
                const isConnected = await Api.UPythonUtilsHub.server.isUpythonConnected(this.module.name);
                console.log('Is Module connected', isConnected);
                if (isConnected) {
                    const components = await this.moduleApi.getAllComponents();
                    console.log(components);
                    const uPythonComponents = components[this.module.name];
                    uPythonComponents.map((component) => {
                        this.module.components.push(new Component(component.name, component.pin, component.mode, component.value))
                    });
                    console.log(uPythonComponents);
                }
            }
        }
    }
</script>

<style scoped>

</style>