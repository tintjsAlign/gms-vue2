// src/store/index.ts
// import { createPinia } from 'pinia'
// import piniaPluginPersist from 'pinia-plugin-persist'

// const store = createPinia()
// store.use(piniaPluginPersist)

// export default store
import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

export default pinia
