/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import {createPinia} from 'pinia'
import router from '@/router'
import '@/styles/index.css'

const pinia = createPinia()
export function registerPlugins (app) {
  app
    .use(router)
    .use(pinia)
    // .use(PrimeVue, {unstyled: true})
}
