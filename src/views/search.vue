<template>
    <div>
        <div class="h4" style="font-weight: 700;text-align:left">電子取引管理</div>
        <el-divider></el-divider>
        <!-- 条件付き検索 -->
        <el-row :gutter="20">
            <el-col :span="16">
                <el-form :inline="true" :model="condition" class="demo-form-inline ">

                    <!--  -->
                    <el-form-item label="帳票状態">
                        <el-select v-model="condition.searchManage" filterable placeholder="入力又は選択">
                            <el-option v-for="searchManage in searchManages" :key="searchManage.conditionJapanese"
                            :label="searchManage.conditionJapanese" :value="searchManage.conditionJapanese">
                            </el-option>
                        </el-select>
                    </el-form-item><br>
                    <!--  -->
                    <el-form-item label="取引年月日">
                        <input type="text" ref="datepickerInput1" v-model="condition.transactionDateFrom"
                            class="el-input__inner" placeholder="開始日" style="width: 120px;">
                    </el-form-item>
                    <el-form-item label="">~</el-form-item>
                    <el-form-item label="">
                        <input type="text" ref="datepickerInput2" v-model="condition.transactionDateTo"
                            class="el-input__inner" placeholder="終了日" style="width: 120px;">
                    </el-form-item>
                    <el-form-item label="取引金額範囲">
                        <el-input v-model="condition.transactionAmountFrom" placeholder="￥" @blur="checkAmountFrom"
                            style="width: 100px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">~</el-form-item>
                    <el-form-item label="">
                        <el-input v-model="condition.transactionAmountTo" placeholder="￥" @blur="checkAmountTo"
                            style="width: 100px;"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="取引先">
                        <el-select v-model="condition.customerno" filterable placeholder="入力又は選択">
                            <el-option v-for="customer in customers" :key="customer.customerno"
                                :label="customer.customer" :value="customer.customerno">
                            </el-option>
                        </el-select>
                    </el-form-item>
            
                    <el-form-item label="帳票種類">
                        <el-select v-model="condition.billTypeno" filterable placeholder="入力又は選択">
                            <el-option v-for="billType in billTypes" :key="billType.billTypeno"
                                :label="billType.billType" :value="billType.billTypeno">
                            </el-option>
                        </el-select>
                    </el-form-item>&nbsp;
                    <el-form-item label="登録ユーザー">
                        <el-select v-model="condition.updateuserid" filterable placeholder="入力又は選択">
                            <el-option v-for="updateUser in updateUsers" :key="updateUser.updateuserid"
                                :label="updateUser.updateUserName" :value="updateUser.updateuserid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-button type="primary" @click="search">検 索</el-button>
                <el-button type="warning" @click="clear">クリア</el-button>
                <br>
                <el-button type="primary" @click="onSubmit" v-if="reviewBt">承認待ち</el-button>
                <el-button type="primary" @click="getEditWaitBill" v-if="getEditWaitBillBt">改修処理中</el-button>
                <br>
                <el-button type="primary" @click="download" v-if="downloadBt" :disabled="exportBt">エクスポート</el-button>
            </el-col>
        </el-row>

        <!-- 帳票テーブル -->
        <el-table :data="billTableData" style="width: 100%" @selection-change="handleSelectionChange"
            @row-click="handleRowClick" @sort-change="sortChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="billno" label="帳票番号" sortable="sortable">
            </el-table-column>
            <!-- 格式约束 -->
            <el-table-column prop="transactionymd" label="取引年月日" sortable="sortable">
                <template slot-scope="{ row }">
                    {{ row.transactionymd | formatDate }}
                </template>
            </el-table-column>


            <el-table-column prop="transactionAmount" label="取引金額" sortable="sortable">
            </el-table-column>
            <el-table-column prop="customer" label="取引先">
            </el-table-column>
            <!-- 进票出票 -->
            <el-table-column prop="customer" label="受領/発行">
            </el-table-column>
            <!--  -->
            <el-table-column prop="billType" label="帳票種類">
            </el-table-column>
        </el-table>

        <!-- 帳票詳細drawer -->

        <el-drawer title="履歴" :visible.sync="drawerflag" size="80%" @closed="clearBill">
            <div style="margin: 30px 100px; display: flex; justify-content: space-around;" class="d-flex" >
                <div style="width: 40%;flex: 1;padding-right: 4vw; ">
                    <el-form ref="form" :model="bill" label-width="120px" :disabled="true" >
                        <el-form-item label="帳票No">
                            <span style="font-size: 16px;">{{bill.billno}}</span>
                        </el-form-item>
                        <!-- 格式约束 -->
                        <el-form-item label="取引年月日">
                            <el-input :value="bill.transactionymd | formatDate"></el-input>
                        </el-form-item>

                        <el-form-item label="取引金額">
                            <el-input v-model="bill.transactionAmount"></el-input>
                        </el-form-item>

                        <el-form-item label="取引先">
                            <el-input v-model="bill.customer"></el-input>
                        </el-form-item>

                        <el-form-item label="帳票種類">
                            <el-input v-model="bill.billType"></el-input>
                        </el-form-item>

                        <el-form-item label="訂正備考">
                            <el-input type="textarea" :rows="3" v-model="bill.remark"></el-input>
                        </el-form-item>

                        <!-- 时间约束 -->
                        <el-form-item label="登録日時">
                            <el-input :value="$options.filters.formatDateTime(bill.updateymd)" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="登録ユーザー">
                            <el-input v-model="bill.updateUsername"></el-input>
                        </el-form-item>
                    </el-form>

                    <el-button size="medium" type="primary" @click="edit" :disabled="!editBt" v-if="applyEditPermissonsBt">訂正</el-button>
                    <el-button size="medium" type="primary" @click="agree" :disabled="!agreeBt " v-if="editPermissonsBt">承認</el-button>
                    <el-button size="medium" type="danger" @click="disagree"
                        :disabled="!disagreeBt" v-if="editPermissonsBt">拒否</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button size="medium" type="warning" @click="giveEditPermissons" :disabled="!givePermission"
                        v-if="editPermissonsBt">訂正権限を付く</el-button>&nbsp;&nbsp;
                    <el-button size="medium" type="warning" @click="applyEditPermissons" :disabled="!applyPermission"
                        v-if="applyEditPermissonsBt&&rolesno1Bt">訂正権限を申請</el-button>
                </div>
                <!-- <embed :src="bill.imageUrl" type="application/pdf" width="50%" height="70%"
                    style="position: absolute; top: 10%; right: 5%;"> -->
                    <div v-if="bill.imageUrl" style="flex: 1; ">
                        <!-- 这边是查看展示的 -->
                        <div style="flex: 1; ">
                            <!-- 右侧的图片或 PDF 阅读器 -->
                            <div v-if="bill.imageUrl" style="max-width: 30vw; height: 60vh; border-radius: 5px; display: flex; justify-content: center; align-items: center;">
                                <!-- 如果是 PDF 文件 -->
                                <embed v-if="isPDF(bill.imageUrl)" :src="bill.imageUrl" type="application/pdf" width="100%" height="100%" style="border: none;">
                                <!-- 如果是普通图片 -->
                                <div v-if="!isPDF(bill.imageUrl)">
                                    <el-image :src="bill.imageUrl" :fit="contain" style="max-width: 25vw; max-height: 60vh;"></el-image>
                                </div>
                            </div>
                        </div>
                
                    </div>
                <!-- <el-upload class="avatar-uploader" action="http://127.0.0.1:8081" :show-file-list="false"
                    :on-error="handleAvatarSuccess"> -->
                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                <!-- </el-upload> -->
            </div>
            <el-table :data="Logs" :border="true" style="width: 80%;margin-top: 4%;margin-left: 3%;">
                <el-table-column prop="transactionymd" label="取引年月日">
                </el-table-column>
                <el-table-column prop="transactionAmount" label="取引金額">
                </el-table-column>
                <el-table-column prop="customer" label="取引先">
                </el-table-column>
                <el-table-column prop="billType" label="帳票種類">
                </el-table-column>
                <el-table-column prop="remark" label="訂正備考">
                </el-table-column>
                <el-table-column prop="updateymd" label="登録日時">
                </el-table-column>
                <el-table-column prop="updateUsername" label="登録ユーザー">
                </el-table-column>
            </el-table>

          

        </el-drawer>
        <div class="block">
            <el-pagination @current-change="pageCurrentChange" :current-page.sync="currentPage" :page-size="pagesize"
                :page-sizes="[10, 50, 100, 500]" @size-change="handleSizeChange"
                layout="total,sizes, prev, pager, next, jumper" :total="totalBill">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    // Flatpickrを導入する
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
    import 'flatpickr/dist/l10n/ja';
    export default {
        // 时间格式约束
        filters: {
            formatDate(value) {
                if (!value) return '';
                // 替换 / 为 -
                const date = new Date(value);
                return date.toLocaleDateString().replace(/\//g, '-');
            },
            formatDateTime(value) {
                if (!value) return '';
                const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const formattedDateTime = new Date(value).toLocaleString(undefined, options).replace(/\//g, '-');
                return formattedDateTime;
            }
            },
        name: 'billView',
        data() {
            return {
                drawerflag: false,
                multipleSelection: [],

                //ロジック処理
                conditionFlag: false,
                sortFlag: false,
                onSubmitFlag: false,
                getEditWaitBillFlag: false,
                getApplyEditPermissonsFlag: false,
                //ボタンの有効化
                editBt: true,
                agreeBt: true,
                disagreeBt: true,
                reviewBt: false,
                downloadBt: false,
                editPermissonsBt: false,
                applyEditPermissonsBt: false,
                rolesno1Bt: false,
                givePermission: false,
                applyPermission: false,
                getEditWaitBillBt: false,


                //順番処理
                sort: false,
                order: '',

                //ページング部分の機能
                totalBill: 0,
                currentPage: 1,
                pagesize: 10,

                //条件付き検索部分の機能
                customers: [],
                billTypes: [],
                updateUsers: [],
                timeout: null,
                date: '',
                Logs: [],
                searchManages:[],

                //帳票詳細
                bill: {
                    billno: '',
                    billType: '',
                    customer: '',
                    remark: '',
                    transactionAmount: '',
                    transactionymd: '',
                    updateUserName: '',
                    updateymd: '',
                    reviewStatus: '',
                    editPermissions: false,
                    imageUrl: '',
                   
                },

                //帳票一覧
                billTableData: [],

                //検索条件
                condition: {
                    transactionDateFrom: '',
                    transactionDateTo: '',
                    transactionAmountFrom: '',
                    transactionAmountTo: '',
                    customerno: '',
                    billTypeno: '',
                    updateuserid: '',
                    searchManage: '',
                },

            }
        },
        computed: {
            exportBt() {
                if (this.multipleSelection.length == 0) {
                    return true;
                } else {
                    return false;
                }
            }
        },

        methods: {

        
            //   
            handleSizeChange(size) {
                this.pagesize = size;
                this.getBillsByFlag();
            },
            //順番処理
            sortChange(column) {
                this.sort = column.order;
                this.order = column.prop;
                this.sortFlag = true;
                this.currentPage = 1;
                if (this.conditionFlag == true) {
                    this.$http.post('/bill/conditionSearch', {
                        currentPage: this.currentPage,
                        pagesize: this.pagesize,
                        condition: this.condition,
                        sort: this.sort,
                        order: this.order
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.billTableData = res.data.data;
                            this.totalBill = res.data.data[0].totalBill;
                        }
                    });
                } else if (this.onSubmitFlag == true) {
                    this.$http.post('/bill/getOnSubmit', {
                        currentPage: this.currentPage,
                        pagesize: this.pagesize,
                        sort: this.sort,
                        order: this.order
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.billTableData = res.data.data
                            this.totalBill = res.data.data[0].totalBill;
                        }
                    });
                } else if (this.getEditWaitBillFlag == true){
                    this.$http.post('/bill/getEditWaitBill', {
                        currentPage: this.currentPage,
                        pagesize: this.pagesize,
                        order: this.sort,
                        prop: this.order
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.billTableData = res.data.data
                            this.totalBill = res.data.data[0].totalBill;
                        }
                    });
                } else {
                    this.$http.post('/bill/getBills', {
                        currentPage: this.currentPage,
                        pagesize: this.pagesize,
                        order: this.sort,
                        prop: this.order
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.billTableData = res.data.data;
                        }
                    });
                }
            },

            //金額のチェック
            checkAmountFrom() {
                if (!/^-?\d+$/.test(this.condition.transactionAmountFrom) && this.condition.transactionAmountFrom != '') {
                    this.$message({
                        type: 'error',
                        message: '整数のみ入力'
                    });
                    this.condition.transactionAmountFrom = '';
                }
            },
            checkAmountTo() {
                if (!/^-?\d+$/.test(this.condition.transactionAmountTo) && this.condition.transactionAmountTo != '') {
                    this.$message({
                        type: 'error',
                        message: '整数のみ入力'
                    });
                    this.condition.transactionAmountTo = '';
                }
            },

            //編集権限を付くボタン
            giveEditPermissons() {
                console.log("--------------")
                this.$http.get('/bill/giveEditPermissons/' + this.bill.billno).then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '編集権限を付く完了'
                        });
                    }
                });
            },

            //改修権限を申請ボタン
            applyEditPermissons() {
                this.$http.get('/bill/applyEditPermissons/' + this.bill.billno).then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '改修権限を申請しました'
                        });
                    }
                });
            },

            //編集ボタン
            edit() {
                this.$router.push({ path: '/edit/' + this.bill.billno });
            },
            //承認ボタン
            agree() {
                console.log("进入agree")
                this.$http.get('/bill/agreeBill/'+ this.bill.billno).then(res => {
                    console.log(res)
                    if (res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '承認完了'
                        });
                        this.drawerflag = false;
                    }
                });
            },
            //拒否ボタン
            disagree() {
                this.$http.get('/bill/disagreeBill/'+ this.bill.billno).then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '拒否完了'
                        });
                        this.drawerflag = false;
                    }
                });
            },

            //ページジャンプ
            pageCurrentChange(val) {
                this.currentPage = val;
                this.getBillsByFlag();
            },
            //条件付き検索・承認待ち・ソート機能を別で帳票データを取得する
            getBillsByFlag() {
                if (this.sortFlag == false) {
                    if (this.conditionFlag == true) {
                        this.$http.post('/bill/conditionSearch', {
                            currentPage: this.currentPage,
                            pagesize: this.pagesize,
                            condition: this.condition
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.billTableData = res.data.data;
                                this.totalBill = res.data.data[0].totalBill;
                                
                            }
                        });
                    } else if (this.onSubmitFlag == true) {
                        this.$http.post('/bill/getOnSubmit', {
                            currentPage: this.currentPage,
                            pagesize: this.pagesize
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.billTableData = res.data.data
                                this.totalBill = res.data.data[0].totalBill;
                            }
                        });
                    } else if (this.getEditWaitBillFlag == true) {
                        this.$http.post('/bill/getEditWaitBill', {
                            currentPage: this.currentPage,
                            pagesize: this.pagesize
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.billTableData = res.data.data
                                this.totalBill = res.data.data[0].totalBill;
                            }
                        });
                    } else {
                        this.getBills();
                    }
                } else {
                    if (this.conditionFlag == true) {
                        this.$http.post('/bill/conditionSearch', {
                            currentPage: this.currentPage,
                            pagesize: this.pagesize,
                            condition: this.condition,
                            sort: this.sort,
                            order: this.order
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.billTableData = res.data.data;
                                this.totalBill = res.data.data[0].totalBill;
                            }
                        });
                    } else if (this.getEditWaitBillFlag == true) {
                        this.$http.post('/bill/getEditWaitBill', {
                            currentPage: this.currentPage,
                            pagesize: this.pagesize,
                            sort: this.sort,
                            order: this.order
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.billTableData = res.data.data
                                this.totalBill = res.data.data[0].totalBill;
                            }
                        });
                    } else {
                        this.$http.post('/bill/getBills', {
                            currentPage: this.currentPage,
                            pagesize: this.pagesize,
                            sort: this.sort,
                            order: this.order
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.billTableData = res.data.data;
                                this.totalBill = res.data.data[0].totalBill;
                            }
                        });
                    }
                }
            },

            //帳票詳細をクリアする
            clearBill() {
                this.bill = {
                    billType: '',
                    customer: '',
                    remark: '',
                    transactionAmount: '',
                    transactionymd: '',
                    updateUserName: '',
                    updateymd: '',
                    imageUrl: '',
                    Logs: [],
                };
            },

            //帳票データを取得する
            getBills() {
                this.$http.post('/bill/getBills', { currentPage: this.currentPage, pagesize: this.pagesize })
                    .then(res => {
                        if (res.data.code == 200) {
                            this.billTableData = res.data.data;
                            this.totalBill = res.data.data[0].totalBill;
                        }
                    });
            },
            //チェックボックスを選択する
            handleSelectionChange(val) {
                this.multipleSelection = [];
                val.forEach(element => {
                    this.multipleSelection.push(element.billno);
                });
            },
            //検索ボタン
            search() {                
                const dateFrom = new Date(this.condition.transactionDateFrom);
                const dateTo = new Date(this.condition.transactionDateTo);
              if (dateFrom > dateTo) {
                    this.$message({ 
                        type: 'error',
                        message: '開始日は終了日より小さい'
                    });
                    return;
                }
                let AmountFrom = Number(this.condition.transactionAmountFrom);
                let AmountTo = Number(this.condition.transactionAmountTo);
                if (this.condition.transactionAmountFrom != '' && this.condition.transactionAmountTo != '') {
                    if (AmountFrom > AmountTo) {
                        this.$message({
                            type: 'error',
                            message: '金額範囲は0より小さい'
                        });
                        return;
                    }
                } 
                this.conditionFlag = true;
                this.onSubmitFlag = false;
                this.getApplyEditPermissonsFlag = false;
                this.currentPage = 1;
                this.$http.post('/bill/conditionSearch', {
                    currentPage: this.currentPage,
                    pagesize: this.pagesize,
                    condition: this.condition
                }).then(res => {
                    if (res.data.code == 200) {
                        this.billTableData = res.data.data;
                        this.totalBill = res.data.data[0].totalBill;
                    }
                });
            },
            //クリアボタン  
            clear() {
                this.condition.transactionDateFrom = '';
                this.condition.transactionDateTo = '';
                this.condition.transactionAmountFrom = '';
                this.condition.transactionAmountTo = '';
                this.condition.customerno = '';
                // 
                this.condition.searchManage = '';
                // 
                this.condition.billTypeno = '';
                this.condition.updateuserid = '';
                this.onSubmitFlag = false;
                this.conditionFlag = false;
                this.getEditWaitBillFlag = false;
                this.currentPage = 1;
                this.sortFlag = false;
                this.sort = null;
                this.order = null;
                this.getBills();
            },
            //承認待ちボタン
            onSubmit() {
                this.onSubmitFlag = true;
                this.conditionFlag = false;
                this.getEditWaitBillFlag = false;
                this.currentPage = 1;
                this.$http.post('/bill/getOnSubmit', {
                    currentPage: this.currentPage,
                    pagesize: this.pagesize
                }).then(res => {
                    if (res.data.code == 200) {
                        this.billTableData = res.data.data;
                        this.totalBill = res.data.data[0].totalBill;
                    }
                });
            },

            //改修権限申請待ちボタン
            getEditWaitBill() {
                this.onSubmitFlag = false;
                this.conditionFlag = false;
                this.getEditWaitBillFlag = true;
                this.currentPage = 1;
                this.$http.post('/bill/getEditWaitBill', {
                    currentPage: this.currentPage,
                    pagesize: this.pagesize
                }).then(res => {
                    if (res.data.code == 200) {
                        this.billTableData = res.data.data;
                        this.totalBill = res.data.data[0].totalBill;
                    }
                });
            },

            //ダウンロードボタン
            download() {
                this.$http.post('/bill/downloadBill', this.multipleSelection, { responseType: 'blob' }).then(res => {
                    const blob = new Blob([res.data]);
                    const url = window.URL.createObjectURL(blob);

                    // 创建一个 <a> 标签用于下载
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'downloaded_file.txt'; // 设置下载文件的名称
                    link.click();

                    // 释放资源
                    window.URL.revokeObjectURL(url);
                });
            },
            //当帳票の詳細を表示する
            handleRowClick(row) {
                
                this.$http.get('/bill/getBillDetails/' + row.billno).then(res => {
                    
                    if (res.data.code == 200) {
                        sessionStorage.setItem('billno', res.data.data[0].billno);
                        console.log("取值时候的session： ",sessionStorage.getItem('billno'));
                        // 新建的时候需要clear
                        this.Logs=[]
                        for (let i = 0; i < res.data.data.length; i++) {
                            if (i == 0) {
                                this.bill = res.data.data[i];
                                console.log("i=",i ,":",this.bill)
                            } else {
                                this.Logs.push(res.data.data[i]);
                            }
                        }
                    }
                    console.log("/////")
                console.log("this.bill: ",this.bill)
                
                //編集権限を判断する
                // agree的条件可能要改
                // 置之死地而后生
                if (sessionStorage.getItem("rolesno") == 3) {
                    if (this.bill.reviewStatus == 1 || this.bill.reviewStatus == 2 ) {
                    // console.log(this.agreeBt)
                    this.agreeBt = true;
                    this.disagreeBt = true;
                    }else{
                    this.agreeBt = false;
                    this.disagreeBt = false;
                 }
                    
                }else{
                    this.agreeBt = false;
                    this.disagreeBt = false;
                }
               
            
                if (this.bill.reviewStatus == 6 && this.bill.editPermissions && sessionStorage.getItem("rolesno") == 1) {
                    console.log("if-true")
                    this.editBt = true;
                    
                } else {
                    console.log("if-else")
                    this.editBt = false;
                }


                if (sessionStorage.getItem("rolesno") == 3 && this.bill.reviewStatus == 5) {
                    this.givePermission = true;

                } else {
                    this.givePermission = false;
                }

                if ( this.bill.reviewStatus == 3) {
                    this.applyPermission = true;

                } else {
                    this.applyPermission = false;
                }

                this.drawerflag = true;
                });

                
               
            },
            //アップロードしたファイルを表示する
            handleAvatarSuccess(response) {
                this.bill.imageUrl = response;
            },
            //サーバーからデータを取得する
            loadCustomers() {
                this.$http.get('/category/getCustomers').then(res => {
                    if (res.data.code == 200) {
                        this.customers = res.data.data;
                    }
                });
            },
            // 下拉菜单读取 searchManage
            loadsearchManage() {
                this.$http.get('/bill/getSearchmanage/'+sessionStorage.getItem('userid')).then(res => {
                    console.log(sessionStorage.getItem('userid'))
                    if (res.data.code == 200) {
                        this.searchManages = res.data.data;
                    }
                });
            },
            // 
            loadBillTypes() {
                this.$http.get('/category/getBillTypes').then(res => {
                    if (res.data.code == 200) {
                        this.billTypes = res.data.data;
                    }
                });
            },
            loadUpdateUsers() {
                this.$http.get('/bill/getUpdateUserids').then(res => {
                    if (res.data.code == 200) {
                        this.updateUsers = res.data.data;
                    }
                });
            },
            isPDF(url) {
                return url.toLowerCase().endsWith('.pdf');
            },
        },
        //画面がロードされたら、取引先などのデータを取得する
        mounted() {
            this.loadCustomers();
            this.loadBillTypes();
            this.loadUpdateUsers();
            this.loadsearchManage();
            this.getBills();
            var rolesno = sessionStorage.getItem("rolesno");
            switch (rolesno) {
                case '1':
                    this.reviewBt = false;
                    this.downloadBt = false;
                    this.editBt = true;
                    this.getEditWaitBillBt = true;
                    this.applyEditPermissonsBt = true;
                    this.rolesno1Bt = true;
                    break;
                case '2':
                    this.reviewBt = false;
                    this.downloadBt = true;
                    this.getApplyEditPermissonsBt = false;
                    break;
                case '3':
                    this.reviewBt = true;
                    this.downloadBt = true;
                    this.agreeBt = false;
                    this.disagreeBt = false;
                    this.editPermissonsBt = true,
                    this.getEditWaitBillBt = true;
                    this.applyEditPermissonsBt = false;
                    
                    break;
                case "4":
                    this.editFlag = true;
                    this.reviewBt = true;
                    this.downloadBt = true;
                    this.editBt = true;
                    this.agreeBt = false;
                    this.disagreeBt = false;
                    this.editPermissonsBt = true;
                    this.getEditWaitBillBt = true;
                    this.applyEditPermissonsBt = true;
                    break;
            }

            //日付の設定
            flatpickr(this.$refs.datepickerInput1, {
                dateFormat: 'Y/m/d',
                locale: 'ja',
                firstDayOfWeek: '0',
                allowInput: 'true',
                minDate: "1990/01/01",
                maxDate: "today",

            });
            flatpickr(this.$refs.datepickerInput2, {
                dateFormat: 'Y/m/d',
                locale: 'ja',
                firstDayOfWeek: '0',
                allowInput: 'true',
                minDate: "1990/01/01",
                maxDate: "today",
            });
            


        },

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
        text-align: center;
        width: 88%;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
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