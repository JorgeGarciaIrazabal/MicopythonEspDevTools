<template>
  <v-app>
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <toolbar></toolbar>
    <v-content>
      <module-tabs></module-tabs>
      <!--<module-manager></module-manager>-->
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
    >
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
    import Toolbar from '../components/Toolbar';
    import ComponentRow from '../components/ComponentRow';
    import ModuleManager from '../components/ModuleManager';
    import ModuleTabs from '../components/ModuleTabs';

    export default {
        components: {
            ModuleTabs,
            ModuleManager,
            ComponentRow,
            Toolbar,
        },
        data() {
            return {
                drawer: false,
                fixed: false,
                items: [
                    {icon: 'bubble_chart', title: 'Inspire'},
                ],
                right: true,
                rightDrawer: false,
                title: 'Vuetify.js',
            };
        },
    };
</script>
