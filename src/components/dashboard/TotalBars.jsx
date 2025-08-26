import { Avatar, Box, Card, CircularProgress, Grid, Typography } from '@mui/material'
import React from 'react'
import { styled } from '@mui/material/styles'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'
import PercentIcon from '@mui/icons-material/Percent'
import InventoryIcon from '@mui/icons-material/Inventory'

// ✅ Move styled components outside the component
const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
}))

const IconWrapper = styled(Avatar, {
  shouldForwardProp: prop => prop !== 'color'
})(({ theme, color }) => ({
  width: 46,
  height: 46,
  backgroundColor: color || theme.palette.primary.main
}))

const TotalBars = ({ stats }) => {
  const loading = !stats

  return (
    <Grid container spacing={3}>
      {/* Total Pharmacies */}
      <Grid item xs={12} sm={6} md={2}>
        <StatsCard>
          <Box>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Total Wallet balance
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant='body2'>Loading...</Typography>
              </Box>
            ) : (
              <Typography variant='h4'>
                {process.env.CURRENCY} {parseFloat(stats?.stats?.currentWalletBalance || '0').toFixed(2)}
              </Typography>
            )}
          </Box>
          <IconWrapper>
            <LocalPharmacyIcon />
          </IconWrapper>
        </StatsCard>
      </Grid>

      {/* Total Orders */}
      <Grid item xs={12} sm={6} md={2}>
        <StatsCard>
          <Box>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Total Orders
            </Typography>
            <Typography variant='h4'>{stats?.stats?.totalOrders}</Typography>
          </Box>
          <IconWrapper color='#4caf50'>
            <ShoppingCartIcon />
          </IconWrapper>
        </StatsCard>
      </Grid>

      {/* Total Revenue */}
      <Grid item xs={12} sm={6} md={2}>
        <StatsCard>
          <Box>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Total Revenue
            </Typography>
            <Typography variant='h4'>₹{(stats?.stats?.totalRevenue || 0).toLocaleString()}</Typography>
          </Box>
          <IconWrapper color='#fca11afb'>
            <CurrencyRupeeIcon />
          </IconWrapper>
        </StatsCard>
      </Grid>

      {/* Total Delivery Cost */}
      <Grid item xs={12} sm={6} md={2}>
        <StatsCard>
          <Box>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Total Delivery Cost
            </Typography>
            <Typography variant='h4'>₹{(stats?.stats?.totalDeliveryCost || 0).toLocaleString()}</Typography>
          </Box>
          <IconWrapper color='#fca11afb'>
            <CurrencyRupeeIcon />
          </IconWrapper>
        </StatsCard>
      </Grid>

      {/* Pending Orders */}
      <Grid item xs={12} sm={6} md={2}>
        <StatsCard>
          <Box>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Pending Orders
            </Typography>
            <Typography variant='h4'>{stats?.stats?.pendingOrders}</Typography>
          </Box>
          <IconWrapper color='#f44336'>
            <InventoryIcon />
          </IconWrapper>
        </StatsCard>
      </Grid>

      {/* Current Platform fees */}
      <Grid item xs={12} sm={6} md={2}>
        <StatsCard>
          <Box>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Current Platform fees
            </Typography>
            <Typography variant='h4'>{(stats?.analytics?.platformFeePercentage || 0).toLocaleString()}%</Typography>
          </Box>
          <IconWrapper color='#1abcfcfb'>
            <PercentIcon />
          </IconWrapper>
        </StatsCard>
      </Grid>
    </Grid>
  )
}

export default TotalBars
