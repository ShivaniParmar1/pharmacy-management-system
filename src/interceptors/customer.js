import axios from 'axios'
import Router from 'next/router'
import themeConfig from 'src/configs/themeConfig'
import { store } from 'src/store'
import { updatePermissions } from 'src/store/apps/permissions'

const customerApi = axios.create()

const backendUrl = themeConfig.backendUrl

customerApi.interceptors.request.use(
  config => {
    config.url = `${backendUrl}${config.url}`
    const token = store.getState().customer.accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

customerApi.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      return Router.push('/logout')
    }

    return Promise.reject(error)
  }
)

export default customerApi
