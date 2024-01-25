import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 先將model變數放最外層以便取用
let productModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "newhandarky",
      products: [],
      pagination: {},  // 增加分頁資訊
      tempProduct: {
        imagesUrl: []
      },
    }
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url).then((res) => {
        // 驗證完畢後取得產品列表
        this.getData()
      }).catch((err) => {
        Swal.fire({
          title: `${err.data.message}`,
          icon: "error",
        }).then(() => {
          location = "./login.html"
        });
      })
    },

    // 預設抓第一頁資料
    getData(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url).then((res) => {
        this.products = res.data.products
        // 存入回傳的分頁資訊
        this.pagination = res.data.pagination
      }).catch((err) => {
        Swal.fire({
          title: `${err.data.message}`,
          icon: "error",
        })
      })
    },

    addModel() {
      this.tempProduct = {
        imagesUrl: []
      },
        productModal.show()
    },

    editModel(product) {
      this.tempProduct = { ...product }
      productModal.show()
    },

    delModel(product) {
      this.tempProduct = product 
      delProductModal.show()
    },
  },
  mounted() {
    // 從cookie取出登入時存入的token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    // 將token設定到axios的預設header裡
    axios.defaults.headers.common.Authorization = token;
    // 確認登入狀態
    this.checkAdmin();
  },
})

// 分頁元件
app.component('paginationCom', {
  // template 對應 #pagination-com 的 script
  template: '#pagination-com',
  props: ['pages'],
  methods: {
    emitPages(item) {
      this.$emit('emit-pages', item)
    }
  }
})

app.component('productModalCom', {
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "newhandarky",
      defaultImageUrl: "https://www.ils.com.tw/zh/Up_files/webskin/RWD/include/images/type3album_blank.png",
    }
  },
  template: '#product-modal',
  props: ['product'],
  methods: {
    addProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      // 若是沒有ID改呼叫編輯
      if (this.product.id) {
        this.updateProduct();
      } else {
        axios.post(url, { data: this.product }).then((res) => {
          Swal.fire({
            title: "新增成功",
            icon: "success",
          }).then(() => {
            this.$emit('updatedProduct')
            productModal.hide()
          });
        }).catch((err) => {
          Swal.fire({
            title: `${err.data.message}`,
            icon: "error",
          })
        })
      }
    },

    updateProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
      axios.put(url, { data: this.product }).then((res) => {
        Swal.fire({
          title: "修改成功",
          icon: "success",
        }).then(() => {
          // 將修改完的事件傳回給根元件
          this.$emit('updatedProduct')
          productModal.hide()
        });
      }).catch((err) => {
        Swal.fire({
          title: `${err.data.message}`,
          icon: "error",
        })
      })
    },
    createImages() {
      this.tempProduct.imagesUrl = [""];
    },
  },
  mounted() {
    // 綁定編輯的model
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
  },
})

app.component('deleteModelCom', {
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "newhandarky"
    }
  },
  props: ['product'],
  template: '#delete-modal',
  methods: {
    deleteProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
      axios.delete(url).then((res) => {
        Swal.fire({
          title: "刪除成功",
          icon: "success",
        }).then(() => {
          // 將刪除完的事件傳回給根元件
          this.$emit('deletedProduct')
          delProductModal.hide()
        });
      }).catch((err) => {
        Swal.fire({
          title: `${err.data.message}`,
          icon: "error",
        })
      })
    },
  },
  mounted() {
    // 綁定刪除的model
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });
  }
})

app.mount("#app")