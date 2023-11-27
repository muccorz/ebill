<template>
   

   <div>
    <el-menu>
      <el-menu-item @click="changeTab('billType')" :class="{ 'is-active': currentTab === 'billType' }">
        帳票種類
      </el-menu-item>
      <el-menu-item @click="changeTab('customer')" :class="{ 'is-active': currentTab === 'customer' }">
        取引先
      </el-menu-item>
    </el-menu>

    <div v-if="currentTab === 'billType'">
        <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>帳票種類</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="addBillType">新規</el-button>
                </div>
                <div v-for="billType in billTypes" :key="billType.billTypeno" class="text item d-flex "
                    style="justify-content: space-between">
                    <div>{{billType.billType}}</div>
                    <el-button size="mini" type="danger" icon="el-icon-delete"
                        @click="deleteBillType(billType.billTypeno)">削除</el-button>
                </div>
            </el-card>
    </div>

    <div v-if="currentTab === 'customer'">
        <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>取引先</span>
                    <el-button style="float: right; padding: 3px 0" type="text"
                        @click="dialogFormVisible= true">新規</el-button>
                    <el-dialog title="取引先新規" :visible.sync="dialogFormVisible" @closed="customerInit">
                        <el-form :model="customer">
                            <el-form-item label="取引先">
                                <span class="text-danger" style="font-size: 12px;" v-if="flag1">取引先を入力してください</span>
                                <el-input v-model="customer.customer" autocomplete="off"
                                    @blur="customerBlur"></el-input>
                            </el-form-item>
                            <el-form-item label="取引先種類">
                                <span class="text-danger" style="font-size: 12px;" v-if="flag2">取引先種類を入力してください</span>
                                <el-select v-model="customer.customerType" filterable allow-create default-first-option
                                    class="w-100" placeholder="取引先種類を選択してください">
                                    <el-option v-for="customerType in customerTypes" :key="customerType.customerType"
                                        :label="customerType.customerType" :value="customerType.customerType">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">キャンセル</el-button>
                            <el-button type="primary" @click="addCustomer" :disabled="addCustomerBt">追 加</el-button>
                        </div>
                    </el-dialog>
                </div>
                <div v-for="customer in customers" :key="customer.customerno" class="text item d-flex "
                    style="justify-content: space-between">
                    <div style="width: 120px;">{{customer.customer}}</div>
                    <div>{{customer.customerType}}</div>
                    <el-button size="mini" type="danger" icon="el-icon-delete"
                        @click="deleteCustomer(customer.customerno)">削除</el-button>
                </div>
            </el-card> 
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                path: '',
                dialogFormVisible: false,
                flag1: false,
                flag2: false,
                billType: {
                    billType: ''
                },
                customer: {
                    customer: '',
                    customerType: ''
                },
                customerTypes: [],
                billTypes: [],
                customers: []
            }
        },
        name: 'categoryView',
        computed: {
            addCustomerBt() {
                return this.customer.customer === '' || this.customer.customerType === ''
            },
            // editPathBt(){
            //     return this.path === ''
            // }
        },
        created() {
            this.billsInit()
            this.costumersInit()
            this.customerTypesInit()
        },
        methods: {
            // 
            changeTab(tab) {
                    this.currentTab = tab;
                    const path = `/home/${tab.toLowerCase()}`;
                    this.$router.push({ path });
                },
            // 
            // editPath(){

            // },
            costumersInit() {
                this.$http.get('/category/getCustomers')
                    .then(res => {
                        this.customers = res.data.data
                    })
            },
            customerTypesInit() {
                this.$http.get('/category/getCustomerTypes')
                    .then(res => {
                        this.customerTypes = res.data.data
                    })
            },
            customerBlur() {
                if (this.customer.customer === '') {
                    this.flag1 = true
                } else {
                    this.flag1 = false
                }
            },
            // deleteCustomer(customerno) {
            //     this.$confirm('これで取引先は完全に削除されます，続きますが？', '取引先を消しますが？', {
            //         confirmButtonText: '続く',
            //         cancelButtonText: 'キャンセル',
            //         type: 'warning'
            //     }).then(() => {
            //         this.$http.get('/category/deleteCustomer/' + customerno)
            //             .then(res => {
            //                 if (res.data.code === 200) {
            //                     this.$message({
            //                         type: 'success',
            //                         message: '削除成功'
            //                     });
            //                     this.customerInit()
            //                 }
            //             })
            //     }).catch(() => { });
            // },
            deleteCustomer(customerno) {
                this.$confirm('これで取引先は完全に削除されます，続きますが？', '取引先を消しますが？', {
                    confirmButtonText: '続く',
                    cancelButtonText: 'キャンセル',
                    type: 'warning'
                }).then(() => {
                    const requestData = {
                        customerno: customerno,
                        updateuserid: sessionStorage.getItem('userid')
                    };

                    this.$http.post('/category/deleteCustomer', requestData)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '削除成功'
                                });
                                this.customerInit();
                            }
                        });
                }).catch(() => {});
            },
            addCustomer() {
                let flag1 = false;
                this.customerTypes.forEach(customer => {
                    if (this.customer.customerType === customer.customerType) {
                        flag1 = true
                    }
                });
                if (!flag1) {
                    this.$confirm('入力した取引先は今のない取引先です。', '取引先を新規しますか？', {
                        confirmButtonText: '新規',
                        cancelButtonText: 'キャンセル',
                        type: 'warning'
                    }).then(() => {
                        this.addCustomerSend()
                    })
                } else {
                    this.addCustomerSend()
                }
            },

            addCustomerSend() {
                
                const requestData = {
                    customer: this.customer,
                    updateuserid: sessionStorage.getItem('userid')
                };
                this.$http.post('/category/addCustomer', requestData)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '新規成功'
                            });
                            this.costomersInit();
                            this.costomerInit();
                        }
                    });
                // 
                // 
                // this.$http.post('/category/addCustomer', this.customer)
                //     .then(res => {
                //         if (res.data.code === 200) {
                //             this.$message({
                //                 type: 'success',
                //                 message: '新規成功'
                //             });
                //             this.costomersInit()
                //             this.costomerInit()
                //         }
                //     })
                this.dialogFormVisible = false
            },
            // deleteBillType(billTypeno) {
            //     this.$confirm('これで帳票種類は完全に削除されます，続きますが？', '帳票種類を消しますが？', {
            //         confirmButtonText: '続く',
            //         cancelButtonText: 'キャンセル',
            //         type: 'warning'
            //     }).then(() => {
            //         this.$http.get('/category/deleteBillType/' + billTypeno)
            //             .then(res => {
            //                 if (res.data.code === 200) {
            //                     this.$message({
            //                         type: 'success',
            //                         message: '削除成功'
            //                     });
            //                     this.billsInit()
            //                 }
            //             })
            //     }).catch(() => { });
            // },
            deleteBillType(billTypeno) {
                this.$confirm('これで帳票種類は完全に削除されます，続きますが？', '帳票種類を消しますが？', {
                    confirmButtonText: '続く',
                    cancelButtonText: 'キャンセル',
                    type: 'warning'
                }).then(() => {
                    const requestData = {
                        billTypeno:billTypeno,
                        updateuserid: sessionStorage.getItem('userid')
                    };

                    this.$http.post('/category/deleteBillType' , requestData)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '削除成功'
                                });
                                this.billsInit();
                            }
                        });
                }).catch(() => {});
            },
            addBillType() {
                this.$prompt('帳票種類を入力ください', '帳票種類新規', {
                    confirmButtonText: '追加',
                    cancelButtonText: 'キャンセル',
                }).then(({ value }) => {
                    if (value == null || value === '') {
                        this.$message({
                            type: 'warning',
                            message: '帳票種類を入力ください'
                        });
                        return
                    }

                    const requestData = {
                        
                        billTypeValue: value,
                        updateuserid: sessionStorage.getItem('userid')  
                    };

                    this.$http.post('/category/addBillType', requestData)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '新規成功'
                                });
                                this.billsInit();
                            }
                        });

                    // this.$http.get('/category/addBillType/' + value)
                    //     .then(res => {
                    //         if (res.data.code === 200) {
                    //             this.$message({
                    //                 type: 'success',
                    //                 message: '新規成功'
                    //             });
                    //             this.billsInit()
                    //         }
                    //     })
                }).catch(() => { });
            },
            handleFolderChange(e) {
                const path = e.target.files[0].path
                this.path = path
            },
            triggerFileInput() {
                this.$refs.fileInput.click();
            },
            billsInit() {
                this.$http.get('/category/getBillTypes')
                    .then(res => {
                        this.billTypes = res.data.data
                    })
            },
            costomersInit() {
                this.$http.get('/category/getCustomers')
                    .then(res => {
                        this.customers = res.data.data
                    })
            },
            customerInit() {
                this.customer.customer = '',
                    this.customer.customerType = ''
            }

        }
    }

</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 480px;
    }
</style>