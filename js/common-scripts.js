function initCommonScripts() {

    var qrCodeWidget = document.getElementById('pageQrCode');
    if (qrCodeWidget) {
      // 使用window.location.href获取当前页面的完整URL
      qrCodeWidget.setAttribute('value', window.location.href);
    }
    const appid = 'cyxu7ueP4';
    const conf = 'prod_ff4e62d448f38bedc4a1f89a5125ccd0';
    const loadScript = (url, callback) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.onload = callback;
        script.src = url;
        document.head.appendChild(script);
    };

    const width = window.innerWidth || document.documentElement.clientWidth;
    const isMobile = width < 1000;
    const cdnBase = 'https://cy-cdn.kuaizhan.com/upload/';

    if (isMobile) {
        loadScript(`${cdnBase}mobile/wap-js/changyan_mobile.js?client_id=${appid}&conf=${conf}`, () => {
            window.changyan.api.config({ appid, conf });
        });
    } else {
        loadScript(`${cdnBase}changyan.js`, () => {
            window.changyan.api.config({ appid, conf });
        });
    }
}

document.addEventListener('DOMContentLoaded', initCommonScripts);