<template>
  <div>
    <div style="height: 56px">
      <div style="float: left">
        搜索：
        <el-input v-model="keyword" placeholder="请输入关键字" style="width: 256px"></el-input>
        <el-switch v-model="is_all" active-text="显示所有容器" style="margin-left: 16px"></el-switch>
      </div>
      <div style="float: right">
        <el-button-group style="margin-right: 16px">
          <el-button v-if="selection.length" type="info" @click="stopContainerItems(selectionIds)">
            <el-icon class="el-icon-video-pause"></el-icon>
            停止
          </el-button>
          <el-button v-if="selection.length" type="warning" @click="restartContainerItems(selectionIds)">
            <el-icon class="el-icon-refresh-right"></el-icon>
            重启
          </el-button>
          <el-button v-if="selection.length" type="success" @click="startContainerItems(selectionIds)">
            <el-icon class="el-icon-video-play"></el-icon>
            启动
          </el-button>
          <el-button v-if="selection.length" type="danger" @click="deleteContainerItems(selectionIds)">
            <el-icon class="el-icon-delete"></el-icon>
            删除
          </el-button>
        </el-button-group>
        <el-button circle @click="getContainerItems">
          <el-icon class="el-icon-refresh"></el-icon>
        </el-button>
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
          width="200">
      </el-table-column>
      <el-table-column
          label="镜像"
          width="270">
        <template slot-scope="scope">
          <el-link v-if="!scope.row.image.tags.length" :href="`/image/${scope.row.image.id}`">
            {{ scope.row.image.id }}
          </el-link>
          <el-link v-else v-for="tag in scope.row.image.tags" :key="tag" :href="`/image/${scope.row.image.id}`"
                   style="margin-top: 2px; margin-bottom: 2px"
                   class="el-button el-button--mini">{{ tag }}
          </el-link>
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
          fixed="right"
          label="操作"
          width="240">
        <template slot-scope="scope">
          <el-link :href="`/container/${scope.row.id}`" class="el-button el-button--mini">信息</el-link>
          <el-button size="mini" type="danger" @click="deleteContainerItems([scope.row.id])">删除</el-button>
          <el-dropdown style="margin-left: 8px" trigger="click" @command="cmd => handleOperation(scope.row, cmd)">
            <el-button size="mini" type="primary">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="rename">
                <el-icon class="el-icon-edit"></el-icon>
                容器更名
              </el-dropdown-item>
              <el-dropdown-item command="logs" divided>
                <el-icon class="el-icon-tickets"></el-icon>
                容器操作日志
              </el-dropdown-item>
              <el-dropdown-item command="diff">
                <el-icon class="el-icon-document-checked"></el-icon>
                文件差异对比
              </el-dropdown-item>
              <el-dropdown-item command="commit">
                <el-icon class="el-icon-s-promotion"></el-icon>
                提交到镜像
              </el-dropdown-item>
              <el-dropdown-item command="start" divided>
                <el-icon class="el-icon-video-play"></el-icon>
                启动容器
              </el-dropdown-item>
              <el-dropdown-item command="stop">
                <el-icon class="el-icon-circle-close"></el-icon>
                停止容器
              </el-dropdown-item>
              <el-dropdown-item command="restart">
                <el-icon class="el-icon-refresh-right"></el-icon>
                重启容器
              </el-dropdown-item>
              <el-dropdown-item command="terminal" divided>
                <el-icon class="el-icon-s-platform"></el-icon>
                容器终端交互
              </el-dropdown-item>
              <el-dropdown-item command="exec">
                <el-icon class="el-icon-magic-stick"></el-icon>
                容器命令执行
              </el-dropdown-item>
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
    <LogsDialog></LogsDialog>
    <DiffDialog></DiffDialog>
    <CommitDialog></CommitDialog>
  </div>
</template>

<script>
import CreateDialog from "@/components/container/CreateDialog";
import LogsDialog from "@/components/container/LogsDialog";
import DiffDialog from "@/components/container/DiffDialog";
import CommitDialog from "@/components/container/CommitDialog";

export default {
  name: "Index",
  components: {CommitDialog, CreateDialog, LogsDialog, DiffDialog},
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
        item.status = this.$text.$get('container', 'status', item.status);
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
    this.$bus.$on(this.$event.refresh_containers, () => {
      this.getContainerItems()
    })
  },
  beforeDestroy() {
    this.$bus.$off(this.$event.refresh_containers);
  },
  watch: {
    is_all(old, new_) {
      if (old !== new_)
        this.getContainerItems();
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selection = val;
    },
    handleOperation(item, cmd) {
      if (cmd === 'start')
        this.startContainerItems([item.id]);
      else if (cmd === 'stop')
        this.stopContainerItems([item.id]);
      else if (cmd === 'restart')
        this.restartContainerItems([item.id]);
      else if (cmd === 'rename')
        this.renameContainerItem(item);
      else if (cmd === 'logs')
        this.getContainerItemLogs(item.id);
      else if (cmd === 'diff')
        this.getContainerItemDiff(item.id);
      else if (cmd === 'commit')
        this.commitContainerImage(item.id);
      else if (cmd === 'terminal')
        this.openContainerTerminal(item.id);
      else if (cmd === 'exec') {
        this.execCommandContainer(item);
      }
    },
    getContainerItems() {
      this.$api.containerList(this.is_all).then(
          resp => {
            if (resp.code === 0)
              this.items = resp.data.items;
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
      this.$api.containerStop(ids, 5).then(
          resp => {
            this.getContainerItems();
          }
      );
    },
    restartContainerItems(ids) {
      this.$api.containerRestart(ids, 5).then(
          resp => {
            this.getContainerItems();
          }
      );
    },
    renameContainerItem(item) {
      this.$prompt('请输入新的容器名称', `容器更名：${item.name}`).then(
          ({value}) => {
            this.$api.containerRename(item.id, value).then(resp => this.getContainerItems())
          }
      ).catch(_ => _);
    },
    getContainerItemLogs(id) {
      this.$bus.$emit(this.$event.container_logs, id)
    },
    getContainerItemDiff(id) {
      this.$bus.$emit(this.$event.container_diff, id)
    },
    openCreateDialog() {
      this.$bus.$emit(this.$event.container_create);
    },
    commitContainerImage(id) {
      this.$bus.$emit(this.$event.container_commit, id)
    },
    openContainerTerminal(id, cmd) {
      this.$api.containerTerminal(id, cmd).then(
          resp => {
            if (resp.code === 0) {
              let token = resp.data.token;
              this.$router.push(`/container/terminal/${token}`)
            }
          }
      )
    },
    execCommandContainer(item) {
      this.$prompt('请输入需要在终端执行的命令', `执行命令：${item.name}`).then(
          ({value}) => {
            this.openContainerTerminal(item.id, value);
          }
      ).catch(_ => _);
    }
  },
}
</script>

<style scoped>

</style>
