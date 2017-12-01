<template>
    <v-container grid-list-md>
        <component-row v-for="component in module.components" v-bind:component="component"></component-row>
    </v-container>
</template>

<script>
    import Api from '../services/Api';
    import Module, {Component} from "../modules/Module";

    export default {
        name: "module-manager",
        created() {
            this.moduleApi = Api.ModuleHub.getClients([this.module.name]);
            this.refreshComponents()
        },
        data() {
            return {
                /** @type Module */
                module: new Module("upython"),
            };
        },
        methods: {
            refreshComponents: async function() {
                const isConnected = await Api.UPythonUtilsHub.server.isUpythonConnected();
                console.log('Is Module connected', isConnected);
                if (isConnected) {
                    const components = await this.moduleApi.getAllComponents();
                    console.log(components);
                    debugger;
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