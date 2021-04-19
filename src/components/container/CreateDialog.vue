<template>
  <el-dialog :visible.sync="dialog_visible" title="创建容器" width="1280px">
    <el-container>
      <el-aside width="224px">
        <el-menu default-active="1" @select="x => step = x" ref="menu">
          <el-menu-item index="1">
            <i class="el-icon-document-copy"></i>选择镜像
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-copy-document"></i>容器信息
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <div v-show="step === '1'">
          <div id="navbar" style="height: 56px">
            <div style="float: left">
              搜索：
              <el-input v-model="keyword" placeholder="请输入关键字" style="width: 256px"></el-input>
            </div>
          </div>
          <el-table ref="table" :data="tableData" border height="320px" highlight-current-row
                    @current-change="tableCurrentChange">
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
          </el-table>
          <div style="margin-top: 8px">
            <el-pagination
                :current-page.sync="page" :page-size.sync="page_size"
                :page-sizes="[5, 10, 50, 100]" :total="this.items.length"
                background layout="prev, pager, next, sizes"></el-pagination>
          </div>
        </div>
        <div v-show="step === '2'">
          <el-col :span="12">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="容器名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="镜像名称">
                <el-input v-model="form.image"></el-input>
              </el-form-item>
              <el-form-item label="镜像标签">
                <el-select v-model="form.tag" placeholder="tag" style="width: 100%">
                  <el-option v-for="tag in itemTags" :key="tag" :label="tag" :value="tag"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="启动命令">
                <el-input v-model="form.command"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </div>
      </el-main>
    </el-container>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog_visible = false">取 消</el-button>
      <el-button type="primary" @click="createContainer">确 定</el-button>
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
      step: '1',
      page: 1,
      page_size: 10,
      form: {},
      item: {tags: []},
    };
  },
  created() {
    this.$bus.$on('create_container', () => {
      this.dialog_visible = true;
      this.step = '1';
      this.form = {};
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
    },
    itemName() {
      return this.item.tags[0].split(':')[0] || 'latest'
    },
    itemTags() {
      let a = [];
      for (let tag of this.item.tags) {
        a.push(tag.split(':')[1])
      }
      return a;
    },
  },
  methods: {
    tableCurrentChange(n, o) {
      if (n) {
        this.loadImageInfo(n.id, () => {
          this.step = '2';
          this.$refs.menu.activeIndex = '2';
        });
      }
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

    loadImageInfo(id, callback) {
      this.$api.imageItem(id).then(
          resp => {
            if (resp.code === 0) {
              this.item = resp.data.item;
              this.form.image = this.itemName;
              this.form.tag = this.itemTags[0];
              this.form.command = this.item.command;
              callback();
            }
          }
      )
    },

    createContainer() {
      this.$api.containerCreate(`${this.form.image}:${this.form.tag}`, this.form.command, this.form.name).then(
          resp => {
            if (resp.code === 0) {
              this.dialog_visible = false;
            }
            this.$bus.$emit('refresh_containers');
          }
      )
    },
  },
}
</script>

<style scoped>

</style>
