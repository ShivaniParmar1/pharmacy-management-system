import axios from 'axios'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import themeConfig from 'src/configs/themeConfig'
import { store } from 'src/store'
import { setPrescriptionsCount, setOrdersCount } from 'src/store/apps/user'

const CountBadge = () => {
  const backendUrl = themeConfig.backendUrl
  const router = useRouter()

  // Define your main pages (non-dynamic routes)
  const mainPages = [
    '/',
    '/dashboard',
    '/prescriptions',
    '/quotes',
    '/orders',
    '/transactions',
    '/apps/account-settings/account',
    '/apps/permissions',
    '/apps/roles'
  ]

  // Function to check if current route is a main page
  const isMainPage = pathname => {
    // Check if the pathname exactly matches any main page
    if (mainPages.includes(pathname)) {
      return true
    }

    // Additional check: if pathname doesn't contain dynamic segments like [id], [slug], etc.
    // Dynamic routes typically contain brackets or have multiple path segments
    return !pathname.includes('[') && !pathname.includes(']') && pathname.split('/').length <= 2 // Adjust this based on your routing structure
  }

  const fetchCount = async pharmacyId => {
    try {
      const response = await axios.get(`${backendUrl}/api/pharmacy/getUnViewedCount`, {
        params: {
          pharmacy_id: pharmacyId
        }
      })

      store.dispatch(setPrescriptionsCount(response.data.quotesCount || 0))
      store.dispatch(setOrdersCount(response.data.ordersCount || 0))
    } catch (error) {
      console.error('Failed to fetch unViewed quote count:', error)
      store.dispatch(setPrescriptionsCount(0))
      store.dispatch(setOrdersCount(0))
    }
  }

  useEffect(() => {
    // Only proceed if we're on a main page
    if (!isMainPage(router.pathname)) {
      console.log('Skipping API call for dynamic page:', router.pathname)

      return
    }

    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('userData')
      const parsedData = JSON.parse(storedData)
      const pharmacyId = parsedData?.pharmacy_id

      if (pharmacyId) {
        fetchCount(pharmacyId) // Call it once immediately

        const interval = setInterval(() => {
          fetchCount(pharmacyId)
        }, 10000) // every 10 seconds

        return () => clearInterval(interval)
      }
    }
  }, [router.pathname]) // Add router.pathname as dependency

  return <div></div>
}

export default CountBadge
