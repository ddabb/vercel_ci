<template>
  <view>
    <text>{{ message }}</text>
    <!-- 添加一个按钮来触发请求 -->
    <button @click="fetchData">获取消息</button>
    <!-- 显示加载状态 -->
    <text v-if="loading">加载中...</text>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const message = ref('');
// 添加加载状态
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    // 直接使用 api/hello
    const apiUrl = 'api/hello';
    console.log('url:', apiUrl);
    // 使用 fetch 替代 axios
    const response = await fetch(apiUrl);
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    message.value = data.message;
  } catch (error) {
    console.error('请求出错:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchData(); 
});
</script>

<style scoped>
/* 可以在这里添加样式 */
</style>
