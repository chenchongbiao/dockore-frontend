<template>
  <div>
    <div id="navbar" style="height: 56px">
      <div style="float: left">
        搜索：
        <el-input v-model="keyword" placeholder="请输入关键字" style="width: 256px"></el-input>
      </div>
      <div style="float: right">
        <el-button v-if="selection.length" type="danger" @click="deleteSelectItems">删除选中</el-button>
        <el-button circle @click="getVolumeItems">
          <el-icon class="el-icon-refresh"></el-icon>
        </el-button>
        <el-button @click="$refs.create_dialog.open()">创建存储卷</el-button>
      </div>
    </div>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          label="名称"
          prop="name"
          width="200">
      </el-table-column>
      <el-table-column
          label="驱动器类型"
          prop="driver"
          width="160">
      </el-table-column>
      <el-table-column
          label="挂载点"
          prop="mount_point"
          width="280">
      </el-table-column>
      <el-table-column
          label="创建时间"
          prop="create_time"
          width="200">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="160">
        <template slot-scope="scope">
          <router-link :to="`/volume/${scope.row.id}`" class="el-button el-button--mini">信息</router-link>
          <el-button size="mini" type="danger" @click="deleteVolumeItems([scope.row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 8px">
      <el-pagination
          :current-page.sync="page" :page-size.sync="page_size"
          :page-sizes="[5, 10, 50, 100]" :total="this.items.length"
          background layout="prev, pager, next, sizes"></el-pagination>
    </div>
    <CreateDialog ref="create_dialog"></CreateDialog>
  </div>
</template>

<script>
import CreateDialog from "@/components/volume/CreateDialog";

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

      items = this.$helper.copyObject(items);
      for (let item of items) {
        item.driver = this.$text.volume.driver[item.driver];
        item.create_time = this.$moment(item.create_time).from();
      }

      return items;
    },
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
    this.getVolumeItems();
    this.$bus.$on(this.$event.refresh_volumes, () => {
      this.getVolumeItems()
    })
  },
  beforeDestroy() {
    this.$bus.$off(this.$event.refresh_volumes);
  },
  methods: {
    handleSelectionChange(val) {
      this.selection = val;
    },
    deleteSelectItems() {
      let ids = [];
      this.selection.map(item => {
        ids.push(item.id);
      });
      this.deleteVolumeItems(ids)
    },
    getVolumeItems() {
      this.$api.volumeList().then(
          resp => {
            if (resp.code === 0)
              this.items = resp.data.items;
          }
      )
    },
    deleteVolumeItems(ids) {
      this.$api.volumeDelete(ids).then(
          resp => {
            this.getVolumeItems();
          }
      );
    },
  },
}
</script>

<style scoped>

</style>
