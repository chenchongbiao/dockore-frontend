<template>
  <div>
    <el-tabs v-model="tab">
      <el-tab-pane :label="text(i)" v-for="(s, i) in form" :key="i">
        <el-form :model="s" label-width="160px" style="width: 640px; margin-top: 16px">
          <el-form-item :label="text(i, k)" v-for="(v, k) in s" :key="k">
            <el-input v-model="s[k]" v-if="typeof s[k] === 'string'"></el-input>
            <el-input-number v-model="s[k]" type="" v-else-if="typeof s[k] === 'number'"></el-input-number>
            <el-switch v-model="s[k]" type="" v-else-if="typeof s[k] === 'boolean'"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateConfig">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "Config",
  data() {
    return {
      tab: '',
      form: {},
    }
  },
  created() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      this.$api.queryConfig().then(
          resp => {
            this.form = resp.data.config;
          }
      );
    },
    updateConfig() {
      this.$api.updateConfig(this.form).then(
          resp => this.getConfig()
      );
    },
    text(i, k) {
      return this.$text.$get('config', i, k);
    },
  },
}
</script>

<style scoped>

</style>
