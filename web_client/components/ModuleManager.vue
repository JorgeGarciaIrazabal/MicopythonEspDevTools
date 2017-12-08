<template>
  <div class="ModuleManager__container">
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
    <div class="ModuleManager__loader-container" v-show="loading">
      <v-flex class="text-xs-center">
        <v-progress-circular indeterminate size="50" color="primary" />
      </v-flex>
      <div class="ModuleManager__loader-container-shadow"></div>
    </div>
  </div>
</template>

<script>
    import Api from '../services/Api';
    import Module, {Component} from '../modules/Module';

    export default {
        name: 'module-manager',
        props: {
            /** @type Module */
            module: {
                type: Module,
                required: false,
            },
        },
        created() {
            this.moduleApi = Api.ModuleHub.getClients([this.module.name]);
            setInterval(async() => {
                await this.refreshComponents();
            }, 2000);
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
                this.loading = true;
                try {
                    const isConnected = await Api.UPythonUtilsHub.server.isUpythonConnected(this.module.name);
                    if (isConnected) {
                        const components = (await this.moduleApi.getAllComponents())[this.module.name];
                        if (components.error) {
                            this.errorMessage = 'testing';
                            return;
                        }
                        this.errorMessage = null;
                        components.map((component) => {
                            this._createOrUpdateComponent(component);
                        });
                    }
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
      min-height: 5rem;
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