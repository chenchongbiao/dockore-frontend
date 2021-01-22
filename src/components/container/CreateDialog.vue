<template>
  <el-dialog title="创建容器" :visible.sync="dialog_visible" width="66%">
    <div>
      <div style="height: 56px" id="navbar">
        <div style="float: left">
          搜索：
          <el-input style="width: 256px" placeholder="请输入关键字" v-model="keyword"></el-input>
        </div>
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
      </el-table>
      <div style="margin-top: 8px">
        <el-pagination
            background layout="prev, pager, next, sizes"
            :page-size.sync="page_size" :total="this.items.length"
            :page-sizes="[5, 10, 50, 100]" :current-page.sync="page"></el-pagination>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog_visible = false">取 消</el-button>
      <el-button type="primary" @click="dialog_visible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "CreateDialog",
  data() {
    return {
      dialog_visible: false,
      items: [],
      keyword: '',
      page: 1,
      page_size: 10,
    };
  },
  created() {
    this.$bus.$on('create_container', () => {
      this.dialog_visible = true;
      this.getImageItems();
    })
  },
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
  },
}
</script>

<style scoped>

</style>
