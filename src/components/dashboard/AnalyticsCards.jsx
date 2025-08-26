import { Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const AnalyticsCards = ({ stats }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant='subtitle2' color='textSecondary'>
              Pending Earnings
            </Typography>
            <Typography variant='h4' sx={{ my: 2 }}>
              {process.env.CURRENCY} {stats?.analytics?.pendingEarnings || 0}
            </Typography>
            <LinearProgress
              variant='determinate'
              value={stats?.analytics?.orderConversionRate || 40}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant='subtitle2' color='textSecondary'>
              Quote Conversion Rate
            </Typography>
            <Typography variant='h4' sx={{ my: 2 }}>
              {stats?.analytics?.quoteConversionRate || 0}%
            </Typography>
            <LinearProgress
              variant='determinate'
              value={stats?.analytics?.quoteConversionRate || 0}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant='subtitle2' color='textSecondary'>
              Average Order Value
            </Typography>
            <Typography variant='h4' sx={{ my: 2 }}>
              ₹{stats?.stats?.avgOrderValue?.toFixed(2) || 0}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='caption' color='textSecondary'>
                Platform Fee: {stats?.analytics?.platformFeePercentage || 0}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant='subtitle2' color='textSecondary'>
              Average Delivery Fee
            </Typography>
            <Typography variant='h4' sx={{ my: 2 }}>
              {process.env.CURRENCY}
              {Number(stats?.analytics?.avgDeliveryFee || 0).toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='caption' color='textSecondary'>
                Total Delivery Cost: {process.env.CURRENCY}
                {Number(stats?.stats?.totalDeliveryCost || 0).toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AnalyticsCards
