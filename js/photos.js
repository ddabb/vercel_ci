document.addEventListener('DOMContentLoaded', function () {
  var grid = document.querySelector('#masonry-grid');
  
  // 创建图片元素
  var images = [
      // {src: 'https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/炉石.jpg', alt: '炉石'},
      // {src: 'https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/台球厅图片.jpg', alt: '台球厅图片'}
  ];

  // 动态添加图片到页面
  images.forEach(function(image) {
      var imgElement = document.createElement('img');
      imgElement.src = image.src;
      imgElement.alt = image.alt;
      imgElement.classList.add('masonry-grid-item'); // 添加必要的类名用于Masonry布局
      grid.appendChild(imgElement);
  });

  // 初始化Masonry
  var msnry = new Masonry(grid, {
      itemSelector: '.masonry-grid-item',
      columnWidth: 200,
      gutter: 10
  });
});

function removeFileExtension(text) {
  // Regular expression to match file extensions
  const extensionRegex = /\.[^.]+$/;
  return text.replace(extensionRegex, '');
}