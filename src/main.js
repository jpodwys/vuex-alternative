import Vue from 'vue'
import App from './App.vue'
import store from '@/js/store';

Vue.config.productionTip = false

// window.store = store;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
