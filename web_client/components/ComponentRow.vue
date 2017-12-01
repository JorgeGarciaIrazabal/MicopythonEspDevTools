<template>
    <v-layout row>
        <v-flex xs12>
            <v-text-field
                name="componentName"
                label="Name"
                v-bind:value="component.name"
            ></v-text-field>
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
                v-on:change="refreshComponents"
            ></v-select>
        </v-flex>
        <v-flex xs12>
            <v-text-field
                name="input-1"
                label="Label Text"
                id="testing"
            ></v-text-field>
        </v-flex>
    </v-layout>

    <!--<div key={component.pin}>-->
    <!--<Divider/>-->
    <!--<div className={"ComponentContainer"}>-->
    <!--<div className={'ComponentLabel'}>-->
    <!--{`PIN ${component.pin}`}-->
    <!--</div>-->
    <!--<TextField-->
    <!--id={`pin${component.pin}`}-->
    <!--value={component.provisionalName}-->
    <!--onBlur={(event, name) => this.handleNameChange(component, name)}-->
    <!--onChange={(event, value) => component.provisionalName = value}-->
    <!--className={'ComponentName'}-->
    <!--/>-->
    <!--<DropDownMenu-->
    <!--value={component.mode}-->
    <!--onChange={(event, index, mode) => this.handleModeChange(component, mode)}-->
    <!--className={'ComponentMode'}-->
    <!--&gt;-->
    <!--<MenuItem value={0} primaryText="Digital IN"/>-->
    <!--<MenuItem value={1} primaryText="Digital OUT"/>-->
    <!--<MenuItem value={2} primaryText="Analog IN"/>-->
    <!--<MenuItem value={3} primaryText="Analog OUT"/>-->
    <!--</DropDownMenu>-->
    <!--{component.mode <= 1 && (<Toggle-->
    <!--toggled={!!component.value}-->
    <!--label={''}-->
    <!--onToggle={(event, value) => this.handleValueChange(component, value)}-->
    <!--className={'ComponentDigitalValue'}-->
    <!--style={{-->
    <!--width: "initial",-->
    <!--}}-->
    <!--/>)}-->
    <!--{component.mode > 1 && (<Slider-->
    <!--min={0}-->
    <!--max={1024}-->
    <!--step={1}-->
    <!--value={component.value}-->
    <!--onChange={(event, value) => this.handleValueChange(component, value)}-->
    <!--className={'ComponentAnalogValue'}-->
    <!--sliderStyle={{-->
    <!--marginTop: 0,-->
    <!--marginBottom: 0,-->
    <!--}}-->
    <!--/>)}-->
    <!--</div>-->
    <!--</div>-->
</template>

<script>
    import {Component, PIN_MODE_ANALOG_OUT, PIN_MODE_DIGITAL_OUT} from "../modules/Module";
    import Api from '../services/Api';

    export default {
        name: "component-row",
        created() {
            this.moduleApi = Api.ModuleHub.getClients(['upython']);
            debugger;
        },
        props: {
            /** @type Component */
            component: {
                type: Component,
                required: true
            },
        },
        data() {
            return {
                componentModes: [
                    {value: 0, text: "Digital IN"},
                    {value: 1, text: "Digital OUT"},
                    {value: 2, text: "Analog IN"},
                    {value: 3, text: "Analog OUT"},
                ]
            }
        },
        methods: {
            handleModeChange: async function (mode) {
                await this.moduleApi.changeComponentMode(this.component.name, mode);
                this.component.mode = mode;
            },

            handleValueChange: async function (value) {
                if (this.component.mode === PIN_MODE_DIGITAL_OUT || this.component.mode === PIN_MODE_ANALOG_OUT) {
                    await this.moduleApi.setComponentValue(this.component.name, value);
                    this.component.value = value;
                }
            },

            handleNameChange: async function () {
                await this.moduleApi.changeComponentName(this.component.name, this.component.provisionalName);
                this.component.name = this.component.provisionalName;
            },
        },
    }
</script>

<style scoped>

</style>