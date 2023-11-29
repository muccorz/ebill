import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'; 
import 'element-ui/lib/theme-chalk/index.css';
import 'jquery/dist/jquery.min'
import 'bootstrap/dist/css/bootstrap.css'
import './plugins/element.js'
import router from './router'
import request from './utils/axios'



Vue.prototype.$http = request
Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
