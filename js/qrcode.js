function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

function generateQrcode() {
    try {
        // 获取canvas和img元素所在的div
        var qrcodeCanvasDiv = document.getElementById("qrcodeCanvas");

        // 移除已存在的img标签
        var existingImg = qrcodeCanvasDiv.querySelector('img');
        if (existingImg) {
            qrcodeCanvasDiv.removeChild(existingImg);
        }

        // 如果canvas存在，则清除画布
        var canvas = qrcodeCanvasDiv.querySelector('canvas');
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布
        }

        // 创建二维码实例
        const qrcode = new QRCode(qrcodeCanvasDiv, {
            text: document.getElementById("inputText").value,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // 加载要嵌入的图片
        var img = new Image();
        img.src = "../logo.png"; // 使用实际路径
        img.onload = function () {
            drawLogoOnQrCode();
        };

        // 如果图片加载失败，捕获错误
        img.onerror = function () {
            console.error('图片加载失败，请检查图片路径是否正确');
        };
    } catch (error) {
        console.error('生成二维码时发生错误：', error);
    }


    function drawLogoOnQrCode() {
        // 在这里重新获取canvas和ctx
        var qrcodeCanvasDiv = document.getElementById("qrcodeCanvas");
        var canvas = qrcodeCanvasDiv.querySelector('canvas');
        if (!canvas) {
            console.error('无法找到canvas元素');
            return;
        }
        var ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error('无法获取canvas 2D渲染上下文');
            return;
        }

        // 调整图片大小，通常是二维码大小的1/4到1/5
        var logoSize = Math.min(canvas.width, canvas.height) * 0.30; // 20% 大小
        img.width = logoSize;
        img.height = logoSize;

        // 计算图片的位置，使其位于中心
        var x = (canvas.width - img.width) / 2;
        var y = (canvas.height - img.height) / 2;

        // 绘制图片到二维码上
        ctx.drawImage(img, x, y, img.width, img.height);

        // 更新img元素的src属性以显示带有嵌入图片的二维码
        var imgElement = qrcodeCanvasDiv.querySelector('img');
        if (imgElement) {
            imgElement.src = canvas.toDataURL();
        }

        console.log('二维码生成成功，并且图片已嵌入');
    }
}

function captureImage() {
    var canvas = document.getElementById("qrcodeCanvas");
    var dataURL = canvas.toDataURL();
    downloadURI(dataURL, "qrcode.png");
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function readImage() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        document.getElementById('inputImage').src = reader.result;
    };

    reader.readAsDataURL(file);
}

function decodeFromInputImage() {
    const img = document.getElementById('inputImage');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
        document.getElementById('result').innerText = code.data;
    } else {
        document.getElementById('result').innerText = '无法识别二维码';
    }
}