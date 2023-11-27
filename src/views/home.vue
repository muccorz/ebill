<template>
  <div id="app">
    <el-container style="height: 100%; border: 1px solid #eee" class="position-absolute w-100" >
      <el-aside width="200px">
        <el-menu class="h-100" router>
          <el-menu-item-group style="background-color: rgb(238, 241, 246)" class="h-100 h6">
            <p style="font-weight: 600; font-size: 19px;">xxxx株式会社</p>
            <el-menu-item index="/roles" v-if="rolesBt">ユーザー管理</el-menu-item>
            <!-- <el-menu-item index="/category" v-if="categoryBt">カテゴリー管理</el-menu-item> -->
            <!-- 这下面加两个小标签  -->
              <!--  -->
              <!--  -->
             
              <el-submenu>
                <template slot="title"  v-if="categoryBt" >カテゴリー管理</template>
                <el-menu-item @click="$router.push('/billStyle')" :class="{ 'is-active': currentTab === 'billType' }">
                  帳票種類
                </el-menu-item>
                <el-menu-item @click="$router.push('/customer')" :class="{ 'is-active': currentTab === 'customer' }">
                  取引先
                </el-menu-item>
                <!-- 其他子菜单项 -->
              </el-submenu>
          

             <!--  -->
            <el-menu-item index="/search">電子取引検索</el-menu-item>
            <el-menu-item index="/create" v-if="createBt">電子取引新規</el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 14px;">
          <span>{{user.role}}:{{user.username}}</span>
        </el-header>
        <!-- 使用插槽加载子路由的页面 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  export default {
    created() {
      this.user.rolesno = sessionStorage.getItem('rolesno');
      this.user.username = sessionStorage.getItem('username');
      //根据用户权限显示不同菜单
      switch (this.user.rolesno) {
        case '1':
          this.user.role = '操作者';
          this.$router.push('/create')
          this.rolesBt = false;
          this.categoryBt = false;
          break;
        case '2':
          this.user.role = '閲覧者';
          this.$router.push('/search')
          this.rolesBt = false;
          this.categoryBt = false;
          this.createBt = false;
          break;
        case '3':
          this.user.role = '管理者';
          this.$router.push('/search')
          this.rolesBt = false;
          this.categoryBt = false;
          this.createBt = false;
          break;
        case '4':
          this.user.role = 'システム管理者';
          this.$router.push('/roles')
          break;
      }
    },
    name: 'HomeView',
    data() {
      return {
        createBt: true,
        rolesBt: true,
        categoryBt: true,
        user: {
          username: '',
          rolesno: '',
          role:'',
        }

      }
    },
    methods: {

    },
  }
</script>
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>