import Vue from 'vue'

import {
  BootstrapVue, ToastPlugin, ModalPlugin, IconsPlugin,
} from 'bootstrap-vue'

import VueCompositionAPI from '@vue/composition-api'
import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'

// Mixins
import { mixinAlerts } from './utils/mixins/alerts'
import { mixinErrors } from './utils/mixins/errors'

// BSV Plugin Registration
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// Mixins
Vue.mixin(mixinAlerts)
Vue.mixin(mixinErrors)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
