import Vue from 'vue'
import ElementUI from 'element-ui';
import App from './App.vue'
import axios from './http'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = axios; // 在vue组件中使用axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
