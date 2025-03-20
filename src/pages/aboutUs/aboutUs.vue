<template>
  <Header />
  <view class="container-fluid">
    <view class="row mt-5">
      <view class="col-lg-8 col-md-12 mx-auto">
        <view class="card">
          <view class="card-body">
            <view id="article-content">
              <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <navigator url="/pages/index/index">首页</navigator>
                  </li>
                  <li class="breadcrumb-item">
                    <navigator url="/category/分类列表.html">分类列表</navigator>
                  </li>
                  <li class="breadcrumb-item">
                    <navigator url="/category/台球天地.html">台球天地</navigator>
                  </li>
                </ol>
              </nav>

              <h1>探索台球世界的无限魅力</h1>
              <p>
                欢迎您来到我们的网站，这里不仅是台球爱好者的知识宝库，也是辅助台球店运营的强大工具。从零开始搭建的这一平台，仿照Hexo风格设计，拥有清晰的分类列表与标签列表，旨在为每一位用户提供学习、交流和享受台球乐趣的空间。
              </p>
              <h2>【台球百科全书】</h2>
              <p>
                无论你是初学者还是资深球员，都能在这里找到你所需要的一切。从台球运动的起源到现代比赛规则，从基础技巧到高级策略，我们的文章全面覆盖了台球的各个方面。探索“台球名将介绍”，了解那些传奇人物的故事；或是深入“台球设备评测报告”，选择最适合你的装备。
              </p>
              <h2>【丰富的分类与标签体系】</h2>
              <p>我们的主要分类涵盖了台球领域的广泛主题，如<a
                  href="https://www.60score.com/category/%E5%88%86%E7%B1%BB%E5%88%97%E8%A1%A8.html">分类列表</a>所示，确保用户能够快速定位感兴趣的内容。同时，通过使用各种标签，例如那些在<a
                  href="https://www.60score.com/tag/%E6%A0%87%E7%AD%BE%E5%88%97%E8%A1%A8.html">标签列表</a>上展示的，使得查找特定话题变得异常简单。
              </p>
              <h2>【实用工具与游戏资源】</h2>
              <p>为了进一步增强用户体验，我们提供了多种实用工具，详情请参阅<a
                  href="https://www.60score.com/html/tools.html">工具</a>，并会随着社区需求的增长而持续扩展。此外，还有丰富的游戏资源可供探索，点击<a
                  href="https://www.60score.com/html/games.html">游戏</a>即可发现更多有趣的游戏内容。</p>
              <h2>【互动交流平台】</h2>
              <p>我们深知交流是学习的关键。在此平台上，你可以通过评论区与其他玩家互动，分享你的经验，甚至向专家提问。强大的搜索功能让你能够快速找到感兴趣的主题，无论是台球礼仪、物理学原理，还是提升技能的小贴士。</p>
              <h2>【微信公众号整合】</h2>
              <p>
                除了网站上的资源，我们还集成了微信公众号文章，为你带来最新鲜的台球资讯和深度分析。只需点击，即可阅读更多高质量内容，无需离开我们的网站。如果有优秀的文章链接，可以联系站长进行分享，会毫不吝啬的集成在网站中，以便更多的人发现你的学识和智慧。
              </p>
              <p>加入我们，一起开启这段台球之旅吧！你的台球知识宝库，等待着你的发现。</p>

              <div class="qr-code mt-4">
                <h5>扫描二维码查看</h5>
                <view class="qrcode-container">
                  <vue-qrcode v-if="qrValue" :value="qrValue" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    width: 180,
                    color: {
                      dark: '#1A237E',
                      light: '#FFFFFF'
                    }
                  }">
                  </vue-qrcode>
                  <img class="qrcode__image" src="@/static/logo.png" alt="网站logo" />
                </view>
              </div>

              <div class="tag-links mt-4">
                <span class="badge tag-label"><i class="bi bi-tags"></i> 标签：</span>

                <navigator url="/tag/台球文化.html" class="badge tag-link">台球文化</navigator>
                <navigator url="/tag/台球技巧.html" class="badge tag-link">台球技巧</navigator>
                <navigator url="/tag/台球历史.html" class="badge tag-link">台球历史</navigator>
                <navigator url="/tag/技术驱动体验.html" class="badge tag-link">技术驱动体验</navigator>

              </div>
            </view>
          </view>
        </view>
        <div id="SOHUCS"></div>
      </view>
    </view>
  </view>
  <Footer />
</template>
<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import VueQrcode from '@chenfengyuan/vue-qrcode'; // 使用标准库

export default {
  components: {
    Header,
    Footer,
    VueQrcode
  },
  data() {
    return {
      qrValue: 'https://www.60score.com/mdhtml/关于我们.html' // 直接设置默认值
    };
  },
  mounted() {
    // 优先使用本地存储的值
    const savedValue = localStorage.getItem('qrValue');
    if (savedValue) {
      this.qrValue = savedValue;
    }
    // 调试用（可选）
    console.log('Current QR value:', this.qrValue);
  },
  watch: {
    qrValue(newVal) {
      localStorage.setItem('qrValue', newVal);
    }
  }
};
</script>
<style scoped>
@import url('@/static/css/article.css');

.qrcode-container {
  display: inline-block;
  position: relative;
  margin: 20px 0;
}

.qrcode__image {
  background-color: #fff;
  border: 3px solid #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  height: 20%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
}
</style>