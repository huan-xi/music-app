import Vue from 'vue'
import App from './App.vue'
import './style/common.css'
Vue.config.productionTip = false
import * as musicService from './common/service/MusicService'
import './plugins/element'

Vue.prototype.musicService = musicService;

new Vue({
  render: h => h(App),
}).$mount('#app')
