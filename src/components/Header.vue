<template>
  <header>
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <ul class="navbar-nav d-flex flex-row scrolling-menu">
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/index">
              <img src="@/static/logo.svg" alt="Logo" style="max-width: 24px; max-height: 24px; margin-right:1px;">
              自助工具站
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/photos">📷相册</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ideas">💡想法</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/officialAccount">🗣️公众号</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/tools">🔧工具</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/games">🎮游戏</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/poetry">📜诗词</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
  mounted() {
    // 动态加载外部JS文件
    const scripts = [
      "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",
      "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js",
      "@/static/js/clarity.js",
      "https://cdn.jsdelivr.net/npm/widget-qrcode@1.0.4/dist/widget-qrcode.min.js"
    ];
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });
  }
}
</script>

<style scoped>
/* 在这里添加特定于头部组件的样式 */
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');
@import url('https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css');
@import url('@/static/css/style.css');
@import url('@/static/css/productcard.css');
@import url('@/static/css/article.css');
</style>