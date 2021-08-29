<template>
  <div>
    <div class="hint-area">
      <div style="opacity: 0.15; user-select: none">
        <div class="hint-text">⬅️ 点击菜单开始使用。</div>
        <div class="hint-producer">Producer: HsOjo</div>
      </div>
    </div>
    <div class="logo">
      <img src="@/assets/logo.png" alt="logo" draggable="false"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index"
}
</script>

<style scoped>
.hint-area {
  display: flex;
  align-items: center;
  height: 392px;
  width: 800px;
}

.hint-text {
  font-size: 64px;
  padding-left: 96px;
  margin-bottom: 16px;
}

.hint-producer {
  text-align: center;
  font-size: 24px;
}

.logo {
  position: fixed;
  bottom: 5%;
  right: 7.5%;
  opacity: 0.15;
}
</style>
