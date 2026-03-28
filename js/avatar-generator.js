// 全局变量
let inputText = '';
let selectedTemplate = 'template1';
let selectedTextEffect = 'normal';
let selectedFontStyle = 'sans';
let templateExpanded = true;
let textEffectExpanded = true;
let fontStyleExpanded = true;

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

// 文字效果配置
const textEffects = {
    normal: {
        name: '普通',
        color: '#ffffff',
        shadowColor: 'transparent',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0
    },
    shadow: {
        name: '阴影',
        color: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 8,
        shadowOffsetX: 3,
        shadowOffsetY: 3
    },
    stroke: {
        name: '描边',
        color: '#ffffff',
        shadowColor: 'transparent',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        strokeColor: '#2c3e50',
        strokeWidth: 3
    },
    glow: {
        name: '发光',
        color: '#00ff9d',
        shadowColor: '#00ff9d',
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 0
    },
    '3d': {
        name: '立体',
        color: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 4,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        depthLayers: 2
    },
    gradient: {
        name: '渐变',
        color: 'gradient',
        gradientColors: ['#ffffff', '#f39c12'],
        shadowColor: 'transparent',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0
    }
};

// 字体样式配置
const fontStyles = {
    sans: {
        name: '黑体',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    serif: {
        name: '宋体',
        fontFamily: 'Noto Sans SC, serif',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    mono: {
        name: '等宽',
        fontFamily: 'Fira Code, JetBrains Mono, monospace',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    sansLight: {
        name: '细体',
        fontFamily: 'Noto Sans SC, sans-serif',
        fontWeight: '300',
        fontStyle: 'normal'
    },
    sansMedium: {
        name: '中体',
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: '500',
        fontStyle: 'normal'
    },
    sansBold: {
        name: '特粗',
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: '900',
        fontStyle: 'normal'
    },
    sansItalic: {
        name: '斜体',
        fontFamily: 'Inter, Roboto, sans-serif',
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    serifLight: {
        name: '细宋',
        fontFamily: 'Noto Sans SC, serif',
        fontWeight: '300',
        fontStyle: 'normal'
    },
    cursive: {
        name: '手写体',
        fontFamily: 'Pacifico, Dancing Script, cursive',
        fontWeight: 'normal',
        fontStyle: 'normal'
    },
    fantasy: {
        name: '艺术体',
        fontFamily: 'Bangers, Comic Neue, fantasy',
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    systemBold: {
        name: '系统粗体',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        fontWeight: '800',
        fontStyle: 'normal'
    },
    rounded: {
        name: '圆润体',
        fontFamily: 'Montserrat, Open Sans, sans-serif',
        fontWeight: 'bold',
        fontStyle: 'normal'
    }
};

// 模板对应的阴影效果
const templateShadows = {
    template1: '0 8px 25px rgba(52, 152, 219, 0.35)',
    template2: '0 8px 25px rgba(46, 204, 113, 0.3)',
    template3: '0 8px 25px rgba(255, 154, 158, 0.4)',
    template4: '0 15px 35px rgba(231, 76, 60, 0.4)',
    template5: '0 15px 35px rgba(255, 165, 0, 0.45)',
    template6: '0 8px 25px rgba(0, 131, 176, 0.35)',
    template7: '0 8px 25px rgba(255, 107, 157, 0.4)',
    template8: '0 8px 25px rgba(72, 85, 99, 0.4)',
    template9: '0 8px 25px rgba(0, 0, 0, 0.12)'
};

// 检查输入是否有效
function isValidInput(input) {
    if (!input || input.trim() === '') {
        return { valid: false, message: '请输入内容' };
    }
    
    const chars = Array.from(input.trim());
    const charCount = chars.length;
    
    if (charCount < 1) {
        return { 
            valid: false, 
            message: '请输入至少1个字符'
        };
    }
    
    if (charCount > 4) {
        return { 
            valid: false, 
            message: '最多只能输入4个字符'
        };
    }
    
    return { valid: true, message: '' };
}

// 构建预览样式
function buildPreviewStyle() {
    const inputValue = inputText.trim();
    const validation = isValidInput(inputValue);

    const template = templates[selectedTemplate];
    const textEffect = textEffects[selectedTextEffect];
    const fontStyle = fontStyles[selectedFontStyle];

    let previewStyle = '';

    // 应用模板样式
    Object.keys(template.style).forEach(key => {
        previewStyle += `${key}: ${template.style[key]}; `;
    });

    // 添加阴影
    const shadow = templateShadows[selectedTemplate];
    if (shadow) {
        previewStyle += `box-shadow: ${shadow}; `;
    }

    // 字体大小（根据字符数量）
    const charCount = Array.from(inputValue).length;
    if (charCount === 1) {
        previewStyle += 'font-size: 4.5rem; ';
    } else if (charCount === 2) {
        previewStyle += 'font-size: 4rem; ';
    } else if (charCount === 3) {
        previewStyle += 'font-size: 3.5rem; ';
    } else if (charCount === 4) {
        previewStyle += 'font-size: 3rem; ';
    } else {
        previewStyle += 'font-size: 3.5rem; ';
    }

    // 字体样式
    previewStyle += `font-family: ${fontStyle.fontFamily}; font-weight: ${fontStyle.fontWeight}; font-style: ${fontStyle.fontStyle}; `;

    // 文字效果
    const isLightBackground = ['template3', 'template7', 'template9'].includes(selectedTemplate);
    const effect = selectedTextEffect;

    // 确定文字颜色
    let textColor = textEffect.color;
    if (isLightBackground && textColor === '#ffffff') {
        textColor = '#2c3e50'; // 浅色背景用深色文字
    }
    previewStyle += `color: ${textColor}; `;

    // 确定 text-shadow
    if (effect === 'shadow') {
        if (isLightBackground) {
            previewStyle += `text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3); `;
        } else {
            previewStyle += `text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.5); `;
        }
    } else if (effect === 'stroke') {
        // 描边用阴影模拟
        if (isLightBackground) {
            previewStyle += `text-shadow: 1px 1px 0 #2c3e50, -1px -1px 0 #2c3e50, 1px -1px 0 #2c3e50, -1px 1px 0 #2c3e50, 0 1px 0 #2c3e50, 0 -1px 0 #2c3e50; color: #ffffff; `;
        } else {
            previewStyle += `text-shadow: 1px 1px 0 #2c3e50, -1px -1px 0 #2c3e50, 1px -1px 0 #2c3e50, -1px 1px 0 #2c3e50, 0 1px 0 #2c3e50, 0 -1px 0 #2c3e50; `;
        }
    } else if (effect === 'glow') {
        previewStyle += `text-shadow: 0 0 10px #00ff9d, 0 0 20px #00ff9d, 0 0 30px #00ff9d; `;
    } else if (effect === '3d') {
        previewStyle += `text-shadow: 2px 2px 0 #2c3e50, 4px 4px 0 rgba(0, 0, 0, 0.25); `;
    } else if (effect === 'gradient') {
        if (isLightBackground) {
            previewStyle += `background: linear-gradient(135deg, #3498db 0%, #8e44ad 100%); `;
            previewStyle += `-webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: none; `;
        } else {
            previewStyle += `background: linear-gradient(135deg, #ffffff 0%, #f39c12 100%); `;
            previewStyle += `-webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: none; `;
        }
    } else {
        // normal
        previewStyle += `text-shadow: none; `;
    }

    return {
        style: previewStyle,
        valid: validation.valid,
        inputValue: inputValue
    };
}

// 更新预览
function updatePreview() {
    const result = buildPreviewStyle();
    const previewElement = document.getElementById('avatar-preview');
    
    if (previewElement) {
        previewElement.style.cssText = result.style;
        previewElement.textContent = result.valid ? result.inputValue : '预览';
    }
}

// 输入文字变化
function onTextInput(e) {
    inputText = e.target.value;
    updatePreview();
}

// 模板选择
function onTemplateSelect(template) {
    selectedTemplate = template;
    
    // 更新选中状态
    document.querySelectorAll('.template-label').forEach(label => {
        label.classList.remove('checked');
    });
    document.querySelector(`[data-value="${template}"]`).classList.add('checked');
    
    updatePreview();
}

// 文字效果选择
function onTextEffectSelect(effect) {
    selectedTextEffect = effect;
    
    // 更新选中状态
    document.querySelectorAll('.text-effect-label').forEach(label => {
        label.classList.remove('checked');
    });
    document.querySelector(`[data-value="${effect}"]`).classList.add('checked');
    
    updatePreview();
}

// 字体样式选择
function onFontStyleSelect(fontStyle) {
    selectedFontStyle = fontStyle;
    
    // 更新选中状态
    document.querySelectorAll('.font-style-label').forEach(label => {
        label.classList.remove('checked');
    });
    document.querySelector(`[data-value="${fontStyle}"]`).classList.add('checked');
    
    updatePreview();
}

// 切换模板展开状态
function toggleTemplateExpanded() {
    templateExpanded = !templateExpanded;
    const grid = document.getElementById('templates-grid');
    const icon = document.getElementById('template-expand-icon');
    
    if (grid && icon) {
        if (templateExpanded) {
            grid.classList.remove('collapsed');
            grid.classList.add('expanded');
            icon.textContent = '▼';
        } else {
            grid.classList.remove('expanded');
            grid.classList.add('collapsed');
            icon.textContent = '▶';
        }
    }
}

// 切换文字效果展开状态
function toggleTextEffectExpanded() {
    textEffectExpanded = !textEffectExpanded;
    const options = document.getElementById('text-effect-options');
    const icon = document.getElementById('text-effect-expand-icon');
    
    if (options && icon) {
        if (textEffectExpanded) {
            options.classList.remove('collapsed');
            options.classList.add('expanded');
            icon.textContent = '▼';
        } else {
            options.classList.remove('expanded');
            options.classList.add('collapsed');
            icon.textContent = '▶';
        }
    }
}

// 切换字体样式展开状态
function toggleFontStyleExpanded() {
    fontStyleExpanded = !fontStyleExpanded;
    const options = document.getElementById('font-style-options');
    const icon = document.getElementById('font-style-expand-icon');
    
    if (options && icon) {
        if (fontStyleExpanded) {
            options.classList.remove('collapsed');
            options.classList.add('expanded');
            icon.textContent = '▼';
        } else {
            options.classList.remove('expanded');
            options.classList.add('collapsed');
            icon.textContent = '▶';
        }
    }
}

// 重置表单
function resetForm() {
    inputText = '';
    selectedTemplate = 'template1';
    selectedTextEffect = 'normal';
    selectedFontStyle = 'sans';
    
    // 重置输入框
    const inputElement = document.getElementById('text-input');
    if (inputElement) {
        inputElement.value = '';
    }
    
    // 重置选中状态
    document.querySelectorAll('.template-label').forEach(label => {
        label.classList.remove('checked');
    });
    document.querySelector('[data-value="template1"]').classList.add('checked');
    
    document.querySelectorAll('.text-effect-label').forEach(label => {
        label.classList.remove('checked');
    });
    document.querySelector('[data-value="normal"]').classList.add('checked');
    
    document.querySelectorAll('.font-style-label').forEach(label => {
        label.classList.remove('checked');
    });
    document.querySelector('[data-value="sans"]').classList.add('checked');
    
    updatePreview();
}

// 绘制背景
function _drawBackground(ctx, canvasWidth, canvasHeight) {
    const template = templates[selectedTemplate];
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
        if (ctx.roundRect) {
            ctx.roundRect(0, 0, canvasWidth, canvasHeight, r);
        } else {
            _roundRect(ctx, 0, 0, canvasWidth, canvasHeight, r);
        }
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

// 生成头像PNG图片
function generateAvatarPNG() {
    try {
        const inputTextValue = inputText.trim() || '预览';
        const effect = selectedTextEffect;
        const templateId = selectedTemplate;
        const isLightBackground = ['template3', 'template7', 'template9'].includes(templateId);

        // 获取字体样式配置
        const fontStyleConfig = fontStyles[selectedFontStyle] || fontStyles.sans;

        // 字体大小
        const charCount = Array.from(inputTextValue).length;
        let fontSize;
        if (charCount === 1) fontSize = 180;
        else if (charCount === 2) fontSize = 160;
        else if (charCount === 3) fontSize = 136;
        else if (charCount === 4) fontSize = 116;
        else fontSize = 136;

        // 文字颜色
        let textColor = '#ffffff';
        if (effect === 'glow') {
            textColor = '#00ff9d';
        } else if (isLightBackground) {
            if (effect === 'stroke') {
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

        if (effect === 'shadow') {
            shadowColor = isLightBackground ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)';
            shadowBlur = 8;
            shadowOffsetX = 3;
            shadowOffsetY = 3;
        } else if (effect === 'glow') {
            shadowColor = '#00ff9d';
            shadowBlur = 20;
            shadowOffsetX = 0;
            shadowOffsetY = 0;
        }

        const canvas = document.getElementById('avatarCanvas');
        if (!canvas) {
            alert('Canvas初始化失败');
            document.getElementById('loading').style.display = 'none';
            return;
        }

        const ctx = canvas.getContext('2d');
        const canvasWidth = 800;
        const canvasHeight = 800;

        // 设置 Canvas 尺寸
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // 清空画布
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // 绘制背景
        _drawBackground(ctx, canvasWidth, canvasHeight);

        // 绘制文字
        ctx.font = `${fontStyleConfig.fontWeight} ${fontSize}px ${fontStyleConfig.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 描边效果：先画描边，再画主文字
        if (effect === 'stroke') {
            const strokeColor = isLightBackground ? '#2c3e50' : '#2c3e50';
            const strokeOffsets = [
                [1, 1], [-1, -1], [1, -1], [-1, 1],
                [0, 1], [0, -1], [1, 0], [-1, 0]
            ];
            ctx.fillStyle = strokeColor;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            strokeOffsets.forEach(([ox, oy]) => {
                ctx.fillText(inputTextValue, canvasWidth / 2 + ox, canvasHeight / 2 + oy);
            });
        }

        // 立体效果：多层阴影模拟
        if (effect === '3d') {
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.fillText(inputTextValue, canvasWidth / 2 + 4, canvasHeight / 2 + 4);
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.fillText(inputTextValue, canvasWidth / 2 + 2, canvasHeight / 2 + 2);
        }

        // 设置文字样式（渐变 or 纯色）
        if (effect === 'gradient') {
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

        // 绘制主文字
        ctx.fillText(inputTextValue, canvasWidth / 2, canvasHeight / 2);

        // 导出图片
        canvas.toBlob(function(blob) {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'avatar.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                document.getElementById('loading').style.display = 'none';
            } else {
                alert('生成图片失败，请重试');
                document.getElementById('loading').style.display = 'none';
            }
        }, 'image/png');
    } catch (error) {
        console.error('生成图片时出错:', error);
        alert('生成图片失败，请重试');
        document.getElementById('loading').style.display = 'none';
    }
}

// 导出PNG图片
function exportAsPNG() {
    const inputValue = inputText.trim();
    
    document.getElementById('loading').style.display = 'flex';
    
    try {
        // 延迟执行以确保UI更新
        setTimeout(() => {
            generateAvatarPNG();
        }, 100);
    } catch (error) {
        console.error('导出图片时出错:', error);
        alert('导出图片失败，请重试');
        document.getElementById('loading').style.display = 'none';
    }
}

// 页面加载完成后初始化
window.onload = function() {
    updatePreview();
    
    // 绑定输入事件
    const inputElement = document.getElementById('text-input');
    if (inputElement) {
        inputElement.addEventListener('input', onTextInput);
    }
};