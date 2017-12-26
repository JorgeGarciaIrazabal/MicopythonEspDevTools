import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';

import Toolbar from '../components/Toolbar';
import ComponentRow from '../components/ComponentRow';
import ModuleManager from '../components/ModuleManager';
import ModuleTabs from '../components/ModuleTabs';
import ULoader from '../components/ULoader';
import u_loading from '../directives/loading';

Vue.component('toolbar', Toolbar);
Vue.component('component-row', ComponentRow);
Vue.component('module-manager', ModuleManager);
Vue.component('module-tabs', ModuleTabs);
Vue.component('u-loader', ULoader);
Vue.directive('u-loading', u_loading);

Vue.use(Vuetify);

new Vue({
    el: '#app',
    render: h => h(App)
});
