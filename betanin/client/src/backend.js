import axios from 'axios'
import { Toast } from 'buefy/dist/components/toast'

const PROTOCOL = 'http://'
const HOSTNAME = '192.168.1.14'
const PORT = 5000
const PATH = '/api'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const SOCKET_URL = IS_PRODUCTION
  ? '/'
  : PROTOCOL + HOSTNAME + ':' + PORT
export const API_URL = IS_PRODUCTION
  ? PATH
  : PROTOCOL + HOSTNAME + ':' + PORT + PATH

let $axios = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// request intercept
// $axios.interceptors.request.use(
// )

// response intercept
$axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    Toast.open({
      message: 'network error',
      type: 'is-primary'
    })
    return Promise.reject(error)
  }
)

export default {
  fetchResource (route) {
    return $axios.get(route)
      .then(response => response.data)
  },
  putResource (route, data) {
    return $axios.put(route, data)
      .then(response => response.data)
  },
  postResource (route, data) {
    return $axios.post(route, data)
      .then(response => response.data)
  },
  deleteResource (route) {
    return $axios.delete(route)
      .then(response => response.data)
  }
}
