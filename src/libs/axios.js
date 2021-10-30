import Vue from 'vue'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
})

// Request interceptor for API calls
axiosIns.interceptors.request.use(
  async config => {
    // eslint-disable-next-line no-param-reassign
    config.headers = {
      Authorization: `Bearer ${localStorage.getItem('FerreAuthToken')}`,
    }
    return config
  },
  error => {
    Promise.reject(error)
  },
)

Vue.prototype.$http = axiosIns

export default axiosIns
