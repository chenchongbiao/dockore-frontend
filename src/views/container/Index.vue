<template>
  <div>
    <div style="height: 56px">
      <div style="float: left">
        搜索：
        <el-input style="width: 256px" placeholder="请输入关键字" v-model="keyword"></el-input>
      </div>
      <div style="float: right">
        <el-switch active-text="显示所有容器" style="margin-right: 16px" v-model="is_all"></el-switch>
        <el-button @click="deleteSelectItems" type="danger" v-if="selection.length">删除选中</el-button>
        <el-button @click="openCreateDialog">创建容器</el-button>
      </div>
    </div>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="id"
          label="ID"
          width="200">
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          width="200">
      </el-table-column>
      <el-table-column
          prop="image_id"
          label="镜像ID"
          width="200">
      </el-table-column>
      <el-table-column
          prop="create_time"
          label="创建时间"
          width="240">
      </el-table-column>
      <el-table-column
          label="操作"
          width="200">
        <template slot-scope="scope">
          <router-link class="el-button el-button--mini" :to="`/container/${scope.row.id}`">编辑</router-link>
          <el-button type="danger" size="mini" @click="deleteContainerItems([scope.row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 8px">
      <el-pagination
          background layout="prev, pager, next, sizes"
          :page-size.sync="page_size" :total="this.items.length"
          :page-sizes="[5, 10, 50, 100]" :current-page.sync="page"></el-pagination>
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
      for (let item of items) {
        item.id = item.id.slice(0, 12);
        item.name = item.name.slice(1);
        item.image_id = item.image_id.slice(7, 19);
      }
      return items;
    }
  },
  data() {
    return {
      items: [],
      is_all: false,
      selection: [],
      keyword: '',
      page: 1,
      page_size: 10,
    };
  },
  created() {
    this.getContainerItems();
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
            this.$notify({title: '删除容器', message: resp.msg, type: success ? "success" : "error"})
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
