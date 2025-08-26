// ** MUI Imports
import Typography from '@mui/material/Typography'

import Grid from '@mui/material/Grid'
import ImageLightbox from 'src/components/LightBox'

// ** Custom Components Imports
import TableForPrescriptions from 'src/components/TableForPrescriptions'
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
import jwtDecode from 'jwt-decode' // Assuming you're using a library like jwt-decode for decoding JWTs
import axios from 'axios'
import themeConfig from 'src/configs/themeConfig'

const backendUrl = themeConfig.backendUrl

import CustomChip from 'src/@core/components/mui/chip'

import CustomAvatar from 'src/@core/components/mui/avatar'
import Head from 'next/head'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const handleOpenGoogleMapForUser = (latitude, longitude) => {
  const url = `https://www.google.com/maps/place/${latitude},${longitude}`
  window.open(url, '_blank')
}

const columns = [
  {
    flex: 0.1,
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
    flex: 0.275,
    minWidth: 290,
    field: 'asset_url',
    headerName: 'Prescription',
    renderCell: params => {
      const fileArray = JSON.parse(params.row.asset_url)
      let correctedImagePath = []

      fileArray.map(item => {
        correctedImagePath.push(item.replace('public', ''))
      })

      return (
        <>
          {/* this is working but images are in main admin panel's public */}
          {/* {correctedImagePath.map(item => (
            <ImageLightbox key={item} image={`${item}`} />
          ))} */}

          {/* ${backendUrl}/${item} */}

          {correctedImagePath.map(item => (
            <ImageLightbox key={item} image={`${backendUrl}/public${item}`} />
          ))}
        </>
      )
    }
  },

  // {
  //   flex: 0.2,
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
    flex: 0.2,
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
    flex: 0.2,
    minWidth: 110,
    field: 'user_entered_address',
    headerName: 'Customer Address',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary', textAlign: 'center' }}>
        {params?.row?.user_entered_address}
      </Typography>
    )
  },
  {
    flex: 0.05,
    field: 'map',
    minWidth: 80,
    headerName: 'Map',
    renderCell: params => (
      <Button onClick={e => handleOpenGoogleMapForUser(params?.row?.user_lat, params?.row?.user_lng)} color='primary'>
        <Icon icon='logos:google-maps' />
      </Button>
    )
  },
  {
    flex: 0.2,
    minWidth: 140,
    field: 'action',
    headerName: 'Action',
    renderCell: params => {
      const storedData = localStorage.getItem('userData')

      const parsedData = JSON.parse(storedData)

      const pharmacyId = parsedData?.pharmacy_id

      return (
        <>
          {params.row.quote_status == 'sent' ? (
            <a target='_blank' href={`/quotes/${pharmacyId}/?jwttoken=${params?.row?.validation_token}`}>
              <Button color='primary'>
                <Icon icon='mdi:external-link' />
              </Button>
            </a>
          ) : (
            <CustomChip
              rounded
              size='small'
              skin='light'
              color='success'
              label={params.row.quote_status}
              sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
            />
          )}
        </>
      )
    }
  }
]

const DataGrid = () => {
  return (
    <Grid container spacing={6}>
      <Head>
        <title>{`Prescriptions | ${themeConfig.templateName} Pharmacy Panel`}</title>
      </Head>
      <Grid item xs={12}>
        <TableForPrescriptions columns={columns} />
      </Grid>
    </Grid>
  )
}

DataGrid.acl = {
  action: 'read',
  subject: 'prescriptions'
}

export default DataGrid
