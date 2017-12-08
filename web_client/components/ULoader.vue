<template>
  <div class="ULoader__container" v-show="loading">
    <v-flex class="text-xs-center">
      <v-progress-circular indeterminate :size="size" :color="color" />
    </v-flex>
    <div class="ULoader__container-shadow"></div>
  </div>
</template>

<script>
    export default {
        name: 'u-loader',
        props: {
            /** @type Boolean */
            loading: {
                type: Boolean,
                required: false,
                default: false,
            },
            /** @type Number */
            size: {
                type: Number,
                required: false,
                default: 50,
            },
            /** @type String */
            color: {
                type: String,
                required: false,
                default: 'primary',
            },
        },
    };
</script>

<style lang="scss" scoped>

  .ULoader {
    &__container {
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
        background: darkgrey;
        opacity: 0.2;
      }
    }
  }

</style>