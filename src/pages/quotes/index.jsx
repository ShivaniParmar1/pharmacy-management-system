import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Fade,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React, { forwardRef } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import ImageUpload from 'src/components/ImageUpload'
import ImageLightbox from 'src/components/LightBox'
import Table from 'src/components/Table'
import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import api from 'src/interceptors/api'
import Head from 'next/head'
import themeConfig from 'src/configs/themeConfig'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

export const formatDateToIST = utcDateString => {
  const date = new Date(utcDateString)

  // Convert UTC to IST (UTC+5:30)
  const offsetInHours = 5.5
  const istDate = new Date(date.getTime() + offsetInHours * 60 * 60 * 1000)

  return istDate.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

const pageConfig = {
  listingUrl: `/api/quotes/listing`,
  editUrl: '/api/channels/update',
  createUrl: '/api/channels/create',
  deleteUrl: '/api/headlines/delete',
  module: '',
  pageTitle: '',
  createText: 'Create Headline',
  createSubText: 'Please Enter admin Details to create an admin User',
  editText: 'Edit Admin',
  editSubText: 'Updating user details will receive a privacy audit.',
  createBtn: false,
  editBtn: false,
  deleteBtn: true,
  additionalQuery: {}
}

const AddDialog = ({
  dialogData,
  setShow,
  setDialogData,
  fetchTableData,
  sort,
  searchValue,
  sortColumn,
  show,
  handleClose
}) => {
  const [prefill, setPrefill] = useState(dialogData)
  useEffect(() => {
    setPrefill(dialogData)
  }, [dialogData])

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

  const handleSubmit = e => {
    e.preventDefault()

    if (dialogData.edit == false) {
      const form_data = new FormData()

      Object.keys(prefill).map(val => {
        form_data.append(val, prefill[val])
      })
      api.post(pageConfig.createUrl, form_data).then(res => {
        if (res.data.error) {
          return toast.error(res.data.message)
        }
        fetchTableData(sort, searchValue, sortColumn)

        setDialogData(defaultData)
        setShow(false)

        return toast.success(res.data.message)
      })
    }
    const form_data = new FormData()
    let count = 0
    Object.keys(prefill).map(val => {
      if (val !== 'id' && dialogData[val] === prefill[val]) {
        return
      }
      form_data.append(val, prefill[val])
      count++
    })
    if (count === 0) {
      return toast.error('Nothing to update.')
    }

    api.post(pageConfig.editUrl, form_data).then(res => {
      if (res.data.error) {
        return toast.error(res.data.message)
      }
      fetchTableData(sort, searchValue, sortColumn)

      setDialogData({})
      setShow(false)

      return toast.success(res.data.message)
    })
  }

  const addValueProps = (name, file = false) => {
    if (!file) {
      return {
        value: prefill[name] || '',
        onChange: e => {
          setPrefill({ ...prefill, [name]: e.target.value })
        }
      }
    }

    return {
      defaultImage: prefill[name] || '',
      onChange: e => {
        setPrefill({ ...prefill, [name]: e.target.files[0] })
      }
    }
  }

  return (
    <Dialog
      fullWidth
      open={show}
      maxWidth='md'
      scroll='body'
      onClose={() => handleClose()}
      TransitionComponent={Transition}
      onBackdropClick={() => handleClose()}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <CustomCloseButton onClick={() => handleClose()}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant='h3' sx={{ mb: 3 }}>
            {pageConfig.createText}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Updating user details will receive a privacy audit.</Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item sm={6} xs={12}>
            <CustomTextField
              fullWidth
              label='Channel Name'
              placeholder='Enter Channel Name'
              {...addValueProps('pharmacy_name')}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <ImageUpload title={'Logo'} {...addValueProps('logo', true)} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button variant='contained' sx={{ mr: 1 }} onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant='tonal' color='secondary' onClick={() => handleClose()}>
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const Columns = [
  {
    field: 'id',
    headerName: 'Id',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.id}
      </Typography>
    )
  },
  {
    field: 'order_id',
    headerName: 'Order Id',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.order_id}
      </Typography>
    )
  },
  {
    field: 'customer_name',
    headerName: 'Customer Name',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.customer_name}
      </Typography>
    )
  },
  {
    field: 'quote_status',
    headerName: 'Status',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.quote_status && params.quote_status.charAt(0).toUpperCase() + params.quote_status.slice(1)}{' '}
      </Typography>
    )
  },
  {
    field: 'created_at',
    headerName: 'Created at',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatDateToIST(params.created_at)}
      </Typography>
    )
  },

  {
    field: 'updated_at',
    headerName: 'Updated at',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatDateToIST(params.updated_at)}
      </Typography>
    )
  }
]

const ExpandableComponent = ({ row }) => {
  const theme = useTheme()

  return (
    <>
      <Box sx={{ m: 2 }}>
        <Typography variant='h6' gutterBottom component='div'>
          Pharmacy Items
        </Typography>

        <TableHead>
          <TableRow>
            <TableCell style={{ width: 20 }}>Sr</TableCell>
            <TableCell>Medicine</TableCell>
            <TableCell align='right'>Quantity</TableCell>
            <TableCell align='right'>Unit</TableCell>
            <TableCell align='left'>Discount</TableCell>
            <TableCell align='right'>Price</TableCell>
            <TableCell align='right'>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <>
            {row.items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell component='th' scope='row'>
                  {index + 1}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {item.item_name.charAt(0).toUpperCase() + item.item_name.slice(1)}
                </TableCell>
                {console.log(item)}
                <TableCell component='th' scope='row'>
                  {` ${item.qty}`}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {`${item.unit} ${item.unit_symbol}`}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {item.discount_type &&
                    `${item.item_discount ? item.item_discount : ''} ${
                      item.discount_type.charAt(0).toUpperCase() + item.discount_type.slice(1)
                    }`}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {process.env.CURRENCY}
                  {` ${item.price.toLocaleString()}`}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {process.env.CURRENCY}
                  {` ${item.item_total.toLocaleString()}`}
                </TableCell>
              </TableRow>
            ))}

            <TableRow rowSpan={3}>
              <TableCell>
                <Typography variant='h6' sx={{ color: 'text.primary' }}>
                  Quotation Discount
                </Typography>
              </TableCell>
              <TableCell colSpan={2} align='right'>
                {`${row.discount} ${row.discount_type} `}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant='h6' sx={{ color: 'text.primary' }}>
                  Quote Total
                </Typography>
              </TableCell>
              <TableCell align='right'>
                {process.env.CURRENCY}
                {` ${row.qoute_total.toLocaleString()}`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant='h6' sx={{ color: 'text.primary', fontWeight: 800 }}>
                  Pharmacy Total
                </Typography>
              </TableCell>

              <TableCell align='right' sx={{ fontWeight: 800 }}>
                {process.env.CURRENCY} {row.final_total.toLocaleString()}
              </TableCell>
            </TableRow>
            {!isNaN(Number(row.delivery_cost)) && Number(row.delivery_cost) != 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant='h6' sx={{ color: 'text.primary', fontSize: 12 }}>
                    Delivery Charge
                  </Typography>
                </TableCell>

                <TableCell align='right' sx={{ fontSize: 12 }}>
                  + {process.env.CURRENCY} {Number(row.delivery_cost).toLocaleString()}
                </TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant='h6' sx={{ color: 'text.primary', fontWeight: 800 }}>
                  Final Total
                </Typography>
              </TableCell>

              <TableCell align='right' sx={{ fontWeight: 800 }}>
                {process.env.CURRENCY}
                {(
                  (parseFloat(row.final_total) || 0) +
                  (!isNaN(Number(row.delivery_cost)) ? Number(row.delivery_cost) : 0)
                ).toLocaleString()}
              </TableCell>
            </TableRow>
          </>
        </TableBody>
      </Box>
    </>
  )
}

const Index = () => {
  return (
    <>
      <Head>
        <title>{`Quotes | ${themeConfig.templateName} Pharmacy Panel`}</title>
      </Head>
      <Table
        columns={Columns}
        pageConfig={pageConfig}
        AddDialog={AddDialog}
        expandableRows
        ExpandableComponent={ExpandableComponent}
      />
    </>
  )
}

Index.acl = {
  action: 'read',
  subject: 'quotes'
}

export default Index
