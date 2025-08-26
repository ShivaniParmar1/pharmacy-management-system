import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'

const TopSellingItems = ({ loading, topSellingItems = [] }) => {
  return (
    <Card>
      <CardHeader title='Top Selling Items' />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='start'>Item Name</TableCell>
                <TableCell align='center'>Total Quantity Sold</TableCell>
                <TableCell align='center'>Total Revenue</TableCell>
                <TableCell align='center'>Order Count</TableCell>
                <TableCell align='end'>Avg Price</TableCell>
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
                : topSellingItems.map(item => (
                    <TableRow key={item?.id}>
                      <TableCell align='start'>{item?.item_name || ''}</TableCell>
                      <TableCell align='center'>{item?.totalQuantitySold || ''}</TableCell>
                      <TableCell align='center'>
                        {process.env.CURRENCY}
                        {item?.totalRevenue || ''}
                      </TableCell>
                      <TableCell align='center'>{item?.orderCount || ''}</TableCell>
                      <TableCell align='end'>
                        {process.env.CURRENCY} {item?.avgPrice || ''}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default TopSellingItems
