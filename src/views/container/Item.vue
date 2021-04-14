<template>
  <pre style="text-align: left">{{ item }}</pre>
</template>

<script>
export default {
  name: "Item",
  data() {
    return {
      item: null,
    }
  },
  created() {
    this.getItemInfo(this.$route.params.id);
  },
  methods: {
    getItemInfo(id) {
      this.$api.containerItem(id).then(
          resp => {
            if (resp.code === 0) {
              this.item = resp.data.item;
            } else {
              this.$notify({message: resp.msg, type: "error"});
            }
          }
      )
    }
  }
}
</script>

<style scoped>

</style>
