<template>
  <div>
    <Header />
    <h1>欢迎来到古诗文网</h1>
    <router-link to="/dynasties">查看朝代列表</router-link>
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