// ** React Imports
import { useState, useEffect, useRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api'

// ** Axios and Theme Config
import axios from 'axios'
import themeConfig from 'src/configs/themeConfig'
import toast from 'react-hot-toast'
import Head from 'next/head'
import { useRouter } from 'next/router'
import PharmacyProfile from 'src/components/PharmacyProfile'

const backendURL = themeConfig.backendUrl



const defaultCenter = {
  lat: 17.4152,
  lng: 78.4859
}

const TabAccount = () => {
  // ** Hooks
  const [initialData, setInitialData] = useState({})
  const [pharmacyData, setPharmacyData] = useState({})
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [markerPosition, setMarkerPosition] = useState(defaultCenter)

  const router = useRouter()

  // Form initialization
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm()

  const fetchData = async () => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      setToken(accessToken)
      try {
        const response = await axios.post(
          `${backendURL}/api/admin/getCurrentAdmin`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        )

        const adminData = response.data
        console.log('adminData', adminData)

        setInitialData({
          email: adminData.email,
          firstName: adminData.firstname,
          lastName: adminData.lastname
        })

        // Set pharmacy data if available
        if (adminData.pharmacy) {
          setPharmacyData(adminData.pharmacy)

          const pharmacyLocation = {
            lat: adminData.pharmacy.lat || defaultCenter.lat,
            lng: adminData.pharmacy.lng || defaultCenter.lng
          }
          setMapCenter(pharmacyLocation)
          setMarkerPosition(pharmacyLocation)
        }
      } catch (error) {
        console.error('Error fetching admin data:', error)
        if (error.response && error.response.status === 401) {
          toast.error('Session expired. Logging out...')
          router.push('/logout')
        } else {
          toast.error('Failed to fetch admin data')
        }
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Initialize the form with default values
    if (Object.keys(initialData).length > 0) {
      reset({
        ...initialData,
        ...pharmacyData
      })
    }
  }, [initialData, pharmacyData, reset])

  // Set the Authorization header with the JWT token
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const onSubmitForm = async data => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match")

      return
    }

    try {
      const response = await axios.post(`${backendURL}/api/admin/change-admin-password`, data, config)

      if (response.data.errorType === 'password') {
        toast.error(response.data.error)
      } else if (response.data.errorType === 'user') {
        toast.error(response.data.error)
      } else {
        toast.success(response.data.message)
        reset({ currentPassword: '', confirmPassword: '', password: '' })
        fetchData()
      }
    } catch (error) {
      console.error('Error submitting form data:', error)
      toast.error('Failed to update profile')
    }
  }

  const passwordValue = watch('password', '')

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  return (
    <>
      <Head>
        <title>{`Account | ${themeConfig.templateName} Admin Panel`}</title>
      </Head>

      <Grid container spacing={6}>
        {/* Profile Details Card */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Profile Details' />
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='firstName'
                      control={control}
                      rules={{ required: 'First Name is required' }}
                      render={({ field }) => (
                        <CustomTextField {...field} fullWidth label='First Name' placeholder='John' />
                      )}
                    />
                    {errors.firstName && <span style={{ color: 'red' }}>{errors.firstName.message}</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='lastName'
                      control={control}
                      rules={{ required: 'Last Name is required' }}
                      render={({ field }) => (
                        <CustomTextField {...field} fullWidth label='Last Name' placeholder='Doe' />
                      )}
                    />
                    {errors.lastName && <span style={{ color: 'red' }}>{errors.lastName.message}</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='email'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          type='email'
                          label='Email'
                          disabled
                          placeholder='john.doe@example.com'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='currentPassword'
                      control={control}
                      rules={{
                        required: 'Current Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters long' }
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          type='password'
                          label='Current Password'
                          placeholder='Enter your current password'
                        />
                      )}
                    />
                    {errors.currentPassword && <span style={{ color: 'red' }}>{errors.currentPassword.message}</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='password'
                      control={control}
                      rules={{
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters long' }
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          type='password'
                          label='New Password'
                          placeholder='Enter your new password'
                        />
                      )}
                    />
                    {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='confirmPassword'
                      control={control}
                      rules={{
                        required: 'Confirm Password is required',
                        validate: value => value === passwordValue || 'Passwords do not match'
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          type='password'
                          label='Confirm New Password'
                          placeholder='Confirm your new password'
                        />
                      )}
                    />
                    {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword.message}</span>}
                  </Grid>
                  <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                    <Button variant='contained' type='submit' sx={{ mr: 4 }}>
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </form>
          </Card>
        </Grid>

        {/* Pharmacy Details Card */}
        <Grid item xs={12}>
          <PharmacyProfile pharmacyData={pharmacyData} setPharmacyData={setPharmacyData} markerPosition={markerPosition} setMarkerPosition={setMarkerPosition} mapCenter={mapCenter} setMapCenter={setMapCenter} fetchData={fetchData} />
        </Grid>
      </Grid>
    </>
  )
}

// Define ACL (Access Control List) for TabAccount component
TabAccount.acl = {
  action: 'read',
  subject: 'account-settings'
}

export default TabAccount
