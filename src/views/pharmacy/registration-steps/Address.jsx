import React, { useEffect, useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Table
} from '@mui/material'
import { Box } from '@mui/system'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useSelector, useDispatch } from 'react-redux'
import { setRegistrationData } from 'src/store/apps/pharmacy'
import toast from 'react-hot-toast'

const LocationSearch = () => {
  const [open, setOpen] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [location, setLocation] = useState({ address_components: [] })
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)

  const searchInputRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const autocompleteRef = useRef(null)
  const placeAutocompleteRef = useRef(null)

  const dispatch = useDispatch()
  const data = useSelector(state => state.pharmacy.registrationData)

  const defaultCenter = {
    lat: data.lat || 17.4152,
    lng: data.lng || 78.4859
  }

  // 1. Ensure libraries load
  useEffect(() => {
    let id

    const check = () => {
      if (window.google && window.google.maps && window.google.maps.importLibrary) {
        setIsGoogleLoaded(true)
        clearInterval(id)
      }
    }
    id = setInterval(check, 100)

    return () => clearInterval(id)
  }, [])

  const loadPlaces = async () => {
    const [{ AdvancedMarkerElement }] = await Promise.all([google.maps.importLibrary('places')])
  }

  // 2. Autocomplete setup
  useEffect(() => {
    pcHelper()
  }, [isGoogleLoaded, defaultCenter])

  const pcHelper = async () => {
    if (!isGoogleLoaded || autocompleteRef.current) return

    await loadPlaces()

    const pc = new window.google.maps.places.PlaceAutocompleteElement({
      locationBias: defaultCenter,
      includedRegionCodes: ['in']
    })
    autocompleteRef.current = pc
    placeAutocompleteRef.current = pc
    pc.style.width = '100%'
    pc.style.height = '56px'
    pc.style.fontSize = '16px'

    const container = searchInputRef.current.closest('.MuiFormControl-root')
    if (container) {
      const wrap = document.createElement('div')
      wrap.style.position = 'relative'
      wrap.style.width = '100%'
      wrap.style.marginBottom = '8px'
      container.parentNode.insertBefore(wrap, container)
      wrap.appendChild(pc)
      container.style.display = 'none'
    }

    pc.addEventListener('gmp-select', async ({ placePrediction }) => {
      const place = placePrediction.toPlace()
      await place.fetchFields({
        fields: ['formattedAddress', 'location', 'addressComponents']
      })

      const coords = {
        lat: place.location.lat(),
        lng: place.location.lng()
      }
      setSelectedPlace(coords)

      new window.google.maps.Geocoder().geocode({ location: coords }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setLocation(results[0])
        }
      })

      const inp = pc.querySelector('input')
      if (inp) inp.value = place.formattedAddress
      setOpen(true)
    })
  }

  // 3. Map + marker setup when dialog opens
  useEffect(() => {
    if (!open || !isGoogleLoaded || !selectedPlace) return

    let map, marker

    const run = async () => {
      const { Map } = await window.google.maps.importLibrary('maps')
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker')

      map = new Map(mapRef.current, {
        center: selectedPlace,
        zoom: 15,
        mapId: '4504f8b37365c3d0',
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
      })

      marker = new AdvancedMarkerElement({
        map,
        position: selectedPlace,
        gmpDraggable: true,
        title: 'Selected Location'
      })
      markerRef.current = marker

      map.addListener('click', ev => {
        const pos = { lat: ev.latLng.lat(), lng: ev.latLng.lng() }
        marker.position = pos
        setSelectedPlace(pos)
        new window.google.maps.Geocoder().geocode({ location: pos }, (r, s) => {
          if (s === 'OK' && r[0]) setLocation(r[0])
        })
      })

      marker.addListener('dragend', () => {
        const pos = marker.position
        setSelectedPlace(pos)
        new window.google.maps.Geocoder().geocode({ location: pos }, (r, s) => {
          if (s === 'OK' && r[0]) setLocation(r[0])
        })
      })
    }
    run()

    return () => {
      if (marker) marker.map = null
      map = null
    }
  }, [open, isGoogleLoaded])

  const handleSelectLocation = () => {
    if (!selectedPlace || !location.formatted_address) return

    dispatch(
      setRegistrationData({
        ...data,
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
        address: location.formatted_address
      })
    )
    toast.success('Location selected successfully')
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            inputRef={searchInputRef}
            fullWidth
            label='Address'
            placeholder='Search and select address...'
            autoComplete='off'
            sx={{ display: isGoogleLoaded ? 'none' : 'block' }}
          />
          <Typography>
            <strong>Selected Address:</strong> {location.formatted_address}
          </Typography>
        </Grid>

        {location.address_components.length > 0 && (
          <Grid item xs={12} lg={6}>
            <Typography variant='h6'>Address Components</Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  {location.address_components.map((comp, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{comp.types.filter(t => t !== 'political').join(', ')}</TableCell>
                      <TableCell>{comp.long_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}

        <Grid item xs={12} mb={2}>
          <CustomTextField
            fullWidth
            label='LandMark'
            placeholder='enter landMark...'
            value={data.landmark || ''}
            onChange={e => dispatch(setRegistrationData({ ...data, landmark: e.target.value }))}
          />
        </Grid>

        {location.formatted_address && (
          <Grid item xs={12}>
            <TextField fullWidth disabled multiline value={location.formatted_address} label='Full Address' />
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>Select Location</DialogTitle>
        <DialogContent>
          <Typography mb={4}>Click on the map or drag the marker to set precise location</Typography>
          <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </Box>
          <Typography mt={4}>
            <strong>Selected Address:</strong> {location.formatted_address}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='secondary'>
            Cancel
          </Button>
          <Button
            onClick={handleSelectLocation}
            color='primary'
            variant='contained'
            disabled={!selectedPlace || !location.formatted_address}
          >
            Select Location
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default LocationSearch
