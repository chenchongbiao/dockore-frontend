<template>
  <el-dialog :visible.sync="dialog_visible" title="容器操作日志" width="1280px">
    <el-date-picker
        v-model="dt_range"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
    </el-date-picker>
    <el-button @click="catchContainerLogs" style="margin-left: 8px" circle>
      <el-icon class="el-icon-takeaway-box"></el-icon>
    </el-button>
    <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 20 }"
              v-model="logs" readonly style="margin-top: 8px"></el-input>
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
  created() {
    this.$bus.$on('logs_container', id => {
      this.id = id;
      this.logs = '';
      this.dt_range = [];
      this.dialog_visible = true;
    });
  },
  methods: {
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
