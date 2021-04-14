<template>
  <div>
    <div style="height: 56px" id="navbar">
      <div style="float: left">
        搜索：
        <el-input style="width: 256px" placeholder="请输入关键字" v-model="keyword"></el-input>
      </div>
      <div style="float: right">
        <el-button @click="deleteSelectItems" type="danger" v-if="selection.length">删除选中</el-button>
        <el-button>导入镜像</el-button>
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
          prop="tags"
          label="标签"
          width="200">
      </el-table-column>
      <el-table-column
          prop="author"
          label="创建者"
          width="200">
      </el-table-column>
      <el-table-column
          prop="create_time"
          label="创建时间"
          width="240">
      </el-table-column>
      <el-table-column
          prop="size"
          label="镜像尺寸"
          width="120">
      </el-table-column>
      <el-table-column
          label="操作"
          width="200">
        <template slot-scope="scope">
          <router-link class="el-button el-button--mini" :to="`/image/${scope.row.id}`">编辑</router-link>
          <el-button type="danger" size="mini" @click="deleteImageItems([scope.row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 8px">
      <el-pagination
          background layout="prev, pager, next, sizes"
          :page-size.sync="page_size" :total="this.items.length"
          :page-sizes="[5, 10, 50, 100]" :current-page.sync="page"></el-pagination>
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
