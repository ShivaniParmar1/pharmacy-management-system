// ** MUI Imports
import Typography from '@mui/material/Typography'

import Grid from '@mui/material/Grid'
import ImageLightbox from 'src/components/LightBox'
import CustomChip from 'src/@core/components/mui/chip'

// ** Custom Components Imports
import TableServerSide from 'src/components/CustomTable'
import Box from '@mui/material/Box'
import toast from 'react-hot-toast'
import api from 'src/interceptors/api'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
  Chip
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import Fade from '@mui/material/Fade'
import { useState, forwardRef, useEffect } from 'react'
import ImageUpload from 'src/components/ImageUpload'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useRouter } from 'next/router'
import Head from 'next/head'
import themeConfig from 'src/configs/themeConfig'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})
const MySwal = withReactContent(Swal)

const handleOpenGoogleMapForUser = (latitude, longitude) => {
  const url = `https://www.google.com/maps/place/${latitude},${longitude}`
  window.open(url, '_blank')
}

const PageConfig = {
  listingUrl: `/api/order/listingfororder`,
  editUrl: '/api/headlines/update',
  createUrl: '/api/headlines/create',
  deleteUrl: '/api/order/delete',
  module: '',
  pageTitle: '',
  createText: 'Create Headline',
  createSubText: 'Please Enter admin Details to create an admin User',
  editText: 'Edit Admin',
  editSubText: 'Updating user details will receive a privacy audit.',
  createBtn: false,
  editBtn: false,
  deleteBtn: true,
  additionalQuery: {},
  columns: [
    {
      flex: 0.11,
      field: 'id',
      minWidth: 50,
      headerName: 'Id',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary', textAlign: 'center' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.25,
      field: 'asset_url',
      headerName: 'Prescription',
      renderCell: params => {
        const url = new URL(params.row.asset_url)

        const urlOrigin = `${url.origin}/`

        const pathArray = params.row.asset_url.replace(`${urlOrigin}`, '')

        const fileArray = JSON.parse(pathArray)

        return (
          <>
            {fileArray.map(item => (
              <ImageLightbox key={item} image={`${url.origin}/${item}`} />
            ))}
          </>
        )
      }
    },

    // {
    //   flex: 0.25,
    //   type: 'number',
    //   minWidth: 120,
    //   headerName: 'Customer Number',
    //   field: 'number',
    //   renderCell: params => (
    //     <Typography variant='body2' sx={{ color: 'text.primary', textAlign: 'center' }}>
    //       {params.row.number}
    //     </Typography>
    //   )
    // },
    {
      flex: 0.25,
      minWidth: 110,
      field: 'user_name',
      headerName: 'Customer Name',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary', textAlign: 'center' }}>
          {params?.row?.user_name}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'payment_type',
      headerName: 'Method',
      renderCell: params => (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={params?.row?.payment_type === 'not_yet_choosed' ? 'warning' : 'success'}
          label={params?.row?.payment_type}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'status',
      headerName: 'Order Status',
      renderCell: params => (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={
            params?.row?.status === 'cancelled'
              ? 'error'
              : params?.row?.status === 'awaiting'
              ? 'warning'
              : params?.row?.status === 'complete'
              ? 'success'
              : 'info'
          }
          label={params?.row?.status
            ?.replace(/_/g, ' ')
            ?.toLowerCase()
            ?.replace(/(^\w|\s\w)/g, match => match.toUpperCase())}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'payment_status',
      headerName: 'Payment Status',
      renderCell: params => (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={params?.row?.payment_status === 'complete' ? 'success' : 'warning'}
          label={params?.row?.payment_status}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    },

    {
      flex: 0.2,
      minWidth: 110,
      field: 'delivery_status',
      headerName: 'Delivery',
      renderCell: params => {
        const status = params?.row?.delivery_status

        return (
          <CustomChip
            rounded
            size='small'
            skin='light'
            color={
              status == 'canceled'
                ? 'error'
                : status == 'finished'
                ? 'success'
                : status == 'created'
                ? 'info'
                : 'warning'
            }
            label={params?.row?.delivery_status}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.05,
      field: 'map',
      minWidth: 80,
      headerName: 'Map',
      renderCell: params => (
        <Button
          onClick={() => handleOpenGoogleMapForUser(params?.row?.user_lat, params?.row?.user_lng)}
          color='primary'
        >
          <Icon icon='logos:google-maps' />
        </Button>
      )
    }
  ]
}

const AddDialog = ({
  dialogData,
  setShow,
  setDialogData,
  fetchTableData = () => {},
  sort,
  searchValue,
  responseData,
  sortColumn,
  show,
  handleClose
}) => {
  const [orderStatus, setOrderStatus] = useState('')
  const [initialStatus, setInitialStatus] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [quoteID, setQuoteID] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const backendUrl = themeConfig.backendUrl

  const selectedRow = dialogData

  useEffect(() => {
    if (dialogData) {
      setOrderStatus(dialogData.status || '')
      setInitialStatus(dialogData.status || '')
      setPaymentType(dialogData.payment_type || '')
      setQuoteID(dialogData.quote_id || '')
    }
  }, [dialogData])

  const handleDialogClose = () => {
    setDialogData({})
    setShow(false)
  }

  const handleStatusChange = event => {
    setOrderStatus(event.target.value)
  }

  const handleOpenGoogleMapForUser = (latitude, longitude) => {
    const url = `https://www.google.com/maps/place/${latitude},${longitude}`
    window.open(url, '_blank')
  }

  const handleCancelOrder = async () => {
    if (!selectedRow?.id) return toast.error('No order selected')

    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, Cancel it',
      cancelButtonText: 'No'
    })

    if (result.isConfirmed) {
      try {
        MySwal.fire({
          title: 'Cancelling Order...',
          html: 'Please wait while we cancel your order.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading()
          }
        })

        const response = await axios.post(`${backendUrl}/api/order/${selectedRow.id}/cancel`)

        if (response.data.error) {
          return MySwal.fire({
            icon: 'error',
            title: 'Failed',
            text: response.data.message || 'Something went wrong while cancelling the order.'
          })
        }

        MySwal.fire({
          icon: 'success',
          title: 'Order Cancelled',
          text: 'The order has been successfully cancelled.'
        })
      } catch (error) {
        console.error('Cancel order failed:', error)

        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.response?.data?.message || 'An unexpected error occurred.'
        })
      } finally {
        setRefreshKey(prevKey => prevKey + 1)
        handleDialogClose()
        fetchTableData()
      }
    }
  }

  const handleUpdateStatus = async () => {
    try {
      if (paymentType === 'Cod' && orderStatus === 'complete') {
        handleDialogClose()

        const result = await MySwal.fire({
          title: 'Confirm Payment',
          text: 'Are you sure you have received the COD payment?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, confirm!',
          cancelButtonText: 'No, cancel!'
        })

        if (!result.isConfirmed) return
      }

      const res = await axios.post(`${backendUrl}/api/order/updateOrderStatus`, {
        id: selectedRow.id,
        status: orderStatus,
        quote_id: quoteID
      })

      if (res.data.error) {
        toast.error(res.data.message)
      } else {
        if (paymentType === 'Cod' && orderStatus === 'complete') {
          const response = await axios.post(`${backendUrl}/api/payment/add-codTransaction`, {
            orderId: selectedRow.id,
            quoteId: quoteID
          })

          if (response.data.error) {
            toast.error(response.data.message)
          } else {
            toast.success(response.data.message)
          }
        }

        toast.success(res.data.message)
      }
    } catch (error) {
      console.error('Failed to update order status', error)
      toast.error('An error occurred while updating the order status.')
    } finally {
      setRefreshKey(prevKey => prevKey + 1)
      handleDialogClose()
      fetchTableData()
    }
  }

  const CustomCloseButton = styled(IconButton)(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
      transform: 'translate(7px, -5px)'
    }
  }))

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='body'
      open={show}
      onClose={handleDialogClose}
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible',
          padding: theme => theme.spacing(4),
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle sx={{ fontSize: '20px', textAlign: 'center', p: 2, pb: 1 }}>
        Update Order Status
        <CustomCloseButton onClick={handleDialogClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
      </DialogTitle>

      <DialogContent
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {dialogData && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            <Grid container spacing={2}>
              {/* Customer Info */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 1.5 }}>
                  <Typography variant='subtitle2' gutterBottom>
                    Customer
                  </Typography>
                  <Typography variant='body2'>Name: {dialogData.user_name}</Typography>
                  <Typography variant='body2'>Phone: {dialogData.number}</Typography>
                  <Typography variant='body2'>Address: {dialogData.user_entered_address}</Typography>
                  <Button
                    variant='outlined'
                    size='small'
                    sx={{ mt: 1 }}
                    onClick={() => handleOpenGoogleMapForUser(dialogData.user_lat, dialogData.user_lng)}
                    startIcon={<Icon icon='logos:google-maps' />}
                  >
                    View on Map
                  </Button>
                </Box>
              </Grid>

              {/* Order Info */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 1.5, height: '100%' }}>
                  <Typography variant='subtitle2' gutterBottom>
                    Order Details
                  </Typography>
                  <Typography variant='body2'>Amount: ₹{dialogData.amount}</Typography>
                  <Typography variant='body2'>Delivery: ₹{dialogData.delivery_cost}</Typography>
                  <Typography variant='body2'>
                    Final Order Total: ₹
                    {parseFloat(dialogData?.delivery_cost || 0) + parseFloat(dialogData.amount || 0).toFixed(2)}
                  </Typography>

                  <Typography variant='body2'>Prescriptions: {dialogData.image_count}</Typography>
                  <Typography variant='body2' sx={{ mt: 1 }}>
                    Payment:
                    <CustomChip
                      size='small'
                      label={dialogData.payment_type}
                      color={dialogData.payment_type === 'not_yet_choosed' ? 'warning' : 'success'}
                      skin='light'
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              </Grid>

              {/* Status Info */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 1.5, gap: 6, height: '100%' }}>
                  <Typography variant='subtitle2'>Status</Typography>
                  <Typography variant='body2' mt={2}>
                    Order:
                    <CustomChip size='small' label={dialogData.status} skin='light' color='info' sx={{ ml: 1 }} />
                  </Typography>
                  <Typography variant='body2' mt={2}>
                    Payment:
                    <CustomChip
                      size='small'
                      label={dialogData.payment_status}
                      skin='light'
                      color={dialogData.payment_status === 'complete' ? 'success' : 'warning'}
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              </Grid>

              {/* Delivery Info */}
              <Grid item xs={12} sm={6} sx={{ height: '100%' }}>
                <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 1.5, gap: 3, height: '100%' }}>
                  <Typography variant='subtitle2'>Delivery</Typography>
                  <Typography variant='body2' mt={1}>
                    Status:
                    <CustomChip
                      size='small'
                      label={dialogData.delivery_status}
                      color='success'
                      skin='light'
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant='body2' mt={1}>
                    Delivery Order Status:
                    <CustomChip
                      size='small'
                      label={dialogData.delivery_order_status}
                      color='info'
                      skin='light'
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant='body2' sx={{ fontWeight: 800 }} mt={1}>
                    Borzo ID: {dialogData.borzo_order_id}
                  </Typography>
                  {dialogData.tracking_url && (
                    <Button
                      size='small'
                      variant='outlined'
                      sx={{ mt: 1 }}
                      onClick={() => window.open(dialogData.tracking_url, '_blank')}
                      startIcon={<Icon icon='mdi:track' />}
                    >
                      Track Delivery
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Order Status Dropdown */}
            <Box sx={{ borderTop: '1px dashed #ccc', pt: 3, mt: 2 }}>
              <Typography variant='subtitle1' sx={{ mb: 4 }}>
                Update Order Status
              </Typography>
              <TextField
                select
                fullWidth
                label='Order Status'
                value={orderStatus}
                onChange={handleStatusChange}
                disabled={initialStatus === 'cancelled' || initialStatus === 'complete'}
              >
                {initialStatus === 'quote_sent' && <MenuItem value='quote_sent'>Quote Sent</MenuItem>}
                {initialStatus !== 'out_for_delivery' && <MenuItem value='processing'>Processing</MenuItem>}
                <MenuItem value='out_for_delivery'>Out For Delivery</MenuItem>
                <MenuItem value='complete'>Complete</MenuItem>
              </TextField>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2, py: 2, flexWrap: 'wrap' }}>
        <Button variant='contained' onClick={handleUpdateStatus}>
          Update Status
        </Button>
        <Button variant='tonal' color='secondary' onClick={handleDialogClose}>
          Close
        </Button>
        <Button
          variant='outlined'
          color='error'
          onClick={handleCancelOrder}
          disabled={initialStatus === 'cancelled' || initialStatus === 'complete'}
        >
          Cancel Order
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const DataGrid = () => {
  return (
    <>
      <Head>
        <title>{`Orders | ${themeConfig.templateName} Admin Panel`}</title>
      </Head>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TableServerSide PageConfig={PageConfig} AddDialog={AddDialog} additionalQuery={''} />
        </Grid>
      </Grid>
    </>
  )
}

export default DataGrid
