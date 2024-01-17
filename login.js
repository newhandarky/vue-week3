import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    data() {
        return {
            user: {
                username: "",
                password: ""
            }
        }
    },
    methods: {
        login() {
            const api = "https://vue3-course-api.hexschool.io/v2/admin/signin";

            axios.post(api, this.user)
                .then((res) => {
                    const { token, expired } = res.data;
                    Swal.fire({
                        title: "登入成功",
                        text: "歡迎您回來",
                        icon: "success",
                    }).then(() => {
                        // 將 token 與 expired 設定好到期時間存入cookie
                        document.cookie = `hexToken=${token}; expired=${new Date(expired)}; path=/`;
                        location = "./product.html";
                    });
                }).catch((err) => {
                    console.dir(err);
                    Swal.fire({
                        title: `${err.data.message}`,
                        text: "請檢察您的帳號密碼",
                        icon: "error",
                    })
                })
        }
    },
}).mount('#app');