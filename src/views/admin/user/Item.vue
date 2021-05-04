<template>
  <div>
    <div style="display: flex; align-items: center; margin: 8px 8px 32px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item to="/admin/user">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/admin/user/add" v-if="isAdd">添加用户</el-breadcrumb-item>
        <el-breadcrumb-item :to="`/admin/user/edit/${item.id}`" v-else>
          用户：{{ item.username }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-form :model="item" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="item.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="item.password" type="password" v-if="isAdd"></el-input>
        <el-input v-model="item.password" type="password" v-else placeholder="（留空则不修改密码）"></el-input>
      </el-form-item>
      <el-form-item label="用户角色">
        <el-select v-model="item.role_type" style="width: 100%">
          <el-option v-for="(k, v) in roleChoices" :key="k" :label="k" :value="parseInt(v)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUserItem" v-if="isAdd">添加</el-button>
        <el-button type="primary" @click="editUserItem" v-else>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Item",
  computed: {
    id() {
      return this.$route.params.id;
    },
    isAdd() {
      return !this.id;
    },
    roleChoices() {
      return this.$text.user.roles;
    },
  },
  data() {
    return {
      item: {},
    }
  },
  created() {
    if (!this.isAdd)
      this.getUserItem(this.id);
  },
  methods: {
    getUserItem(id) {
      this.$api.adminUserItem(id).then(
          resp => {
            this.item = resp.data.item;
          }
      )
    },
    addUserItem() {
      this.$api.adminUserAdd(this.item.username, this.item.password, this.item.role_type).then(
          resp => {
            if (resp.code === 0)
              this.$router.push('/admin/user');
          }
      )
    },
    editUserItem() {
      this.$api.adminUserEdit(this.item.id, this.item.username, this.item.password, this.item.role_type).then(
          resp => {
            if (resp.code === 0) {
              if (this.item.id === this.$store.getters.userInfo.id) {
                this.$bus.$emit(this.$event.update_user_info);
              }
            }
          }
      );
    },
  },
}
</script>

<style scoped>
.el-form {
  width: 640px;
}
</style>
