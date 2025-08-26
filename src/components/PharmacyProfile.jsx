import React, { useRef, useState, useCallback, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios'
import themeConfig from 'src/configs/themeConfig'
import { Chip } from '@mui/material'
import toast from 'react-hot-toast'

const defaultCenter = {
  lat: 17.4152,
  lng: 78.4859
}

const backendUrl = themeConfig.backendUrl

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
}

const PharmacyProfile = ({
  pharmacyData,
  mapCenter,
  setMapCenter,
  markerPosition,
  setMarkerPosition,
  fetchData = () => {}
}) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const searchInputRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const autocompleteRef = useRef(null)

  const pharmacyLocation = {
    lat: pharmacyData.lat || defaultCenter.lat,
    lng: pharmacyData.lng || defaultCenter.lng
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm()

  // Initialize Google Maps libraries and check if they're loaded
  useEffect(() => {
    const checkGoogleMapsLoaded = async () => {
      if (window.google && window.google.maps) {
        try {
          // Import the places library first
          await window.google.maps.importLibrary('places')
          await window.google.maps.importLibrary('maps')
          await window.google.maps.importLibrary('marker')
          setIsGoogleLoaded(true)
        } catch (error) {
          console.error('Error loading Google Maps libraries:', error)
          toast.error('Failed to load Google Maps libraries')
        }
      }
    }

    // Check immediately if Google is already loaded
    if (window.google) {
      checkGoogleMapsLoaded()
    } else {
      // Wait for Google Maps to load
      const interval = setInterval(() => {
        if (window.google) {
          checkGoogleMapsLoaded()
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [])

  // Initialize map and marker
  useEffect(() => {
    if (!isGoogleLoaded || !mapRef.current) return

    let map, marker

    const initMap = async () => {
      try {
        const { Map } = await window.google.maps.importLibrary('maps')
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker')

        map = new Map(mapRef.current, {
          center: mapCenter,
          zoom: 15,
          mapId: '4504f8b37365c3d0',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        })

        marker = new AdvancedMarkerElement({
          map,
          position: mapCenter,
          gmpDraggable: true,
          title: 'Pharmacy Location'
        })

        markerRef.current = marker

        // Map click listener
        map.addListener('click', event => {
          const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          }
          setMarkerPosition(newPosition)
          marker.position = newPosition

          // Reverse geocoding
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: newPosition }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const address = results[0].formatted_address
              setValue('address', address)
              if (searchInputRef.current) {
                searchInputRef.current.value = address
              }
            }
          })
        })

        // Marker drag listener
        marker.addListener('dragend', () => {
          const newPosition = marker.position
          setMarkerPosition(newPosition)

          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: newPosition }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const address = results[0].formatted_address
              setValue('address', address)
              if (searchInputRef.current) {
                searchInputRef.current.value = address
              }
            }
          })
        })
      } catch (error) {
        console.error('Error initializing map:', error)
        toast.error('Failed to load map')
      }
    }

    initMap()

    return () => {
      if (marker) {
        marker.map = null
      }
      if (map) {
        map = null
      }
    }
  }, [isGoogleLoaded, mapCenter])

  // Initialize Place Autocomplete
  useEffect(() => {
    if (!isGoogleLoaded || !searchInputRef.current || autocompleteRef.current) return

    const initAutocomplete = async () => {
      try {
        // Create the PlaceAutocompleteElement
        const placeAutocomplete = new window.google.maps.places.PlaceAutocompleteElement({
          locationBias: mapCenter,
          includedRegionCodes: ['in']
        })

        // Store reference
        autocompleteRef.current = placeAutocomplete
        setPlaceAutocomplete(placeAutocomplete)

        // Style the autocomplete to match Material-UI
        placeAutocomplete.style.width = '100%'
        placeAutocomplete.style.height = '56px' // Match Material-UI TextField height
        placeAutocomplete.style.fontSize = '16px'
        placeAutocomplete.style.fontFamily = '"Roboto","Helvetica","Arial",sans-serif'

        // Find the Material-UI TextField container
        const textFieldContainer = searchInputRef.current.closest('.MuiFormControl-root')
        if (textFieldContainer) {
          // Create a wrapper div
          const wrapper = document.createElement('div')
          wrapper.style.position = 'relative'
          wrapper.style.width = '100%'
          wrapper.style.marginBottom = '8px'

          // Insert the wrapper before the TextField
          textFieldContainer.parentNode.insertBefore(wrapper, textFieldContainer)
          wrapper.appendChild(placeAutocomplete)

          // Hide the original TextField but keep it for validation
          textFieldContainer.style.display = 'none'
        }

        // Add event listener for place selection
        placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
          try {
            const place = placePrediction.toPlace()
            await place.fetchFields({
              fields: ['displayName', 'formattedAddress', 'location', 'viewport']
            })

            const location = {
              lat: place.location.lat(),
              lng: place.location.lng()
            }

            setMapCenter(location)
            setMarkerPosition(location)

            const selectedAddress = place.formattedAddress || place.displayName
            setValue('address', selectedAddress)

            // Update the hidden input value for form validation
            if (searchInputRef.current) {
              searchInputRef.current.value = selectedAddress

              // Trigger change event for react-hook-form
              const event = new Event('input', { bubbles: true })
              searchInputRef.current.dispatchEvent(event)
            }

            // Update marker position if it exists
            if (markerRef.current) {
              markerRef.current.position = location
            }

            // Keep the selected value in the autocomplete input
            const autocompleteInput = placeAutocomplete.querySelector('input')
            if (autocompleteInput) {
              autocompleteInput.value = selectedAddress
            }
          } catch (error) {
            console.error('Error handling place selection:', error)
            toast.error('Error selecting place')
          }
        })
      } catch (error) {
        console.error('Error initializing autocomplete:', error)
        toast.error('Failed to initialize place search')
      }
    }

    initAutocomplete()

    return () => {
      if (autocompleteRef.current) {
        try {
          // Find and remove the wrapper
          const wrapper = autocompleteRef.current.parentNode
          if (wrapper && wrapper.parentNode) {
            // Show the original TextField again
            const textFieldContainer = searchInputRef.current?.closest('.MuiFormControl-root')
            if (textFieldContainer) {
              textFieldContainer.style.display = 'block'
            }
            wrapper.parentNode.removeChild(wrapper)
          }
        } catch (error) {
          console.error('Error cleaning up autocomplete:', error)
        }
        autocompleteRef.current = null
        setPlaceAutocomplete(null)
      }
    }
  }, [isGoogleLoaded, mapCenter, setMapCenter, setMarkerPosition, setValue])

  const onSubmitPharmacyForm = async data => {
    try {
      const accessToken = localStorage.getItem('accessToken')

      const pharmacyUpdateData = {
        ...pharmacyData,
        pharmacy_name: data.pharmacy_name,
        owner_name: data.owner_name,
        email: data.pharmacyEmail,
        license_no: data.license_no,
        whatsapp_no: data.whatsapp_no,
        bank_ifsc: data.bank_ifsc,
        bank_account_number: data.bank_account_number,
        awards: data.awards,
        address: data.address,
        lat: markerPosition.lat,
        lng: markerPosition.lng,
        landmark: data?.landmark || ''
      }

      const response = await axios.post(`${backendUrl}/api/pharmacy/update`, pharmacyUpdateData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (response.data.success) {
        toast.success('Pharmacy details updated successfully')
      } else {
        toast.error(response.data.message || 'Failed to update pharmacy details')
      }
    } catch (error) {
      console.error('Error updating pharmacy data:', error)
      toast.error('Failed to update pharmacy details')
    } finally {
      fetchData()
    }
  }

  const resetLocation = useCallback(() => {
    setMapCenter(pharmacyLocation)
    setMarkerPosition(pharmacyLocation)
    setValue('address', pharmacyData?.address || '')

    if (searchInputRef.current) {
      searchInputRef.current.value = ''

      // Trigger change event for react-hook-form
      const event = new Event('input', { bubbles: true })
      searchInputRef.current.dispatchEvent(event)
    }

    if (placeAutocomplete) {
      // Clear the autocomplete input without causing re-render
      const autocompleteInput = placeAutocomplete.querySelector('input')
      if (autocompleteInput) {
        autocompleteInput.value = ''

        // Dispatch input event to clear any internal state
        const inputEvent = new Event('input', { bubbles: true })
        autocompleteInput.dispatchEvent(inputEvent)
      }
    }

    if (markerRef.current) {
      markerRef.current.position = pharmacyLocation
    }
  }, [setMapCenter, setMarkerPosition, setValue, pharmacyLocation, placeAutocomplete])

  return (
    <Card>
      <CardHeader
        title='Pharmacy Details'
        subheader={pharmacyData.wallet_amount ? `Wallet Balance: ₹${pharmacyData.wallet_amount}` : ''}
        action={
          <Chip
            label={pharmacyData.status == 'active' ? 'Active' : 'In Active'}
            color={pharmacyData.status == 'active' ? 'success' : 'warning'}
            size='small'
          />
        }
      />
      <form onSubmit={handleSubmit(onSubmitPharmacyForm)}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='pharmacy_name'
                control={control}
                defaultValue={pharmacyData.pharmacy_name || ''}
                rules={{ required: 'Pharmacy Name is required' }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Pharmacy Name' placeholder='Enter pharmacy name' />
                )}
              />
              {errors.pharmacy_name && <span style={{ color: 'red' }}>{errors.pharmacy_name.message}</span>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='owner_name'
                control={control}
                defaultValue={pharmacyData.owner_name || ''}
                rules={{ required: 'Owner Name is required' }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Owner Name' placeholder='Enter owner name' />
                )}
              />
              {errors.owner_name && <span style={{ color: 'red' }}>{errors.owner_name.message}</span>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='pharmacyEmail'
                control={control}
                defaultValue={pharmacyData.email || ''}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='email'
                    label='Pharmacy Email'
                    placeholder='pharmacy@example.com'
                    disabled
                  />
                )}
              />
              {errors.pharmacyEmail && <span style={{ color: 'red' }}>{errors.pharmacyEmail.message}</span>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='license_no'
                control={control}
                defaultValue={pharmacyData.license_no || ''}
                rules={{ required: 'License Number is required' }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='License Number' placeholder='Enter license number' />
                )}
              />
              {errors.license_no && <span style={{ color: 'red' }}>{errors.license_no.message}</span>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='whatsapp_no'
                control={control}
                defaultValue={pharmacyData.whatsapp_no || ''}
                rules={{
                  required: 'WhatsApp Number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Enter valid 10-digit number'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='WhatsApp Number'
                    placeholder='9876543210'
                    inputProps={{ maxLength: 10 }}
                  />
                )}
              />
              {errors.whatsapp_no && <span style={{ color: 'red' }}>{errors.whatsapp_no.message}</span>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='landmark'
                control={control}
                defaultValue={pharmacyData.landmark || ''}
                rules={{
                  required: 'Landmark is required'
                }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Landmark' placeholder='Near Mg Road' />
                )}
              />
              {errors.landmark && <span style={{ color: 'red' }}>{errors.landmark.message}</span>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='awards'
                control={control}
                defaultValue={pharmacyData.awards || ''}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Awards/Certifications'
                    placeholder='Enter awards or certifications'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 4 }}>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  Bank Details
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='bank_account_number'
                control={control}
                defaultValue={pharmacyData.bank_account_number || ''}
                rules={{ required: 'Bank Account Number is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Bank Account Number'
                    placeholder='Enter account number'
                  />
                )}
              />
              {errors.bank_account_number && <span style={{ color: 'red' }}>{errors.bank_account_number.message}</span>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='bank_ifsc'
                control={control}
                defaultValue={pharmacyData.bank_ifsc || ''}
                rules={{
                  required: 'IFSC Code is required'
                }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='IFSC Code' placeholder='ABCD0123456' />
                )}
              />
              {errors.bank_ifsc && <span style={{ color: 'red' }}>{errors.bank_ifsc.message}</span>}
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 4 }}>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  Location Details
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Search for address:
              </Typography>
              <Controller
                name='address'
                control={control}
                defaultValue={pharmacyData.address || ''}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <Box sx={{ position: 'relative' }}>
                    <CustomTextField
                      {...field}
                      inputRef={searchInputRef}
                      fullWidth
                      label='Address'
                      placeholder='Search and select address...'
                      autoComplete='off'
                      sx={{ display: isGoogleLoaded ? 'none' : 'block' }}
                    />
                    {!isGoogleLoaded && (
                      <Typography variant='caption' sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                        Loading address search...
                      </Typography>
                    )}
                  </Box>
                )}
              />
              {errors.address && <span style={{ color: 'red' }}>{errors.address.message}</span>}
            </Grid>
            <Grid item xs={12} my={-2}>
              <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
                {`Selected Address :  ${getValues('address')}`}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
                Click on the map to set precise location or use the search box above
              </Typography>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
                <div ref={mapRef} style={mapContainerStyle}></div>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
              <Button variant='contained' type='submit' sx={{ mr: 4 }}>
                Update Pharmacy Details
              </Button>
              <Button variant='outlined' onClick={resetLocation}>
                Reset Location
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </form>
    </Card>
  )
}

export default PharmacyProfile
