<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
      <text class="title">API时间: {{ apiTime }}</text>
    </view>
  </view>
</template>

<script>
import { fetchServerTime } from '@/services/api';

export default {
  data() {
    return {
      title: 'Hello',
      apiTime: '加载中...'
    }
  },
  onLoad() {
    this.fetchTime()
  },
  methods: {
    async fetchTime() {
      try {
        this.apiTime = await fetchServerTime();
      } catch (error) {
        this.apiTime = error.message;
      }
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
