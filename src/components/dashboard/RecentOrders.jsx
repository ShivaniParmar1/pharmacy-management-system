import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'

const getOrderStatusProps = status => {
  switch (status) {
    case 'awaiting':
    case 'quote_sent':
      return { label: 'Awaiting', color: '#9e9e9e' } // Grey

    case 'processing':
      return { label: 'Processing', color: '#ff9800' } // Orange

    case 'out_for_delivery':
      return { label: 'Out for Delivery', color: '#2196f3' } // Blue

    case 'transit':
      return { label: 'In Transit', color: '#3f51b5' } // Indigo

    case 'complete':
    case 'delivered':
      return { label: 'Delivered', color: '#4caf50' } // Green

    case 'cancelled':
      return { label: 'Cancelled', color: '#f44336' } // Red

    default:
      return { label: status, color: '#607d8b' } // Fallback: Blue Grey
  }
}

const RecentOrders = ({ recentOrders = [], loading }) => {
  return (
    <Card>
      <CardHeader title='Recent Orders' />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell align='right'>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? [...Array(3)].map((_, index) => (
                    <TableRow key={index}>
                      {[...Array(4)].map((__, i) => (
                        <TableCell key={i} align={i === 1 ? 'right' : 'left'}>
                          <Skeleton animation='wave' />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : recentOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell align='right'>
                        {process.env.CURRENCY}
                        {parseFloat(order.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const { label, color } = getOrderStatusProps(order.status)

                          return (
                            <Chip
                              label={label}
                              size='small'
                              sx={{
                                backgroundColor: color,
                                color: 'white',
                                fontWeight: 500,
                                textTransform: 'capitalize'
                              }}
                            />
                          )
                        })()}
                      </TableCell>

                      <TableCell>{order.date}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default RecentOrders
