<template>
  <el-dialog :visible.sync="dialog_visible" title="容器操作日志" width="1280px">
    操作时间段：
    <el-date-picker
        v-model="dt_range"
        end-placeholder="结束日期"
        range-separator="至"
        start-placeholder="开始日期"
        type="datetimerange">
    </el-date-picker>
    <el-button circle style="margin-left: 8px" @click="catchContainerLogs">
      <el-icon class="el-icon-takeaway-box"></el-icon>
    </el-button>
    <el-input v-model="logs" :autosize="{ minRows: 10, maxRows: 20 }"
              readonly style="margin-top: 8px" type="textarea"></el-input>
  </el-dialog>
</template>

<script>
export default {
  name: "LogsDialog",
  data() {
    return {
      dialog_visible: false,
      dt_range: [],
      id: '',
      logs: '',
    }
  },
  methods: {
    open(id) {
      this.id = id;
      this.logs = '';
      this.dt_range = [];
      this.dialog_visible = true;
    },
    catchContainerLogs() {
      let since, until;
      if (this.dt_range.length >= 2) {
        this.dt_range = this.dt_range.map(
            x => this.$moment(x).format('YYYY-MM-DD HH:mm:ss')
        );
        [since, until] = this.dt_range;
      }
      this.$api.containerLogs(this.id, since, until).then(
          resp => {
            if (resp.code === 0)
              this.logs = resp.data.content;
          }
      );
    }
  }
}
</script>

<style scoped>

</style>
