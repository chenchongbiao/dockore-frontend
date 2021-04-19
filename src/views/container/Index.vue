<template>
  <div>
    <div style="height: 56px">
      <div style="float: left">
        搜索：
        <el-input v-model="keyword" placeholder="请输入关键字" style="width: 256px"></el-input>
      </div>
      <div style="float: right">
        <el-switch v-model="is_all" active-text="显示所有容器" style="margin-right: 16px"></el-switch>
        <el-button v-if="selection.length" type="danger" @click="deleteSelectItems">删除选中</el-button>
        <el-button @click="openCreateDialog">创建容器</el-button>
      </div>
    </div>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          label="ID"
          prop="id"
          width="200">
      </el-table-column>
      <el-table-column
          label="名称"
          prop="name"
          width="200">
      </el-table-column>
      <el-table-column
          label="镜像ID"
          prop="image_id"
          width="200">
      </el-table-column>
      <el-table-column
          label="创建时间"
          prop="create_time"
          width="240">
      </el-table-column>
      <el-table-column
          label="状态"
          prop="status"
          width="120">
      </el-table-column>
      <el-table-column
          label="操作"
          width="200">
        <template slot-scope="scope">
          <router-link :to="`/container/${scope.row.id}`" class="el-button el-button--mini">编辑</router-link>
          <el-button size="mini" type="danger" @click="deleteContainerItems([scope.row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 8px">
      <el-pagination
          :current-page.sync="page" :page-size.sync="page_size"
          :page-sizes="[5, 10, 50, 100]" :total="this.items.length"
          background layout="prev, pager, next, sizes"></el-pagination>
    </div>
    <CreateDialog></CreateDialog>
  </div>
</template>

<script>
import CreateDialog from "@/components/container/CreateDialog";

export default {
  name: "Index",
  components: {CreateDialog},
  computed: {
    tableData() {
      let items = this.items;
      if (this.keyword) {
        items = items.filter(item => item.name.indexOf(this.keyword) !== -1 || item.id.indexOf(this.keyword) !== -1);
      }
      items = items.slice(
          (this.page - 1) * this.page_size,
          this.page * this.page_size
      );

      items = JSON.parse(JSON.stringify(items))
      return items;
    }
  },
  data() {
    return {
      items: [],
      is_all: true,
      selection: [],
      keyword: '',
      page: 1,
      page_size: 10,
    };
  },
  created() {
    this.getContainerItems();
    this.$bus.$on('refresh_containers', () => {
      this.getContainerItems()
    })
  },
  watch: {
    is_all(old_value, new_value) {
      this.getContainerItems();
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selection = val;
    },
    deleteSelectItems() {
      let ids = this.selection.map(items => items.id);
      this.deleteContainerItems(ids)
    },
    getContainerItems() {
      this.$api.containerList(this.is_all).then(
          resp => {
            if (resp.code === 0) {
              this.items = resp.data.items;
            }
          }
      )
    },
    deleteContainerItems(ids) {
      this.$api.containerDelete(ids).then(
          resp => {
            let success = resp.code === 0;
            if (success)
              this.getContainerItems();
          }
      )
    },
    openCreateDialog() {
      this.$bus.$emit('create_container');
    }
  },
}
</script>

<style scoped>

</style>
