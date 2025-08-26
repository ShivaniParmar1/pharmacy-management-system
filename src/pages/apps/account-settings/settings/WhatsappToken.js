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
import ImageLightbox from 'src/components/LightBoxForConfig'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CircleIcon from '@mui/icons-material/Circle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

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

const WhatsappToken = () => {
  // ** States
  const [open, setOpen] = useState(false)

  // ** Hooks
  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,

    formState: { errors }
  } = useForm({ defaultValues: { Whatsapp_token_: '' } })
  const toggleDialogBox = () => setOpen(!open)

  const whatsappTokenSubmit = value => {
    axios
      .post(`${backendUrl}/api/settings/whatsapptoken`, { whatsappToken: value.Whatsapp_token_ })
      .then(response => {
        toast.success('WhatsApp Token Saved Successfully')
        setValue('Whatsapp_token_', '') // Clear the input field after successful submission
      })
      .catch(error => {
        // Handle error response
        console.error('Error saving WhatsApp Token:', error)
        toast.error('Failed to save WhatsApp Token')
      })
  }

  const closeDialogBoxReferences = () => {
    toggleDialogBox()
    clearErrors('Whatsapp_token_')
  }

  return (
    <>
      <Card>
        <CardHeader title='Whatsapp Token' />
        <CardContent>
          <Typography variant='h6' sx={{ mb: 4 }}>
            Follow these steps to get Whatsapp Token{' '}
            <a href='#' onClick={toggleDialogBox} style={{ textDecoration: 'none', color: 'red' }}>
              {' '}
              reference
            </a>
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <form onSubmit={handleSubmit(whatsappTokenSubmit)}>
                <FormControl fullWidth sx={{ mb: 5 }}>
                  <Controller
                    name='Whatsapp_token_'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        {...field}
                        placeholder='whatsapp token'
                        label='Whatsapp Token'
                        error={Boolean(errors.Whatsapp_token)}
                        {...(errors.Whatsapp_token && { error: true, helperText: 'Please enter Whatsapp token' })}
                      />
                    )}
                  />
                </FormControl>

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
            // px: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(5)} !important`],
            // py: theme => [`${theme.spacing(12)} !important`, `${theme.spacing(12.5)} !important`],
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
              How to get Whatsapp token
            </Typography>
          </Box>
          <Box sx={{ marginLeft: { md: 10, sm: 5 } }}>
            <List>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText primary='Read and follow instructions carefully while configuring WhatsApp setting' />
              </ListItem>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>
                        First open your whatsapp Business. Inside Users
                        <ArrowForwardIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', marginBottom: 1 }} />{' '}
                        System Users
                        <ArrowForwardIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', marginBottom: 1 }} />
                        Select your App
                        <a
                          href='https://business.facebook.com/settings/system-users/'
                          style={{ textDecoration: 'none', color: 'primary' }}
                          target='_blank'
                        >
                          {' '}
                          Link
                        </a>
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>
                        Youtube Tutorial
                        <ArrowForwardIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', marginBottom: 1 }} />
                        <a
                          href='https://www.youtube.com/watch?v=gqiBzFlF44c&t=333s'
                          style={{ textDecoration: 'none', color: 'primary' }}
                          target='_blank'
                        >
                          {' '}
                          Link
                        </a>
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ImageLightbox image={`/images/config/whatsapp-token/whatsapp-token-1.png`} />
              </ListItem>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>
                        After selecting your App
                        <ArrowForwardIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', marginBottom: 1 }} />{' '}
                        Generate New Token
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ImageLightbox image={`/images/config/whatsapp-token/whatsapp-token-2.png`} />
              </ListItem>{' '}
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>
                        Now select token Expiry
                        <ArrowForwardIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', marginBottom: 1 }} />
                        To Never
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ImageLightbox image={`/images/config/whatsapp-token/whatsapp-token-3.png`} />
              </ListItem>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>
                        Now in Permission
                        <ArrowForwardIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', marginBottom: 1 }} />
                        Select (1) business_management (2) whatsapp_business_management (3) whatsapp_business_messaging
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ImageLightbox image={`/images/config/whatsapp-token/whatsapp-token-4.png`} />
              </ListItem>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>Finally Click on Generate Token</Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ImageLightbox image={`/images/config/whatsapp-token/whatsapp-token-5.png`} />
              </ListItem>
              <ListItem>
                <CircleIcon sx={{ width: 7, height: 7, marginRight: 2 }} />
                <ListItemText
                  primary={
                    <>
                      <Typography variant='body1'>
                        Now Copy Whatsapp Access Token and keep it safe and secure
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ImageLightbox image={`/images/config/whatsapp-token/whatsapp-token-6.png`} />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WhatsappToken
