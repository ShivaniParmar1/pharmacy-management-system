// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

const TableBasic = ({ data }) => {
  // Add state variables for other form fields

  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
        <Table sx={{ minWidth: 450 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Medicine Name</TableCell>
              <TableCell align='center'>Single Unit Price</TableCell>
              <TableCell align='center'>Quantity</TableCell>
              <TableCell align='center'>Unit Strength</TableCell>
              <TableCell align='center'>Total Units Price</TableCell>
              <TableCell align='center'>Discount</TableCell>
              <TableCell align='center'>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!data.length ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  <Box sx={{ margin: '20px' }}>
                    <Typography>Please add items to view the table</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              ''
            )}

            {data.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.item_name.charAt(0).toUpperCase() + row.item_name.slice(1)}</TableCell>
                <TableCell align='center'>
                  {process.env.CURRENCY} {row.unit_amount}
                </TableCell>
                <TableCell align='center'>{row.qty}</TableCell>
                <TableCell align='center'>
                  {`${row.unit} ${
                    row.unit_id == 1
                      ? 'mg'
                      : row.unit_id == 2
                      ? 'gram'
                      : row.unit_id == 3
                      ? 'Kg'
                      : row.unit_id == 4
                      ? 'ml'
                      : row.unit_id == 5
                      ? 'l'
                      : ''
                  }`}
                </TableCell>
                <TableCell align='center'>{`${process.env.CURRENCY} ${row.price}`}</TableCell>
                <TableCell align='center'>{`${row.discount} ${
                  row.discount_type.charAt(0).toUpperCase() + row.discount_type.slice(1)
                }`}</TableCell>
                <TableCell align='center'>{`${process.env.CURRENCY} ${row.item_total}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default TableBasic
