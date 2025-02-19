// common-scripts.js

// 生成分享二维码
function generateShareQRCode() {
    document.addEventListener('DOMContentLoaded', function () {
      var qrCodeContainer = document.getElementById('qrCodeContainer');
      if (qrCodeContainer) {
        // 获取当前页面的完整URL
        var url = window.location.href;
        // 使用qrcode.js生成二维码
        new QRCode(qrCodeContainer, {
          text: url,
          width: 128,
          height: 128,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    });
  }
  
  // 初始化函数，可以在这里调用其他需要初始化的函数
  function initCommonScripts() {
    generateShareQRCode();
  
    // 如果有其他的通用脚本也可以在这里初始化
    (function () {
      var appid = 'cyxu7ueP4';
      var conf = 'prod_ff4e62d448f38bedc4a1f89a5125ccd0';
      var width = window.innerWidth || document.documentElement.clientWidth;
      if (width < 1000) {
        var head = document.getElementsByTagName('head')[0] || document.head || document.documentElement;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.id = 'changyan_mobile_js';
        script.src = 'https://cy-cdn.kuaizhan.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + '&conf=' + conf;
        head.appendChild(script);
      } else {
        var loadJs = function (d, a) {
          var c = document.getElementsByTagName("head")[0] || document.head || document.documentElement;
          var b = document.createElement("script");
          b.setAttribute("type", "text/javascript");
          b.setAttribute("charset", "UTF-8");
          b.setAttribute("src", d);
          if (typeof a === "function") {
            if (window.attachEvent) {
              b.onreadystatechange = function () {
                var e = b.readyState;
                if (e === "loaded" || e === "complete") {
                  b.onreadystatechange = null;
                  a();
                }
              };
            } else {
              b.onload = a;
            }
          }
          c.appendChild(b);
        };
        loadJs("https://cy-cdn.kuaizhan.com/upload/changyan.js", function () {
          window.changyan.api.config({ appid: appid, conf: conf });
        });
      }
    })();
  }
  
  // 确保在DOM加载完成后执行初始化
  document.addEventListener('DOMContentLoaded', initCommonScripts);