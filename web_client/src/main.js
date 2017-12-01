import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import Toolbar from '../components/Toolbar'
import ComponentRow from '../components/ComponentRow'
import ModuleManager from '../components/ModuleManager'

Vue.component('toolbar', Toolbar);
Vue.component('component-row', ComponentRow);
Vue.component('module-manager', ModuleManager);

Vue.use(Vuetify);

new Vue({
    el: '#app',
    render: h => h(App)
});