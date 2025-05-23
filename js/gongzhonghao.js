document.addEventListener('DOMContentLoaded', function () {
    // 获取DOM元素
    const articleList = document.getElementById('article-list-weixin');
    const searchInput = document.getElementById('search-input-weixin');
    const searchButton = document.getElementById('search-button-weixin');
    const paginationContainer = document.getElementById('pagination-weixin');
    
    // 定义变量
    let articles = [];
    let currentPage = 1;
    const articlesPerPage = 10;
    let filteredArticles = [];
    let categories = new Set();
    let selectedCategory = 'all';
    
    // 获取文章数据
    fetch('../jsons/wechat.json')
        .then(response => response.json())
        .then(data => {
            articles = data;
            
            // 提取所有分类
            articles.forEach(article => {
                if (article.category) {
                    categories.add(article.category);
                } else {
                    article.category = '未分类';
                    categories.add('未分类');
                }
            });
            
            // 初始化分类筛选器
            initCategoryFilter();
            
            // 初始化文章列表
            filteredArticles = [...articles];
            renderArticles();
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            articleList.innerHTML = '<li class="error-message">加载文章失败，请稍后再试。</li>';
        });
    
    // 初始化分类筛选器
    function initCategoryFilter() {
        const categoryFilterContainer = document.createElement('div');
        categoryFilterContainer.className = 'category-filter-container';
        categoryFilterContainer.innerHTML = '<span class="category-label">分类筛选：</span>';
        
        // 添加"全部"选项
        const allCategoryBtn = document.createElement('button');
        allCategoryBtn.className = 'category-btn active';
        allCategoryBtn.textContent = '全部';
        allCategoryBtn.dataset.category = 'all';
        allCategoryBtn.addEventListener('click', function() {
            filterByCategory('all');
            setActiveCategory(this);
        });
        categoryFilterContainer.appendChild(allCategoryBtn);
        
        // 添加其他分类选项
        categories.forEach(category => {
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'category-btn';
            categoryBtn.textContent = category;
            categoryBtn.dataset.category = category;
            categoryBtn.addEventListener('click', function() {
                filterByCategory(category);
                setActiveCategory(this);
            });
            categoryFilterContainer.appendChild(categoryBtn);
        });
        
        // 将分类筛选器插入到搜索框下方
        const searchForm = document.getElementById('search-form-weixin');
        searchForm.after(categoryFilterContainer);
    }
    
    // 设置活动分类
    function setActiveCategory(button) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    }
    
    // 按分类筛选文章
    function filterByCategory(category) {
        selectedCategory = category;
        
        if (category === 'all') {
            filteredArticles = [...articles];
        } else {
            filteredArticles = articles.filter(article => article.category === category);
        }
        
        // 重置页码并重新渲染
        currentPage = 1;
        renderArticles();
    }
    
    // 搜索功能
    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // 如果搜索词为空，则显示所有文章（但仍然按照当前选中的分类筛选）
            if (selectedCategory === 'all') {
                filteredArticles = [...articles];
            } else {
                filteredArticles = articles.filter(article => article.category === selectedCategory);
            }
        } else {
            // 搜索词不为空，则按照搜索词和当前选中的分类筛选
            if (selectedCategory === 'all') {
                filteredArticles = articles.filter(article => 
                    article.title.toLowerCase().includes(searchTerm)
                );
            } else {
                filteredArticles = articles.filter(article => 
                    article.title.toLowerCase().includes(searchTerm) && 
                    article.category === selectedCategory
                );
            }
        }
        
        // 重置页码并重新渲染
        currentPage = 1;
        renderArticles();
    });
    
    // 回车键触发搜索
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // 渲染文章列表
    function renderArticles() {
        // 计算当前页的文章
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const currentArticles = filteredArticles.slice(startIndex, endIndex);
        
        // 清空文章列表
        articleList.innerHTML = '';
        
        // 如果没有文章，显示提示信息
        if (currentArticles.length === 0) {
            articleList.innerHTML = '<li class="no-results">没有找到匹配的文章</li>';
            paginationContainer.innerHTML = '';
            return;
        }
        
        // 渲染文章列表
        currentArticles.forEach((article, index) => {
            const li = document.createElement('li');
            li.className = 'article-item';
            
            // 创建文章标题链接
            const titleLink = document.createElement('a');
            titleLink.href = article.url;
            titleLink.className = 'article-title';
            titleLink.textContent = article.title.replace(/故事《|》/g, '');
            titleLink.target = '_blank';
            
            // 创建文章分类标签
            const categorySpan = document.createElement('span');
            categorySpan.className = 'article-category';
            categorySpan.textContent = article.category || '未分类';
            
            // 将元素添加到列表项
            li.appendChild(titleLink);
            li.appendChild(categorySpan);
            
            // 将列表项添加到文章列表
            articleList.appendChild(li);
        });
        
        // 渲染分页
        renderPagination();
    }
    
    // 渲染分页
    function renderPagination() {
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        
        // 清空分页容器
        paginationContainer.innerHTML = '';
        
        // 如果只有一页，不显示分页
        if (totalPages <= 1) {
            return;
        }
        
        // 创建分页容器
        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = 'pagination-wrapper';
        
        // 添加"上一页"按钮
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn prev-btn';
        prevButton.textContent = '上一页';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', function () {
            if (currentPage > 1) {
                currentPage--;
                renderArticles();
                window.scrollTo(0, 0);
            }
        });
        paginationWrapper.appendChild(prevButton);
        
        // 添加页码按钮
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // 调整startPage，确保显示maxVisiblePages个页码
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 添加第一页按钮
        if (startPage > 1) {
            const firstPageBtn = document.createElement('button');
            firstPageBtn.className = 'pagination-btn page-btn';
            firstPageBtn.textContent = '1';
            firstPageBtn.addEventListener('click', function () {
                currentPage = 1;
                renderArticles();
                window.scrollTo(0, 0);
            });
            paginationWrapper.appendChild(firstPageBtn);
            
            // 添加省略号
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationWrapper.appendChild(ellipsis);
            }
        }
        
        // 添加页码按钮
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn page-btn';
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', function () {
                currentPage = i;
                renderArticles();
                window.scrollTo(0, 0);
            });
            paginationWrapper.appendChild(pageBtn);
        }
        
        // 添加最后一页按钮
        if (endPage < totalPages) {
            // 添加省略号
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationWrapper.appendChild(ellipsis);
            }
            
            const lastPageBtn = document.createElement('button');
            lastPageBtn.className = 'pagination-btn page-btn';
            lastPageBtn.textContent = totalPages;
            lastPageBtn.addEventListener('click', function () {
                currentPage = totalPages;
                renderArticles();
                window.scrollTo(0, 0);
            });
            paginationWrapper.appendChild(lastPageBtn);
        }
        
        // 添加"下一页"按钮
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn next-btn';
        nextButton.textContent = '下一页';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', function () {
            if (currentPage < totalPages) {
                currentPage++;
                renderArticles();
                window.scrollTo(0, 0);
            }
        });
        paginationWrapper.appendChild(nextButton);
        
        // 将分页容器添加到DOM
        paginationContainer.appendChild(paginationWrapper);
    }
});