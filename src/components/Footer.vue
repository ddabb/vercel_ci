<template>
  <footer class="sticky-footer">
    <div class="container">
      <span id="busuanzi_container_page_pv" class="stat-item">访问量 <span id="busuanzi_value_page_pv">0</span></span>
      <navigator url="/pages/aboutUs/aboutUs" class="nav-item">关于我们</navigator>
      <navigator url="/pages/contactUs/contactUs" class="nav-item">联系我们</navigator>
    </div>
  </footer>
</template>

<style scoped>
/* 新增局部样式 */
.container {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 42px;
}

.stat-item {
  font-size: 14px;
  color: #666;
}

.nav-item {
  padding: 6px 12px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-item:hover {
  background: rgba(74, 144, 226, 0.1);
}
</style>

<script>
export default {
  name: "FooterComponent",
  mounted() {
    // 可以在这里添加任何需要在组件挂载后执行的代码
  }
}
</script>

<style scoped>
@import url('@/static/css/footer.css');
</style>