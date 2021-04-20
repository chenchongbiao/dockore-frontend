<template>
  <div>
    <div id="navbar" style="height: 56px">
      <div style="float: left">
        搜索：
        <el-input v-model="keyword" placeholder="请输入关键字" style="width: 256px"></el-input>
      </div>
      <div style="float: right">
        <el-button v-if="selection.length" type="danger" @click="deleteSelectItems">删除选中</el-button>
        <el-button @click="openPullDialog">拉取镜像</el-button>
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
          width="160">
      </el-table-column>
      <el-table-column
          label="标签"
          width="240">
        <template slot-scope="scope">
          <template v-if="scope.row.tags.length > 1">
            <el-tag v-for="tag in scope.row.tags" :key="tag" type="info" closable
                    @close="deleteImageItems([tag])">{{ tag }}
            </el-tag>
          </template>
          <template v-else>
            <el-tag v-for="tag in scope.row.tags" :key="tag" type="info">{{ tag }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column
          label="创建者"
          prop="author"
          width="320">
      </el-table-column>
      <el-table-column
          label="创建时间"
          prop="create_time"
          width="200">
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
          <template v-if="scope.row.tags.length > 1">
            <el-button size="mini" type="danger" @click="deleteImageItems(scope.row.tags)">删除</el-button>
          </template>
          <template v-else>
            <el-button size="mini" type="danger" @click="deleteImageItems([scope.row.id])">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 8px">
      <el-pagination
          :current-page.sync="page" :page-size.sync="page_size"
          :page-sizes="[5, 10, 50, 100]" :total="this.items.length"
          background layout="prev, pager, next, sizes"></el-pagination>
    </div>
    <PullDialog></PullDialog>
  </div>
</template>

<script>
import PullDialog from "@/components/image/PullDialog";

export default {
  name: "Index",
  components: {PullDialog},
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
      for (let item of items) {
        item.create_time = this.$moment(item.create_time).from();
        item.size = this.$filesize(item.size);
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
    this.$bus.$on('refresh_images', () => {
      this.getImageItems()
    })
  },
  methods: {
    handleSelectionChange(val) {
      this.selection = val;
    },
    deleteSelectItems() {
      let ids = [];
      this.selection.map(item => {
        if (item.tags.length > 1)
          for (let tag of item.tags)
            ids.push(tag);
        else
          ids.push(item.id);
      });
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
      let loading = this.$loading({lock: true, text: '删除镜像中...'})
      this.$api.imageDelete(ids).then(
          resp => {
            loading.close()
            this.getImageItems();
          }
      ).catch(err => loading.close());
    },
    openPullDialog() {
      this.$bus.$emit('pull_image');
    }
  },
}
</script>

<style scoped>

</style>
