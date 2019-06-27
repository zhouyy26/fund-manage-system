import axios from 'axios';
import router from './router';
import { Message, Loading } from 'element-ui';

// 定义加载动画
let loading;
const showLoading = () => {
  loading = Loading.service({
    lock: true,
    text: '拼命加载中...',
    background: 'rgba(0, 0, 0, .7)'
  });
}
const hideLoading = () => {
  loading.close();
}

// 请求拦截
axios.interceptors.request.use(config => {
  showLoading(); // 显示加载动画
  const token = localStorage.token;
  config.headers.Authorization = token; // 设置请求头
  return config;
}, error=> {
  return Promise.reject(error);
});

// 响应拦截
axios.interceptors.response.use(response => {
  hideLoading(); // 隐藏加载动画
  return response;
}, error=> {
  hideLoading();
  const {status, data} = error.response;
  if (status === 404) { // 获取失败
    Message.error(data);
  } else if (status === 401) { // token失效
    Message.error('token失效，请重新登录');
    localStorage.removeItem('token');
    router.push('/login');
  }
  return Promise.reject(error);
});

export default axios;