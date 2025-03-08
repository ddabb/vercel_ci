document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector('.photogrid');

  // 初始化 Masonry 实例
  let masonryInstance;

  async function loadImages() {
    // 清空现有的图片项
    grid.innerHTML = '';

    try {
      // 发起请求获取图片数据
      const response = await fetch(`/api/getjson?calltype=photo&pageSize=10000`);
      const data = await response.json();

      // 假设返回的数据结构为 { items: [{src: "path/to/photo.jpg", alt: "description"}, ...]}
      const images = data.articles; // 确认数据字段名称

      // 动态创建图片项并添加到 grid 中
      images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'photogrid-item';

        // 创建图片元素
        const imgElement = document.createElement('img');
        imgElement.src = img.src;
        imgElement.alt = img.alt;
        imgElement.loading = "lazy";

        // 当图片加载失败时，移除该项
        imgElement.onerror = () => {
          item.remove(); // 使用 item.remove() 更简洁
        };

        // 监听图片加载完成事件
        imgElement.onload = () => {
          item.classList.add('loaded'); // 图片加载完成后添加 'loaded' 类
        };

        item.innerHTML = `
          <a href="${img.src}" 
             data-pswp-width="1200" 
             data-pswp-height="1200" 
             data-cropped="true"
             rel="noopener"
             data-index="${index}">
              ${imgElement.outerHTML}
          </a>
          <div class="photocaption">${img.alt}</div>
        `;
        grid.appendChild(item);
      });
      const columnWidth = window.innerWidth > 768 ? 200 : 'auto'; // 或者选择一个适合移动设备的固定值
      // 确保所有图片加载完毕后再初始化 Masonry
      imagesLoaded(grid, function () {
        masonryInstance = new Masonry(grid, {

          itemSelector: '.photogrid-item',
          columnWidth: columnWidth,
          gutter: 20,
          fitWidth: true

        });

        // 初始化 PhotoSwipe 等其他功能...

        // 添加下载按钮功能
        initPhotoSwipe();

        // 监听窗口大小变化，重新布局 Masonry
        window.addEventListener('resize', () => {
          if (masonryInstance) {
            masonryInstance.layout();
          }
        });
      });

    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  // 初始化 PhotoSwipe
  function initPhotoSwipe() {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '.photogrid',
      children: 'a',
      pswpModule: PhotoSwipe,
      arrowPrev: true,
      arrowNext: true,
      zoom: false,
      bgOpacity: 0.95,
    });
    lightbox.init();

    // 添加下载按钮功能
    lightbox.on('uiRegister', () => {
      lightbox.pswp.ui.registerElement({
        name: 'download-button',
        ariaLabel: '下载图片',
        order: 8,
        isButton: true,
        html: '<i class="pswp__icn" style="background-image:url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkgOUgxNVYzSDlWOUg1bDcgNyA3LTdNNSAydjJoMTRWMkg1eiIvPjwvc3ZnPg==\')"></i>',
        onClick: (e, el) => {
          const imgSrc = lightbox.pswp.currSlide.data.src;
          const a = document.createElement('a');
          a.href = imgSrc;
          a.download = imgSrc.split('/').pop(); // 防止split后为空
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      });
    });
  }

  // 初始加载图片
  loadImages();
});