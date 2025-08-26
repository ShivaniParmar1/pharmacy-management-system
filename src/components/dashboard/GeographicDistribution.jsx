import { Card, CardContent, CardHeader, Skeleton } from '@mui/material'
import { Box } from '@mui/system'
import { Tooltip } from 'chart.js'
import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const GeographicDistribution = ({ geographicChart = [], loading }) => {
  return (
    <Card>
      <CardHeader title='Geographic Distribution' />
      <CardContent>
        {loading ? (
          <Skeleton variant='rectangular' width='100%' height={350} />
        ) : (
          <Box sx={{ height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={geographicChart || []}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='city' angle={-45} textAnchor='end' height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey='orderCount' fill='#82ca9d' name='Orders' />
                <Bar dataKey='revenue' fill='#8884d8' name='Revenue' />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default GeographicDistribution
