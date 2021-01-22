<template>
  <div>
    <el-menu class="el-menu-vertical-demo" v-model="menu_index" ref="menu" :router="true">
      <el-menu-item :index="item.path" v-for="item in menu_items" :key="item.path">
        <i :class="item.icon"></i>
        <span slot="title">{{item.title}}</span>
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
          {path: '/image', title: '镜像管理', icon: 'el-icon-document-copy'},
          {path: '/container', title: '容器管理', icon: 'el-icon-copy-document'},
        ],
      }
    },
    watch: {
      $route(oldVal, newVal) {
        for (let item of this.menu_items) {
          if (this.$route.path.indexOf(item.path) === 0) {
            this.menu_index = item.path;
          }
        }
      }
    },
  }
</script>

<style scoped>

</style>
