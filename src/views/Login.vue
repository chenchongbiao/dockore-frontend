<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <div style="width: 320px; margin-left: auto; margin-right: auto; padding-top: 64px; text-align: center">
        <h2>用户登录</h2>
        <el-form :model="form" label-position="right">
          <el-form-item label="用户名">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" @keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="login">登录</el-button>
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
      form: {},
    }
  },
  methods: {
    login() {
      this.$api.userLogin(this.form.username, this.form.password).then(
          resp => {
            let success = resp.code === 0;
            if (success) {
              this.$store.commit('setUserToken', resp.data.token);
              this.$router.push('/');
            }
          }
      )
    }
  }
}
</script>

<style scoped>

</style>
