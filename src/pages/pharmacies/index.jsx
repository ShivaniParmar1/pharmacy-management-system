import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
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

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const pageConfig = {
  listingUrl: `/api/pharmacy/listing`,
  editUrl: '/api/channels/update',
  createUrl: '/api/channels/create',
  deleteUrl: '/api/headlines/delete',
  module: '',
  pageTitle: 'Pharmacies',
  createText: 'Create Headline',
  createSubText: 'Please Enter admin Details to create an admin User',
  editText: 'Edit Admin',
  editSubText: 'Updating user details will receive a privacy audit.',
  createBtn: false,
  editBtn: false,
  deleteBtn: false,
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
        {params.id}
      </Typography>
    )
  },
  {
    field: 'pharmacy_name',
    headerName: 'pharmacy_name',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.pharmacy_name}
      </Typography>
    )
  },
  {
    field: 'owner_name',
    headerName: 'owner_name',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.owner_name}
      </Typography>
    )
  }
]

const ExpandableComponent = ({ row }) => {
  //   {
  //     "id": 1,
  //     "pharmacy_name": "jay pharmacy",
  //     "owner_name": "parmar",
  //     "email": "jaysspspsp@gmail.com",
  //     "license_no": "asdbasdb",
  //     "whatsapp_no": "9898528257",
  //     "bank_ifsc": "BARB0DAHKUT",
  //     "bank_account_number": "1516100000001",
  //     "awards": "asd",
  //     "lat": 23.2444,
  //     "lng": 69.6547,
  //     "status": "active",
  //     "sr": 4
  // }
  return (
    <>
      <Box sx={{ m: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align='left'>Email</TableCell>
            <TableCell align='right'>Status</TableCell>
            <TableCell align='left'>Whatsapp NO</TableCell>
            <TableCell align='right'>License No</TableCell>
            <TableCell align='right'>Bank IFSC</TableCell>
            <TableCell align='right'>Bank Account Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={row.id}>
            <TableCell component='th' scope='row'>
              {row.owner_name.charAt(0).toUpperCase() + row.owner_name.slice(1)}
            </TableCell>
            <TableCell component='th' scope='row'>
              {row.email}
            </TableCell>
            <TableCell component='th' scope='row'>
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </TableCell>
            <TableCell component='th' scope='row'>
              {row.whatsapp_no}
            </TableCell>
            <TableCell component='th' scope='row'>
              {row.license_no}
            </TableCell>
            <TableCell component='th' scope='row'>
              {row.bank_ifsc}
            </TableCell>
            <TableCell component='th' scope='row'>
              {row.bank_account_number}
            </TableCell>
          </TableRow>
        </TableBody>
      </Box>
    </>
  )
}

const index = () => {
  return (
    <>
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

export default index
