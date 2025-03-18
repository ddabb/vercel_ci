<template>
  <footer class="sticky-footer text-center text-lg-start bg-light text-muted">
    <div class="container text-center py-1">
      <section>
        <span id="busuanzi_container_page_pv">本页面访问量<span id="busuanzi_value_page_pv"></span>次</span>
        <router-link to="/aboutUs">关于我们</router-link>
        <router-link to="/contactUs">联系我们</router-link>
      </section>
    </div>
  </footer>
</template>

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