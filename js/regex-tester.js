// regex-tester.js

// 全局变量
let commonRegex = [
  { name: '邮箱地址', pattern: '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$', flags: ['i'] },
  { name: '手机号码', pattern: '^1[3-9]\\d{9}$', flags: [] },
  { name: '身份证号', pattern: '^\\d{17}[\\dXx]$|^\\d{15}$', flags: [] },
  { name: 'URL链接', pattern: '^https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\.~:/?#[\\]@!$&\\u0027()*+,;=.]+$', flags: ['i'] },
  { name: '纯数字', pattern: '^\\d+$', flags: [] },
  { name: '字母数字', pattern: '^[a-zA-Z0-9]+$', flags: [] },
  { name: '中文', pattern: '[\\u4e00-\\u9fa5]+', flags: ['g'] },
  { name: 'HTML标签', pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)', flags: ['gi'] }
];

// 页面加载完成后初始化
window.onload = function() {
  initEventListeners();
  populateCommonRegexList();
  updateCharCount();
};

// 初始化事件监听器
function initEventListeners() {
  // 文本输入事件
  document.getElementById('testText').addEventListener('input', updateCharCount);
  
  // 标志位变化事件
  const flagCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="flag-"]');
  flagCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', onFlagChange);
  });
  
  // 弹窗标志位同步
  const modalFlagCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="modal-flag-"]');
  modalFlagCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', syncFlagsToModal);
  });
}

// 更新字符计数
function updateCharCount() {
  const testText = document.getElementById('testText').value;
  document.getElementById('charCount').textContent = `字符数: ${testText.length}`;
}

// 处理标志位变化
function onFlagChange() {
  // 可以在这里添加额外的逻辑
}

// 同步标志位到弹窗
function syncFlagsToModal() {
  // 可以在这里添加同步逻辑
}

// 显示错误信息
function showError(message) {
  const errorElement = document.getElementById('errorMessage');
  const errorContent = errorElement.querySelector('.error-content');
  errorContent.textContent = message;
  errorElement.classList.remove('d-none');
  
  // 5秒后自动隐藏
  setTimeout(() => {
    clearError();
  }, 5000);
}

// 清除错误信息
function clearError() {
  document.getElementById('errorMessage').classList.add('d-none');
}

// 测试正则表达式
function testRegex() {
  const regexPattern = document.getElementById('regexPattern').value;
  const testText = document.getElementById('testText').value;
  const flags = getSelectedFlags();
  
  if (!regexPattern.trim()) {
    showError('请输入正则表达式');
    return;
  }

  if (!testText.trim()) {
    showError('请输入测试文本');
    return;
  }

  try {
    // 构建正则表达式标志
    const flagString = flags.join('');
    const regex = new RegExp(regexPattern, flagString);
    
    // 执行匹配
    const matches = [];
    let match;
    
    if (flags.includes('g')) {
      // 全局匹配
      while ((match = regex.exec(testText)) !== null) {
        matches.push(match);
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      // 单次匹配
      match = regex.exec(testText);
      if (match) {
        matches.push(match);
      }
    }

    // 显示结果
    displayResults(testText, matches, regexPattern, flags);

  } catch (error) {
    console.error('正则测试失败', error);
    showError('正则表达式错误：' + error.message);
  }
}

// 获取选中的标志位
function getSelectedFlags() {
  const flags = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="flag-"]:checked');
  checkboxes.forEach(checkbox => {
    flags.push(checkbox.value);
  });
  return flags;
}

// 显示结果
function displayResults(testText, matches, regexPattern, flags) {
  // 显示结果区域
  const resultsSection = document.getElementById('resultsSection');
  resultsSection.classList.remove('d-none');
  
  // 更新匹配计数
  const matchCountElement = document.getElementById('matchCount');
  matchCountElement.textContent = `${matches.length} 个匹配`;
  
  // 生成高亮预览
  const highlightPreview = document.getElementById('highlightPreview');
  highlightPreview.innerHTML = generateHighlightedText(testText, matches);
  
  // 生成匹配列表
  const matchList = document.getElementById('matchList');
  matchList.innerHTML = generateMatchList(matches);
  
  // 更新信息卡片
  document.getElementById('regexDisplay').textContent = regexPattern;
  document.getElementById('flagsDisplay').textContent = flags.join('');
}

// 生成高亮文本
function generateHighlightedText(text, matches) {
  if (matches.length === 0) {
    return text;
  }

  let result = '';
  let lastIndex = 0;

  matches.forEach((match, index) => {
    // 添加匹配前的文本
    if (match.index > lastIndex) {
      result += text.substring(lastIndex, match.index);
    }

    // 添加匹配的文本
    result += `<span class="highlight-text matched">${escapeHtml(match[0])}</span>`;

    lastIndex = match.index + match[0].length;
  });

  // 添加剩余的文本
  if (lastIndex < text.length) {
    result += text.substring(lastIndex);
  }

  return result;
}

// 生成匹配列表
function generateMatchList(matches) {
  if (matches.length === 0) {
    return '<p class="text-center text-muted">没有找到匹配项</p>';
  }

  let result = '';
  matches.forEach((match, index) => {
    result += `
      <div class="match-item">
        <div class="match-header">
          <span class="match-index">匹配 #${index + 1}</span>
          <span class="match-range">位置: ${match.index}-${match.index + match[0].length}</span>
        </div>
        <div class="match-content">${escapeHtml(match[0])}</div>
    `;
    
    // 添加捕获组
    if (match.length > 1) {
      result += '<div class="match-groups">'
              + '<span class="group-label">捕获组:</span>';
      
      
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          result += `<span class="group-item">组 ${i}: ${escapeHtml(match[i])}</span>`;
        }
      }
      
      result += '</div>';
    }
    
    result += '</div>';
  });

  return result;
}

// 转义HTML特殊字符
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 清空结果
function clearResults() {
  const resultsSection = document.getElementById('resultsSection');
  resultsSection.classList.add('d-none');
}

// 显示常用正则表达式弹窗
function showCommonRegexModal() {
  document.getElementById('commonRegexModal').classList.remove('d-none');
}

// 关闭常用正则表达式弹窗
function closeCommonRegexModal() {
  document.getElementById('commonRegexModal').classList.add('d-none');
}

// 显示匹配选项弹窗
function showOptionsModal() {
  // 同步当前标志位到弹窗
  syncFlagsToModalPopup();
  document.getElementById('optionsModal').classList.remove('d-none');
}

// 关闭匹配选项弹窗
function closeOptionsModal() {
  // 同步弹窗标志位到主界面
  syncFlagsFromModalPopup();
  document.getElementById('optionsModal').classList.add('d-none');
}

// 显示语法参考弹窗
function showSyntaxModal() {
  document.getElementById('syntaxModal').classList.remove('d-none');
}

// 关闭语法参考弹窗
function closeSyntaxModal() {
  document.getElementById('syntaxModal').classList.add('d-none');
}

// 同步标志位到弹窗
function syncFlagsToModalPopup() {
  const mainFlags = getSelectedFlags();
  const modalCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="modal-flag-"]');
  
  modalCheckboxes.forEach(checkbox => {
    checkbox.checked = mainFlags.includes(checkbox.value);
  });
}

// 从弹窗同步标志位
function syncFlagsFromModalPopup() {
  const modalCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="modal-flag-"]:checked');
  const mainCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="flag-"]');
  
  // 先取消所有主界面的勾选
  mainCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // 然后根据弹窗的勾选状态更新
  modalCheckboxes.forEach(checkbox => {
    const mainCheckbox = document.getElementById('flag-' + checkbox.value);
    if (mainCheckbox) {
      mainCheckbox.checked = true;
    }
  });
}

// 选择常用正则表达式
function selectCommonRegex(pattern, flags) {
  document.getElementById('regexPattern').value = pattern;
  
  // 更新标志位
  const mainCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="flag-"]');
  mainCheckboxes.forEach(checkbox => {
    checkbox.checked = flags.includes(checkbox.value);
  });
  
  closeCommonRegexModal();
}

// 切换帮助信息显示
function toggleHelp() {
  const helpContent = document.getElementById('helpContent');
  const helpArrow = document.getElementById('helpArrow');
  
  helpContent.classList.toggle('d-none');
  helpArrow.classList.toggle('expanded');
}

// 填充常用正则表达式列表
function populateCommonRegexList() {
  const regexList = document.getElementById('commonRegexList');
  let html = '';
  
  commonRegex.forEach(item => {
    html += `
      <div class="regex-item" onclick="selectCommonRegex('${item.pattern}', ${JSON.stringify(item.flags)})">
        <span class="regex-name">${item.name}</span>
        <span class="regex-pattern">${item.pattern}</span>
      </div>
    `;
  });
  
  regexList.innerHTML = html;
}

// 点击弹窗外部关闭弹窗
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.classList.add('d-none');
      // 如果是选项弹窗，同步标志位
      if (modal.id === 'optionsModal') {
        syncFlagsFromModalPopup();
      }
    }
  });
};