<template>
    <div style="text-align: left;">
        <div class="h4" style="font-weight: 700;text-align:left">ユーザー管理</div>
        <el-divider></el-divider>
        <el-button type="primary" class="mt-2 el-icon-edit" @click="CreateUserVisible= true">ユーザー新規</el-button>
        <!-- ユーザー新規ダイアログ -->
        <el-dialog title="ユーザー新規" :visible.sync="CreateUserVisible" :close-on-click-modal="false" @closed="userInit">
            <el-form :model="user">
                <el-form-item label="ユーザーID">
                    <span class="text-danger" style="font-size: 12px;" v-if="flag1">ユーザーIDを入力してください</span>
                    <span class="text-danger" style="font-size: 12px;" v-if="flag3">ユーザーIDは数字のみ</span>
                    <el-input v-model="user.userid" autocomplete="off" placeholder="ユーザーIDを入力してください"
                        @blur="handUserid"></el-input>
                </el-form-item>
                <el-form-item label="ユーザー名">
                    <span class="text-danger" style="font-size: 12px;" v-if="flag4">ユーザー名を入力してください</span>
                    <el-input v-model="user.username" placeholder="ユーザー名を入力してください" @blur="handleUsername"></el-input>
                </el-form-item>
                <el-form-item label="パスワード">
                    <span class="text-danger" style="font-size: 12px;" v-if="flag2">パスワードを入力してください</span>
                    <el-input v-model="user.password" placeholder="パスワードを入力してください" show-password
                        @blur="handlePassword"></el-input>
                </el-form-item>
                <el-form-item label="ユーザー権限">
                    <el-select v-model="user.rolesno" placeholder="権限種類を選択してください" style="width: 100%;">
                        <el-option label="操作者" value="1"></el-option>
                        <el-option label="閲覧者" value="2"></el-option>
                        <el-option label="管理者" value="3"></el-option>
                        <el-option label="システム管理者" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 多选框 -->

                <el-checkbox-group v-model="checkList">
                    <el-checkbox v-for="role in roles" :key="role.no" :label="role.no">{{ role.roleName }}</el-checkbox>
                </el-checkbox-group>

                <!--  -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="CreateUserVisible = false">キャンセル</el-button>
                <el-button type="primary" @click="createUser" :disabled="!canLogin">追 加</el-button>
            </div>
        </el-dialog>

        <el-table :data="users" style="width: 100%">
            <el-table-column prop="userid" label="ユーザー番号">
            </el-table-column>
            <el-table-column prop="username" label="ユーザー名">
            </el-table-column>
            <el-table-column prop="rolesno" label="権限" :formatter="userFormatter">
            </el-table-column>
            <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                    <button type="button" class="el-button el-button--primary el-button--small"
                        @click="editUserbt(scope.row)">編集</button>
                    <!-- ユーザー編集ダイアログ -->
                    <el-dialog title="ユーザー編集" :visible.sync="editUserVisible" :close-on-click-modal="false"
                        @closed="userInit">
                        <el-form :model="user">
                            <el-form-item label="ユーザーID">
                                <span class="text-danger" style="font-size: 12px;" v-if="flag1">ユーザーIDを入力してください</span>
                                <span class="text-danger" style="font-size: 12px;" v-if="flag3">ユーザーIDは数字のみ</span>
                                <el-input v-model="user.userid" autocomplete="off" placeholder="ユーザーIDを入力してください"
                                    @blur="handUserid"></el-input>
                            </el-form-item>
                            <el-form-item label="ユーザー名">
                                <span class="text-danger" style="font-size: 12px;" v-if="flag4">ユーザー名を入力してください</span>
                                <el-input v-model="user.username" placeholder="ユーザー名を入力してください"
                                    @blur="handleUsername"></el-input>
                            </el-form-item>
                            <el-form-item label="パスワード">
                                <el-input v-model="user.password" placeholder="パスワードを編集したい方のみ入力" show-password
                                    @blur="handlePassword"></el-input>
                            </el-form-item>
                            <el-form-item label="ユーザー権限">
                                <el-select v-model="user.rolesno" placeholder="権限種類を選択してください" style="width: 100%;">
                                    <el-option v-for="role in roles" :key="role.no" :label="role.roleName"
                                        :value="role.no">
                                    </el-option>
                                    <!-- <el-option key="1" label="操作者" value="1"></el-option>
                                    <el-option key="2" label="閲覧者" value="2"></el-option>
                                    <el-option key="3" label="管理者" value="3"></el-option>
                                    <el-option key="4" label="システム管理者" value="4"></el-option> -->
                                </el-select>
                            </el-form-item>
                            <!-- 用户阅览（检索）权限多选 -->
                            <!--  -->

                            <el-checkbox-group v-model="checkList">
                                <el-checkbox v-for="role in roles" :key="role.no" :label="role.no">{{ role.roleName }}</el-checkbox>
                            </el-checkbox-group>

                            <!--  -->
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="editUserVisible = false">キャンセル</el-button>
                            <el-button type="primary" @click="editUser" :disabled="!canEdit">完 了</el-button>
                        </div>
                    </el-dialog> &nbsp;
                    <button type="button" class="el-button el-button--danger el-button--small"
                        @click="deleteUser(scope.row)">削除</button>
                </template>

            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: 'rolesView',
        data() {
            return {
                CreateUserVisible: false,
                editUserVisible: false,
                //ユーザー新規フォーム
                user: {
                    userid: '',
                    username: '',
                    password: '',
                    rolesno: ''
                },
                formLabelWidth: '100px',
                //サーバーから取得したユーザーデータ
                users: [],
                flag1: false,
                flag2: false,
                flag3: false,
                flag4: false,
                roles: [
                    { no: 1, roleName: '操作者' },
                    { no: 2, roleName: '閲覧者' },
                    { no: 3, roleName: '管理者' },
                    { no: 4, roleName: 'システム管理者' }
                ],
                checkList:[],
            }
        },
        computed: {
            canLogin() {
                return !this.flag1 && !this.flag2 && !this.flag3 && !this.flag4 && this.user.userid.length != 0 && this.user.username.length != 0 && this.user.password.length != 0 && this.user.rolesno.length != 0
            },
            canEdit() {
                return !this.flag1 && !this.flag3 && !this.flag4 && this.user.userid.length != 0 && this.user.username.length != 0 && this.user.rolesno.length != 0
            }
        },
        created() {
            this.init()
        },
        methods: {
            // ユーザー編集，user对象的密码可能为空，如果为空就不update密码字段
            editUser() {
                this.$http
                    .post("/user/editUser", this.user)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.editUserVisible = false;
                            this.$message({
                                message: 'ユーザー編集成功',
                                type: 'success'
                            });
                            this.init();
                        }
                    })
                this.editUserVisible = false;
            },
            editUserbt(user) {
                this.editUserVisible = true,
                    this.user.userid = user.userid,
                    this.user.username = user.username,
                    this.user.rolesno = user.rolesno
            },
            // ユーザー削除
            deleteUser(user) {
                this.$confirm('これでユーザーは完全に削除されます，続きますが？', 'このユーザーを削除しますか？', {
                    confirmButtonText: '続く',
                    cancelButtonText: 'キャンセル',
                    type: 'warning'
                }).then(() => {
                    this.$http
                        .get("/user/deleteUser/" + user.userid)
                        .then(res => {
                            if (res.data.code == 200) {
                                this.$message({
                                    message: '削除成功',
                                    type: 'success'
                                });
                                this.init()
                            }
                        })
                })
            },
            // ユーザー新規
            createUser() {
                this.$http
                    .post("/user/createUser", this.user)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.CreateUserVisible = false;
                            this.$message({
                                message: 'ユーザー新規成功',
                                type: 'success'
                            });
                            this.init();
                        }
                    })
                this.CreateUserVisible = false;
            },
            // ユーザー権限のフォーマット
            userFormatter(row) {
                if (row.rolesno == 1) {
                    return '操作者'
                } else if (row.rolesno == 2) {
                    return '閲覧者'
                } else if (row.rolesno == 3) {
                    return '管理者'
                } else if (row.rolesno == 4) {
                    return 'システム管理者'
                }
            },
            // ユーザーIDのバリデーション
            handUserid() {
                if (this.user.userid == '') {
                    this.flag1 = true
                } else {
                    this.flag1 = false
                }
                if (this.user.userid.length != 0 && !/^[0-9]+$/.test(this.user.userid)) {
                    this.flag3 = true
                } else {
                    this.flag3 = false
                }
            },
            // ユーザー名のバリデーション
            handleUsername() {
                if (this.user.username == '') {
                    this.flag4 = true
                } else {
                    this.flag4 = false
                }
            },
            // パスワードのバリデーション
            handlePassword() {
                if (this.user.password == '') {
                    this.flag2 = true
                } else {
                    this.flag2 = false
                }
            },
            //ユーザー一覧取得、初期化クリア
            init() {
                this.$http.get("/user/getUsers")
                    .then(res => {
                        if (res.data.code == 200) {
                            this.users = res.data.data
                        }
                    })
                this.userInit();
            },
            userInit() {
                this.user.userid = '',
                    this.user.username = '',
                    this.user.password = '',
                    this.user.rolesno = '',
                    this.flag1 = false,
                    this.flag2 = false,
                    this.flag3 = false,
                    this.flag4 = false
            },
        },
    }
</script>
<style scoped>

</style>