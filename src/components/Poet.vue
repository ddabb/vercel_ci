<template>
  <div>
    <Header />
    <h2>{{ dynasty }} 诗人列表</h2>
    <ul>
      <li v-for="poet in poets" :key="poet.Name">
        <router-link :to="`/dynasties/${dynasty}/${poet.Name}`">{{ poet.Name }}</router-link>
      </li>
    </ul>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { loadPoetryData } from '@/utils/poetryData';

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      dynasty: this.$route.params.dynasty,
      poets: []
    };
  },
  async created() {
    try {
      const { poetPaths, getPoetByPath } = await loadPoetryData();
      this.poets = (await Promise.all(poetPaths.map(getPoetByPath)))
        .filter(poet => poet.Dynasty === this.dynasty)
        .map(poet => ({
          ...poet,
          Name: this.escapeHtml(poet.Name || '')
        }));
    } catch (error) {
      console.error('Failed to fetch poets:', error);
    }
  },
  methods: {
    escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }
};
</script>