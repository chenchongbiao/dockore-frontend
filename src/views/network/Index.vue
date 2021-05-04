<template>
  <div>
    <div id="navbar" style="height: 56px">
      <div style="float: left">
        搜索：
        <el-input v-model="keyword" placeholder="请输入关键字" style="width: 256px"></el-input>
      </div>
      <div style="float: right">
        <el-button v-if="selection.length" type="danger" @click="deleteSelectItems">删除选中</el-button>
        <el-button circle @click="getNetworkItems">
          <el-icon class="el-icon-refresh"></el-icon>
        </el-button>
        <el-button @click="$refs.create_dialog.open()">创建网络</el-button>
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
          width="120">
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
          label="创建时间"
          prop="create_time"
          width="200">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="240">
        <template slot-scope="scope">
          <router-link :to="`/network/${scope.row.id}`" class="el-button el-button--mini">信息</router-link>
          <el-button size="mini" type="danger" @click="deleteNetworkItems([scope.row.id])">删除</el-button>
          <el-button size="mini" type="primary" @click="$refs.connect_dialog.open(scope.row.id)">连接容器</el-button>
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
    <ConnectDialog ref="connect_dialog"></ConnectDialog>
  </div>
</template>

<script>
import CreateDialog from "@/components/network/CreateDialog";
import ConnectDialog from "@/components/network/ConnectDialog";

export default {
  name: "Index",
  components: {CreateDialog, ConnectDialog},
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
        item.driver = this.$text.$get('network', 'driver', item.driver);
        item.create_time = this.$moment(item.create_time).from();
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
    this.getNetworkItems();
    this.$bus.$on(this.$event.refresh_networks, () => {
      this.getNetworkItems()
    })
  },
  beforeDestroy() {
    this.$bus.$off(this.$event.refresh_networks);
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
      this.deleteNetworkItems(ids)
    },
    getNetworkItems() {
      this.$api.networkList().then(
          resp => {
            if (resp.code === 0)
              this.items = resp.data.items;
          }
      )
    },
    deleteNetworkItems(ids) {
      this.$api.networkDelete(ids).then(
          resp => {
            this.getNetworkItems();
          }
      );
    },
  },
}
</script>

<style scoped>

</style>
