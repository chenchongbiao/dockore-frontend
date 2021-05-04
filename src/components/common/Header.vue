<template>
  <el-menu mode="horizontal" @select="menuSelect" ref="menu">
    <el-menu-item index="home">
      <template slot="title">
        <router-link to="/" class="el-link">
          <h1 style="margin: 0; font-size: 26px;">{{ title }}</h1>
        </router-link>
      </template>
    </el-menu-item>
    <template v-if="isLogined">
      <el-submenu index="user" style="float: right">
        <template slot="title">{{ username }}</template>
        <el-menu-item index="change_password">
          <i class="el-icon-key"></i> 修改密码
        </el-menu-item>
        <el-menu-item index="logout">
          <i class="el-icon-switch-button"></i> 注销
        </el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
export default {
  name: "Header",
  computed: {
    isLogined() {
      return !!this.username;
    },
    username() {
      return this.$store.getters.userInfo.username;
    },
    title() {
      return this.$text.global.project.name;
    }
  },
  methods: {
    menuSelect(index) {
      if (index === 'change_password') {
        this.$bus.$emit(this.$event.change_password)
      } else if (index === 'logout') {
        this.$store.commit('logout');
        this.$router.push('/login');
      } else if (index === 'home') {
        this.$refs.menu.activeIndex = '';
      }
    }
  }
}
</script>

<style scoped>

</style>
