<template>
  <div>
    <el-table :data="container_items" border>
      <el-table-column
              prop="id"
              label="ID"
              width="200">
      </el-table-column>
      <el-table-column
              prop="name"
              label="名称"
              width="200">
      </el-table-column>
      <el-table-column
              prop="image_id"
              label="镜像ID"
              width="200">
      </el-table-column>
      <el-table-column
              prop="create_time"
              label="创建时间"
              width="240">
      </el-table-column>
      <el-table-column
              label="操作"
              width="200">
        <template slot-scope="scope">
          <router-link class="el-button el-button--mini" :to="`/container/${scope.row.id}`">编辑</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "Index",
    data() {
      return {
        container_items: [],
      };
    },
    created() {
      this.getContainerItems();
    },
    methods: {
      getContainerItems() {
        this.$axios.post(this.$api.CONTAINER_LIST, {
          token: this.$store.getters.userToken,
        }).then(
            resp => {
              if (resp.code === 0) {
                this.container_items = resp.data.items;
              }
            }
        )
      }
    },
  }
</script>

<style scoped>

</style>