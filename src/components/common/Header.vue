<template>
  <div :class="{dragable: isMac}">
    <el-menu ref="menu" mode="horizontal" @select="menuSelect" default-active="none">
      <el-menu-item index="none" style="width: 0"></el-menu-item>

      <template v-if="isElectron">
        <el-menu-item class="control-area control-item">
          <div v-show="!isMac">
            <el-button type="danger" size="mini" circle class="control-item" @click="close"></el-button>
            <el-button type="warning" size="mini" circle class="control-item" @click="minimize"></el-button>
            <el-button type="success" size="mini" circle class="control-item" @click="maximize"></el-button>
          </div>
        </el-menu-item>
        <el-menu-item class="dragable control-item dragable-left"></el-menu-item>
      </template>

      <el-menu-item index="home" class="title-item">
        <template slot="title">
          <router-link :to="`${isLogined? '/' : '#'}`" class="el-link" draggable="false">
            <h1 style="margin: 0; font-size: 26px;">{{ title }}</h1>
          </router-link>
        </template>
      </el-menu-item>

      <template v-if="isElectron">
        <el-menu-item :class="{'dragable-right': isLogined, 'dragable-right-no-menu':!isLogined}"
                      class="dragable control-item"></el-menu-item>
      </template>

      <template v-if="isLogined">
        <el-submenu index="user" style="float: right;">
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
      return !!this.remote;
    },
    isMac() {
      return this.isElectron && this.remote.process.platform === 'darwin';
    },
    window() {
      return this.remote.getCurrentWindow();
    },
  },
  data() {
    return {
      remote: null,
      last_click_time: 0,
    };
  },
  created() {
    let electron = this.$helper.getElectron()
    if (electron)
      this.remote = electron.remote
  },
  mounted() {
    this.$refs.menu.$on('item-click', () => {
      let now = this.now();
      if (now - this.last_click_time <= 200)
        this.maximize();
      this.last_click_time = now;
    });
  },
  methods: {
    now() {
      return new Date().getTime();
    },
    menuSelect(index) {
      if (index === 'change_password') {
        this.$refs.change_pwd_dialog.open();
      } else if (index === 'logout') {
        this.$store.commit('logout');
        this.$router.push('/login');
      } else {
        this.$refs.menu.activeIndex = '';
      }
    },
    close() {
      this.window.close()
    },
    minimize() {
      this.window.minimize()
    },
    maximize() {
      if (this.window.isMaximized())
        this.window.unmaximize()
      else
        this.window.maximize()
    },
  }
}
</script>

<style scoped>
.dragable {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.dragable-left {
  /* 50% - padding - control-area - title/2 */
  width: calc(50vw - 20px - 72px - 64px);
}

.dragable-right {
  /* 50% - padding - right_menu - title/2 */
  width: calc(50vw - 20px - 100px - 64px - 20px);
}

.dragable-right-no-menu {
  /* 50% - padding - right_menu - title/2 */
  width: calc(50vw - 20px - 64px);
}

.control-item {
  cursor: default;
}

.el-menu-item {
  padding: 0;
}

.control-area {
  position: relative;
  width: 72px;
  top: -4px;
  left: -2px;
}

.title-item {
  width: 128px;
  text-align: center;
}
</style>
