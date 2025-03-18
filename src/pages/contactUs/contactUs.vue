<template>
    <div>
      <Header />
      <h1>联系我们</h1>
      <div class="profile">
        <img src="@/static/images/wexin.jpg" alt="店长公众号" class="wexin-img">
        <div class="name">店长微信</div>
        <div class="bio">未尽事宜可以添加店长微信，进行进一步的沟通。</div>
      </div>
      <div class="profile">
        <img src="@/static/images/wechat.jpg" alt="博主头像" class="wechat-img">
        <div class="name">公众号</div>
        <div class="bio">关注了解更多台球店的相关资讯</div>
      </div>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  
  export default {
    components: {
      Header,
      Footer
    }
  };
  </script>
  
  <style scoped>
  @import url('@/static/css/profile.css');
  </style>