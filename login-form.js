export default {
  data() {
    return {
      user: {
        username: "",
        password: ""
      }
    }
  },
  template: `
  <form id="form" class="form-signin">
    <div class="form-floating mb-3">
      <input type="email" class="form-control" id="username" v-model="user.username"
        placeholder="name@example.com" required autofocus>
      <label for="username">Email address</label>
    </div>
    <div class="form-floating">
      <input type="password" class="form-control" id="password" v-model="user.password" placeholder="Password"
        required>
      <label for="password">Password</label>
    </div>
    <button class="btn btn-lg btn-primary w-100 mt-3" @click.prevent="login" type="submit">登入</button>
  </form>
  `,
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
          Swal.fire({
            title: `${err.data.message}`,
            text: "請檢察您的帳號密碼",
            icon: "error",
          })
        })
    }
  }
}