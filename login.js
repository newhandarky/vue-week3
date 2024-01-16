import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    data(){
        return{
            user: {
                username: "",
                password: ""
            }
        }
    },
    methods: {
        
    },
}).mount('#app');