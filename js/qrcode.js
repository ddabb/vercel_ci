function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

function generateQrcode() {
    const qrcode = new QRCode(document.getElementById("qrcodeCanvas"), {
        text: document.getElementById("inputText").value,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.ErrorCorrectLevel.HIGH
    });
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