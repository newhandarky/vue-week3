import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
// import 拆至外部的元件
import loginForm from './login-form.js';

createApp({
  data() {
    return {
      user: {
      }
    }
  },
  components: {
    loginForm
  },
  methods: {
  },
}).mount('#app');