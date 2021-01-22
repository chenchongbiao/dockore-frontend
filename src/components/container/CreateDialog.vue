<template>
  <el-dialog title="创建容器" :visible.sync="dialog_visible" width="80%">
    <div>

    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog_visible = false">取 消</el-button>
      <el-button type="primary" @click="dialog_visible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "CreateDialog",
  data() {
    return {
      dialog_visible: false,
    };
  },
  created() {
    this.$bus.$on('create_container', () => {
      this.dialog_visible = true;
    })
  }
}
</script>

<style scoped>

</style>
