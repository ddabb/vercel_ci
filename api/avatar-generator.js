// 字符头像生成器 API
// 通过 API 暴露头像生成功能，返回图片数据

const { createCanvas, registerFont } = require('canvas');

// 模板配置
const templates = {
    template1: {
        name: '简约圆形',
        style: {
            'background': 'linear-gradient(135deg, #3498db, #8e44ad)',
            'border-radius': '50%',
            'border': 'none'
        }
    },
    template2: {
        name: '方形边框',
        style: {
            'background': 'linear-gradient(135deg, #2ecc71, #1abc9c)',
            'border-radius': '25px',
            'border': '8px solid #2c3e50'
        }
    },
    template3: {
        name: '渐变背景',
        style: {
            'background': 'linear-gradient(135deg, #ff9a9e, #fad0c4, #fad0c4)',
            'border-radius': '50%',
            'border': 'none'
        }
    },
    template4: {
        name: '阴影效果',
        style: {
            'background': 'linear-gradient(135deg, #e74c3c, #c0392b)',
            'border-radius': '50%',
            'border': 'none'
        }
    },
    template5: {
        name: '金色质感',
        style: {
            'background': 'linear-gradient(135deg, #FFD700, #FFA500)',
            'border-radius': '50%',
            'border': 'none'
        }
    },
    template6: {
        name: '科技蓝',
        style: {
            'background': 'linear-gradient(135deg, #00b4db, #0083b0)',
            'border-radius': '20px',
            'border': 'none'
        }
    },
    template7: {
        name: '粉色浪漫',
        style: {
            'background': 'linear-gradient(135deg, #ff6b9d, #ff8e53)',
            'border-radius': '50%',
            'border': 'none'
        }
    },
    template8: {
        name: '商务深灰',
        style: {
            'background': 'linear-gradient(135deg, #485563, #29323c)',
            'border-radius': '8px',
            'border': '3px solid #1a1a1a'
        }
    },
    template9: {
        name: '纯色背景',
        style: {
            'background': '#ffffff',
            'border-radius': '50%',
            'border': 'none'
        }
    }
};

// 字体样式配置
const fontStyles = {
    // 无衬线字体
    sans: {
        name: '黑体',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    // 衬线字体
    serif: {
        name: '宋体',
        fontFamily: 'Noto Sans SC, serif',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    // 等宽字体
    mono: {
        name: '等宽',
        fontFamily: 'Fira Code, JetBrains Mono, monospace',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    // 细体无衬线
    sansLight: {
        name: '细体',
        fontFamily: 'Noto Sans SC, sans-serif',
        fontWeight: '300',
        fontStyle: 'normal'
    },
    // 中等无衬线
    sansMedium: {
        name: '中体',
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: '500',
        fontStyle: 'normal'
    },
    // 粗体无衬线
    sansBold: {
        name: '特粗',
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: '900',
        fontStyle: 'normal'
    },
    // 斜体
    sansItalic: {
        name: '斜体',
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    // 细宋体
    serifLight: {
        name: '细宋',
        fontFamily: 'Noto Sans SC, serif',
        fontWeight: '300',
        fontStyle: 'normal'
    },
    // 意大利体
    cursive: {
        name: '手写体',
        fontFamily: 'Pacifico, Dancing Script, cursive',
        fontWeight: 'normal',
        fontStyle: 'normal'
    },
    // 装饰体
    fantasy: {
        name: '艺术体',
        fontFamily: 'Bangers, Comic Neue, fantasy',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    // 系统默认加粗
    systemBold: {
        name: '系统粗体',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        fontWeight: '800',
        fontStyle: 'normal'
    },
    // 圆润体
    rounded: {
        name: '圆润体',
        fontFamily: 'Montserrat, Open Sans, sans-serif',
        fontWeight: 'bold',
        fontStyle: 'normal'
    }
};

// 兼容旧版 Canvas 的圆角矩形
function _roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// 绘制背景（支持渐变/纯色 + 圆形/圆角/方形 + 边框）
function drawBackground(ctx, canvasWidth, canvasHeight, template) {
    const style = template.style;

    // 填充颜色
    let fillStyle = '#ffffff';
    if (style.background) {
        if (style.background.startsWith('linear-gradient')) {
            const colorMatch = style.background.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g);
            if (colorMatch && colorMatch.length >= 2) {
                const grd = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
                grd.addColorStop(0, colorMatch[0]);
                grd.addColorStop(1, colorMatch[1]);
                fillStyle = grd;
            } else if (colorMatch) {
                fillStyle = colorMatch[0];
            }
        } else {
            fillStyle = style.background;
        }
    }
    ctx.fillStyle = fillStyle;

    // 绘制形状
    const borderRadius = style['border-radius'];
    const border = style.border;

    ctx.beginPath();

    if (borderRadius === '50%') {
        // 圆形
        const r = canvasWidth / 2;
        ctx.arc(canvasWidth / 2, canvasHeight / 2, r, 0, 2 * Math.PI);
    } else if (borderRadius && borderRadius.includes('px')) {
        // 圆角矩形
        const r = Math.min(parseInt(borderRadius), canvasWidth / 2);
        ctx.roundRect ? ctx.roundRect(0, 0, canvasWidth, canvasHeight, r) : _roundRect(ctx, 0, 0, canvasWidth, canvasHeight, r);
    } else {
        // 方形
        ctx.rect(0, 0, canvasWidth, canvasHeight);
    }

    ctx.fill();

    // 绘制边框
    if (border && border !== 'none') {
        const match = border.match(/(\d+)px\s+solid\s+(.+)/);
        if (match) {
            const borderWidth = Math.max(parseInt(match[1]) * 0.8, 1);
            ctx.strokeStyle = match[2];
            ctx.lineWidth = borderWidth;
            ctx.stroke();
        }
    }
}

module.exports = async (req, res) => {
    try {
        // 解析请求参数（支持 GET 和 POST）
        const params = req.method === 'POST' ? req.body : req.query;
        const { text, template = 'template1', textEffect = 'normal', fontStyle = 'sans' } = params;
        
        // 验证参数
        if (!text || text.length < 1 || text.length > 4) {
            return res.status(400).json({
                error: '请输入1-4个字符'
            });
        }
        
        // 获取模板和字体配置
        const selectedTemplate = templates[template] || templates.template1;
        const selectedFontStyle = fontStyles[fontStyle] || fontStyles.sans;
        
        // 创建 Canvas（与原始版本一致，使用 200x200 画布）
        const canvasWidth = 200;
        const canvasHeight = 200;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        
        // 清空画布，实现透明背景
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // 绘制背景
        drawBackground(ctx, canvasWidth, canvasHeight, selectedTemplate);
        
        // 计算字体大小（与原始版本一致）
        const charCount = text.length;
        let fontSize;
        if (charCount === 1) fontSize = 90;
        else if (charCount === 2) fontSize = 80;
        else if (charCount === 3) fontSize = 68;
        else if (charCount === 4) fontSize = 58;
        else fontSize = 68;
        
        // 设置字体
        ctx.font = `${selectedFontStyle.fontWeight} ${fontSize}px ${selectedFontStyle.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 文字颜色
        let textColor = '#ffffff';
        const isLightBackground = ['template3', 'template7', 'template9'].includes(template);
        if (textEffect === 'glow') {
            textColor = '#00ff9d';
        } else if (isLightBackground) {
            if (textEffect === 'stroke') {
                textColor = '#ffffff'; // 描边效果始终白字
            } else {
                textColor = '#2c3e50'; // 浅色背景默认深色字
            }
        }
        
        // 阴影参数
        let shadowColor = 'transparent';
        let shadowBlur = 0;
        let shadowOffsetX = 0;
        let shadowOffsetY = 0;

        if (textEffect === 'shadow') {
            shadowColor = isLightBackground ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)';
            shadowBlur = 8;
            shadowOffsetX = 3;
            shadowOffsetY = 3;
        } else if (textEffect === 'glow') {
            shadowColor = '#00ff9d';
            shadowBlur = 20;
            shadowOffsetX = 0;
            shadowOffsetY = 0;
        }
        
        // 描边效果：先画描边，再画主文字
        if (textEffect === 'stroke') {
            const strokeColor = isLightBackground ? '#2c3e50' : '#2c3e50';
            const strokeOffsets = [
                [1, 1], [-1, -1], [1, -1], [-1, 1],
                [0, 1], [0, -1], [1, 0], [-1, 0]
            ];
            ctx.fillStyle = strokeColor;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            strokeOffsets.forEach(([ox, oy]) => {
                ctx.fillText(text, canvasWidth / 2 + ox, canvasHeight / 2 + oy);
            });
        }

        // 立体效果：多层阴影模拟
        if (textEffect === '3d') {
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.fillText(text, canvasWidth / 2 + 4, canvasHeight / 2 + 4);
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.fillText(text, canvasWidth / 2 + 2, canvasHeight / 2 + 2);
        }

        // 设置文字样式（渐变 or 纯色）
        if (textEffect === 'gradient') {
            const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
            if (isLightBackground) {
                gradient.addColorStop(0, '#3498db');
                gradient.addColorStop(1, '#8e44ad');
            } else {
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(1, '#f39c12');
            }
            ctx.fillStyle = gradient;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        } else {
            ctx.fillStyle = textColor;
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
        }
        
        // 绘制文字
        ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
        
        // 转换为 PNG 并返回
        const buffer = canvas.toBuffer('image/png');
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', buffer.length);
        return res.send(buffer);
        
    } catch (error) {
        console.error('API 错误:', error);
        return res.status(500).json({
            error: '服务器内部错误'
        });
    }
};