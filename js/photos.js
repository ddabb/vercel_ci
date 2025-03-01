document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector('.photogrid');

  async function loadImages() {
    // 清空现有的图片项
    grid.innerHTML = '';

    try {
      // 发起请求获取图片数据
      const response = await fetch(`/api/getjson?calltype=photo&pageSize=10000`);
      const data = await response.json();
      
      // 假设返回的数据结构为 { items: [{src: "path/to/photo.jpg", alt: "description"}, ...]}
      const images = data;

      // 动态创建图片项并添加到grid中
      images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'photogrid-item';
        item.innerHTML = `
          <a href="${img.src}" 
             data-pswp-width="1200" 
             data-pswp-height="1200" 
             data-cropped="true"
             rel="noopener"
             data-index="${index}">
              <img src="${img.src}" 
                   alt="${img.alt}" 
                   loading="lazy">
          </a>
          <div class="photocaption">${img.alt}</div>
        `;
        grid.appendChild(item);
      });

      // 确保所有图片加载完毕后再初始化Masonry
      imagesLoaded(grid, function () {
        new Masonry(grid, {
          itemSelector: '.photogrid-item',
          columnWidth: 200,
          gutter: 20,
          fitWidth: true
        });
      });

      // 初始化PhotoSwipe
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
            a.download = imgSrc.split('/').pop();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        });
      });

    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  // 初始加载图片
  loadImages();

  // 如果需要根据某些条件重新加载图片（例如用户触发了重新查询），可以调用loadImages函数
  // 例如：某个按钮点击事件触发重新加载
  // document.getElementById('reloadButton').addEventListener('click', loadImages);
});