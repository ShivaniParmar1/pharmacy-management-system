import { useState, useEffect } from 'react'
import {
  Card,
  Typography,
  Avatar,
  Box
} from '@mui/material'
import { styled } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'
import axios from 'axios'

// Component imports
import GeographicDistribution from 'src/components/dashboard/GeographicDistribution'
import OrderStatusDistribution from 'src/components/dashboard/OrderStatusDistribution'
import RevenueTrendChart from 'src/components/dashboard/RevenueTrendChart'
import { TopCustomers } from 'src/components/dashboard/TopCustomers'
import RecentOrders from 'src/components/dashboard/RecentOrders'
import AnalyticsCards from 'src/components/dashboard/AnalyticsCards'
import TotalBars from 'src/components/dashboard/TotalBars'
import RecentTransactions from 'src/components/dashboard/RecentTransactions'
import TopSellingItems from 'src/components/dashboard/TopSellingItems'

// Styled component for icon wrapper
const IconWrapper = styled(Avatar)(({ theme, color }) => ({
  width: 46,
  height: 46,
  backgroundColor: color || theme.palette.primary.main
}))

const backendUrl = themeConfig.backendUrl

function Dashboard() {
  const [stats, setStats] = useState({
    totalPharmacies: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [topSellingItems, setTopSellingItems] = useState([])
  const [topCustomers, setTopCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const storedData = localStorage.getItem('userData')
  const parsedData = JSON.parse(storedData)
  const pharmacyId = parsedData?.pharmacy_id

  useEffect(() => {
    const fetchDashboardData = async () => {


      try {
        setLoading(true)
        const token = localStorage.getItem('accessToken')

        const response = await axios.get(`${backendUrl}/api/dashboard/statsByPharmacyId`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            pharmacy_id: pharmacyId || ''
          }
        });

        const { data } = response.data

        const transformedData = {
          ...data,
          charts: {
            ...data.charts,
            revenueChart: (data.charts?.revenueChart || []).map(item => ({
              ...item,
              date: new Date(item.date).toLocaleDateString('en-IN', { dateStyle: 'short' })
            })),
            orderStatusChart: (data.charts?.orderStatusChart || []).map(item => ({
              ...item,
              status: item.status.replace(/_/g, ' ').replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
            })),
            geographicChart: (data.charts?.geographicChart || []).map(item => ({
              ...item,
              city: item.city.trim(),
              revenue: item.revenue || 0
            }))
          }
        }

        setStats(transformedData)
        setRecentOrders(
          (data?.recentOrders || []).map(item => ({
            ...item,
            date: new Date(item.date).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
              hour12: true,
              timeZone: 'Asia/Kolkata'
            })
          }))
        )

        setRecentTransactions(
          (data?.recentTransactions || []).map(item => ({
            ...item,
            created_at: new Date(item.created_at).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
              hour12: true,
              timeZone: 'Asia/Kolkata'
            })
          }))
        )
        setTopSellingItems(data.topSellingItems || [])
        setTopCustomers(data.topCustomers || [])
        setError(null)
      } catch (err) {
        console.error('Dashboard data fetch error:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    const refreshInterval = setInterval(fetchDashboardData, 300000) // 5 mins

    return () => clearInterval(refreshInterval)
  }, [])

  if (error) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      </Card>
    )
  }

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {/* Top Metrics */}
      <TotalBars stats={stats} />
      <AnalyticsCards stats={stats || {}} />

      {/* Main Grid */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        justifyContent="space-between"
        alignItems="stretch"
      >
        {/* Left-side Items */}
        <Box flex="1 1 48%" minWidth={360} display="flex" flexDirection="column" gap={3}>
          <RecentOrders loading={loading} recentOrders={recentOrders} />
          <TopCustomers loading={loading} topCustomers={topCustomers} />
          <OrderStatusDistribution
            loading={loading}
            orderStatusChart={stats?.charts?.orderStatusChart || []}
          />
          <GeographicDistribution
            geographicChart={stats?.charts?.geographicChart || []}
            loading={loading}
          />
        </Box>

        {/* Right-side Items */}
        <Box flex="1 1 48%" minWidth={360} display="flex" flexDirection="column" gap={3}>
          <TopSellingItems loading={loading} topSellingItems={topSellingItems} />
          <RecentTransactions recentTransactions={recentTransactions} />
          <RevenueTrendChart
            loading={loading}
            totalRevenue={stats?.totalRevenue || 0}
            revenueChart={stats?.charts?.revenueChart || []}
          />

        </Box>
      </Box>
    </Box>


  )
}

export default Dashboard
