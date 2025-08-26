import { Box, Card, CardContent, CardHeader, Skeleton } from '@mui/material'
import { Tooltip } from 'chart.js'
import React from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const RevenueTrendChart = ({ totalRevenue = 0, revenueChart = [], loading }) => {
  return (
    <Card>
      <CardHeader
        title='Revenue Trend'
        subheader={`${totalRevenue ? `₹${totalRevenue.toLocaleString()} total revenue` : ''}`}
      />
      <CardContent>
        {loading ? (
          <Skeleton variant='rectangular' width='100%' height={350} />
        ) : (
          <Box sx={{ height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={revenueChart || []} margin={{ left: 0, right: 0 }}>
                <defs>
                  <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey='date' />
                <YAxis />
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip />
                <Area type='monotone' dataKey='revenue' stroke='#8884d8' fillOpacity={1} fill='url(#colorRevenue)' />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default RevenueTrendChart
