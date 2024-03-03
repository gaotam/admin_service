import axios from 'axios'
import router from '@/router'

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosIns.interceptors.request.use(function (config) {
  const token = `Bearer ${localStorage.getItem("accessToken")}`
  config.headers.Authorization = token;
  return config;
}, function (error) {
  return Promise.reject(error);
});

axiosIns.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if(error.response.status == 401){
    localStorage.removeItem('userData');
    localStorage.removeItem('accessToken');
    router.push('/login').then(() => {

      // Remove "userAbilities" from localStorage
      localStorage.removeItem('userAbilities')
    })
  }
  return Promise.reject(error);
});
export default axiosIns
