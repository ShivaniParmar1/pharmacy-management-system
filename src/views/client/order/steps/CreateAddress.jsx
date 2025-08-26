import React, { useState } from 'react'
import { Autocomplete } from '@react-google-maps/api'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Table
} from '@mui/material'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useSelector, useDispatch } from 'react-redux'
import { setRegistrationData } from 'src/store/apps/pharmacy'
import customerApi from 'src/interceptors/customer'
import { useRouter } from 'next/router'

const CreateAddress = ({ setType, fetchAddress }) => {
  const [open, setOpen] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [autocomplete, setAutocomplete] = useState(null)
  const [map, setMap] = useState(null)
  const [geocoder, setGeocoder] = useState(null)
  const dispatch = useDispatch()
  const data = useSelector(state => state.pharmacy).registrationData
  const [field, setFields] = useState({})
  const [formattedAdd, setFormattedAdd] = useState('')
  const { orderId } = useRouter().query

  const addValueProps = (name, file = false) => {
    if (!file) {
      return {
        value: field[name] || '',
        onChange: e => {
          setFields({ ...field, [name]: e.target.value })
        }
      }
    }

    return {
      defaultImage: field[name] || '',
      onChange: e => {
        setFields({ ...field, [name]: e.target.files[0] })
      }
    }
  }

  const [location, setLocation] = useState({
    address_components: []
  })

  const handleSelect = () => {
    const place = autocomplete.getPlace()
    setFormattedAdd(place.formatted_address)
    setSelectedPlace({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    })

    setOpen(true)
  }

  const create = () => {
    console.log(location)

    customerApi
      .post('/api/customer/address/create', {
        ...selectedPlace,
        ...field,
        address: location.formatted_address,
        place_id: location.place_id,
        formatted_address: location.formatted_address,
        address_response: JSON.stringify(location),
        order_id: orderId
      })
      .then(res => {
        if (res.data.error) {
          return toast.error(res.data.message)
        }
        setType('address')
        fetchAddress()
      })
      .catch(err => {
        console.log(err)
      })
    console.log(selectedPlace)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMarkerDrag = e => {
    setSelectedPlace({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    })

    if (geocoder) {
      geocoder.geocode({ location: { lat: e.latLng.lat(), lng: e.latLng.lng() } }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            setFormattedAdd(results[0].formatted_address)
            setLocation(results[0]) // Complete location object with address details
            console.log(results[0]) // Complete location object with address details
          }
        }
      })
    }
  }

  const onMapLoad = map => {
    setMap(map)
    if (window.google) {
      setGeocoder(new window.google.maps.Geocoder())
    }
  }

  return (
    <div>
      <LoadScript googleMapsApiKey='AIzaSyApsSG7uW6KzpUpfKmotUUPSppS_xZ6f2I' libraries={['places']}>
        <Grid container sx={{ marginTop: '2px' }} spacing={4}>
          <Grid item xs={12} sm={12}>
            <Typography variant='h4'>Create Address</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField fullWidth label='Full Name' placeholder='Full Name' {...addValueProps('full_name')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField fullWidth label='Title' placeholder='Enter Title' {...addValueProps('title')} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField fullWidth label='Address one' placeholder='Address one' {...addValueProps('address1')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField fullWidth label='Address two' placeholder='Address two' {...addValueProps('address2')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField fullWidth label='Mobile' placeholder='Enter Mobile' {...addValueProps('phone')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete onLoad={autoComp => setAutocomplete(autoComp)} onPlaceChanged={handleSelect}>
              <CustomTextField
                fullWidth
                label='Location'
                onChange={e => setFormattedAdd(e.target.value)}
                value={formattedAdd}
                placeholder='Enter Address'
              />
            </Autocomplete>
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
          <Grid item xs={12} lg={6} xl={7}>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableBody
                    sx={{
                      '& .MuiTableCell-root': {
                        borderBottom: 0,
                        verticalAlign: 'top',
                        '&:last-of-type': { px: '0 !important' },
                        '&:first-of-type': { pl: '0 !important' },
                        py: theme => `${theme.spacing(0.75)} !important`
                      }
                    }}
                  >
                    {location.address_components.map((row, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                              {row.types.map((heading, index) => {
                                if (heading === 'political') {
                                  return ''
                                }
                                if (index === 0) {
                                  return heading
                                }

                                return ' or ' + heading
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: 'text.secondary' }}>{row.long_name}</Typography>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          {location.address_components.length !== 0 && (
            <>
              <Grid item sm={12} xs={12}>
                <Button variant='contained' onClick={create}>
                  Create
                </Button>
              </Grid>
            </>
          )}
        </Grid>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
          <DialogTitle>Selected Location</DialogTitle>
          <DialogContent>
            {selectedPlace && (
              <div style={{ height: '400px', width: '100%' }}>
                <GoogleMap
                  mapContainerStyle={{ height: '100%', width: '100%' }}
                  center={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                  zoom={15}
                  onLoad={onMapLoad}
                >
                  {selectedPlace && (
                    <Marker
                      position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                      draggable={true}
                      onDragEnd={handleMarkerDrag}
                    />
                  )}
                </GoogleMap>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </LoadScript>
    </div>
  )
}

export default CreateAddress
