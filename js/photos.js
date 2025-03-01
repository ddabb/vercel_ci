const grid = document.querySelector('.photogrid');
var images = [
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/飞天鼠.png",
    "alt": "一只穿着传统服饰的老鼠正在弹奏一把琵琶，背景是色彩斑斓的壁画风格，充满了浓厚的艺术氛围"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/兵马俑鼠.png",
    "alt": "兵马俑风格的老鼠雕像，手里拿着竹简，背景是类似兵马俑坑的考古现场，雕像表面有明显的裂纹和风化痕迹"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/剪纸鼠.png",
    "alt": "红色剪纸艺术作品，图案中有老鼠和鲤鱼，周围环绕着花卉和吉祥符号，背景为金色，阳光透过剪纸形成美丽光影"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/动漫男.png",
    "alt": "一位穿着蓝色眼罩的动漫男性角色，背景是剧烈的爆炸和火焰效果，营造出紧张和动感的氛围"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/奶酪鼠.png",
    "alt": "一只小老鼠坐在一块奶酪上，周围散落着一些通心粉，背景是柔和的光线，营造出温馨的氛围"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/富士山鼠.png",
    "alt": "一只穿着和服的老鼠站在海边，背景是富士山和盛开的樱花，展现了浓厚的日本传统艺术风格"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/庭院太极鼠.png",
    "alt": "一只老鼠在庭院中打太极，背景是传统的中式建筑和竹林，展现了浓厚的中国水墨画风格"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/彩虹小妹妹.png",
    "alt": "一个可爱的卡通小妹妹，有着大大的眼睛和天使翅膀，手里抱着一个带有星星的球。背景是彩虹、星星和云朵，周围有许多彩色的棒棒糖，整体风格非常梦幻"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/抽象线条鼠.png",
    "alt": "一只由几何形状和线条组成的抽象风格老鼠，背景是粉蓝色的渐变色，整体设计简洁而现代"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/教堂男.png",
    "alt": "一个站在教堂前的男孩，背景是满月和哥特式建筑。男孩有着白色的卷发和红色的眼睛，穿着黑色的复古服装，整体风格具有浓厚的奇幻色彩"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/机械女.jpg",
    "alt": "一位蓝色短发的机械女性角色，穿着高科技风格的盔甲，背景是充满霓虹灯光的未来城市，展现了浓厚的赛博朋克风格"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/机械爬行鼠.png",
    "alt": "一只机械风格的老鼠，身体由金属和电子元件组成，眼睛发出蓝色的光芒，背景是一个充满霓虹灯光的未来城市，整体设计充满了科幻和赛博朋克的氛围"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/机械街头女.png",
    "alt": "一位拥有蓝色和粉色渐变头发的女性，穿着银色的紧身衣，脸上有电路图案，背景是一个充满霓虹灯光的未来城市街道，营造出浓厚的赛博朋克氛围"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/武侠鼠.png",
    "alt": "一只穿着武侠服装的老鼠，手持一把剑，站在竹林中。老鼠戴着黑色面具，肌肉线条明显，整体风格充满了浓厚的武侠气息"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/水晶鼠.png",
    "alt": "一只身体由水晶构成的老鼠，站在光滑的表面上，身体透明且反射出彩色的光芒，背景是一个简洁的室内环境，光线从一侧照射进来，营造出一种现代而梦幻的氛围"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/火鼠.png",
    "alt": "一只被火焰环绕的老鼠，背景是黑暗的。老鼠的眼睛大而明亮，身体周围有火焰和火花，尾巴也呈现出火焰的效果，整体风格充满了动感和力量"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/玻璃女.png",
    "alt": "一幅抽象风格的女性肖像画，由多种颜色和几何形状组成，形成一个充满活力和动感的形象。女性的脸部特征清晰，尤其是红色的嘴唇非常醒目，整体风格现代且富有艺术感"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/田园少数鼠.png",
    "alt": "一只穿着传统民族服饰的老鼠，站在一个石块上，背景是绿色的梯田和远处的山脉，整体风格充满了田园风光"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/白猫.png",
    "alt": "一只白色长毛猫戴着红色蝴蝶结，背景是模糊的彩色灯光，营造出宁静的氛围"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/舞扇星空鼠.png",
    "alt": "一只穿着传统服饰的老鼠，背景是星空和行星。老鼠的右臂是机械臂，左手拿着一把发光的扇子，整体风格融合了传统与科幻元素"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/舞扇白鼠.png",
    "alt": "一只穿着传统服饰的白色老鼠，背景是星空和闪烁的灯光。老鼠的右臂是机械臂，左手拿着一把发光的扇子，整体风格融合了传统与科幻元素"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/节日鼠.png",
    "alt": "一只穿着传统服饰的老鼠，戴着金色的帽子，手里拿着一个金元宝，背景是热闹的节日场景，有灯笼和烟花，营造出浓厚的节日氛围"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/银色机器人.png",
    "alt": "一个银色的机器人，背景是一个科幻风格的宇宙飞船内部。机器人的眼睛发出紫色和橙色的光芒，整体设计充满了未来感和科技感"
  },
  {
    "src": "https://cdn.jsdelivr.net/gh/ddabb/goodpic/img/零件男头.png",
    "alt": "一个机械风格的金色人脸雕塑，背景是复杂的齿轮和机械装置，整体风格具有浓厚的蒸汽朋克特色"
  }
];

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

// 初始化Masonry
new Masonry(grid, {
  itemSelector: '.photogrid-item',
  columnWidth: 100,
  gutter: 20,
  fitWidth: true
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
