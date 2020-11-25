<template>
  <div id="app">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside v-if="isLogined">
          <LeftASide></LeftASide>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Header from "@/components/common/Header";
  import LeftASide from "@/components/common/LeftASide";

  export default {
    components: {Header, LeftASide},
    computed: {
      isLogined() {
        return this.$store.getters.userToken !== null;
      },
    },
    created() {

    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  a {
    text-decoration: none;
  }
</style>
