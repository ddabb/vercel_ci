<template>
  <view class="container">
    <!-- 顶部升级公告 -->
    <view class="upgrade-banner">
      🚧 系统升级公告：本站正在从HTML/CSS/JS向Uniapp迁移，持续优化用户体验！
    </view>
    
    <Header />
    
    <!-- 主内容区 -->
    <view class="content-box">
      <image 
        src="/static/logo.png" 
        class="main-logo"
        mode="aspectFit"
      />
      <text class="title">欢迎来到无人自助站</text>
      <text class="subtitle">敬请期待，更好的未来</text>
      
      <!-- 功能入口 -->
      <view class="button-group">
        <navigator 
          url="/pages/dynasties/dynasties" 
          class="action-button"
          hover-class="button-hover"
        >
          <text class="iconfont icon-history"></text>
          朝代列表
        </navigator>
      </view>
    </view>

    <Footer />
  </view>
</template>

// 在script部分修复组件注册方式（Vue3语法）
<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Header,
    Footer
  }
}
</script>

// 在style部分修复选择器作用域问题
<style scoped>
/* 保持原有样式不变，仅修改选择器 */
.container {
  min-height: 100vh;
  background: #f5f2e9;
}

.upgrade-banner {
  background: #fff9e6;
  color: #d48806;
  padding: 12rpx;
  text-align: center;
  font-size: 24rpx;
}

.content-box {
  margin: 40rpx;
  padding: 40rpx;
  background: white;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.main-logo {
  width: 200rpx;
  height: 200rpx;
  display: block;
  margin: 0 auto;
}

.title {
  display: block;
  text-align: center;
  font-size: 44rpx;
  color: #2c3e50;
  margin: 30rpx 0;
  font-weight: bold;
}

.subtitle {
  display: block;
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 60rpx;
}

.button-group {
  display: flex;
  justify-content: center;
}

.action-button {
  background: #4a90e2;
  color: white;
  padding: 20rpx 40rpx;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  font-size: 32rpx;
  transition: all 0.3s;
}

.button-hover {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 16rpx rgba(74,144,226,0.3);
}

.iconfont {
  margin-right: 15rpx;
  font-size: 36rpx;
}
</style>