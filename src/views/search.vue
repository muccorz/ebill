<template>
    <div>
        <div class="h4" style="font-weight: 700;text-align:left">電子取引管理</div>
        <el-divider></el-divider>
        <!-- 条件付き検索 -->
        <el-row :gutter="20">
            <el-col :span="16">
                <el-form :inline="true" :model="condition" class="demo-form-inline ">
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
                            <el-option v-for="customer in customers" :key="customer.customerno" :label="customer.customer"
                                :value="customer.customerno">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="帳票種類">
                        <el-select v-model="condition.billTypeno" filterable placeholder="入力又は選択">
                            <el-option v-for="billType in billTypes" :key="billType.billTypeno" :label="billType.billType"
                                :value="billType.billTypeno">
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
                <el-button type="primary" @click="onWait" v-if="reviewBt">待修改</el-button>
                <el-button type="primary" @click="onSubmit" v-if="reviewBt">承認待ち</el-button>

                <!-- v-if ：显示不显示这个按钮  -->
                <el-button type="primary" @click="download" v-if="downloadBt" :disabled="exportBt">エクスポート</el-button>
            </el-col>
        </el-row>

        <!-- 帳票テーブル -->
        <el-table :data="billTableData" style="width: 100%" @selection-change="handleSelectionChange"
            @row-click="handleRowClick" @sort-change="sortChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="billno" label="帳票番号" sortable="sortable">
            </el-table-column>
            <el-table-column prop="transactionymd" label="取引年月日" sortable="sortable">
            </el-table-column>
            <el-table-column prop="transactionAmount" label="取引金額" sortable="sortable">
            </el-table-column>
            <el-table-column prop="customer" label="取引先">
            </el-table-column>
            <el-table-column prop="billType" label="帳票種類">
            </el-table-column>
        </el-table>

        <!-- 帳票詳細drawer -->

        <el-drawer title="履歴" :visible.sync="drawerflag" size="80%" @closed="clearBill">
            <div style="margin: 30px 100px; " class="d-flex">
                <div style="width: 44%;">
                    <el-form ref="form" :model="bill" label-width="120px" :disabled="true">
                        <el-form-item label="帳票No">
                            <span style="font-size: 16px;">{{ bill.billno }}</span>
                        </el-form-item>

                        <el-form-item label="取引年月日">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input v-model="bill.transactionymd" style="width: 85%;"></el-input>
                        </el-form-item>
                        <el-form-item label="取引金額">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input v-model="bill.transactionAmount" style="width: 85%;"></el-input>
                        </el-form-item>
                        <el-form-item label="取引先">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input v-model="bill.customer" style="width: 85%;"></el-input>
                        </el-form-item>
                        <el-form-item label="帳票種類">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input v-model="bill.billType" style="width: 85%;"></el-input>
                        </el-form-item>
                        <el-form-item label="訂正備考">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input type="textarea" :rows="3" v-model="bill.remark" style="width: 85%;"></el-input>
                        </el-form-item>
                        <el-form-item label="登録日時">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input v-model="bill.updateymd" style="width: 85%;"></el-input>
                        </el-form-item>
                        <el-form-item label="登録ユーザー">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input v-model="bill.updateUserName" style="width: 85%;"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button size="medium" type="primary" @click="edit" :disabled="editBt">訂正</el-button>
                    <el-button size="medium" type="primary" @click="agree" :disabled="agreeBt">承認</el-button>
                    <el-button size="medium" type="info" @click="disagree"
                        :disabled="disagreeBt">拒否</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button size="medium" type="warning" @click="giveEditPermissons"
                        v-if="editPermissonsBt">訂正権限を付く</el-button>
                </div>
                <embed :src="bill.imageUrl" type="application/pdf" width="50%" height="70%"
                    style="position: absolute; top: 5%; right: 2%;">
                <!-- <el-upload class="avatar-uploader" action="http://127.0.0.1:8081" :show-file-list="false"
                    :on-error="handleAvatarSuccess"> -->
                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                <!-- </el-upload> -->
            </div>
            <el-table :data="bill.Logs" :border="true" style="width: 80%;margin-top: 4%;margin-left: 3%;">
                <el-table-column prop="date" label="取引年月日">
                </el-table-column>
                <el-table-column prop="money" label="取引金額">
                </el-table-column>
                <el-table-column prop="custom" label="取引先">
                </el-table-column>
                <el-table-column prop="paper" label="帳票種類">
                </el-table-column>
                <el-table-column prop="log" label="訂正備考">
                </el-table-column>
                <el-table-column prop="date2" label="登録日時">
                </el-table-column>
                <el-table-column prop="user" label="登録ユーザー">
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
    name: 'billView',
    data() {
        return {
            drawerflag: false,
            multipleSelection: [],

            //ロジック処理
            conditionFlag: false,
            sortFlag: false,
            onSubmitFlag: false,
            // ⬇️
            onWaitFlag: false,
            // 


            //ボタンの有効化
            editBt: true,
            agreeBt: true,
            disagreeBt: true,
            reviewBt: false,
            downloadBt: false,
            editPermissonsBt: false,

            //順番処理
            sort: false,
            order: '',

            //ページング部分の機能
            totalBill: '',
            currentPage: 1,
            pagesize: 10,

            //条件付き検索部分の機能
            customers: [],
            billTypes: [],
            updateUsers: [],
            timeout: null,
            date: '',

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
                Logs: [],
            },

            //帳票一覧
            billTableData: [],

            //検索条件
            // 对应的选框
            condition: {
                transactionDateFrom: '',
                transactionDateTo: '',
                transactionAmountFrom: '',
                transactionAmountTo: '',
                customerno: '',
                billTypeno: '',
                updateuserid: '',
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
    //内部条件发生变化时 进行一次判断 这段是导出按钮亮不亮的逻辑

    methods: {
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
            this.$http.get('/bill/giveEditPermissons/' + this.bill.billno).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '編集権限を付く完了'
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
            this.$http.get('/bill/agreeBill').then(res => {
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
            this.$http.get('/bill/disagreeBill').then(res => {
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
        //A&&B（&&C） 或 A&&C 会影响请求（返回sql不同）
        // getBillsByFlag() {
        //     if (this.sortFlag == false) {
        //         if (this.conditionFlag == true) {
        //             this.$http.post('/bill/conditionSearch', {
        //                 currentPage: this.currentPage,
        //                 pagesize: this.pagesize,
        //                 condition: this.condition
        //             }).then(res => {
        //                 if (res.data.code == 200) {
        //                     this.billTableData = res.data.data;
        //                     this.totalBill = res.data.data[0].totalBill;
        //                 }
        //             });
        //         } else if (this.onSubmitFlag == true) {
        //             this.$http.post('/bill/getOnSubmit', {
        //                 currentPage: this.currentPage,
        //                 pagesize: this.pagesize
        //             }).then(res => {
        //                 if (res.data.code == 200) {
        //                     this.billTableData = res.data.data
        //                     this.totalBill = res.data.data[0].totalBill;
        //                 }
        //             });
        //         } else {
        //             this.getBills();
        //         }
        //     } else {
        //         if (this.conditionFlag == true) {
        //             this.$http.post('/bill/conditionSearch', {
        //                 currentPage: this.currentPage,
        //                 pagesize: this.pagesize,
        //                 condition: this.condition,
        //                 sort: this.sort,
        //                 order: this.order
        //             }).then(res => {
        //                 if (res.data.code == 200) {
        //                     this.billTableData = res.data.data;
        //                     this.totalBill = res.data.data[0].totalBill;
        //                 }
        //             });//then是返回的东西是res 括号里面对res的操作
        //         } else if (this.onSubmitFlag == true) {
        //             this.$http.post('/bill/getOnSubmit', {
        //                 currentPage: this.currentPage,
        //                 pagesize: this.pagesize,
        //                 sort: this.sort,
        //                 order: this.order
        //             }).then(res => {
        //                 if (res.data.code == 200) {
        //                     this.billTableData = res.data.data
        //                     this.totalBill = res.data.data[0].totalBill;
        //                 }
        //             });
        //         } else {
        //             this.$http.post('/bill/getBills', {
        //                 currentPage: this.currentPage,
        //                 pagesize: this.pagesize,
        //                 sort: this.sort,
        //                 order: this.order
        //             }).then(res => {
        //                 if (res.data.code == 200) {
        //                     this.billTableData = res.data.data;
        //                     this.totalBill = res.data.data[0].totalBill;
        //                 }
        //             });
        //         }
        //     }
        // },

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
                } else if (this.onWaitFlag == true) {
                    this.$http.post('/bill/getOnWait', {
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
                    });//then是返回的东西是res 括号里面对res的操作
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
                } else if (this.onWaitFlag == true) {
                    this.$http.post('/bill/getOnWait', {
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

            // ⬇️校验逻辑
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
            // 上面是数据校验

            // 下面是数据处理逻辑

            // **记得加flag处理
            this.conditionFlag = true;
            this.onSubmitFlag = false;
            // 
            this.onWaitFlag = false;
            // 
            this.currentPage = 1;//重置
            this.$http.post('/bill/conditionSearch', {
                currentPage: this.currentPage,
                pagesize: this.pagesize,
                condition: this.condition
            }).then(res => {
                if (res.data.code == 200) {
                    this.billTableData = res.data.data;
                    this.totalBill = res.data.data[0].totalBill;
                    // totalBill 计算页数 
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
            this.condition.billTypeno = '';
            this.condition.updateuserid = '';
            this.onSubmitFlag = false;
            this.conditionFlag = false;
            // 
            this.onWaitFlag = false;
            // 
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
            // 
            this.onWaitFlag = false;
            // 
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
        // 
        // 所有的flag同时加入判断 按钮
        // 
        onWait() {
            this.onSubmitFlag = false;
            this.conditionFlag = false;
            // 
            this.onWaitFlag = true;
            // 
            this.currentPage = 1;
            this.$http.post('/bill/getOnWait', {
                currentPage: this.currentPage,
                pagesize: this.pagesize
            }).then(res => {
                if (res.data.code == 200) {
                    this.billTableData = res.data.data;
                    this.totalBill = res.data.data[0].totalBill;
                }
            });
        },

        // 
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
                    for (let i = 0; i < res.data.data.length; i++) {
                        if (i == 0) {
                            this.bill = res.data.data[i];
                        } else {
                            this.bill.Logs[i] = res.data.data[i];
                        }

                    }
                }
            });
            //編集権限を判断する
            if (this.bill.reviewStatus == 1) {
                this.agreeBt = true;
                this.disagreeBt = true;
            }
            if (!this.bill.editPermissions) {
                if (sessionStorage.getItem("rolesno") == 4 || sessionStorage.getItem("rolesno") == 3) {
                    this.editPermissonsBt = true;
                }
                this.editBt = true;
            } else {
                this.editPermissonsBt = false;
            }
            this.drawerflag = true;
        },
        //アップロードしたファイルを表示する
        handleAvatarSuccess(response) {
            console.log(response);
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
    },
    //画面がロードされたら、取引先などのデータを取得する
    mounted() {
        this.loadCustomers();
        this.loadBillTypes();
        this.loadUpdateUsers();
        this.getBills();
        var rolesno = sessionStorage.getItem("rolesno");
        // **
        // sessionStorage.setItem('username', res.data.data.username)
        // sessionStorage.setItem('userid', res.data.data.userid)
        // **
        switch (rolesno) {
            // 
            case '1':
                this.reviewBt = false;
                this.downloadBt = false;
                this.editBt = false;

                break;
            case '2':
                this.reviewBt = false;
                this.downloadBt = true;
                break;
            case '3':
                this.reviewBt = true;
                this.downloadBt = true;
                this.agreeBt = false;
                this.disagreeBt = false;

                break;
            case "4":
                this.editFlag = true;
                this.reviewBt = true;
                this.downloadBt = true;
                this.editBt = false;
                this.agreeBt = false;
                this.disagreeBt = false;
                this.editPermissonsBt = true;
                break;
        }

        //日付の設定
        // 
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