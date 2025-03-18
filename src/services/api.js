const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api' 
  : '/api';

/**
 * 获取服务器时间
 * @returns {Promise<string>}
 */
export const fetchServerTime = async () => {
  try {
    const response = await uni.request({
      url: `${BASE_URL}/hello`,
      method: 'GET',
      timeout: 5000
    });
    
    const res = response[0] ? response[1] : response;
    
    if (res.statusCode === 200) {
      return res.data.time;
    }
    throw new Error(`[${res.statusCode}] 服务器响应异常`);
  } catch (error) {
    console.error('API请求失败:', error);
    throw new Error(error.message || '网络连接异常');
  }
};
