<template lang="">
    <div>
        <div style="flex-direction: row; height: 80vh; display: flex;">
       
            <div style="width: 45%; margin-top: 13vh;">

                <el-upload multiple :limit="5" style="margin-bottom:20px" class="avatar-uploader" action="http://192.168.11.9:8082/bill/updateFile" :show-file-list="false"
                :on-success="handleAvatarSuccess" >
               
                <div v-if="bill.imageUrl">
                    <!-- isPDF(bill.imageUrl) -->
                    <embed v-if="false" :src="bill.imageUrl" type="application/pdf" width="48%" height="80%" style="position: absolute; top: 10%; left: 51%;">
                    <!-- !isPDF(bill.imageUrl) -->
                    <div  style="width: 40%; height: 80%; position: absolute; top: 10%; left: 55%; border-radius: 5px; display: flex; justify-content: center; align-items: center;">
                        <img v-if="true"  :src="bill.imageUrl" style="max-width: 100%; max-height: 100%;">
                    </div>
                </div>
              </el-upload>

              <!-- 上面是upload按钮 -->
                <el-form ref="form" :model="bill" label-width="120px">
                    <el-form-item label="帳票No" v-if="rewriteFlag">
                        <span style="font-size: 16px;">{{bill.billno}}</span>
                    </el-form-item>
                    <el-form-item label="取引年月日">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="text" ref="datepickerInput" v-model="transactionymdStr" class="el-input__inner"
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
            <el-upload
                style="display: flex; justify-content: center; margin-bottom: 20px;"
                class="avatar-uploader"
                :action="getUploadUrl()"
                :before-upload="beforeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleAvatarSuccess"
                multiple
                :limit="5"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip"></div>
         
            </el-upload>
        </div>
    </div>
</template>

<script>
 /* eslint-disable */
//  上面这个注释是用来停报未使用函数错误的，优化的时候再删掉
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
                transactionymdStr: '',
                bill: {
                    billno: '',
                    updateuserid: '',
                    billTypeno: '',
                    customerno: '',

                    // billType: '',
                    // customer: '',
                    // receipt_issuance: false,
                    remark: '',
                    transactionAmount: '',
                    // transactionymdStr: '',
                    transactionymd: null,
                    imageUrls: [],
                },
                fileList: [],
                updateFileList:[],
                // updateuserid:'',暂时没用
                deletingFile: null,

            }
        },
        computed: {
            //作成button启用判断
            setCreateBt() {
                if (this.bill.billno != null) {
                    console.log("this.bill.billno != null")
                    // 编辑
                    return this.bill.billTypeno == '' || this.bill.customerno == '' || this.bill.transactionAmount == '' || this.transactionymdStr == '' || this.bill.imageUrl == '' || this.bill.remark == '';
                } else {
                    // 新建
          
                    return this.bill.billTypeno == '' || this.bill.customerno == '' || this.bill.transactionAmount == '' || this.transactionymdStr == '' || this.bill.imageUrl == '';
                }
            }
        },
        methods: {
            
            create() {
                this.bill.updateuserid = sessionStorage.getItem('userid');
                this.bill.transactionymd = new Date(this.transactionymdStr)
                this.bill.imageUrls=this.updateFileList

        

                if (this.bill.billno != null) {
                    this.$http.post('/bill/editBill', this.bill)
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
                    // console.log("this.bill",this.bill)
                    // this.bill.imageUrls = []
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
                          
                            this.bill = res.data.data[0];
                            console.log(this.bill)
                            
                            this.bill.customer = res.data.data[0].customer;
                            this.bill.billType = res.data.data[0].billType;
                            this.transactionymdStr = res.data.data[0].transactionymd;

                        })
                } else {
                    this.bill.billTypeno = '';
                    this.bill.customerno = '';
                    this.bill.remark = '';
                    this.bill.transactionAmount = '';
                    this.transactionymdStr = '';
                    this.bill.transactionymd = new Date(this.transactionymdStr);
                    this.bill.updateuserid = '';
                    this.bill.updateymd = '';
                    this.bill.imageUrls = [];
                    this.rewriteFlag = false;
                    this.remarkFlag = true;
                    this.createBtText = '作 成';
                }
            },


            isPDF(url) {
                return url.toLowerCase().endsWith('.pdf');
            },
            beforeUpload(file) {
                const maxFileSize = 12; // 最大文件大小（MB）
                const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

                const isAllowedType = allowedTypes.includes(file.type);
                const isLtMaxFileSize = file.size / 1024 / 1024 <= maxFileSize;

                if (!isAllowedType) {
                    this.$message.error('上传文件格式仅支持 JPG、PNG 和 PDF 格式！');
                    return false;
                }

                if (!isLtMaxFileSize) {
                    this.$message.error(`上传文件大小不能超过 ${maxFileSize}MB!`);
                    return false;
                }

                this.fileList.push(file);

                return true;
            },
            handleRemove(file, fileList) {

                // 向后端发送 POST 请求，删除文件
                this.$http.post('/bill/deleteTempFile', { imageUrl: file.response.data.imageUrl })
                .then(response => {
                    // 请求成功后，继续执行默认的移除操作
                    const index = fileList.indexOf(file);
                    if (index !== -1) {
                        fileList.splice(index, 1);
                    }
                    //删除updateFileList里的值
                    this.updateFileList = this.updateFileList.filter(item => item !== file.response.data.imageUrl);
                    // [...fileList]数组浅拷贝
                    this.fileList = [...fileList];
                    // 请求成功后清空 deletingFile
                    this.deletingFile = null;
                })
                .catch(error => {
                    // 处理请求失败的情况
                    console.error('Error removing file:', error);

                    // 请求失败时清空 deletingFile
                    this.deletingFile = null;
                });
            },

            handleAvatarSuccess(response) {
                console.log('handleAvatarSuccess', response);

                this.updateFileList.push(response.data.imageUrl);
            },
            handlePreview(file) {
                console.log(file);
            },
            
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
           
            beforeRemove(file, fileList) {
                
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            getUploadUrl() {
            return `http://192.168.11.9:8082/bill/updateFile?userid=${sessionStorage.getItem('userid')}`;
            },
  
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