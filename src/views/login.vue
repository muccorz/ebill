<template>
  <div id="app">
    <div class="d-flex h-100 position-absolute w-100 align-items-center justify-content-center">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>ユーザーログイン</span>
        </div>
        <el-form ref="form" @keyup.native.enter="loginEnter">
          <el-form-item label="ユーザーID">
            <span class="text-danger" style="font-size: 12px;" v-if="flag1">ユーザーIDを入力してください</span>
            <span class="text-danger" style="font-size: 12px;" v-if="flag3">ユーザーIDは数字のみ</span>
            <el-input v-model="user.userid" placeholder="ユーザーIDを入力してください" @blur="handleUserid"></el-input>
          </el-form-item>
          <el-form-item label="パスワード">
            <span class="text-danger" style="font-size: 12px;" v-if="flag2">パスワードを入力してください</span>
            <el-input v-model="user.password" placeholder="パスワードを入力してください" show-password
              @blur="handlePassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login" :disabled="!canLogin">ログイン</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LoginView',
    data() {
      return {
        // ユーザー情報
        user: {
          userid: '',
          password: ''
        },
        // バリデーションフラグ
        flag1: false,
        flag2: false,
        flag3: false,
      }
    },
    computed: {
      canLogin() {
        return !this.flag1 && !this.flag2 && !this.flag3 && this.user.userid.length != 0 && this.user.password.length != 0
      }
    },
    methods: {
      loginEnter() {
        if (this.canLogin) {
          this.login()
        }
      },
      // ユーザー名のバリデーション
      handleUserid() {
        if (this.user.userid == '') {
          this.flag1 = true
        } else {
          this.flag1 = false
        }
        // ユーザーIDは数字のみ
        if (this.user.userid.length != 0 && !/^[0-9]+$/.test(this.user.userid)) {
          this.flag3 = true
        } else {
          this.flag3 = false
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
      // ログイン処理
      login() {
        this.$http.post('/login', this.user)
          // ログイン成功，ホーム画面へ遷移
          .then((res) => {
            if (res.data.code == 200) {
              sessionStorage.setItem('username', res.data.data.username)
              sessionStorage.setItem('rolesno', res.data.data.rolesno)
              sessionStorage.setItem('userid', res.data.data.userid)
              // 
              this.$router.push({ path: '/home' })
            }
          })
      }
    }
  }
</script>

<style>
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