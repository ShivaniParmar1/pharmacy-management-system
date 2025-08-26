import { Box, Card, CardContent, CardHeader, Skeleton } from '@mui/material'
import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const OrderStatusDistribution = ({ orderStatusChart = [], loading }) => {
  return (
    <Card>
      <CardHeader title='Order Status Distribution' />
      <CardContent>
        {loading ? (
          <Skeleton variant='rectangular' width='100%' height={350} />
        ) : (
          <Box sx={{ height: 350 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={orderStatusChart || []}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={120}
                  fill='#8884d8'
                  dataKey='count'
                  nameKey='status'
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {(orderStatusChart || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${(index * 45) % 360}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default OrderStatusDistribution
