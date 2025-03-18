<template>
  <div>
    <Header />
    <h2>朝代列表</h2>
    <ul>
      <li v-for="dynasty in dynasties" :key="dynasty.dynasty">
        <router-link :to="`/dynasties/${dynasty.dynasty}`">{{ dynasty.dynasty }}</router-link>
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
      dynasties: []
    };
  },
  async created() {
    try {
      const { poetPaths, getPoetByPath } = await loadPoetryData();
      const dynastyPoetMap = new Map();

      for (const poetPath of poetPaths) {
        const poet = await getPoetByPath(poetPath);
        if (!dynastyPoetMap.has(poet.Dynasty)) {
          dynastyPoetMap.set(poet.Dynasty, []);
        }
        dynastyPoetMap.get(poet.Dynasty).push(poet);
      }

      this.dynasties = Array.from(dynastyPoetMap.entries()).map(([dynasty, poetList]) => ({
        dynasty,
        poets: poetList.map(poet => ({
          ...poet,
          Name: this.escapeHtml(poet.Name || '')
        }))
      }));
    } catch (error) {
      console.error('Failed to fetch dynasties:', error);
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