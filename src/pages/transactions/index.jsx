import { Button, Card, CardContent, CardHeader, Divider, Tooltip } from '@mui/material'
import TransactionTable from 'src/components/TableForTransactions'
import { useState, useEffect } from 'react'
import api from 'src/interceptors/api'
import Box from '@mui/material/Box'
import CustomChip from 'src/@core/components/mui/chip'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Head from 'next/head'
import themeConfig from 'src/configs/themeConfig'
import Icon from 'src/@core/components/icon'
import { AmountBreakdownTooltip } from 'src/components/AmountBreakdownTooltip'

// ** Utils Import
function formatDate(dateString) {
  // Convert the date string to a JavaScript Date object
  const date = new Date(dateString)

  // Format the date and time
  const formattedDate = date.toLocaleDateString()
  const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })

  // Return the formatted date and time
  return `${formattedDate} ${formattedTime}`
}

function renderStatus(params) {
  // Check if status is "captured", render CustomChip component if true
  if (params.row.status === 'captured' || params.row.status === 'completed') {
    return (
      <CustomChip
        rounded
        size='small'
        skin='light'
        color={'success'}
        label={'success'}
        sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
      />
    )
  } else if (params.row.status === 'refund') {
    // Render nothing if status is not "captured"
    return (
      <CustomChip
        rounded
        size='small'
        skin='light'
        color={'info'}
        label={'Refund'}
        sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
      />
    )
  } else {
    // Render nothing if status is not "captured"
    return (
      <CustomChip
        rounded
        size='small'
        skin='light'
        color={'error'}
        label={'failed'}
        sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
      />
    )
  }
}

const columns = [
  {
    flex: 0.1,
    type: 'id',
    minWidth: 120,
    headerName: 'ID',
    field: 'id',

    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {`${params.row.id}`}
      </Typography>
    )
  },

  {
    flex: 0.3,
    type: 'transaction_id',
    minWidth: 120,
    headerName: 'Transaction Id',
    field: 'transaction_id',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {`${params.row.transaction_id}`}
      </Typography>
    )
  },
  {
    flex: 0.4,
    type: 'transaction_type',
    minWidth: 120,
    headerName: 'Transaction Type',
    field: 'transaction_type',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.transaction_type
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, char => char.toUpperCase())}
      </Typography>
    )
  },
  ,
  {
    flex: 0.1,
    type: 'order_id',
    minWidth: 120,
    headerName: 'Order Id',
    field: 'order_id',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary', textAlign: 'center' }}>
        {`${params.row.order_id}`}
      </Typography>
    )
  },
  ,
  {
    flex: 0.2,
    type: 'quote_id',
    minWidth: 120,
    headerName: 'Quote Id',
    field: 'quote_id',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary', textAlign: 'center' }}>
        {`${params.row.quote_id}`}
      </Typography>
    )
  },
  {
    flex: 0.2,
    field: 'amount',
    minWidth: 80,
    headerName: 'Amount',
    renderCell: params => {
      return <AmountBreakdownTooltip orderDetails={params.row} />
    }
  },

  {
    flex: 0.3,
    type: 'transaction_date',
    minWidth: 120,
    headerName: 'Date',
    field: 'transaction_date',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatDate(params.row.transaction_date)}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 140,
    field: 'method',
    headerName: 'Method',
    renderCell: params => {
      return (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.method}
        </Typography>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 140,
    field: 'bank',
    headerName: 'Bank',
    renderCell: params => {
      return (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bank}
        </Typography>
      )
    }
  },

  {
    flex: 0.2,
    minWidth: 140,
    field: 'status',
    headerName: 'Status',
    renderCell: params => {
      return renderStatus(params)
    }
  }
]

const TransactionsPage = () => {
  const [balance, setBalance] = useState(null)

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
      <Head>
        <title>{`Transactions | ${themeConfig.templateName} Pharmacy Panel`}</title>
      </Head>
      <Card>
        <CardContent>
          <Typography variant='h6'>Wallet Balance</Typography>
          <Typography variant='h4' sx={{ mt: 1 }}>
            ₹ {balance !== null ? balance.toFixed(2) : 'Loading...'}
          </Typography>
        </CardContent>
      </Card>

      <TransactionTable columns={columns} setBalance={setBalance} />
    </Box>
  )
}

export default TransactionsPage
