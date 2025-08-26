import { getStoreValues, subscribeToStore } from 'src/utils/storeSubscriber'
import { useState, useEffect, useMemo } from 'react'

const Navigation = () => {
  const [prescriptionCount, setPrescriptionCount] = useState(getStoreValues().prescriptionCount)
  const [ordersCount, setOrdersCount] = useState(getStoreValues().prescriptionCount)


  useEffect(() => {
    const unsubscribe = subscribeToStore(({ prescriptionsCount, ordersCount }) => {
      setPrescriptionCount(prescriptionsCount)
      setOrdersCount(ordersCount)
    })

    return () => unsubscribe()
  }, [])

  return [
    {
      title: 'Dashboard',
      icon: 'tabler:smart-home',
      path: '/dashboard',
      action: 'read',
      subject: 'dashboard'
    },

    // {
    //   title: 'Access Control',
    //   icon: 'tabler:shield',
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page'
    // },
    {
      title: 'Prescriptions',
      icon: 'tabler:package',
      path: '/prescriptions',
      action: 'read',
      subject: 'prescriptions',
      badgeContent: prescriptionCount > 0 ? prescriptionCount : undefined,
      badgeColor: 'error'
    },
    {
      title: 'Quotes',
      icon: 'mdi:users',
      path: '/quotes',
      action: 'read',
      subject: 'quotes',
    },
    {
      title: 'Orders',
      icon: 'tabler:truck-delivery',
      path: '/orders',
      badgeContent: ordersCount > 0 ? ordersCount : undefined,
      badgeColor: 'error'
    },
    {
      title: 'Transactions',
      icon: 'tabler:transaction-rupee',
      path: '/transactions'
    },
    {
      sectionTitle: 'Roles & Settings',
      action: 'read',
      subject: 'roles-settings'
    },
    {
      title: 'Settings',
      icon: 'tabler:settings',
      children: [
        {
          title: 'Account',
          icon: 'tabler:user',
          path: '/apps/account-settings/account/',
          action: 'read',
          subject: 'account-settings'
        }
      ]
    }
  ]
}

export default Navigation
