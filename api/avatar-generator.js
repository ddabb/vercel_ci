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
    sans: {
        name: '黑体',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    serif: {
        name: '宋体',
        fontFamily: 'serif',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    mono: {
        name: '等宽',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    sansLight: {
        name: '细体',
        fontFamily: 'sans-serif',
        fontWeight: '300',
        fontStyle: 'normal'
    },
    sansMedium: {
        name: '中体',
        fontFamily: 'sans-serif',
        fontWeight: '500',
        fontStyle: 'normal'
    },
    sansBold: {
        name: '特粗',
        fontFamily: 'sans-serif',
        fontWeight: '900',
        fontStyle: 'normal'
    },
    sansItalic: {
        name: '斜体',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    serifLight: {
        name: '细宋',
        fontFamily: 'serif',
        fontWeight: '300',
        fontStyle: 'normal'
    },
    cursive: {
        name: '手写体',
        fontFamily: 'cursive',
        fontWeight: 'normal',
        fontStyle: 'normal'
    },
    fantasy: {
        name: '艺术体',
        fontFamily: 'fantasy',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    systemBold: {
        name: '系统粗体',
        fontFamily: 'sans-serif',
        fontWeight: '800',
        fontStyle: 'normal'
    },
    rounded: {
        name: '圆润体',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontStyle: 'normal'
    }
};

// 绘制背景
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
        // 使用 roundRect 方法
        ctx.roundRect(0, 0, canvasWidth, canvasHeight, r);
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
        
        // 创建 Canvas
        const canvasWidth = 800;
        const canvasHeight = 800;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        
        // 绘制背景
        drawBackground(ctx, canvasWidth, canvasHeight, selectedTemplate);
        
        // 计算字体大小
        const charCount = text.length;
        let fontSize;
        if (charCount === 1) fontSize = 180;
        else if (charCount === 2) fontSize = 160;
        else if (charCount === 3) fontSize = 136;
        else if (charCount === 4) fontSize = 116;
        else fontSize = 136;
        
        // 设置字体
        ctx.font = `${selectedFontStyle.fontWeight} ${fontSize}px ${selectedFontStyle.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 设置文字颜色
        let textColor = '#ffffff';
        const isLightBackground = ['template3', 'template7', 'template9'].includes(template);
        if (isLightBackground) {
            textColor = '#2c3e50';
        }
        
        // 应用文字效果
        if (textEffect === 'shadow') {
            ctx.shadowColor = isLightBackground ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
        } else if (textEffect === 'glow') {
            ctx.shadowColor = '#00ff9d';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            textColor = '#00ff9d';
        } else if (textEffect === 'stroke') {
            // 描边效果
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
        } else if (textEffect === '3d') {
            // 立体效果
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.fillText(text, canvasWidth / 2 + 4, canvasHeight / 2 + 4);
            ctx.fillText(text, canvasWidth / 2 + 2, canvasHeight / 2 + 2);
        } else if (textEffect === 'gradient') {
            // 渐变文字
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
            // 普通效果
            ctx.fillStyle = textColor;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
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