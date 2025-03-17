<template>
  <view>
    <!-- 头部导航 -->
    <header>
      <view>
        <nav class="navbar navbar-light bg-light">
          <view class="container-fluid">
            <ul class="navbar-nav d-flex flex-row scrolling-menu">
              <li class="nav-item">
                <a class="nav-link d-flex align-items-center" href="/pages/index/index">
                  <img src="@/static/logo.svg" alt="Logo" style="max-width: 24px;max-height: 24px; margin-right:1px;">
                  自助工具站
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/pages/photos/photos">
                  📷相册
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/pages/dianzhangbiji/dianzhangbiji">
                  💡想法
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/pages/gongzhonghao/gongzhonghao">
                  🗣️公众号
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/pages/tools/tools">
                  🔧工具
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/pages/games/games">
                  🎮游戏
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/pages/sghtml/dynasties/dynasties">
                  📜诗词
                </a>
              </li>
            </ul>
          </view>
        </nav>
      </view>
    </header>

    <!-- 主要内容 -->
    <main class="container-fluid">
      <div class="row mt-5">
        <div class="col-lg-8 col-md-12 mx-auto">
          <div class="card mb-4">
            <div class="card-header">
              <h1 style="font-size: 1.5em; margin: 0.5em 0;">传阅·站长精选·每日更新</h1>
            </div>
            <div class="card-body">
              <div id="search-form">
                <div class="search-container">
                  <input type="text" v-model="keyword" id="search-input-md" placeholder="输入标题、标签、分类、描述...">
                  <button @click="fetchArticles" id="search-button-md">找找看</button>
                </div>
              </div>
              <ul id="article-list-md">
                <li v-for="article in articles" :key="article.id">{{ article.name }}</li>
              </ul>
              <div id="pagination-md">
                <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
                <span>{{ currentPage }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <div class="sticky-footer-container">
      <footer class="sticky-footer text-center text-lg-start bg-light text-muted">
        <div class="container text-center py-1">
          <section>
            <p>
              <span id="busuanzi_container_site_pv">本站总访问量<span id="busuanzi_value_site_pv"></span>次</span>
              <a href="/pages/mdhtml/关于我们/关于我们">关于我们</a> |
              <a href="/pages/contactus/contactus">联系我们</a>
            </p>
          </section>
        </div>
      </footer>
    </div>
  </view>
</template>

<script>
import getJson from '@/api/getjson.js';
import { onShow } from '@dcloudio/uni-app';

export default {
  data() {
    return {
      articles: [],
      currentPage: 1,
      totalPages: 1,
      keyword: '',
      pageSize: 10
    };
  },
  onLoad() {
    console.log('onLoad: 页面加载开始');
    this.fetchArticles();
    // 百度统计代码
    var _hmt = _hmt || [];
    (function () {
      console.log('onLoad: 开始加载百度统计代码');
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?9375ffd48c244c211aeaa2bd8c047a43";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
      console.log('onLoad: 百度统计代码加载完成');
    })();
    console.log('onLoad: 页面加载结束');
  },
  onShow() {
    console.log('onShow: 页面显示开始');
    // 不蒜子统计代码
    const script = document.createElement('script');
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.async = true;
    document.head.appendChild(script);
    console.log('onShow: 不蒜子统计代码加载完成');
    console.log('onShow: 页面显示结束');
  },
  methods: {
    async fetchArticles() {
      console.log('fetchArticles: 开始获取文章数据');
      console.log(`fetchArticles: 当前关键字: ${this.keyword}`);
      console.log(`fetchArticles: 当前页码: ${this.currentPage}`);
      console.log(`fetchArticles: 每页数量: ${this.pageSize}`);
      try {
        const response = await getJson({
          query: {
            keyword: this.keyword,
            pageSize: this.pageSize,
            page: this.currentPage,
            calltype: 'md'
          }
        });
        console.log('fetchArticles: 文章数据获取成功');
        console.log('fetchArticles: 文章数据:', response.data.articles);
        console.log('fetchArticles: 总页数:', response.data.totalPages);
        this.articles = response.data.articles;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error('fetchArticles: 文章数据获取失败:', error);
      }
      console.log('fetchArticles: 获取文章数据结束');
    },
    prevPage() {
      console.log('prevPage: 点击上一页按钮');
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchArticles();
      }
      console.log('prevPage: 上一页操作结束');
    },
    nextPage() {
      console.log('nextPage: 点击下一页按钮');
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchArticles();
      }
      console.log('nextPage: 下一页操作结束');
    }
  }
};
</script>

<style>
/* 引入CSS文件 */
@import '@/static/css/style.css';
@import '@/static/css/footer.css';
@import '@/static/css/weixin.css';
@import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
@import 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
</style>

<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"></script>
<script src="@/js/clarity.js"></script>
