document.addEventListener('DOMContentLoaded', () => {
  // 获取模态框和大图容器的引用
  const modal = new bootstrap.Modal(document.getElementById('imageModal'));
  const modalImage = document.getElementById('modalImage');

  // 获取图片列表并渲染到页面
  fetch('/api/images') // 替换为实际的 API 路径
    .then(response => response.json())
    .then(imagesData => {
      const photoGrid = document.getElementById('photo-grid');
      imagesData.forEach(imageData => {
        const imgElement = document.createElement('img');
        imgElement.src = imageData.src;
        imgElement.alt = imageData.alt;
        imgElement.classList.add('grid-item'); // 添加类名以便应用 CSS Grid 样式
        imgElement.addEventListener('click', () => {
          // 当图片被点击时，设置模态框中大图的 src 并显示模态框
          modalImage.src = imgElement.src;
          modal.show();
        });
        photoGrid.appendChild(imgElement);
      });
    })
    .catch(error => console.error('Error fetching images:', error));
});