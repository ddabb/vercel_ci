document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.poet-list');
    elems.forEach(function (elem) {
        new Masonry(elem, {
            itemSelector: '.poet-item',
            gutter: 10,
            fitWidth: true,
            percentPosition: true // 使用百分比位置计算
        });
    });
});