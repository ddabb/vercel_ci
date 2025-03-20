<template>
    <view>
        <!-- 引入头部组件 -->
        <Header />

        <main class="container-fluid">
            <div class="row mt-5">
                <div class="col-lg-8 col-md-12 mx-auto">
                    <div class="card">
                        <div class="card-body">
                            <div id="article-content">
                                <nav aria-label="breadcrumb" class="mb-4" v-if="meta && meta.category">
                                    <ol class="breadcrumb">
                                        <li class="breadcrumb-item"><a href="/pages/index/index">首页</a></li>
                                        <li class="breadcrumb-item"><a href="/category/分类列表.html">分类列表</a></li>
                                        <li class="breadcrumb-item"><a
                                                :href="`/category/${encodeURIComponent(meta.category)}.html`">{{
                                    meta.category }}</a></li>
                                    </ol>
                                </nav>

                                <div v-html="content"></div>

                                <div class="qr-code mt-4">
                                    <h5>扫描二维码查看</h5>
                                    <!-- 假设您有一个QRCode组件或使用第三方库生成二维码 -->
                                    <widget-qrcode id="pageQrCode" template="heart" width="180" height="180"
                                        foreground-color="#1A237E" inner-color="#FF6D00" outer-color="#1A237E"
                                        logo="../static/logo.png"
                                        :value="`https://www.60score.com/mdhtml/${encodeURIComponent(meta.title)}.html`">
                                    </widget-qrcode>
                                </div>

                                <div class="product-card mt-4"
                                    v-if="meta.goodsInfo && Object.keys(meta.goodsInfo).length > 0">
                                    <a :href="meta.goodsInfo.showurl" target="_blank" rel="nofollow">
                                        <img :src="meta.goodsInfo.picLink" :alt="meta.goodsInfo.name">
                                        <p>{{ meta.goodsInfo.name }}</p>
                                        <p>月销量：{{ meta.goodsInfo.monthSale }}</p>
                                        <p class="card-text">单价：<span class="price-highlight">{{
                                    meta.goodsInfo.unitprice }}</span> 元</p>
                                    </a>
                                </div>

                                <div class="tag-links mt-4" v-if="meta && meta.tags && meta.tags.length > 0">
                                    <span class="badge tag-label"><i class="bi bi-tags"></i> 标签：</span>
                                    <a v-for="(tag, index) in meta.tags" :key="index"
                                        :href="`/tag/${encodeURIComponent(tag.trim())}.html`" class="badge tag-link">{{
                                    tag.trim() }}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="SOHUCS"></div>
                </div>
            </div>
        </main>

        <!-- 引入尾部组件 -->
        <Footer />
    </view>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            content: '',
            meta: {}
        }
    },
    onLoad(options) {
        if (options.title) {
            this.fetchArticle(options.title);
        }
    },
    methods: {
        async fetchArticle(title) {
            try {
                // 注意：这里不使用 encodeURIComponent 来保持原始文件名
                const response = await uni.request({
                    url: `/static/mdfiles/${title}.json`,
                });
                const articleData = response[1].data;
                this.content = articleData.content;
                this.meta = articleData.meta;
            } catch (error) {
                console.error(`Failed to load article ${title}:`, error);
            }
        }
    }

}
</script>

<style scoped>
/* 页面样式 */
.qr-code {
    text-align: center;
}

.product-card img {
    max-width: 100%;
    height: auto;
}

.tag-links .tag-link {
    margin-right: 5px;
}

.price-highlight {
    color: red;
    font-weight: bold;
}
</style>