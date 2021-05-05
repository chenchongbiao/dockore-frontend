<template>
  <div class="titlebar">
    <el-menu mode="horizontal" @select="menuSelect" ref="menu">
      <el-menu-item index="home" :class="`${isElectron? 'title': ''}`">
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
    <ChangePasswordDialog ref="change_pwd_dialog"></ChangePasswordDialog>
  </div>
</template>

<script>
import ChangePasswordDialog from "@/components/user/ChangePasswordDialog";

export default {
  name: "Header",
  components: {ChangePasswordDialog},
  computed: {
    isLogined() {
      return !!this.username;
    },
    username() {
      return this.$store.getters.userInfo.username;
    },
    title() {
      return this.$text.global.project.name;
    },
    isElectron() {
      return process.env.IS_ELECTRON;
    },
  },
  methods: {
    menuSelect(index) {
      if (index === 'change_password') {
        this.$refs.change_pwd_dialog.open();
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
.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.title {
  width: 128px;

  /* el-menu padding: 40px */
  margin-left: calc(50vw - 64px - 40px);
}
</style>
