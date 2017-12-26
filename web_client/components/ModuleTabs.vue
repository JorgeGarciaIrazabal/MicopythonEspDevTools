<template>
  <div>
    <v-tabs v-if="!loading" v-model="active" class="ModuleTabs__tabs">
      <v-tabs-bar class="cyan" dark>
        <v-tabs-item
          v-for="module in modules"
          :key="module.name"
          :href="'#' + module.name"
          ripple
        >
          {{ module.name }}
        </v-tabs-item>
        <v-tabs-slider color="white"></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-items>
        <v-tabs-content
          v-for="module in modules"
          :key="module.name"
          :id="module.name"
        >
          <module-manager v-bind:module="module"></module-manager>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>

    <v-container class="ModuleTabs__loader-container" v-else fluid grid-list-xl>
      <div class="spacer"></div>
      <v-progress-circular indeterminate size="100" color="primary" class="text-xs-center" />
      <div class="spacer"></div>
    </v-container>
    <v-snackbar
      :timeout=2000
      :color="snackbarColor"
      :vertical="false"
      v-model="snackbar"
    >
      {{snackbarText}}
      <v-btn dark icon flat @click.native="snackbar = false">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
    import Api from '../services/Api';
    import Module, {Component} from '../modules/Module';

    export default {
        name: 'module-tabs',

        async created() {
            try {
                const clientNames = await Api.UPythonUtilsHub.server.getUpythonClientIds();
                if (clientNames.length > 0) {
                    clientNames.map((name) => {
                        this.modules.push(new Module(name));
                    });

                    this.active = clientNames[0];
                }
            } catch (e) {
                this.setErrorText(e.message);
            } finally {
                this.loading = false;
            }
        },
        data() {
            return {
                active: 'test',
                modules: [],
                loading: true,
                snackbar: false,
                snackbarText: '',
                snackbarColor: 'error',
            };
        },
        methods: {
            setErrorText(text) {
                this.snackbar = true;
                this.snackbarText = text;
            },
        },

    };
</script>

<style lang="scss" scoped>
  .ModuleTabs {
    &__tabs {
      max-width: 50rem;
      margin: auto;
    }
    &__loader-container {
      display: flex;
    }
  }



  .progress-circular {
    flex-grow: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;

  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>