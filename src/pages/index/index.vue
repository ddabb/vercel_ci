<template>
  <Header />
  <view class="container-fluid">
    <view class="row mt-5">
      <view class="col-lg-8 col-md-12 mx-auto">
        <view class="card mb-4">
          <view class="card-header">
            <text style="font-size: 1.5em; margin: 0.5em 0;">传阅·站长精选·每日更新</text>
          </view>
          <view class="card-body">
            <view id="search-form">
              <view class="search-container">
                <input type="text" v-model="keyword" placeholder="输入标题、标签、分类、描述..." @confirm="onSearch" />
                <button @click="onSearch">找找看</button>
              </view>
            </view>
            <ul id="article-list-md">
              <li v-for="(article, index) in articles" :key="index" class="article-container">
                <span class="article-category" @click="navigateToCategory(article.category)">
                  {{ article.category }}
                </span>
                <navigator :url="`/pages/mdhtml/${encodeURIComponent(article.fileName)}`">
                  {{ article.title }}
                </navigator>
                <span class="article-date">{{ formatDate(article.updateTime) }}</span>
              </li>
            </ul>
            <view id="pagination-md">
              <!-- 分页控件 -->
              <block v-for="(page, index) in paginationPages" :key="index">
                <button @click="goToPage(page.pageNumber)" :class="{ active: page.isActive }">
                  {{ page.text }}
                </button>
              </block>
            </view>
          </view>
        </view>
      </view>
    </view>
    <Footer />
  </view>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  data() {
    return {
      keyword: '',
      articles: [],
      currentPage: 1,
      pageSize: 12,
      totalPages: 1,
      paginationPages: [],
      callType: 'md' // 确保 callType 正确初始化
    };
  },
  components: {
    Header,
    Footer
  },
  methods: {
    createPagination() {
      this.paginationPages = [];
      let startPage = Math.max(1, this.currentPage - 3);
      let endPage = Math.min(this.totalPages, startPage + 6);

      if (startPage > 1) {
        this.paginationPages.push({ text: '首页', pageNumber: 1 });
        this.paginationPages.push({ text: '...', pageNumber: null });
      }

      for (let i = startPage; i <= endPage; i++) {
        this.paginationPages.push({ text: i.toString(), pageNumber: i, isActive: i === this.currentPage });
      }

      if (endPage < this.totalPages) {
        this.paginationPages.push({ text: '...', pageNumber: null });
        this.paginationPages.push({ text: '末页', pageNumber: this.totalPages });
      }
    },
    goToPage(pageNumber) {
      if (pageNumber !== null) {
        this.fetchArticles(this.keyword, pageNumber, this.callType);
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    navigateToCategory(category) {
      uni.navigateTo({
        url: `/pages/category/${encodeURIComponent(category)}`
      });
    },
    async onSearch() {
      await this.fetchArticles(this.keyword, 1, this.callType);
    },
    async fetchArticles(keyword = '', page = 1, callType = 'md') {
  try {
    const response = await uni.request({
      url: `/api/getjson?keyword=${keyword}&pageSize=${this.pageSize}&page=${page}&calltype=${callType}`, // 调用API
      method: 'GET'
    });
    debugger;
    console.log('Response:', response); // 添加调试信息

    // 假设响应结构是 [response, data]
    const { data } = response[1];

    // 检查数据是否存在
    if (!data) {
      throw new Error('No data returned from API');
    }

    const { articles, currentPage, totalPages, pageSize } = data;
    this.articles = articles;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.createPagination();
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
},
  created() {
    console.log('callType:', this.callType); // 使用 created 生命周期钩子
    this.fetchArticles('', 1, this.callType);
  }
}}
</script>