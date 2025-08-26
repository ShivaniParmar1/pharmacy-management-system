// ** React Imports
import { createContext, useEffect, useState } from 'react'
import axios from 'axios'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'
import api from 'src/interceptors/api'
import themeConfig from 'src/configs/themeConfig'
import { store } from 'src/store'
import { updatePermissions } from 'src/store/apps/permissions'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await api
          .post(
            authConfig.meEndpoint,
            {},
            {
              headers: {
                Authorization: 'Bearer ' + storedToken
              }
            }
          )
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const handleLogin = (params, errorCallback) => {
  //   api
  //     .post(authConfig.loginEndpoint, params)
  //     .then(async response => {
  //       params.rememberMe
  //         ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
  //         : null

  //       console.log(router.query.returnUrl)

  //       const returnUrl =
  //         router.query.returnUrl == '/logout/' || router.query.returnUrl == '/logout' ? '/' : router.query.returnUrl

  //       setUser({ ...response.data.userData })
  //       params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
  //       const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
  //       axios
  //         .post(`${themeConfig.backendUrl}/api/admin/permissions/get`, null, {
  //           headers: {
  //             Authorization: `Bearer ${response.data.accessToken}`
  //           }
  //         })
  //         .then(res => {
  //           store.dispatch(updatePermissions(res.data))
  //           router.replace(redirectURL)
  //         })
  //     })
  //     .catch(err => {
  //       if (errorCallback) errorCallback(err)
  //     })
  // }

  const handleLogin = (params, errorCallback) => {
    console.log('inside handle login')

    api
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        console.log(response.data.userData)

        // Further logic for successful login (setting user data, redirecting, etc.)
        const userData = response.data.userData
        const accessToken = response.data.accessToken

        // Store access token
        params.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken) : null

        // Set user data in state
        setUser(userData)

        // Store user data in localStorage if rememberMe is set
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(userData)) : null

        // Determine user type and redirect accordingly
        const redirectURL = determineRedirectURL(userData.role)
        router.replace(redirectURL)

        // Fetch permissions and store them
        fetchPermissions(accessToken)
      })
      .catch(err => {
        console.log(err)
        if (errorCallback) errorCallback(err) // Optional: Handle error callback if provided
      })
  }

  const fetchPermissions = accessToken => {
    axios
      .post(`${themeConfig.backendUrl}/api/admin/permissions/get`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(res => {
        store.dispatch(updatePermissions(res.data))
        console.log('Permissions updated:', res.data)
      })
      .catch(err => {
        console.error('Error fetching permissions:', err)
      })
  }

  // Function to determine redirect URL based on user role
  const determineRedirectURL = role => {
    console.log(role)
    let redirectURL = '/'
    if (role === 'admin') {
      redirectURL = '/dashboard' // Redirect admin to dashboard
    } else if (role === 'pharmacy') {
      redirectURL = '/dashboard'
      console.log('inside pharmacy redirect')
    }

    return redirectURL
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
