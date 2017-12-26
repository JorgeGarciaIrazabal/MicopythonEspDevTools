<template>
  <v-layout row>
    <v-flex xs12>
      <v-text-field
        v-bind:disabled="loading || disabled"
        name="componentName"
        label="Name"
        v-model="component.provisionalName"
        v-on:change="debounceHandleNameChange"
      />
    </v-flex>
    <v-flex xs12>
      <v-select
        v-bind:items="componentModes"
        v-model="component.mode"
        label="Select"
        single-line
        bottom
        item-text="text"
        item-value="value"
        v-on:change="handleModeChange"
        v-bind:disabled="loading || disabled"
      />
    </v-flex>
    <v-flex xs12>
      <component :is="componentTag"
                 v-model="component.value"
                 :disabled="isInputDisabled()"
                 v-on:change="handleValueChange"
                 v-on:input="debounceHandleValueChange"
                 max="1024"
      />
    </v-flex>
    <v-flex xs3>
      <v-progress-circular v-show="loading" indeterminate size="50" color="primary" class="text-xs-center" />
    </v-flex>
  </v-layout>
</template>

<script>
    import Module, {Component, PIN_MODE_ANALOG_OUT, PIN_MODE_DIGITAL_IN, PIN_MODE_DIGITAL_OUT, PIN_MODE_ANALOG_IN} from '../modules/Module';
    import Api from '../services/Api';
    import debounce from 'lodash/debounce';

    export default {
        name: 'component-row',
        created() {
            this.moduleApi = Api.ModuleHub.getClients([this.module.name]);
            this._getComponentTag();
            this.debounceHandleValueChange = debounce(this.handleValueChange, 300);
            this.debounceHandleNameChange = debounce(this.handleNameChange, 300);
            this.updateIntervalId = setInterval(this._updateInput, 2000);
        },
        destroyed() {
            clearInterval(this.updateIntervalId);
        },
        props: {
            /** @type Component */
            component: {
                type: Component,
                required: true,
            },
            /** @type Module */
            module: {
                type: Module,
                required: true,
            },
            /** @type Boolean */
            disabled: {
                type: Boolean,
                required: true,
            },
        },
        data() {
            return {
                componentModes: [
                    {value: 0, text: 'Digital IN'},
                    {value: 1, text: 'Digital OUT'},
                    {value: 2, text: 'Analog IN'},
                    {value: 3, text: 'Analog OUT'},
                ],
                loading: false,
                componentTag: null,
            };
        },

        watch: {


        },

        methods: {
            handleModeChange: async function(mode) {
                try {
                    this.loading = true;
                    const result = (await this.moduleApi
                        .changeComponentMode(this.component.name, mode))[this.module.name];
                    if (result && result.error) {
                        throw new Error(result.error);
                    }
                } catch (e) {
                    console.warn(e.message);
                    this.$parent.$parent.$parent.$parent.$parent.setErrorText(e.message);
                } finally {
                    this.loading = false;
                }
                this.component.mode = mode;
                this._getComponentTag();
            },

            handleValueChange: async function(value) {
                if (this.component.isOutput()) {
                    console.log(value);
                    this.loading = true;
                    await this.moduleApi.setComponentValue(this.component.name, value);
                    this.loading = false;
                    this.component.value = value;
                }
            },

            handleNameChange: async function() {
                await this.moduleApi.changeComponentName(this.component.name, this.component.provisionalName);
                this.component.name = this.component.provisionalName;
            },

            isInputDisabled() {
                return this.component.isInput();
            },

            _getComponentTag() {
                switch (this.component.mode) {
                    case PIN_MODE_DIGITAL_OUT:
                    case PIN_MODE_DIGITAL_IN:
                        this.componentTag = 'v-switch';
                        break;
                    case PIN_MODE_ANALOG_OUT:
                    case PIN_MODE_ANALOG_IN:
                        this.componentTag = 'v-slider';
                        break;
                }
            },

            _updateInput: async function() {
                if (this.component && this.component.isInput()) {
                    const value = (await this.moduleApi.getComponentValue(this.component.name))[this.module.name];
                    if (value.error || value.error_type) {
                        return;
                    }
                    this.component.value = value;
                }
            },
        },
    };
</script>

<style scoped>

</style>