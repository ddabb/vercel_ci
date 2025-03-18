<template>
  <div>
    <Header />
    <h2>{{ poet.Name }}</h2>
    <p>{{ poet.Description }}</p>
    <h3>作品列表</h3>
    <ul>
      <li v-for="poem in poet.Poems" :key="poem.Name">{{ poem.Name }}</li>
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
      poetName: this.$route.params.poetName,
      poet: {}
    };
  },
  async created() {
    try {
      const { getPoetByPath } = await loadPoetryData();
      this.poet = await getPoetByPath(`${this.dynasty}/${this.poetName}`);
      this.poet.Name = this.escapeHtml(this.poet.Name || '');
      this.poet.Description = this.escapeHtml(this.poet.Description || '');
      this.poet.Poems = (this.poet.Poems || []).map(poem => ({
        ...poem,
        Name: this.escapeHtml(poem.Name || ''),
        Form: this.escapeHtml(poem.Form || ''),
        Tags: (poem.Tags || []).map(tag => this.escapeHtml(tag)),
        Contents: (poem.Contents || []).map(line => this.escapeHtml(line))
      }));
    } catch (error) {
      console.error('Failed to fetch poet details:', error);
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