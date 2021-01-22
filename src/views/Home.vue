<template>
  <div>
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
  name: "Home",
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

<style scoped>

</style>
