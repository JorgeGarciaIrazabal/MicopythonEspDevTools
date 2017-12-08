import Vue from 'vue';

export default {
    bind(el, binding, vnode) {
        console.log(binding);
        const Hello = {
            props: ['loading'],
            template: '<u-loader :loading="loading"></u-loader>',
        };

        const LoadingComponent = Vue.extend(Hello);
        el.__loadingComponent = new LoadingComponent({
            propsData: {
                loading: binding.value,
            },
        }).$mount();
        el.appendChild(el.__loadingComponent.$el);
    },
    update(el, binding) {
        el.__loadingComponent.loading = binding.value;
    },
};