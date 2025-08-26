// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import { useEffect, useState } from 'react'
import { Card, Chip, Typography } from '@mui/material'
import { Box } from '@mui/system'

const TableBasic = ({ transaction }) => {
  // Add state variables for other form fields

  const getStatusChip = status => {
    const normalized = status ? status.toLowerCase() : 'unknown'
    const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1)

    if (normalized === 'cancelled' || normalized === 'canceled') {
      return <Chip label={capitalized} color='error' />
    } else if (normalized === 'captured' || normalized === 'complete') {
      return <Chip label={capitalized} color='success' />
    } else {
      return <Chip label={capitalized} color='info' />
    }
  }

  return (
    <>
      {transaction.length ? (
        <Box sx={{ marginBottom: '20px' }}>
          <Card>
            <Typography variant='h5' sx={{ paddingTop: '20px', paddingLeft: '20px' }}>
              Transactions
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
              <Table sx={{ minWidth: 450 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>Id</TableCell>
                    <TableCell align='center'>Date</TableCell>
                    <TableCell align='center'>Amount</TableCell>
                    <TableCell align='center'>Order Amount</TableCell>
                    <TableCell align='center'>Delivery Cost</TableCell>
                    <TableCell align='center'>Method</TableCell>
                    <TableCell align='center'>Bank</TableCell>
                    <TableCell align='center'>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {transaction.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell align='center'>{`${transaction.transaction_id}`}</TableCell>
                      <TableCell align='center'>
                        {new Date(transaction.transaction_date).toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true // Enable 12-hour format
                        })}
                      </TableCell>
                      <TableCell align='center'>{`${process.env.CURRENCY} ${transaction.amount}`}</TableCell>
                      <TableCell align='center'>{`${process.env.CURRENCY} ${transaction.order_amount}`}</TableCell>
                      <TableCell align='center'>{`${process.env.CURRENCY} ${transaction.delivery_cost}`}</TableCell>
                      <TableCell align='center'>{`${transaction.method}`}</TableCell>
                      <TableCell align='center'>{`${transaction.bank}`}</TableCell>
                      <TableCell align='center'>{getStatusChip(transaction?.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      ) : (
        ''
      )}
    </>
  )
}

export default TableBasic
