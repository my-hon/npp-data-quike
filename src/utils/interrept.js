// 引入 axios 库
import axios from 'axios';

// 创建 axios 实例
const instance = axios.create({
  baseURL: 'http://127.0.0.1:4523/m1/6014121-5703001-default', // 根据实际情况修改
  timeout: 10000 // 请求超时时间
});

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 正常响应处理
    const {
      status,
      data
    } = response;
    return {
      status,
      data
    };
  },
  error => {
    // 错误响应处理
    if (error.response) {
      const {
        status
      } = error.response;
      switch (status) {
        case 400:
          console.error('请求参数错误');
          break;
        case 401:
          console.error('未授权，请登录');
          break;
        case 403:
          console.error('禁止访问');
          break;
        case 404:
          console.error('请求资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`未知错误，状态码: ${status}`);
      }
    } else if (error.request) {
      console.error('请求已发送，但没有收到响应');
    } else {
      console.error('请求发生错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;