import React, { useEffect, useState, useCallback, forwardRef, useMemo, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import api from 'src/interceptors/api'
import authGuard from 'src/helpers/authGuard'
import IconButton from '@mui/material/IconButton'
import { Accordion, AccordionDetails, AccordionSummary, Button, Chip, Grid, Paper, Typography } from '@mui/material'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** ThirdParty Components
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

import debounce from 'lodash/debounce'

// ** Custom Components
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Utils Import
import Icon from 'src/@core/components/icon'
import themeConfig from 'src/configs/themeConfig'
import axios from 'axios'

// ** Styles Import
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ExcelExport from './ExcelExport'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonIcon from '@mui/icons-material/Person'
import DirectionsIcon from '@mui/icons-material/Directions'
import HomeIcon from '@mui/icons-material/Home'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import RefreshIcon from '@mui/icons-material/Refresh'

const MySwal = withReactContent(Swal)
const backendUrl = themeConfig.backendUrl

const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : ''
  const value = `${startDate}${endDate !== null ? endDate : ''}`

  return <CustomTextField inputRef={ref} label={props.label || ''} {...props} value={value} />
})

const CustomTable = ({ PageConfig, AddDialog, additionalQuery, CustomCreate }) => {
  const defaultData = {
    edit: false
  }

  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('desc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('id')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [show, setShow] = useState(false)
  const [responseData, setResponseData] = useState({})
  const [dialogData, setDialogData] = useState(defaultData)
  const [isLoading, setSetIsLoading] = useState(true)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [statusGuideOpen, setStatusGuideOpen] = useState(false)

  const columns = PageConfig.columns

  // Create a ref to store the debounced function
  const debouncedSearchRef = useRef()

  // Create the debounced function only once
  useEffect(() => {
    debouncedSearchRef.current = debounce(searchTerm => {
      setDebouncedSearchValue(searchTerm)
    }, 500) // 500ms delay

    // Cleanup function
    return () => {
      if (debouncedSearchRef.current) {
        debouncedSearchRef.current.cancel()
      }
    }
  }, [])

  const deleteRecord = row => {
    MySwal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        api.post(PageConfig.deleteUrl, { id: row.id }).then(res => {
          if (res.data.error) {
            const resMessage = res.data.message
            if (Array.isArray(resMessage)) {
              return toast.error(resMessage[0])
            }

            return toast.error(resMessage)
          }
          fetchTableData(sort, debouncedSearchValue, sortColumn)

          return MySwal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Deleted Successfully!'
          })
        })
      }
    })
  }

  const fetchTableData = useCallback(
    async (sort, q, column) => {
      const storedData = localStorage.getItem('userData')

      const parsedData = JSON.parse(storedData)

      const pharmacyId = parsedData?.pharmacy_id

      let params = {
        search: q,
        order: sort,
        sort: column,
        limit: paginationModel.pageSize,
        offset: Math.round(Math.round(paginationModel.page) * paginationModel.pageSize),
        pharmacy_id: pharmacyId
      }

      // Add date range parameters if they exist
      if (startDate) {
        params.startDate = format(startDate, 'yyyy-MM-dd')

        // If endDate is null but startDate exists, set endDate to current date
        if (!endDate) {
          const currentDate = new Date()
          params.endDate = format(currentDate, 'yyyy-MM-dd')
        } else {
          params.endDate = format(endDate, 'yyyy-MM-dd')
        }
      } else if (endDate) {
        // If only endDate exists, set startDate to a reasonable past date
        const pastDate = new Date(0) // Jan 1, 1970
        params.startDate = format(pastDate, 'yyyy-MM-dd')
        params.endDate = format(endDate, 'yyyy-MM-dd')
      }

      if (additionalQuery && typeof additionalQuery === 'object') {
        params = { ...params, ...additionalQuery }
      }

      setSetIsLoading(true)
      await api
        .post(PageConfig.listingUrl, params)
        .then(res => {
          if (res.data.error) {
            return toast.error(res.data.message)
          }

          setResponseData(res.data.data)
          setTotal(res.data.data.total)
          setRows(res.data.data.rows)

          setSetIsLoading(false)
        })
        .catch(err => {
          console.log(err)
          setSetIsLoading(false)
        })
    },
    [paginationModel, startDate, endDate]
  )

  // Effect to fetch data when debouncedSearchValue changes
  useEffect(() => {
    fetchTableData(sort, debouncedSearchValue, sortColumn)
  }, [fetchTableData, debouncedSearchValue, sort, sortColumn])

  // Effect to fetch data when date range changes
  useEffect(() => {
    if (startDate !== null || endDate !== null) {
      fetchTableData(sort, debouncedSearchValue, sortColumn)
    }
  }, [startDate, endDate, fetchTableData, sort, debouncedSearchValue, sortColumn])

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)

      // Don't call fetchTableData here - let useEffect handle it
    } else {
      setSort('asc')
      setSortColumn('full_name')
    }
  }

  const storedData = localStorage.getItem('userData')
  const parsedData = JSON.parse(storedData)
  const pharmacyId = parsedData?.pharmacy_id

  // Handle search input changes
  const handleSearch = value => {
    setSearchValue(value) // Update the input value immediately for UI responsiveness

    // Call the debounced function to update the actual search after delay
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(value)
    }
  }

  // Handle clear search
  const handleClearSearch = () => {
    setSearchValue('')
    setDebouncedSearchValue('')

    // Cancel any pending debounced calls
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current.cancel()
    }
  }

  // Add handleDateChange function
  const handleDateChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)

    // Don't call fetchTableData here - let useEffect handle it
  }

  const handleClose = () => {
    setDialogData(defaultData)
    setShow(false)
  }

  const refresh = () => {
    fetchTableData(sort, debouncedSearchValue, sortColumn)
  }

  const downloadsInvoice = async orderId => {
    if (!orderId) {
      toast.error('Order ID not found')

      return
    }

    toast.loading('Generating invoice...')

    try {
      const response = await axios.get(`${backendUrl}/api/order/${orderId}/invoice`, {
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${orderId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.dismiss()
      toast.success('Invoice downloaded')
    } catch (err) {
      toast.dismiss()
      console.error('Download failed:', err)
      toast.error('Failed to download invoice')
    }
  }

  const columnMapping = {
    id: 'Order ID',

    // number: 'Customer Number',
    user_name: 'Customer Name',
    user_entered_address: 'Customer Address',
    pharmacy_name: 'Pharmacy Name',
    user_location: 'Address Location',
    amount: 'Pharmacy Total',
    delivery_cost: 'Delivery Cost',
    final_total: 'Final Order Total',
    status: 'Order Status',
    payment_type: 'Payment Type',
    payment_status: 'Payment Status',
    delivery_status: 'Delivery Status',
    borzo_order_id: 'Borzo Order ID',
    tracking_url: 'Tracking URL',
    created_at: 'Order Date'
  }

  const QuickSearchToolbar = props => {
    // Borzo delivery status configurations
    const deliveryStatuses = [
      {
        status: 'planned',
        label: 'Planned',
        description: 'Delivery is scheduled but no courier has been assigned yet',
        color: '#2196F3',
        icon: <AccessTimeIcon />,
        category: 'in-progress'
      },
      {
        status: 'courier_assigned',
        label: 'Courier Assigned',
        description: "A courier has been assigned to your delivery but hasn't departed yet",
        color: '#FF9800',
        icon: <PersonIcon />,
        category: 'in-progress'
      },
      {
        status: 'courier_departed',
        label: 'Courier Departed',
        description: 'Courier has started the journey to the pickup point',
        color: '#FF5722',
        icon: <DirectionsIcon />,
        category: 'in-progress'
      },
      {
        status: 'courier_at_pickup',
        label: 'Courier at Pickup',
        description: 'Courier has arrived at the pickup location',
        color: '#9C27B0',
        icon: <HomeIcon />,
        category: 'in-progress'
      },
      {
        status: 'parcel_picked_up',
        label: 'Parcel Picked Up',
        description: 'Courier has collected the parcel and is now heading to delivery address',
        color: '#607D8B',
        icon: <LocalShippingIcon />,
        category: 'in-progress'
      },
      {
        status: 'active',
        label: 'In Transit / Active',
        description: 'Delivery is actively in progress, courier is on the way',
        color: '#3F51B5',
        icon: <LocalShippingIcon />,
        category: 'out-for-delivery'
      },
      {
        status: 'courier_arrived',
        label: 'Courier Arrived',
        description: 'Courier has reached the delivery address and is waiting for customer',
        color: '#E91E63',
        icon: <HomeIcon />,
        category: 'in-progress'
      },
      {
        status: 'finished',
        label: 'Delivered / Finished / Complete',
        description: 'Package has been successfully delivered to the recipient',
        color: '#4CAF50',
        icon: <CheckCircleIcon />,
        category: 'completed'
      },
      {
        status: 'canceled',
        label: 'Cancelled',
        description: 'Delivery has been cancelled and will not be completed',
        color: '#F44336',
        icon: <CancelIcon />,
        category: 'cancelled'
      },
      {
        status: 'delayed',
        label: 'Delayed',
        description: 'Delivery has been postponed by dispatcher due to various reasons',
        color: '#795548',
        icon: <AccessTimeIcon />,
        category: 'delayed'
      },
      {
        status: 'return_planned',
        label: 'Return Planned',
        description: 'Failed delivery - return to sender has been scheduled',
        color: '#607D8B',
        icon: <RefreshIcon />,
        category: 'return'
      },
      {
        status: 'return_courier_assigned',
        label: 'Return Courier Assigned',
        description: 'A courier has been assigned to return the package to sender',
        color: '#795548',
        icon: <PersonIcon />,
        category: 'return'
      },
      {
        status: 'return_finished',
        label: 'Returned',
        description: 'Package has been successfully returned to the sender',
        color: '#9E9E9E',
        icon: <AssignmentTurnedInIcon />,
        category: 'return'
      },
      {
        status: 'reattempt_planned',
        label: 'Reattempt Planned',
        description: 'Second delivery attempt has been scheduled',
        color: '#00BCD4',
        icon: <RefreshIcon />,
        category: 'reattempt'
      },
      {
        status: 'reattempt_finished',
        label: 'Reattempt Completed',
        description: 'Second delivery attempt was successful',
        color: '#4CAF50',
        icon: <CheckCircleIcon />,
        category: 'reattempt'
      }
    ]

    const statusCategories = {
      pending: { label: 'Pending', color: '#2196F3' },
      'in-progress': { label: 'In Progress', color: '#FF9800' },
      'out-for-delivery': { label: 'Out for Delivery', color: '#27beecff' },
      completed: { label: 'Completed', color: '#4CAF50' },
      cancelled: { label: 'Cancelled', color: '#F44336' },
      delayed: { label: 'Delayed', color: '#795548' },

      // return: { label: 'Return Process', color: '#607D8B' },
      reattempt: { label: 'Reattempt', color: '#00BCD4' }
    }

    const StatusChip = ({ status, label, color, icon }) => (
      <Chip
        icon={React.cloneElement(icon, { style: { color: 'white', fontSize: '16px' } })}
        label={label}
        sx={{
          backgroundColor: color,
          color: 'white',
          fontWeight: 500,
          fontSize: '0.75rem',
          height: '28px',
          '& .MuiChip-icon': {
            color: 'white !important'
          }
        }}
        size='small'
      />
    )

    return (
      <Box sx={{ display: 'flex', justifyContent: 'start', alignContent: 'center', flexDirection: 'column', gap: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'end'
          }}
        >
          <ServerSideToolbar
            onChange={props.onChange}
            value={props.value}
            clearSearch={props.clearSearch}
            refresh={props.refresh}
          />
        </Box>

        {/* Delivery Status Information Section */}
        <Box sx={{ px: 5, pb: 2 }}>
          <Accordion expanded={statusGuideOpen} onChange={() => setStatusGuideOpen(!statusGuideOpen)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoOutlinedIcon color='primary' />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Borzo Delivery Status Guide
                </Typography>
                <Chip
                  label='Interactive Guide'
                  size='small'
                  color='primary'
                  variant='outlined'
                  sx={{ ml: 1, fontSize: '0.7rem' }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 3 }}>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3, lineHeight: 1.6 }}>
                Understanding your delivery status helps you track orders effectively. Each status represents a specific
                stage in the delivery process managed by our partner Borzo.
              </Typography>

              {Object.entries(statusCategories).map(([categoryKey, category]) => {
                const categoryStatuses = deliveryStatuses.filter(status => status.category === categoryKey)

                if (categoryStatuses.length === 0) return null

                return (
                  <Paper
                    key={categoryKey}
                    elevation={1}
                    sx={{
                      p: 3,
                      mb: 2,
                      border: `2px solid ${category.color}15`,
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 4,
                          height: 24,
                          backgroundColor: category.color,
                          borderRadius: 1,
                          mr: 2
                        }}
                      />
                      <Typography variant='h6' sx={{ fontWeight: 600, color: category.color }}>
                        {category.label}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      {categoryStatuses.map(statusInfo => (
                        <Grid item xs={12} sm={6} md={4} key={statusInfo.status}>
                          <Box
                            sx={{
                              p: 2,
                              border: '1px solid #e0e0e0',
                              borderRadius: 2,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              '&:hover': {
                                borderColor: statusInfo.color,
                                backgroundColor: `${statusInfo.color}05`
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Box sx={{ mb: 1.5 }}>
                              <StatusChip {...statusInfo} />
                            </Box>
                            <Typography
                              variant='body2'
                              sx={{
                                color: 'text.secondary',
                                lineHeight: 1.5,
                                flex: 1
                              }}
                            >
                              {statusInfo.description}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                )
              })}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    )
  }

  return (
    <DatePickerWrapper sx={{ zIndex: 5000 }}>
      {AddDialog && (
        <AddDialog
          {...{
            dialogData,
            setShow,
            setDialogData,
            fetchTableData,
            sort,
            searchValue: debouncedSearchValue,
            sortColumn,
            show,
            handleClose,
            responseData,
            isLoading,
            defaultData
          }}
        />
      )}
      <Card>
        <CardHeader
          title='Orders'
          action={
            <ExcelExport
              listingUrl={PageConfig.listingUrl}
              columnMapping={columnMapping}
              customFormatters={{
                final_total: row => (parseFloat(row.amount || 0) + parseFloat(row.delivery_cost || 0)).toFixed(2),
                user_location: row => {
                  const lat = row.user_lat
                  const lng = row.user_lng

                  return lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : 'Not Available'
                },
                created_at: row => {
                  const date = new Date(row.created_at || '')

                  return date.toLocaleString()
                }
              }}
              buttonText='Export Orders'
              dialogTitle='Export Order Report'
              pharmacyId={pharmacyId}
            />
          }
        />

        <DataGrid
          autoHeight
          pagination
          rows={rows}
          rowCount={total}
          loading={isLoading}
          columns={[
            ...columns,
            {
              flex: 0.35,
              minWidth: 110,
              field: 'test',
              headerName: 'Action',
              renderCell: params => (
                <Box>
                  <Button
                    color='primary'
                    onClick={() => {
                      setDialogData({ ...params.row, edit: true })
                      setShow(true)
                    }}
                  >
                    <Icon icon='mingcute:edit-line' />
                  </Button>

                  <Button
                    color='primary'
                    onClick={() => {
                      downloadsInvoice(params?.row?.id)
                    }}
                  >
                    <Icon icon='tabler:download' />
                  </Button>

                  {authGuard.hasPermission('admin', 'delete') && (
                    <a
                      target='_blank'
                      href={`/prescriptions/${pharmacyId}/?jwttoken=${params?.row?.customer_validation}`}
                      rel='noopener noreferrer'
                    >
                      <Button color='primary'>
                        <Icon icon='mdi:external-link' />
                      </Button>
                    </a>
                  )}

                  {PageConfig.deleteBtn && authGuard.hasPermission('admin', 'delete') && (
                    <Button
                      color='error'
                      onClick={() => {
                        deleteRecord(params.row)
                      }}
                    >
                      <Icon icon='icon-park-twotone:delete' />
                    </Button>
                  )}
                </Box>
              )
            }
          ]}
          sortingMode='server'
          paginationMode='server'
          pageSizeOptions={[1, 5, 10, 25, 50]}
          paginationModel={paginationModel}
          onSortModelChange={handleSortModel}
          onPaginationModelChange={setPaginationModel}
          slots={{ toolbar: QuickSearchToolbar }}
          slotProps={{
            baseButton: {
              size: 'medium',
              variant: 'outlined'
            },
            toolbar: {
              value: searchValue,
              clearSearch: handleClearSearch,
              onChange: event => handleSearch(event.target.value),
              startDate: startDate,
              endDate: endDate,
              onDateChange: handleDateChange,
              refresh: refresh
            }
          }}
        />
      </Card>
    </DatePickerWrapper>
  )
}

export default CustomTable
