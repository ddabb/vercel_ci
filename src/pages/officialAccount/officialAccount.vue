<template>
    <div>
      <Header />
      <h1>🗣️公众号</h1>
      <p>这里是公众号页面的内容。</p>
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