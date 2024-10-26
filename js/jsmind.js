document.addEventListener('DOMContentLoaded', (event) => {
    const inputArea = document.getElementById('input_area');
    // 设置默认值
    if (inputArea.value === '') {
        inputArea.value = `{
    "meta": {},
    "format": "node_tree",
    "data": {
        "id": "root",
        "topic": "根节点",
        "children": [
            {"id": "child1", "topic": "子节点1"},
            {"id": "child2", "topic": "子节点2"},
            {"id": "child3", "topic": "子节点3"}
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
    html2canvas(document.querySelector("#jsmind_container")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = '思维导图.png';
        link.click();
    });
}

function exportAsPDF() {
    const { jsPDF } = window.jspdf;
    const A4_WIDTH = 210; // A4宽度（mm）
    const A4_HEIGHT = 297; // A4高度（mm）

    html2canvas(document.querySelector("#jsmind_container")).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = canvas.width * 0.264583; // 转换为mm
        const imgHeight = canvas.height * 0.264583; // 转换为mm

        const ratio = Math.min(A4_WIDTH / imgWidth, A4_HEIGHT / imgHeight);

        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        const marginLeft = (A4_WIDTH - finalWidth) / 2;
        const marginTop = (A4_HEIGHT - finalHeight) / 2;

        pdf.addImage(imgData, 'JPEG', marginLeft, marginTop, finalWidth, finalHeight);
        pdf.save("思维导图.pdf");
    });
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