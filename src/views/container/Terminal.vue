<template>
  <div>
    <div style="margin: 0 8px 16px; display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/container">容器管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="`/container/${item.id}`">
            <template v-if="item.name">终端：{{ item.name }}</template>
            <template v-else>容器终端</template>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button-group style="margin-right: 16px">
          <el-button type="success" @click="startContainer">启动选中</el-button>
          <el-button type="danger" @click="stopContainer">停止选中</el-button>
          <el-button type="warning" @click="restartContainer">重启选中</el-button>
        </el-button-group>
        <el-button circle @click="refresh">
          <el-icon class="el-icon-refresh"></el-icon>
        </el-button>
      </div>
    </div>
    <el-card shadow="hover">
      <div ref="terminal" @resize="fitToscreen" style="width: 100%; height: calc(100vh - 224px);"></div>
    </el-card>
  </div>
</template>

<script>
import {Terminal} from 'xterm';
import {WebLinksAddon} from 'xterm-addon-web-links'
import {FitAddon} from 'xterm-addon-fit'
import {SearchAddon} from 'xterm-addon-search'
import {AttachAddon} from 'xterm-addon-attach'
import {ResizeObserver} from '@juggle/resize-observer';
import helper from "@/utils/helper";

export default {
  name: "Terminal",
  computed: {
    token() {
      return this.$route.params.token;
    }
  },
  data() {
    return {
      term: new Terminal({
        cursorBlink: true,
        macOptionIsMeta: true,
        scrollback: true,
      }),
      web_link: new WebLinksAddon(),
      fit: new FitAddon(),
      search: new SearchAddon(),
      attach: null,
      ro: null,
      item: {},
    };
  },
  created() {
    this.term.loadAddon(this.web_link);
    this.term.loadAddon(this.fit);
    this.term.loadAddon(this.search);
    this.ro = new ResizeObserver((entries, observer) => {
      this.fitToscreen();
    });
  },
  mounted() {
    this.ro.observe(this.$refs.terminal);
    this.term.open(this.$refs.terminal);
    this.term.onKey(this.pty_input);
    this.$socket.emit('open', this.token);
  },
  sockets: {
    connect() {
      this.attach = new AttachAddon(this.$socket);
      this.term.loadAddon(this.attach);
    },
    disconnect() {
      helper.sendNotification('容器终端', '网络连接中断。', 'warning');
      this.term.write(
          '\n' +
          '--==========================--\r\n' +
          ' * Terminal: Network was down.\r\n' +
          '--==========================--\r\n'
      )
    },
    pty_output(data) {
      this.term.write(data.output)
    },
    init_failed() {
      helper.sendNotification('容器终端', '会话无效，请重新打开。', 'error');
    },
    init_success(obj) {
      this.item = obj;
      helper.sendNotification('容器终端', '打开容器终端成功。', 'success');
      this.fitToscreen();
    },
  },
  methods: {
    pty_input({key, domEvent}) {
      this.$socket.emit("pty_input", {input: key});
      this.$debounce(() => this.$socket.emit('pty_input'), 3000);
    },
    fitToscreen() {
      this.$debounce(() => {
        this.fit.fit()
        this.$socket.emit("resize", {"cols": this.term.cols, "rows": this.term.rows})
      }, 1000)
    },
    startContainer() {
      this.$api.containerStart([this.item.id]).then(this.refresh);
    },
    stopContainer() {
      this.$api.containerStop([this.item.id], 5).then(
          () => setTimeout(() => this.$socket.emit('pty_input'), 1000)
      );
    },
    restartContainer() {
      this.$api.containerRestart([this.item.id], 5).then(this.refresh);
    },
    refresh() {
      this.$router.go(0);
    }
  },
  beforeDestroy() {
    this.ro.disconnect();
  },
}
</script>

<style scoped>
@import "~xterm/css/xterm.css";
</style>
