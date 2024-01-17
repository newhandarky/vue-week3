import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 先將model變數放最外層以便取用
let productModal = null;
let delProductModal = null;

createApp({
    data() {
        return {
            //       https://ec-course-api.hexschool.io/v2/api/newhandarky/admin/product
            apiUrl: "https://vue3-course-api.hexschool.io/v2",
            apiPath: "newhandarky",
            products: [],
            tempProduct: {
                imagesUrl: []
            },
            defaultImageUrl: "https://www.ils.com.tw/zh/Up_files/webskin/RWD/include/images/type3album_blank.png",
        }
    },
    mounted() {
        // 綁定編輯的model
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
        // 綁定刪除的model
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });
        // 從cookie取出登入時存入的token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        // 將token設定到axios的預設header裡
        axios.defaults.headers.common.Authorization = token;
        // 確認登入狀態
        this.checkAdmin();
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
                })
            })
        },

        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
            axios.get(url).then((res) => {
                this.products = res.data.products
            }).catch((err) => {
                Swal.fire({
                    title: `${err.data.message}`,
                    icon: "error",
                }).then(() => {
                    location = "./login.html"
                });
            })
        },
        
        toggleUpdateModel(str) {
            str === "show" ? productModal.show() : productModal.hide();
        },

        toggleDeleteModel(str) {
            str === "show" ? delProductModal.show() : delProductModal.hide();
        },

        addModel() {
            this.tempProduct = {
                imagesUrl: []
            },
                this.toggleUpdateModel("show");
        },

        editModel(product) {
            this.tempProduct = { ...product }
            this.toggleUpdateModel("show");
        },

        delModel(product) {
            this.tempProduct = { ...product }
            this.toggleDeleteModel("show");
        },

        addProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            // 若是沒有ID改呼叫編輯
            if (this.tempProduct.id) {
                this.updateProduct();
            } else {
                axios.post(url, { data: this.tempProduct }).then((res) => {
                    Swal.fire({
                        title: "新增成功",
                        icon: "success",
                    }).then(() => {
                        this.getData();
                        this.toggleUpdateModel();
                    });
                }).catch((err) => {
                    Swal.fire({
                        title: `${err.data.message}`,
                        icon: "error",
                    })
                })
            }
        },

        deleteProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url).then((res) => {
                Swal.fire({
                    title: "刪除成功",
                    icon: "success",
                }).then(() => {
                    this.getData()
                    this.toggleDeleteModel();
                });
            }).catch((err) => {
                Swal.fire({
                    title: `${err.data.message}`,
                    icon: "error",
                })
            })
        },

        updateProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.put(url, { data: this.tempProduct }).then((res) => {
                Swal.fire({
                    title: "修改成功",
                    icon: "success",
                }).then(() => {
                    this.getData()
                    this.toggleUpdateModel();
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
    }
}).mount("#app")