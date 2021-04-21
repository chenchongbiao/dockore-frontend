<template>
  <el-tabs v-model="tab">
    <el-tab-pane label="基本信息" name="basic">
      <el-form :model="item" label-width="80px" style="width: 640px">
        <el-form-item label="容器ID">
          <el-input v-model="item.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="容器名称">
          <el-input v-model="item.name">
            <el-button slot="append" @click="renameContainerItem">
              <el-icon class="el-icon-edit"></el-icon>
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="镜像ID">
          <el-input v-model="item.image_id" readonly></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="itemCreateTime" readonly></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="itemStatus" readonly></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="item.tty" disabled>虚拟终端</el-checkbox>
          <el-checkbox v-model="item.interactive" disabled>交互模式</el-checkbox>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="网络信息" name="network">
      <el-form :model="item" label-width="120px" style="width: 640px">
        <el-form-item label="IP">
          <el-input v-model="item.network.ip" readonly></el-input>
        </el-form-item>
        <el-form-item label="前缀">
          <el-input v-model="item.network.prefix" readonly></el-input>
        </el-form-item>
        <el-form-item label="网关">
          <el-input v-model="item.network.gateway" readonly></el-input>
        </el-form-item>
        <el-form-item label="MAC地址">
          <el-input v-model="item.network.mac_address" readonly></el-input>
        </el-form-item>
      </el-form>
      <h1 style="text-align: left; margin-top: 32px; margin-bottom: 8px; margin-left: 8px">端口映射列表</h1>
      <el-table :data="item.network.ports" border style="width: 640px">
        <el-table-column label="内部端口" prop="port" width="120"></el-table-column>
        <el-table-column label="协议" prop="protocol" width="120"></el-table-column>
        <el-table-column label="监听地址" prop="listen_ip" width="120"></el-table-column>
        <el-table-column label="监听端口" prop="listen_port" width="120"></el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "Item",
  computed: {
    itemCreateTime() {
      if (this.item.create_time)
        return this.$moment(this.item.create_time).from();
    },
    itemStatus() {
      let status = this.item.status;
      if (status) {
        let status_text = this.$text.container.status;
        if (status_text[status])
          status = status_text[status];
        return status;
      }
    },
  },
  data() {
    return {
      tab: 'basic',
      item: {network: {}},
    }
  },
  created() {
    this.getItemInfo(this.$route.params.id);
  },
  methods: {
    getItemInfo(id) {
      this.$api.containerItem(id).then(
          resp => {
            if (resp.code === 0) {
              this.item = resp.data.item;
            }
          }
      )
    },
    renameContainerItem() {
      this.$api.containerRename(this.item.id, this.item.name).then(
          () => this.getItemInfo(this.item.id)
      );
    },
  }
}
</script>

<style scoped>

</style>
