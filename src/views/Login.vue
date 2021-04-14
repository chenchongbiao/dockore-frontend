<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <div style="width: 320px; margin-left: auto; margin-right: auto; padding-top: 64px">
        <h1>用户登录</h1>
        <el-form :model="user" label-position="right">
          <el-form-item label="用户名">
            <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="user.password" type="password"></el-input>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="login(user.username, user.password)">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import Header from "@/components/common/Header";

export default {
  name: "Login",
  components: {Header},
  data() {
    return {
      user: {},
    }
  },
  methods: {
    login(username, password) {
      this.$api.userLogin(username, password).then(
          resp => {
            let success = resp.code === 0;
            if (success) {
              this.$store.commit('setUserToken', resp.data.token);
              this.$router.push('/');
            }
            this.$notify({title: '用户登录', message: resp.msg, type: success ? "success" : "error"});
          }
      )
    }
  }
}
</script>

<style scoped>

</style>
