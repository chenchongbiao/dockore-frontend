<template>
  <div>
    <div id="navbar" style="height: 56px">
      <div style="float: left">
        搜索：
        <el-input v-model="keyword" placeholder="请输入关键字" style="width: 256px"></el-input>
      </div>
      <div style="float: right">
        <el-button v-if="selection.length" type="danger" @click="deleteSelectItems">删除选中</el-button>
        <el-button>导入镜像</el-button>
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
          label="标签"
          prop="tags"
          width="200">
      </el-table-column>
      <el-table-column
          label="创建者"
          prop="author"
          width="200">
      </el-table-column>
      <el-table-column
          label="创建时间"
          prop="create_time"
          width="240">
      </el-table-column>
      <el-table-column
          label="镜像尺寸"
          prop="size"
          width="120">
      </el-table-column>
      <el-table-column
          label="操作"
          width="200">
        <template slot-scope="scope">
          <router-link :to="`/image/${scope.row.id}`" class="el-button el-button--mini">编辑</router-link>
          <el-button size="mini" type="danger" @click="deleteImageItems([scope.row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 8px">
      <el-pagination
          :current-page.sync="page" :page-size.sync="page_size"
          :page-sizes="[5, 10, 50, 100]" :total="this.items.length"
          background layout="prev, pager, next, sizes"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  computed: {
    tableData() {
      let items = this.items;
      if (this.keyword) {
        items = items.filter(item => item.tags.join(',').indexOf(this.keyword) !== -1 || item.id.indexOf(this.keyword) !== -1);
      }
      items = items.slice(
          (this.page - 1) * this.page_size,
          this.page * this.page_size
      );

      items = JSON.parse(JSON.stringify(items))
      items = items.map(item => {
        item.tags = item.tags.join(',')
        return item;
      });
      for (let item of items) {
        item.id = item.id.slice(7, 19);
      }
      return items;
    }
  },
  data() {
    return {
      items: [],
      selection: [],
      keyword: '',
      page: 1,
      page_size: 10,
    };
  },
  created() {
    this.getImageItems();
  },
  methods: {
    handleSelectionChange(val) {
      this.selection = val;
    },
    deleteSelectItems() {
      let ids = this.selection.map(items => items.id);
      this.deleteImageItems(ids)
    },
    getImageItems() {
      this.$api.imageList(false).then(
          resp => {
            if (resp.code === 0) {
              this.items = resp.data.items;
            }
          }
      )
    },
    deleteImageItems(ids) {
      this.$api.imageDelete(ids).then(
          resp => {
            let success = resp.code === 0;
            if (success)
              this.getImageItems();
            this.$notify({title: '删除镜像', message: resp.msg, type: success ? "success" : "error"})
          }
      )
    },
  },
}
</script>

<style scoped>

</style>
