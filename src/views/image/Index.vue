<template>
  <div>
    <div style="height: 56px" id="navbar">
      <div style="float: left">
        搜索：
        <el-input style="width: 256px" placeholder="请输入关键字" v-model="keyword"></el-input>
      </div>
      <el-button style="float: right">导入镜像</el-button>
    </div>
    <el-table :data="tableData" border>
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
import CreateDialog from "@/components/container/CreateDialog";

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
      keyword: '',
      page: 1,
      page_size: 10,
    };
  },
  created() {
    this.getImageItems();
  },
  methods: {
    getImageItems() {
      this.$axios.post(this.$api.IMAGE_LIST, {
        token: this.$store.getters.userToken,
      }).then(
          resp => {
            if (resp.code === 0) {
              this.items = resp.data.items;
            }
          }
      )
    },
    deleteImageItems(ids) {
      this.$axios.post(this.$api.IMAGE_DELETE, {
        token: this.$store.getters.userToken,
        ids: ids,
      }).then(
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
