import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import OverlayPanel from 'primevue/overlaypanel'

// PrimeVue theme imports - make sure these come AFTER installing primeicons
import 'primeicons/primeicons.css' // Icons
import Aura from '@primeuix/themes/aura' // Aura theme preset
import { useAppStore } from './stores/appStore'

import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(ToastService)

app.component('Button', Button)
app.component('InputText', InputText)
app.component('Checkbox', Checkbox)
app.component('OverlayPanel', OverlayPanel)

app.mount('#app')

const appStore = useAppStore()
appStore.init()
