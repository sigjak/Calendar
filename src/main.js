import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import VueTextareaAutosize from "vue-textarea-autosize"
import VueTimepicker from "vue2-timepicker"
import "vue2-timepicker/dist/VueTimepicker.css"

import axios from "axios"
Vue.use(VueTextareaAutosize)

Vue.component("VueTimepicker", VueTimepicker)

let base = ""
if (process.env.NODE_ENV == "development") {
  base = axios.create({
    baseURL: "http://localhost/snatPHP/"
  })
} else {
  base = axios.create({
    baseURL: "https://microprobe.hi.is/xxxxxx/",
    headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" }
  })
}

Vue.prototype.$http = base

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app")
