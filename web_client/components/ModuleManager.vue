<template>
  <v-container class="ModuleManager__container" v-u-loading="loading">
    <v-container grid-list-md>
      <component-row v-for="component in module.components"
                     v-bind:component="component"
                     v-bind:key="component.name"
                     v-bind:module="module"
                     v-bind:disabled="disabled" />
    </v-container>
    <v-alert color="error" icon="warning" v-bind:value="errorMessage">
      {{errorMessage}}
    </v-alert>
    <v-speed-dial bottom right hover="hover">
      <v-btn
        slot="activator"
        color="blue darken-2"
        dark
        fab
        hover
      >
        <v-icon>add</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="green"
        v-on:click="refreshComponentsWithLoading"
      >
        <v-icon>replay</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="green"
        v-on:click="onSaveConfiguration"
      >
        <v-icon>save</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-container>
</template>

<script>
    import Api from '../services/Api';
    import Module, {Component, PIN_MODE_ANALOG_IN, PIN_MODE_DIGITAL_IN} from '../modules/Module';

    export default {
        name: 'module-manager',
        props: {
            /** @type Module */
            module: {
                type: Module,
                required: false,
            },
        },
        created: async function() {
            this.moduleApi = Api.ModuleHub.getClients([this.module.name]);

            await  this.refreshComponentsWithLoading();
            setInterval(this.updateInputs.bind(this), 2000);
        },

        data() {
            return {
                disabled: false,
                errorMessage: null,
                loading: false,
            };
        },
        methods: {
            refreshComponents: async function() {
                const isConnected = await Api.UPythonUtilsHub.server.isUpythonConnected(this.module.name);
                if (isConnected) {
                    const components = (await this.moduleApi.getAllComponents())[this.module.name];
                    if (components.error || components.error_type) {
                        this.errorMessage = components.error || components.error_type;
                        return;
                    }
                    this.errorMessage = null;
                    components.map((component) => {
                        this._createOrUpdateComponent(component);
                    });
                }
            },

            refreshComponentsWithLoading: async function (){
                this.loading = true;
                try {
                    await this.refreshComponents();
                } finally {
                    this.loading = false;
                }
            },

            updateInputs: async function() {
                const inputComponents = this.module.components.filter(component => {
                    return [
                        PIN_MODE_DIGITAL_IN,
                        PIN_MODE_ANALOG_IN,
                    ].indexOf(component.mode) !== -1;
                });

                inputComponents.forEach(async component => {
                    const value = (await this.moduleApi.getComponentValue(component.name))[this.module.name];
                    if(value.error || value.error_type) {
                        return;
                    }
                    console.log(value);
                    component.value = value;
                })
            },

            onSaveConfiguration: async function() {
                this.loading = true;
                try {
                    await this.moduleApi.saveConfig();
                } catch (e) {
                    this.errorMessage = e.message;
                } finally {
                    this.loading = false;
                }
            },

            readSerial() {
                setInterval(async() => {
                    const serial = (await this.moduleApi.readSerial())[this.module.name];
                    console.log(serial);
                }, 5000);
            },

            _createOrUpdateComponent(componentData) {
                const foundComponent = this.module.components.find((component) => {
                    return component.name === componentData.name;
                });
                if (foundComponent) {
                    foundComponent.name = componentData.name;
                    foundComponent.pin = componentData.pin;
                    foundComponent.mode = componentData.mode;
                    foundComponent.value = componentData.value;
                }
                else {
                    this.module.components.push(new Component(
                        componentData.name,
                        componentData.pin,
                        componentData.mode,
                        componentData.value,
                    ));
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
  .ModuleManager {
    &__container {
      position: relative;
      min-height: 10rem;
      padding-bottom: 5rem;
      .speed-dial {
        position: absolute;
      }
    }
    &__loader-container {
      position: absolute;
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      top: 0;
      min-height: 3rem;
      &-shadow {
        position: absolute;
        min-height: 3rem;
        width: 100%;
        height: 100%;
        top: 0;
        background: aquamarine;
        opacity: 0.2;
      }
    }
  }

</style>