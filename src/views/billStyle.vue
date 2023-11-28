<template>
    <div>
        <el-button type="primary" plain @click="addBillType" style="display: flex;">新規</el-button>
        <el-table :data="billTypes" style="width: 100%" >
            <el-table-column
                prop="billTypeno"
                label="帳票種類编号"
                >
            </el-table-column>
            <el-table-column
                prop="billType"
                label="帳票種類"
                >
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="editBillType(scope.row)">編集</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteBillType(scope.row.billTypeno)">削除</el-button>
                </template>
            </el-table-column>
        </el-table>
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
        
        // editPathBt(){
        //     return this.path === ''
        // }
    },
    created() {
        this.billsInit()
    
    },
    methods: {
        // 
        deleteBillType(billTypeno) {
            this.$confirm('これで帳票種類は完全に削除されます，続きますが？', '帳票種類を消しますが？', {
                confirmButtonText: '続く',
                cancelButtonText: 'キャンセル',
                type: 'warning'
            }).then(() => {
                this.$http.get('/category/deleteBillType/' + billTypeno)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '削除成功'
                            });
                            this.billsInit()
                        }
                    })
            }).catch(() => { });
        },
        // addBillType() {
        //     this.$prompt('帳票種類を入力ください', '帳票種類新規', {
        //         confirmButtonText: '追加',
        //         cancelButtonText: 'キャンセル',
        //     }).then(({ value }) => {
        //         if (value == null || value === '') {
        //             this.$message({
        //                 type: 'warning',
        //                 message: '帳票種類を入力ください'
        //             });
        //             return
        //         }
        //         this.$http.get('/category/addBillType/' + value)
        //             .then(res => {
        //                 if (res.data.code === 200) {
        //                     this.$message({
        //                         type: 'success',
        //                         message: '新規成功'
        //                     });
        //                     this.billsInit()
        //                 }
        //             })
        //     }).catch(() => { });
        // },

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
                    return;
                }

                const requestData = {

                    billType: value,
                    createuserid: sessionStorage.getItem('userid')

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
                    })
                    .catch(error => {
                        console.error('新規请求失败:', error);
                     
                    });
            }).catch(() => {});
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
       
        // 编辑帐单类型方法
        editBillType(billType) {
            this.$prompt('帳票種類を入力ください', '帳票種類編集', {
                confirmButtonText: '追加',
                cancelButtonText: 'キャンセル',
            }).then(({ value }) => {
                if (value == null || value === '') {
                    this.$message({
                        type: 'warning',
                        message: '帳票種類を入力ください'
                    });
                    return;
                }

                // 
                const requestData = {
                    billTypeno: billType.billTypeno,
                    billType: value,
                    updateuserid: sessionStorage.getItem('userid')

                };

                this.$http.post('/category/editBillType', requestData)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '編集成功'
                            });
                            this.billsInit();
                        }
                    })
                    .catch(error => {
                        
                        console.error('編集失败:', error);
                        this.$message({
                            type: 'error',
                           
                        });
                    });
            }).catch(() => {
                
            });
        }
    

    }
    
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>