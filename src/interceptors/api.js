import axios from 'axios'
import Router from 'next/router'
import themeConfig from 'src/configs/themeConfig'
import { store } from 'src/store'
import { updatePermissions } from 'src/store/apps/permissions'

const api = axios.create()

const backendUrl = themeConfig.backendUrl

api.interceptors.request.use(
  config => {
    config.url = `${backendUrl}${config.url}`
    const token = localStorage.getItem('accessToken') // Replace 'YOUR_BEARER_TOKEN_HERE' with your actual token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => {
    console.log(error)

    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  async function (response) {
    try {
      if (response.status === 201) {
        const token = localStorage.getItem('accessToken')
        axios
          .post(`${backendUrl}/api/admin/permissions/get`, null, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(res => {
            store.dispatch(updatePermissions(res.data))
          }).catch(err => {
            console.log('Error fetching permissions:', err)
            if (err?.response?.status === 401) {
              return Router.push('/logout')
            }
          })
      }

      return response
    } catch (error) {
      console.log(error)

      if (error.response.status === 401) {
        return Router.push('/logout')
      }

      return Promise.reject(error)
    }
  },
  function (error) {
    if (error.response.status === 401) {
      return Router.push('/logout')
    }

    return Promise.reject(error)
  }
)

export default api
