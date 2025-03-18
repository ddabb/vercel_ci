<template>
    <div>
      <Header />
      <h1>📷相册</h1>
      <p>这里是相册页面的内容。</p>
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