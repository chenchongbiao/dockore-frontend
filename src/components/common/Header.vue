<template>
  <el-menu mode="horizontal" @select="menuSelect">
    <el-menu-item>
      <template slot="title">
        <router-link to="/"><h1 style="margin: 0">Dockore</h1></router-link>
      </template>
    </el-menu-item>
    <template v-if="isLogined">
      <el-submenu index="2" style="float: right">
        <template slot="title">{{username}}</template>
        <el-menu-item index="logout"><i class="el-icon-switch-button"></i> 注销</el-menu-item>
      </el-submenu>
    </template>
    <el-menu-item index="3" style="float: right" v-else>
      <router-link to="/login">登录</router-link>
    </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    name: "Header",
    computed: {
      isLogined() {
        return this.$store.getters.userToken !== null;
      },
      username() {
        return this.$store.getters.userInfo.username;
      },
    },
    methods: {
      menuSelect(index){
        if (index === 'logout') {
          this.$store.commit('setUserInfo', null);
          this.$store.commit('setUserToken', null);
          this.$router.push('/login');
        }
      }
    }
  }
</script>

<style scoped>

</style>
