document.addEventListener('DOMContentLoaded', function () {
    // DOM元素引用
    const articleList = document.getElementById('article-list-weixin');
    const searchInput = document.getElementById('search-input-weixin');
    const searchButton = document.getElementById('search-button-weixin');
    const paginationContainer = document.getElementById('pagination-weixin');
    const categoryButtonsContainer = document.getElementById('category-buttons-container');
    
    // 页面状态变量
    let articles = []; // 存储所有文章数据
    let currentPage = 1; // 当前页码
    const articlesPerPage = 12; // 每页显示文章数
    let filteredArticles = []; // 过滤后的文章
    let categories = new Set(); // 文章分类集合
    let selectedCategory = 'all'; // 当前选中分类

    /**
     * 初始化页面数据
     */
    function initPage() {
        fetch('../jsons/wechat.json')
            .then(response => response.json())
            .then(data => {
                articles = data;
                extractCategories();
                initCategoryFilter();
                filteredArticles = [...articles];
                renderArticles();
            })
            .catch(error => {
                console.error('加载文章数据失败:', error);
                showErrorMessage();
            });
    }

    /**
     * 从文章数据中提取分类信息
     */
    function extractCategories() {
        articles.forEach(article => {
            const category = article.category || '未分类';
            categories.add(category);
        });
    }

    /**
     * 显示错误信息
     */
    function showErrorMessage() {
        articleList.innerHTML = '<div class="error-message">加载文章失败，请稍后再试。</div>';
    }

    /**
     * 初始化分类筛选器
     */
    function initCategoryFilter() {
        // 分类图标映射
        const categoryIcons = {
            '全部': 'bi-collection',
            '古代言情': 'bi-heart',
            '悬疑': 'bi-question-circle',
            '幻想言情': 'bi-stars',
            '同人': 'bi-people',
            '游戏': 'bi-controller',
            '现代言情': 'bi-heart-fill',
            '未分类': 'bi-tag'
        };

        // 添加"全部"选项
        addCategoryButton('全部', 'all', categoryIcons['全部'], true);

        // 添加其他分类选项
        categories.forEach(category => {
            const icon = categoryIcons[category] || 'bi-tag';
            addCategoryButton(category, category, icon, false);
        });
    }

    /**
     * 添加分类按钮
     * @param {string} displayText 显示文本
     * @param {string} category 分类值
     * @param {string} iconClass 图标类名
     * @param {boolean} isActive 是否默认激活
     */
    function addCategoryButton(displayText, category, iconClass, isActive) {
        const button = document.createElement('div');
        button.className = `category-tag ${isActive ? 'active' : ''}`;
        button.innerHTML = `<i class="bi ${iconClass}"></i> ${displayText}`;
        button.dataset.category = category;
        button.addEventListener('click', () => {
            filterByCategory(category);
            setActiveCategory(button);
        });
        categoryButtonsContainer.appendChild(button);
    }

    /**
     * 设置当前激活的分类按钮
     * @param {HTMLElement} activeButton 激活的按钮元素
     */
    function setActiveCategory(activeButton) {
        document.querySelectorAll('.category-tag').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
        scrollToCategory(activeButton);
    }

    /**
     * 滚动到指定分类（移动端优化）
     * @param {HTMLElement} element 要滚动到的元素
     */
    function scrollToCategory(element) {
        if (window.innerWidth <= 768) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    /**
     * 根据分类过滤文章
     * @param {string} category 要过滤的分类
     */
    function filterByCategory(category) {
        selectedCategory = category;
        filteredArticles = category === 'all' 
            ? [...articles] 
            : articles.filter(article => article.category === category);
        resetPagination();
    }

    /**
     * 重置分页状态
     */
    function resetPagination() {
        currentPage = 1;
        renderArticles();
    }

    /**
     * 渲染文章列表
     */
    function renderArticles() {
        const paginatedArticles = getPaginatedArticles();
        
        if (paginatedArticles.length === 0) {
            showNoResults();
            return;
        }

        renderArticleCards(paginatedArticles);
        renderPagination();
    }

    /**
     * 获取当前页的文章
     */
    function getPaginatedArticles() {
        const start = (currentPage - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        return filteredArticles.slice(start, end);
    }

    /**
     * 显示无结果提示
     */
    function showNoResults() {
        articleList.innerHTML = '<div class="no-results">没有找到匹配的文章</div>';
        paginationContainer.innerHTML = '';
    }

    /**
     * 渲染文章卡片
     * @param {Array} articles 要渲染的文章数组
     */
    function renderArticleCards(articles) {
        articleList.innerHTML = '';
        articles.forEach(article => {
            const card = createArticleCard(article);
            articleList.appendChild(card);
        });
    }

    /**
     * 创建文章卡片元素
     * @param {Object} article 文章数据
     */
    function createArticleCard(article) {
        const card = document.createElement('div');
        card.className = 'article-card';
        
        card.innerHTML = `
            <div class="article-content">
                <a href="${article.url}" class="article-title" target="_blank">
                    ${article.title.replace(/故事《|》/g, '')}
                </a>
                <div class="article-meta">
                    <span class="article-category">${article.category || '未分类'}</span>
                    <span class="article-date">${getRandomDate()}</span>
                </div>
            </div>
        `;
        
        return card;
    }

    /**
     * 生成随机日期（模拟）
     */
    function getRandomDate() {
        const start = new Date(2023, 0, 1);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toLocaleDateString('zh-CN');
    }

    /**
     * 渲染分页控件
     */
    function renderPagination() {
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        paginationContainer.innerHTML = '';
        const pagination = document.createElement('div');
        pagination.className = 'pagination';

        pagination.appendChild(createPrevButton());
        pagination.appendChild(createPageButtons(totalPages));
        pagination.appendChild(createNextButton(totalPages));

        paginationContainer.appendChild(pagination);
    }

    /**
     * 创建上一页按钮
     */
    function createPrevButton() {
        const button = document.createElement('button');
        button.className = 'pagination-btn';
        button.innerHTML = '<i class="bi bi-chevron-left"></i>';
        button.disabled = currentPage === 1;
        button.addEventListener('click', () => navigateToPage(currentPage - 1));
        return button;
    }

    /**
     * 创建页码按钮
     * @param {number} totalPages 总页数
     */
    function createPageButtons(totalPages) {
        const fragment = document.createDocumentFragment();
        const { startPage, endPage } = calculatePageRange(totalPages);

        if (startPage > 1) {
            fragment.appendChild(createPageButton(1));
            if (startPage > 2) {
                fragment.appendChild(createEllipsis());
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            fragment.appendChild(createPageButton(i));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                fragment.appendChild(createEllipsis());
            }
            fragment.appendChild(createPageButton(totalPages));
        }

        return fragment;
    }

    /**
     * 计算页码显示范围
     * @param {number} totalPages 总页数
     */
    function calculatePageRange(totalPages) {
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return { startPage, endPage };
    }

    /**
     * 创建单个页码按钮
     * @param {number} pageNum 页码
     */
    function createPageButton(pageNum) {
        const button = document.createElement('button');
        button.className = 'pagination-btn';
        button.textContent = pageNum;
        if (pageNum === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => navigateToPage(pageNum));
        return button;
    }

    /**
     * 创建省略号元素
     */
    function createEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        return ellipsis;
    }

    /**
     * 创建下一页按钮
     * @param {number} totalPages 总页数
     */
    function createNextButton(totalPages) {
        const button = document.createElement('button');
        button.className = 'pagination-btn';
        button.innerHTML = '<i class="bi bi-chevron-right"></i>';
        button.disabled = currentPage === totalPages;
        button.addEventListener('click', () => navigateToPage(currentPage + 1));
        return button;
    }

    /**
     * 导航到指定页码
     * @param {number} pageNum 目标页码
     */
    function navigateToPage(pageNum) {
        currentPage = pageNum;
        renderArticles();
        window.scrollTo(0, 0);
    }

    // 初始化搜索功能
    function initSearch() {
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    /**
     * 处理搜索操作
     */
    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        filteredArticles = selectedCategory === 'all'
            ? articles.filter(article => article.title.toLowerCase().includes(searchTerm))
            : articles.filter(article => 
                article.title.toLowerCase().includes(searchTerm) && 
                article.category === selectedCategory
            );

        resetPagination();
    }

    // 初始化页面
    initPage();
    initSearch();
});