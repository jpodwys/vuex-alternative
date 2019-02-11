import Vue from 'vue'
import App from './App.vue'
import vstore from '@/js/v-store';
import store from '@/js/v-store/store';

Vue.config.productionTip = false

window.store = store;

Vue.use(vstore);

new Vue({
  store,
  sup: { a: 'b' },
  render: h => h(App),
}).$mount('#app')
