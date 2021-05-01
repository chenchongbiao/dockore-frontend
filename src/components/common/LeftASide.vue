<template>
  <div style="text-align: center">
    <el-menu ref="menu" v-model="menu_index" :default-active="menu_index"
             :router="true" :collapse="collapse" class="left-aside">
      <el-menu-item v-for="item in menu_items" :key="item.path" :index="item.path">
        <i :class="item.icon"></i>
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "LeftASide",
  data() {
    return {
      menu_index: null,
      menu_items: [
        {path: '/system/version', title: '系统版本', icon: 'el-icon-warning-outline'},
        {path: '/system/config', title: '系统设置', icon: 'el-icon-setting'},
        {path: '/image', title: '镜像管理', icon: 'el-icon-document-copy'},
        {path: '/container', title: '容器管理', icon: 'el-icon-copy-document'},
      ],
      collapse: false,
    }
  },
  created() {
    for (let item of this.menu_items) {
      if (this.$route.path.indexOf(item.path) === 0) {
        this.menu_index = item.path;
      }
    }
  },
  mounted() {
    window.onresize = this.fit;
    this.fit();
  },
  methods: {
    fit() {
      this.collapse = document.body.clientWidth < 1440;
    },
  }
}
</script>

<style scoped>
.left-aside:not(.el-menu--collapse) {
  width: 256px;
}
</style>
