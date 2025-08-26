import { useEffect, useState, forwardRef, useCallback, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import debounce from 'lodash/debounce'
import { Box, Button, IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import axios from 'axios'
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import themeConfig from 'src/configs/themeConfig'
import ExcelExport from './ExcelExport'

const backendUrl = themeConfig.backendUrl

const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : ''
  const value = `${startDate}${endDate !== null ? endDate : ''}`

  return <CustomTextField inputRef={ref} label={props.label || ''} {...props} value={value} />
})

const QuickSearchToolbar = props => (
  <Box
    sx={{
      gap: 2,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: theme => theme.spacing(2, 5, 4, 5)
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <DatePicker
        selectsRange
        endDate={props.endDate}
        selected={props.startDate}
        startDate={props.startDate}
        id='date-range-picker'
        onChange={props.onDateChange}
        shouldCloseOnSelect={false}
        customInput={<CustomInput label='Select Date Range' start={props.startDate} end={props.endDate} />}
      />
      <CustomTextField
        select
        label='Transaction Type'
        value={props.transactionType}
        onChange={props.onTransactionTypeChange}
        sx={{
          minWidth: 300,
          '& .MuiInputBase-root': {
            height: '39px',
            width: '200px'
          }
        }}
      >
        <MenuItem value=''>All Types</MenuItem>
        <MenuItem value='pharmacy_wallet_credit'>Pharmacy Wallet Credit</MenuItem>
        <MenuItem value='pharmacy_wallet_withdraw'>Pharmacy Wallet Withdraw</MenuItem>
        <MenuItem value='customer_payment'>Customer Payment</MenuItem>
        <MenuItem value='customer_refund'>Customer Refund</MenuItem>
      </CustomTextField>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <CustomTextField
        value={props.value}
        placeholder='Search…'
        onChange={props.onChange}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 2, display: 'flex' }}>
              <Icon fontSize='1.25rem' icon='tabler:search' />
            </Box>
          ),
          endAdornment: (
            <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
              <Icon fontSize='1.25rem' icon='tabler:x' />
            </IconButton>
          )
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto'
          },
          alignSelf: 'flex-end',
          '& .MuiInputBase-root > svg': {
            mr: 2
          }
        }}
      />

      <Button id='table-refresh-btn' onClick={props.clearSearch} color='primary' title='Refresh Data'>
        <Icon fontSize='1.25rem' icon='tabler:refresh' />
      </Button>
    </Box>
  </Box>
)

const TableForTransactionTable = ({ columns, setBalance = () => {} }) => {
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [transactionType, setTransactionType] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const storedData = localStorage.getItem('userData')
  const parsedData = JSON.parse(storedData)
  const pharmacyId = parsedData?.pharmacy_id

  useEffect(() => {
    fetchDataWithPagination(searchText, { startDate, endDate }, transactionType, paginationModel)
  }, []) // Initial fetch only

  const fetchDataWithPagination = async (searchValue, dateRange, txnType, pagination) => {
    try {
      setLoading(true)

      const payload = {
        search: searchValue,
        pharmacy_id: pharmacyId,
        limit: pagination.pageSize,
        offset: pagination.page * pagination.pageSize
      }

      const currentStartDate = dateRange.startDate !== undefined ? dateRange.startDate : startDate
      const currentEndDate = dateRange.endDate !== undefined ? dateRange.endDate : endDate

      if (txnType) payload.transaction_type = txnType

      if (currentStartDate) {
        payload.startDate = currentStartDate.toISOString()
        payload.endDate = currentEndDate ? currentEndDate.toISOString() : new Date().toISOString()
      } else if (currentEndDate) {
        payload.startDate = new Date(0).toISOString()
        payload.endDate = currentEndDate.toISOString()
      }

      const response = await axios.post(`${backendUrl}/api/transactions/alllisting`, payload)
      setData(response.data.data.rows)
      setTotalCount(response.data.data.total || response.data.data.count || 0)
      setBalance(response.data.data.wallet_balance)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = useCallback(
    searchValue => {
      const newPaginationModel = { ...paginationModel, page: 0 }
      setPaginationModel(newPaginationModel)

      fetchDataWithPagination(searchValue, { startDate, endDate }, transactionType, newPaginationModel)
    },
    [paginationModel, startDate, endDate, transactionType]
  )

  const debouncedSearch = useMemo(() => debounce(handleSearch, 500), [handleSearch])

  const handleInputChange = e => {
    const value = e.target.value
    setSearchText(value)
    debouncedSearch(value)
  }

  useEffect(() => {
    return () => debouncedSearch.cancel()
  }, [debouncedSearch])

  const handleDateChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)

    const newPaginationModel = { ...paginationModel, page: 0 }
    setPaginationModel(newPaginationModel)

    fetchDataWithPagination(searchText, { startDate: start, endDate: end }, transactionType, newPaginationModel)
  }

  const handleTransactionTypeChange = event => {
    const newType = event.target.value
    setTransactionType(newType)

    const newPaginationModel = { ...paginationModel, page: 0 }
    setPaginationModel(newPaginationModel)

    fetchDataWithPagination(searchText, { startDate, endDate }, newType, newPaginationModel)
  }

  const handlePaginationModelChange = newPaginationModel => {
    setPaginationModel(newPaginationModel)
    fetchDataWithPagination(searchText, { startDate, endDate }, transactionType, newPaginationModel)
  }

  const columnMapping = {
    id: 'ID',
    transaction_id: 'Transaction ID',
    transaction_type: 'Transaction Type',
    order_id: 'Order ID',
    quote_id: 'Quote ID',
    platform_fees: 'PlateForm Fees',
    amount: 'Amount',
    delivery_cost: 'Delivery Cost',
    final_total: 'Final Total',
    transaction_date: 'Date',
    method: 'Method',
    bank: 'Bank',
    status: 'Status',
    created_at: 'Order Date'
  }

  return (
    <DatePickerWrapper>
      <Card>
        <CardHeader
          title='Transactions'
          action={
            <ExcelExport
              listingUrl='/api/transactions/alllisting'
              fileNamePrefix='transactions'
              columnMapping={columnMapping}
              pharmacyId={pharmacyId}
              customFormatters={{
                final_total: row =>
                  row.transaction_type === 'pharmacy_wallet_credit'
                    ? parseFloat(row?.amount || 0).toFixed(2)
                    : (parseFloat(row?.amount || 0) + parseFloat(row?.delivery_cost || 0)).toFixed(2),
                created_at: row => new Date(row.created_at || '').toLocaleString()
              }}
              buttonText='Export Transactions'
              dialogTitle='Export Transactions Report'
            />
          }
        />
        <DataGrid
          autoHeight
          columns={columns}
          rows={data}
          loading={loading}
          rowCount={totalCount}
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          paginationMode='server'
          onPaginationModelChange={handlePaginationModelChange}
          slots={{ toolbar: QuickSearchToolbar }}
          sx={{ '& .MuiSvgIcon-root': { fontSize: '1.125rem' }, minHeight: '40vh' }}
          slotProps={{
            baseButton: {
              size: 'medium',
              variant: 'outlined'
            },
            toolbar: {
              value: searchText,
              clearSearch: () => {
                handleSearch('')
                setSearchText('')
              },
              onChange: handleInputChange,
              startDate: startDate,
              endDate: endDate,
              onDateChange: handleDateChange,
              transactionType: transactionType,
              onTransactionTypeChange: handleTransactionTypeChange
            }
          }}
        />
      </Card>
    </DatePickerWrapper>
  )
}

export default TableForTransactionTable
