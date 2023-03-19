import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false


var baseUrl = window.location.origin
if (baseUrl.indexOf('https') === 0) {
    Vue.prototype.BASE_WS = process.env.VUE_APP_BASE_HTTP
} else if (baseUrl.indexOf('http') === 0) {
    Vue.prototype.BASE_WS = process.env.VUE_APP_BASE_HTTP
}

new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app')
