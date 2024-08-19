document.addEventListener('DOMContentLoaded', () => {
  const imageModal = document.getElementById('imageModal');
  const modal = new bootstrap.Modal(imageModal);

  fetch('/api/images')
    .then(response => response.json())
    .then(imagesData => {
      const photoGrid = document.getElementById('photo-grid');
      imagesData.forEach(imageData => {
        const imgElement = document.createElement('img');
        imgElement.src = imageData.src;
        imgElement.alt = imageData.alt;
        imgElement.classList.add('grid-item');
        imgElement.style.cursor = 'pointer';

        imgElement.addEventListener('click', function () {
          const modalImage = document.getElementById('modalImage');
          const modalImageAlt = document.getElementById('modalImageAlt');
          modalImage.src = imgElement.src;
          modalImage.alt = imgElement.alt;

          // Remove file extension from alt text
          const altTextWithoutExtension = removeFileExtension(modalImage.alt);
          modalImageAlt.textContent = altTextWithoutExtension;

          modal.show();
        });

        photoGrid.appendChild(imgElement);
      });
    })
    .catch(error => console.error('Error fetching images:', error));
});

function removeFileExtension(text) {
  // Regular expression to match file extensions
  const extensionRegex = /\.[^.]+$/;
  return text.replace(extensionRegex, '');
}