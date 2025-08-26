import { Box, Card, CardContent, CardHeader, LinearProgress, Skeleton, Typography } from '@mui/material'
import React from 'react'

const TopPharmacies = ({ topPharmacies = [], loading }) => {
  return (
    <Card>
      <CardHeader title='Top Performing Pharmacies' />
      <CardContent>
        {loading
          ? [...Array(3)].map((_, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Skeleton animation='wave' width={200} />
                  <Skeleton animation='wave' width={150} />
                </Box>
                <Skeleton animation='wave' height={8} />
              </Box>
            ))
          : topPharmacies.map((pharmacy, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant='body1'>{pharmacy.name}</Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {pharmacy.orders} orders | ₹{pharmacy.revenue.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant='determinate'
                  value={pharmacy.performance}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
      </CardContent>
    </Card>
  )
}

export default TopPharmacies
