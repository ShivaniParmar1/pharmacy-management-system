import React from 'react'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Skeleton,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Divider
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

export const TopCustomers = ({ loading, topCustomers = [] }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const renderCustomerTooltip = customer => {
    return (
      <Box sx={{ p: 1, minWidth: 220 }}>
        <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
          Customer Details
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant='body2'>Phone</Typography>
          <Typography variant='body2'>+{customer.phone}</Typography>
        </Box>

        <Box sx={{ mb: 0.5 }}>
          <Typography variant='body2'>Address</Typography>
          <Typography variant='caption' color='text.secondary'>
            {customer.address || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant='body2'>Avg Order Value</Typography>
          <Typography variant='body2'>₹ {customer.avgOrderValue?.toFixed(2) || 0}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='body2'>Last Order</Typography>
          <Typography variant='body2'>{new Date(customer.lastOrderDate).toLocaleString('en-IN')}</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Card>
      <CardHeader title='Top Customers' />
      <CardContent>
        {loading
          ? [...Array(5)].map((_, index) => (
              <Box key={index} sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Skeleton animation='wave' width={120} />
                    <Skeleton animation='wave' width={100} />
                  </Box>
                  <Skeleton animation='wave' height={8} />
                </Box>
              </Box>
            ))
          : topCustomers.map((customer, index) => (
              <Box key={customer.id} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      mr: 2,
                      width: 40,
                      height: 40,
                      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`
                    }}
                  >
                    {customer.name ? customer.name.charAt(0).toUpperCase() : customer.phone.slice(-2)}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box>
                        <Typography variant='body1'>{customer.name || 'Customer'}</Typography>
                        <Typography variant='caption' color='textSecondary'>
                          +{customer.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant='body2' color='textSecondary'>
                          {customer.totalOrders} orders | ₹{customer.totalSpent.toLocaleString()}
                        </Typography>
                        <Tooltip
                          title={renderCustomerTooltip(customer)}
                          arrow
                          placement='top'
                          componentsProps={{
                            tooltip: {
                              sx: {
                                bgcolor: isDarkMode ? '' : 'common.white',
                                color: isDarkMode ? 'common.white' : 'text.primary',
                                boxShadow: isDarkMode ? 3 : 1,
                                border: isDarkMode ? 'none' : '1px solid #e0e0e0',
                                '& .MuiTooltip-arrow': {
                                  color: isDarkMode ? '' : 'common.white'
                                }
                              }
                            }
                          }}
                        >
                          <InfoIcon sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.7, cursor: 'pointer' }} />
                        </Tooltip>
                      </Box>
                    </Box>

                    <LinearProgress
                      variant='determinate'
                      value={customer.performance}
                      sx={{
                        mt: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'action.hover',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
      </CardContent>
    </Card>
  )
}
