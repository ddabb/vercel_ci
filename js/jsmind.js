

document.addEventListener('DOMContentLoaded', (event) => {
  const inputArea = document.getElementById('input_area');
  // 设置默认值
  if (inputArea.value === '') {
    inputArea.value = `{
  "meta": {},
  "format": "node_tree",
  "data": {
    "id": "root",
    "topic": "人生的智慧",
    "children": [
      {
        "id": "child1",
        "topic": "自我认识",
        "children": [
          {
            "id": "grandchild1",
            "topic": "接受自己的不完美",
            "children": [
              {"id": "greatgrandchild1", "topic": "认识到每个人都有缺点"},
              {"id": "greatgrandchild2", "topic": "用爱和同情对待自己"}
            ]
          },
          {
            "id": "grandchild2",
            "topic": "了解个人的价值观和信念",
            "children": [
              {"id": "greatgrandchild3", "topic": "反思什么是最重要的"},
              {"id": "greatgrandchild4", "topic": "与志同道合的人交往"}
            ]
          },
          {
            "id": "grandchild3",
            "topic": "持续学习与成长",
            "children": [
              {"id": "greatgrandchild5", "topic": "保持好奇心"},
              {"id": "greatgrandchild6", "topic": "从失败中吸取教训"},
              {"id": "greatgrandchild7", "topic": "设定个人发展目标"}
            ]
          }
        ]
      },
      {
        "id": "child2",
        "topic": "人际关系",
        "children": [
          {
            "id": "grandchild4",
            "topic": "建立信任",
            "children": [
              {"id": "greatgrandchild8", "topic": "诚实交流"},
              {"id": "greatgrandchild9", "topic": "尊重他人观点"},
              {"id": "greatgrandchild10", "topic": "保持承诺"}
            ]
          },
          {
            "id": "grandchild5",
            "topic": "培养同情心",
            "children": [
              {"id": "greatgrandchild11", "topic": "倾听他人的故事"},
              {"id": "greatgrandchild12", "topic": "提供无私的帮助"},
              {"id": "greatgrandchild13", "topic": "理解而非评判"}
            ]
          },
          {
            "id": "grandchild6",
            "topic": "维护健康的界限",
            "children": [
              {"id": "greatgrandchild14", "topic": "学会说不"},
              {"id": "greatgrandchild15", "topic": "保护个人时间和空间"},
              {"id": "greatgrandchild16", "topic": "识别并处理毒性关系"}
            ]
          }
        ]
      },
      {
        "id": "child3",
        "topic": "目标与梦想",
        "children": [
          {
            "id": "grandchild7",
            "topic": "设定清晰的目标",
            "children": [
              {"id": "greatgrandchild17", "topic": "明确长期和短期目标"},
              {"id": "greatgrandchild18", "topic": "将目标分解为可管理的任务"}
            ]
          },
          {
            "id": "grandchild8",
            "topic": "制定实现计划",
            "children": [
              {"id": "greatgrandchild19", "topic": "设立实际的时间表"},
              {"id": "greatgrandchild20", "topic": "寻找资源和支持系统"}
            ]
          },
          {
            "id": "grandchild9",
            "topic": "面对挑战时坚持不懈",
            "children": [
              {"id": "greatgrandchild21", "topic": "培养韧性"},
              {"id": "greatgrandchild22", "topic": "适应变化"},
              {"id": "greatgrandchild23", "topic": "寻求反馈和调整策略"}
            ]
          },
          {"id": "grandchild10", "topic": "庆祝每一个小成就"}
        ]
      },
      {
        "id": "child4",
        "topic": "生活态度",
        "children": [
          {
            "id": "grandchild11",
            "topic": "感恩之心",
            "children": [
              {"id": "greatgrandchild24", "topic": "每天记下感激的事物"},
              {"id": "greatgrandchild25", "topic": "向他人表达感谢之情"}
            ]
          },
          {
            "id": "grandchild12",
            "topic": "积极乐观",
            "children": [
              {"id": "greatgrandchild26", "topic": "专注于解决方案而不是问题"},
              {"id": "greatgrandchild27", "topic": "保持幽默感"},
              {"id": "greatgrandchild28", "topic": "练习正面思考"}
            ]
          },
          {
            "id": "grandchild13",
            "topic": "活在当下",
            "children": [
              {"id": "greatgrandchild29", "topic": "进行冥想或正念练习"},
              {"id": "greatgrandchild30", "topic": "珍惜当前经历"},
              {"id": "greatgrandchild31", "topic": "减少对过去的懊悔和未来的忧虑"}
            ]
          },
          {
            "id": "grandchild14",
            "topic": "给予比接受更有福",
            "children": [
              {"id": "greatgrandchild32", "topic": "志愿服务"},
              {"id": "greatgrandchild33", "topic": "分享知识和经验"},
              {"id": "greatgrandchild34", "topic": "慷慨解囊"}
            ]
          }
        ]
      }
    ]
  }
}`;
  }
});

let jm = null;

function updateMindMap() {
  const input = document.getElementById('input_area').value;
  try {
    const parsedData = JSON.parse(input);
    console.log("Parsed Data:", parsedData); // 打印解析后的JSON对象

    // 清空容器内容
    const container = document.getElementById('jsmind_container');
    container.innerHTML = '';

    // 重新初始化jsMind实例
    const options = {
      container: 'jsmind_container',
      editable: true,
      theme: 'primary'
    };

    jm = jsMind.show(options, parsedData);
  } catch (e) {
    // 如果发生错误，打印错误信息
    console.error("Invalid JSON:", e.message);
    alert(`无效的JSON格式，请检查您的输入。错误详情：${e.message}`);
  }
}

function exportAsImage() {
  debugger
  const rect = document.querySelector(".jsmind");
  const container = document.querySelector("#jsmind_container");
  const inputArea = document.querySelector("#input_area");

  // 显示加载指示器（可选）
  const loadingIndicator = document.createElement('div');
  loadingIndicator.style.position = 'fixed';
  loadingIndicator.style.top = '50%';
  loadingIndicator.style.left = '50%';
  loadingIndicator.style.transform = 'translate(-50%, -50%)';
  loadingIndicator.style.zIndex = '1000';
  loadingIndicator.innerHTML = '<p>正在生成图片，请稍候...</p>';
  document.body.appendChild(loadingIndicator);

  // 记录原始样式
  const originalContainerStyles = {
    width: container.style.width,
    height: container.style.height,
    overflow: container.style.overflow
  };
  const originalInputAreaDisplay = inputArea.style.display;

  // 设置新样式以移除滚动条并隐藏<textarea>
  container.style.overflow = 'visible'; // 移除滚动条
  container.style.width = `${rect.scrollWidth + 20}px`; //消除显示滚动条的问题
  container.style.height = `${rect.scrollHeight + 20}px`;//消除显示滚动条的问题

  // 隐藏<textarea>
  inputArea.style.display = 'none';
  // 强制重绘以确保样式生效
  container.offsetHeight; // 这行代码会强制浏览器重绘容器
  // 使用 dom-to-image 生成图片
  domtoimage.toPng(container, {
    width: rect.scrollWidth,
    height: rect.scrollHeight,
    quality: 0.95,
    bgcolor: '#fff'
  }).then(function (dataUrl) {
    // 移除加载指示器
    document.body.removeChild(loadingIndicator);

    // 恢复原始样式
    Object.assign(container.style, originalContainerStyles);
    inputArea.style.display = originalInputAreaDisplay;

    // 创建下载链接并触发下载
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = '思维导图.png';
    link.click();
  }).catch(function (error) {
    console.error("生成图片时发生错误:", error);
    alert("生成图片时发生错误，请检查控制台获取更多信息。");

    // 即使有错误也要确保恢复原状
    Object.assign(container.style, originalContainerStyles);
    inputArea.style.display = originalInputAreaDisplay;
  });
}

function exportAsPDF() {
  const rect = document.querySelector(".jsmind");
  // 显示加载指示器（可选）
  console.log("开始生成PDF...");
  const loadingIndicator = document.createElement('div');
  loadingIndicator.style.position = 'fixed';
  loadingIndicator.style.top = '50%';
  loadingIndicator.style.left = '50%';
  loadingIndicator.style.transform = 'translate(-50%, -50%)';
  loadingIndicator.style.zIndex = '1000';
  loadingIndicator.innerHTML = '<p>正在生成PDF，请稍候...</p>';
  document.body.appendChild(loadingIndicator);
  console.log("加载指示器已显示");

  // 记录原始样式
  const container = document.querySelector("#jsmind_container");
  const originalContainerStyles = {
    width: container.style.width,
    height: container.style.height,
    overflow: container.style.overflow
  };
  const inputArea = document.querySelector("#input_area");
  const originalInputAreaDisplay = inputArea.style.display;
  console.log("记录了原始样式");

  // 设置新样式以移除滚动条并隐藏<textarea>
  container.style.overflow = 'visible'; // 移除滚动条
  container.style.width = `${rect.scrollWidth + 20}px`; //消除显示滚动条的问题
  container.style.height = `${rect.scrollHeight + 20}px`;//消除显示滚动条的问题
  console.log("调整了容器的样式");

  // 隐藏<textarea>
  inputArea.style.display = 'none';
  console.log("<textarea> 已隐藏");

  // 强制重绘以确保样式生效
  container.offsetHeight; // 这行代码会强制浏览器重绘容器
  console.log("强制重绘完成");
  debugger


  const { jsPDF } = window.jspdf;

  html2canvas(container).then(canvas => {
    debugger
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    // 在设置新样式后，获取容器的实际像素宽度和高度
    const containerWidth = parseInt(container.style.width, 10);
    const containerHeight = parseInt(container.style.height, 10);
    console.log("containerWidth" + containerWidth + "containerHeight" + containerHeight);

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [containerWidth, containerHeight]
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, containerWidth, containerHeight);
    pdf.save("思维导图.pdf");
    console.log("PDF 文件已保存");

    // 移除加载指示器
    document.body.removeChild(loadingIndicator);
    console.log("移除了加载指示器");

    // 恢复原始样式
    Object.assign(container.style, originalContainerStyles);
    inputArea.style.display = originalInputAreaDisplay;
    console.log("恢复了原始样式");
  }).catch(function (error) {
    console.error("生成PDF时发生错误:", error);
    alert("生成PDF时发生错误，请检查控制台获取更多信息。");
    // 即使有错误也要确保恢复原状
    Object.assign(container.style, originalContainerStyles);
    inputArea.style.display = originalInputAreaDisplay;
    document.body.removeChild(loadingIndicator);
    console.log("即使出错也恢复了原始样式");
  });

  ;
}


function initializeMindMap() {
  updateMindMap();
}

const resizer = document.getElementById('resizer');
const container = document.getElementById('container');
const inputArea = document.getElementById('input_area');

let isResizing = false;

resizer.addEventListener('mousedown', () => {
  isResizing = true;
});

document.addEventListener('mousemove', (e) => {
  if (isResizing) {
    const newWidth = e.clientX;
    const minSize = 100; // 最小尺寸限制
    if (newWidth > minSize && (container.clientWidth - newWidth) > minSize) {
      inputArea.style.width = `${newWidth}px`;
      document.getElementById('jsmind_container').style.width = `calc(100% - ${newWidth}px)`;
    }
  }
});

document.addEventListener('mouseup', () => {
  isResizing = false;
});