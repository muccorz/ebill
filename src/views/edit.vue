<template lang="">
    <div>
        <div style="margin: 30px 100px; " class="d-flex">
            <div style="width: 44%;">
                <el-form ref="form" :model="bill" label-width="120px">
                    <el-form-item label="帳票No" v-if="rewriteFlag">
                        <span style="font-size: 16px;">{{bill.billno}}</span>
                    </el-form-item>
                    <el-form-item label="取引年月日">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="text" ref="datepickerInput" v-model="bill.transactionymd" class="el-input__inner"
                            style="width: 85%; " placeholder="入力或いは選択してください">
                    </el-form-item>
                    <el-form-item label="取引金額">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-input v-model="bill.transactionAmount" style="width: 85%;" @blur="checkAmountFrom"
                            placeholder="￥"></el-input>
                    </el-form-item>
                    <el-form-item label="取引先">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-select v-model="bill.customerno" filterable placeholder="入力又は選択" style="width: 85%;">
                            <el-option v-for="customer in customers" :key="customer.customerno"
                                :label="customer.customer" :value="customer.customerno">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="帳票種類">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-select v-model="bill.billTypeno" filterable placeholder="入力又は選択" style="width: 85%;">
                            <el-option v-for="billType in billTypes" :key="billType.billTypeno"
                                :label="billType.billType" :value="billType.billTypeno">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="備考">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-input type="textarea" :rows="3" v-model="bill.remark" style="width: 85%;"
                            placeholder="訂正の時必ず入力してください"></el-input>
                    </el-form-item>
                </el-form>
                <el-button size="medium" type="primary" @click="create"
                    :disabled="setCreateBt">{{createBtText}}</el-button>
                <el-button size="medium" type="warning" @click="cancel">キャンセル</el-button>
            </div>
            <el-upload class="avatar-uploader" action="/bill/updateFile" :show-file-list="false"
                :on-success="handleAvatarSuccess" >
                <el-button size="small" type="primary">アップロードファイル</el-button>
                <embed v-if="bill.imageUrl" :src="bill.imageUrl" type="application/pdf" width="48%" height="83%"
                    style="position: absolute; top: 17%; left: 51%;">
            </el-upload>
        </div>
    </div>
</template>

<script>
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
    import 'flatpickr/dist/l10n/ja';
    export default {
        name: "editView",
        data() {
            return {
                createBtText: '作 成',
                rewriteFlag: false,
                remarkFlag: true,
                createBt: true,
                billTypes: [],
                customers: [],
                //帳票詳細
                bill: {
                    billno: '',
                    updateuserId: '',
                    billTypeno: '',
                    customerno: '',
                    remark: '',
                    transactionAmount: '',
                    transactionymd: '',
                    imageUrl: '',
                },
            }
        },
        computed: {
            //作成button启用判断
            // setCreateBt() {
            //     console.log("进入setCreat");
                // if (this.bill.billno != undefined) {
                //     console.log("if:",this.bill.billTypeno == '' || this.bill.customerno == '' || this.bill.transactionAmount == '' || this.bill.transactionymd == '' || this.bill.imageUrl == '' || this.bill.remark == '');
                //     return this.bill.billTypeno == '' || this.bill.customerno == '' || this.bill.transactionAmount == '' || this.bill.transactionymd == '' || this.bill.imageUrl == '' || this.bill.remark == '';
                // } else {
                //     console.log("else:",this.bill.billTypeno == '' || this.bill.customerno == '' || this.bill.transactionAmount == '' || this.bill.transactionymd == '' || this.bill.imageUrl == '');
                //     return this.bill.billTypeno == '' || this.bill.customerno == '' || this.bill.transactionAmount == '' || this.bill.transactionymd == '' || this.bill.imageUrl == '';
                // }
            // }
        },
        methods: {
            create() {
                // 发的时候加上userid
                const requestData = {
                    bill: this.bill,
                    updateuserid: sessionStorage.getItem('userid')
                };

                this.bill.updateuserid = sessionStorage.getItem('userid');
                if (this.bill.billno != undefined) {
                    this.$http.post('/bill/editBill', requestData)
                        .then(res => {
                            if (res.data.code == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '訂正成功'
                                });
                                this.$router.push('/search');
                            }
                        })
           
                } else {
                    this.$http.post('/bill/createBill', this.bill)
                        .then(res => {
                            if (res.data.code == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '作成成功'
                                });
                                this.$router.push('/search');
                            }
                        })
          
                }
            },
            cancel() {
                this.$router.push('/search');
            },
            handleAvatarSuccess(response) {
                console.log(response);
                this.bill.imageUrl = "https://solution.fielding.co.jp/application/files/6516/3910/2834/column-3.png";
                // 图片上传校验
            },

            //金額のチェック
            checkAmountFrom() {
                if (!/^-?\d+$/.test(this.bill.transactionAmount) && this.bill.transactionAmount != '') {
                    this.$message({
                        type: 'error',
                        message: '整数のみ入力'
                    });
                    this.bill.transactionAmount = '';
                }
            },

            //サーバーからデータを取得する
            loadCustomers() {
                this.$http.get('/category/getCustomers').then(res => {
                    if (res.data.code == 200) {
                        this.customers = res.data.data;
                    }
                });
            },
            loadBillTypes() {
                this.$http.get('/category/getBillTypes').then(res => {
                    if (res.data.code == 200) {
                        this.billTypes = res.data.data;
                    }
                });
            },


            init() {
                this.bill.billno = this.$route.params.billno;
                if (this.bill.billno != undefined) {
                    this.$http.get('/bill/getBillDetails/' + this.bill.billno)
                        .then(res => {
                            this.bill = res.data.data;
                        })
                } else {
                    this.bill.billTypeno = '';
                    this.bill.customerno = '';
                    this.bill.remark = '';
                    this.bill.transactionAmount = '';
                    this.bill.transactionymd = '';
                    this.bill.updateuserId = '';
                    this.bill.updateymd = '';
                    this.bill.imageUrl = '';
                    this.rewriteFlag = false;
                    this.remarkFlag = true;
                    this.createBtText = '作 成';
                }
            }
        },
        watch: {
            $route() {
                this.init();
            }
        },
        mounted() {
            flatpickr(this.$refs.datepickerInput, {
                dateFormat: 'Y/m/d',
                locale: 'ja',
                firstDayOfWeek: '0',
                allowInput: 'true',
                minDate: "1990/01/01",
                maxDate: "today",
            });
            this.loadCustomers();
            this.loadBillTypes();
        },
        created() {
            this.init();
        }
    }
</script>
<style scoped>
    .el-table :deep() .cell {
        /* overflow: hidden; */
        /* text-overflow: ellipsis; */
        white-space: nowrap;

    }

    .block {
        position: absolute;
        bottom: 40px;
        left: 47%;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .el-button {
        margin: 5px;
    }
</style>