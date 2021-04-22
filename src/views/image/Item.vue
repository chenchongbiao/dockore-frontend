<template>
  <div>
    <el-form :model="item" label-width="80px" style="width: 640px">
      <el-form-item label="镜像ID">
        <el-input v-model="item.id" readonly></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <template v-if="item.tags.length > 1">
          <el-tag v-for="tag in item.tags" :key="tag" closable style="margin-right: 8px"
                  type="info" @close="deleteImageItems([tag])">{{ tag }}
          </el-tag>
        </template>
        <template v-else>
          <el-tag v-for="tag in item.tags" :key="tag" type="info">{{ tag }}</el-tag>
        </template>
      </el-form-item>
      <el-form-item label="操作系统">
        <el-input v-model="item.os" readonly></el-input>
      </el-form-item>
      <el-form-item label="创建者">
        <el-input v-model="item.author" readonly></el-input>
      </el-form-item>
      <el-form-item label="启动命令">
        <el-input v-model="item.command" readonly></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="itemCreateTime" readonly></el-input>
      </el-form-item>
      <el-form-item label="镜像尺寸">
        <el-input v-model="itemSize" readonly></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="item.tty" disabled>虚拟终端</el-checkbox>
        <el-checkbox v-model="item.interactive" disabled>交互模式</el-checkbox>
        <el-popover placement="right" style="margin-left: 32px" trigger="click" width="320">
          <el-table :data="item.ports" border>
            <el-table-column label="内部端口" prop="port" width="140"></el-table-column>
            <el-table-column label="协议" prop="protocol" width="140"></el-table-column>
          </el-table>
          <el-button slot="reference" :disabled="item.ports.length === 0">端口映射列表</el-button>
        </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Item",
  computed: {
    itemCreateTime() {
      if (this.item.create_time)
        return this.$moment(this.item.create_time).from();
    },
    itemSize() {
      if (this.item.size)
        return this.$filesize(this.item.size);
    },
  },
  data() {
    return {
      item: null,
    }
  },
  created() {
    this.getItemInfo(this.$route.params.id);
  },
  methods: {
    getItemInfo(id) {
      this.$api.imageItem(id).then(
          resp => {
            if (resp.code === 0) {
              this.item = resp.data.item;
            }
          }
      )
    },
    deleteImageItems(ids) {
      let loading = this.$loading({lock: true, text: '删除镜像中...'})
      this.$api.imageDelete(ids).then(
          resp => {
            this.getItemInfo(this.item.id);
            loading.close()
          }
      );
    },
  }
}
</script>

<style scoped>

</style>
