// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CircleIcon from '@mui/icons-material/Circle'
import ImageLightbox from 'src/components/LightBoxForConfig'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import { FormControl, Grid, List, ListItem, ListItemText, MenuItem } from '@mui/material'
import Link from 'next/link'
import toast from 'react-hot-toast'
import axios from 'axios'
import themeConfig from 'src/configs/themeConfig'

const backendUrl = themeConfig.backendUrl

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

const RazorpayIdAndKey = () => {
  // ** States
  const [open, setOpen] = useState(false)

  // ** Hooks
  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,

    formState: { errors }
  } = useForm({ defaultValues: { razorpay_id: '', razorpay_key: '' } })
  const toggleDialogBox = () => setOpen(!open)

  const handleRazopaySettings = value => {
    console.log(value)

    axios
      .post(`${backendUrl}/api/settings/razorpayidandkey`, {
        razorpay_id: value.razorpay_id,
        razorpay_key: value.razorpay_key
      })
      .then(response => {
        toast.success('Razorpay ID and Key Saved Successfully')
        setValue('razorpay_id', '')
        setValue('razorpay_key', '')
      })
      .catch(error => {
        // Handle error response
        console.error('Error saving Razorpay ID and Key:', error)
        toast.error('Failed to save Razorpay ID and Key')
      })
  }

  const closeDialogBoxReferences = () => {
    toggleDialogBox()
    clearErrors('razorpay_id')
    clearErrors('razorpay_key')
  }

  return (
    <>
      <Card>
        <CardHeader title='Razorpay ID and Key' />
        <CardContent>
          <Typography variant='h6' sx={{ mb: 4 }}>
            Follow these steps to get Razorpay id and key{' '}
            <a href='#' onClick={toggleDialogBox} style={{ textDecoration: 'none', color: 'red' }}>
              {' '}
              reference
            </a>
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <form onSubmit={handleSubmit(handleRazopaySettings)}>
                <Box mb={5}>
                  <FormControl fullWidth>
                    <Controller
                      name='razorpay_id'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomTextField
                          fullWidth
                          {...field}
                          placeholder='razorpay id'
                          label='Razorpay id'
                          error={Boolean(errors.razorpay_id)}
                          {...(errors.razorpay_id && { error: true, helperText: 'Please enter Razorpay id' })}
                        />
                      )}
                    />
                  </FormControl>
                </Box>

                <Box mb={5}>
                  <FormControl fullWidth>
                    <Controller
                      name='razorpay_key'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomTextField
                          fullWidth
                          {...field}
                          placeholder='razorpay secret key'
                          label='Razorpay Secret key'
                          error={Boolean(errors.razorpay_key)}
                          {...(errors.razorpay_key && { error: true, helperText: 'Please enter Razorpay key' })}
                        />
                      )}
                    />
                  </FormControl>
                </Box>

                <Button type='submit' variant='contained' fullWidth>
                  Save
                </Button>
              </form>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        fullWidth
        open={open}
        onClose={toggleDialogBox}
        maxWidth='md' // Set the maxWidth property here
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'visible'
          }
        }}
      >
        <DialogContent
          sx={{
            px: {
              md: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(5)} !important`],
              sm: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(2)} !important`]
            },
            py: {
              md: theme => [`${theme.spacing(12)} !important`, `${theme.spacing(12.5)} !important`],
              sm: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(2.5)} !important`]
            },
            overflow: 'auto',
            scrollbarWidth: 'none',
            '-ms-overflow-style': 'none'
          }}
        >
          <CustomCloseButton onClick={closeDialogBoxReferences}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>

          <Box sx={{ mb: 7, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h5' sx={{ textAlign: 'center', fontSize: '1.625rem' }}>
              How to get Razorpay ID and Key
            </Typography>
          </Box>
          <Box sx={{ marginLeft: { md: 10, sm: 5 } }}>
            <List>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <Typography>
                      Read and follow instructions carefully while configuring Razorpay setting
                      <a
                        target='_blank'
                        href='https://dashboard.razorpay.com/app/website-app-settings/api-keys'
                        style={{ textDecoration: 'none', color: 'red' }}
                      >
                        {' '}
                        Link
                      </a>
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>First open Razorpay Dashboard</Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ImageLightbox image={`/images/config/razorpay-api/razorpay-api-1.png`} />
              </ListItem>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>
                        After opening Razorpay dashboard
                        <ArrowForwardIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', marginBottom: 1 }} />
                        Account Settings
                        <ArrowForwardIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', marginBottom: 1 }} />
                        API Keys
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ImageLightbox image={`/images/config/razorpay-api/razorpay-api-2.png`} />
              </ListItem>{' '}
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>
                        After opening API Keys
                        <ArrowForwardIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', marginBottom: 1 }} />{' '}
                        Select Generate Key
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ImageLightbox image={`/images/config/razorpay-api/razorpay-api-3.png`} />
              </ListItem>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>
                        Please download the key details{' '}
                        <ArrowForwardIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', marginBottom: 1 }} /> Now
                        ensure to keep this file safe.
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ImageLightbox image={`/images/config/razorpay-api/razorpay-api-4.png`} />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default RazorpayIdAndKey
