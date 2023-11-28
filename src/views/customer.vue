<template>
   <div>
    <el-button type="primary" plain @click="dialogFormVisible= true" style="display: flex;">新規</el-button>
    <el-table :data="customers" style="width: 100%">
      <el-table-column label="取引先" prop="customer"></el-table-column>
      <el-table-column label="取引先種類" prop="customerType"></el-table-column>
      <el-table-column label="TEL" prop="phoneNumber"></el-table-column>
      <el-table-column label="アドレス" prop="address"></el-table-column>
      <el-table-column label="法人番号" prop="legalEntityNumber"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editCustomer(scope.row)">編集</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCustomer(scope.row.customerno)">削除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog form for adding/editing customer -->
    <!-- <el-dialog title="取引先新規" :visible.sync="dialogFormVisible" @closed="customerInit">
      <el-form :model="customer">
        <el-form-item label="取引先">
          <span class="text-danger" style="font-size: 12px;" v-if="flag1">取引先を入力してください</span>
          <el-input v-model="customer.customer" autocomplete="off" @blur="customerBlur"></el-input>
        </el-form-item> 
        <el-form-item label="取引先種類">
          <span class="text-danger" style="font-size: 12px;" v-if="flag2">取引先種類を入力してください</span>
          <el-select v-model="customer.customerType" filterable allow-create default-first-option class="w-100" placeholder="取引先種類を選択してください">
            <el-option v-for="customerType in customerTypes" :key="customerType.customerType" :label="customerType.customerType" :value="customerType.customerType"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">キャンセル</el-button>
        <el-button type="primary" @click="addCustomer" :disabled="addCustomerBt">追 加</el-button>
      </div>
    </el-dialog> -->
    <!-- <el-dialog title="取引先新規" :visible.sync="dialogFormVisible" @closed="customerInit"> -->
    <el-dialog :title="isEditing ? '取引先編集' : '取引先新規'" :visible.sync="dialogFormVisible" @closed="customerInit">
    <el-form :model="customer">
        <el-form-item label="取引先">
        <span class="text-danger" style="font-size: 12px;" v-if="flag1">取引先を入力してください</span>
        <el-input v-model="customer.customer" autocomplete="off" @blur="customerBlur"></el-input>
        </el-form-item> 
        <el-form-item label="取引先種類">
        <span class="text-danger" style="font-size: 12px;" v-if="flag2">取引先種類を入力してください</span>
        <el-select v-model="customer.customerType" filterable allow-create default-first-option class="w-100" placeholder="取引先種類を選択してください">
            <el-option v-for="customerType in customerTypes" :key="customerType.customerType" :label="customerType.customerType" :value="customerType.customerType"></el-option>
        </el-select>
        </el-form-item>
        <!-- 新增输入框开始 -->
        <el-form-item label="地址">
        <!-- 这是新增的地址输入框 -->
        <el-input v-model="customer.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="電話番号">
        <!-- 这是新增的电话号码输入框 -->
        <el-input v-model="customer.phoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="法人番号">
        <!-- 这是新增的法人番号输入框 -->
        <el-input v-model="customer.legalEntityNumber" autocomplete="off"></el-input>
        </el-form-item>
       
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">キャンセル</el-button>
        <!-- <el-button type="primary" @click="addCustomer" :disabled="addCustomerBt">追 加</el-button> -->
        <el-button type="primary" @click="handleCustomerAction" :disabled="addCustomerBt">
        {{ isEditing ? '更 新' : '追 加' }}
        </el-button>
    </div>
    </el-dialog>

  </div>
</template>
<!--  -->
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
                customers: [],
                isEditing: false, //判断是否编辑
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
            // this.billsInit()
            this.costumersInit()
            this.customerTypesInit()
        },
        methods: {
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
                                // 用于过滤掉已删除的客户，然后更新 customers 数据
                                this.customers = this.customers.filter(customer => customer.customerno !== customerno);
                            }
                        })
                        .catch(() => {
                            // 处理请求失败的情况
                        });
                }).catch(() => { });
            },

            addCustomer() {
                this.isEditing = false; // 重置为新增状态
                let flag1 = false;
                this.customerTypes.forEach(customer => {
                    if (this.customer.customerType === customer.customerType) {
                        flag1 = true;
                    }
                });
                if (!flag1) {
                    this.$confirm('入力した取引先は今のない取引先です。', '取引先を新規しますか？', {
                        confirmButtonText: '新規',
                        cancelButtonText: 'キャンセル',
                        type: 'warning'
                    }).then(() => {
                        this.addCustomerSend();
                    });
                    } else {
                        this.addCustomerSend();
                    }
                },
            addCustomerSend() {
                const requestData = {
                
                        customer: this.customer.customer,
                        customerType: this.customer.customerType,
                        address: this.customer.address,
                        phoneNumber: this.customer.phoneNumber,
                        legalEntityNumber: this.customer.legalEntityNumber,
                        createuserid: sessionStorage.getItem('userid')
                    
                };

                this.$http.post('/category/addCustomer', requestData)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '新規成功'
                            });
                            this.customersInit();
                            this.customerInit(); // 修正函数名
                        }
                    })
                    .catch(error => {

                        console.error('具体错误信息:', error.response); // 打印具体的错误信息
                        console.error('新規请求失败:', error);
                        this.$message({
                            type: 'error',
                            message: '新規请求失败，请重试'
                        });
                    });
                this.dialogFormVisible = false;
                
            },
            
            // 判断
            handleCustomerAction() {
                if (this.isEditing) {
                this.sendEditCustomer(); // 调用更新的方法
                } else {
                
                this.addCustomerSend(); // 调用添加的方法
                this.isEditing = false;
                }
            },

            // 编辑取引先
            
            editCustomer(row) {
                // 将 isEditing 设置为 true，表示现在是编辑状态
                this.isEditing = true;

                // 将客户数据设置为所选行的数据
                this.customer = {
                    customerno: row.customerno,
                    customer: row.customer,
                    customerType: row.customerType,
                    address: row.address,
                    phoneNumber: row.phoneNumber,
                    legalEntityNumber: row.legalEntityNumber,
                    updateuserid: sessionStorage.getItem('userid'),
                };

                // 显示用于编辑的对话框表单
                this.dialogFormVisible = true;
            },

            sendEditCustomer() {
                const requestData = {
                    customerno: this.customer.customerno,
                    customer: this.customer.customer,
                    customerType: this.customer.customerType,
                    address: this.customer.address,
                    phoneNumber: this.customer.phoneNumber,
                    legalEntityNumber: this.customer.legalEntityNumber,
                    updateuserid: this.customer.updateuserid,
                };

                this.$http.post('/category/editCustomer', requestData)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '编辑成功',
                            });
                            this.customersInit();
                            this.customerInit();
                        }
                    })
                    .catch(error => {
                        console.error('编辑请求失败:', error);
                        this.$message({
                            type: 'error',
                            message: '编辑请求失败，请重试',
                        });
                    });

                this.dialogFormVisible = false;
                this.isEditing = false; // 重置为新增状态
            },


            
            customersInit() {
                this.$http.get('/category/getCustomers')
                    .then(res => {
                        this.customers = res.data.data
                    })
            },
            customerInit() {
                this.customer.customer = '',
                this.customer.customerType = ''
            },


        }
    }
</script>
<!--  -->
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>