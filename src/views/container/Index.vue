<template>
  <div>
    <div style="height: 56px">
      <div style="float: left">
        搜索：
        <el-input v-model="keyword" placeholder="请输入关键字" style="width: 256px"></el-input>
        <el-switch v-model="is_all" active-text="显示所有容器" style="margin-left: 16px"></el-switch>
      </div>
      <div style="float: right">
        <el-button v-if="selection.length" type="success" @click="startContainerItems(selectionIds)">启动选中</el-button>
        <el-button v-if="selection.length" type="info" @click="stopContainerItems(selectionIds)">停止选中</el-button>
        <el-button v-if="selection.length" type="warning" @click="restartContainerItems(selectionIds)">重启选中</el-button>
        <el-button v-if="selection.length" type="danger" @click="deleteContainerItems(selectionIds)">删除选中</el-button>
        <el-button circle @click="getContainerItems"><el-icon class="el-icon-refresh"></el-icon></el-button>
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
          width="120">
      </el-table-column>
      <el-table-column
          label="名称"
          prop="name"
          width="240">
      </el-table-column>
      <el-table-column
          label="镜像ID"
          width="160">
        <template slot-scope="scope">
          <el-link :href="`/image/${scope.row.image_id}`">{{ scope.row.image_id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
          label="创建时间"
          prop="create_time"
          width="200">
      </el-table-column>
      <el-table-column
          label="状态"
          prop="status"
          width="120">
      </el-table-column>
      <el-table-column
          label="操作"
          width="240">
        <template slot-scope="scope">
          <router-link :to="`/container/${scope.row.id}`" class="el-button el-button--mini">信息</router-link>
          <el-button size="mini" type="danger" @click="deleteContainerItems([scope.row.id])">删除</el-button>
          <el-dropdown style="margin-left: 8px" trigger="click" @command="cmd => handleOperation(scope.row.id, cmd)">
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="start">启动容器</el-dropdown-item>
              <el-dropdown-item command="stop">停止容器</el-dropdown-item>
              <el-dropdown-item command="restart">重启容器</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

      let status_map = {
        created: '已创建',
        running: '运行中',
        exited: '已退出',
      }

      items = JSON.parse(JSON.stringify(items))
      for (let item of items) {
        if (status_map[item.status])
          item.status = status_map[item.status];
        item.create_time = this.$moment(item.create_time).from();
      }
      return items;
    },
    selectionIds() {
      return this.selection.map(items => items.id);
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
    handleOperation(id, cmd){
      if (cmd === 'start')
        this.startContainerItems([id]);
      else if (cmd === 'stop')
        this.stopContainerItems([id]);
      else if (cmd === 'restart')
        this.restartContainerItems([id]);
    },
    getContainerItems() {
      this.$api.containerList(this.is_all).then(
          resp => {
            if (resp.code === 0) {
              this.items = resp.data.items;
            }
          }
      );
    },
    deleteContainerItems(ids) {
      this.$api.containerDelete(ids).then(
          resp => this.getContainerItems()
      );
    },
    startContainerItems(ids) {
      this.$api.containerStart(ids).then(
          resp => this.getContainerItems()
      );
    },
    stopContainerItems(ids) {
      let loading = this.$loading({lock: true, text: '停止容器中...'});
      this.$api.containerStop(ids, 5).then(
          resp => {
            this.getContainerItems();
            loading.close();
          }
      );
    },
    restartContainerItems(ids) {
      let loading = this.$loading({lock: true, text: '重启容器中...'});
      this.$api.containerRestart(ids, 5).then(
          resp => {
            this.getContainerItems();
            loading.close();
          }
      );
    },
    openCreateDialog() {
      this.$bus.$emit('create_container');
    },
  },
}
</script>

<style scoped>

</style>
