import React, { useEffect, useState } from 'react'
import { Button, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useSelector, useDispatch } from 'react-redux'
import CreateAddress from './CreateAddress'
import EditAddress from './EditAddress'
import CustomRadioIcons from 'src/@core/components/custom-radio/icons'
import customerApi from 'src/interceptors/customer'
import toast from 'react-hot-toast'

const LocationSearch = ({ setActionButtons }) => {
  const [type, setType] = useState('address')
  const data = useSelector(state => state.customer)

  const Switcher = () => {
    return (
      <div>
        {type !== 'create' && type !== 'edit' && (
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button variant='contained' size='sm' onClick={() => setType('create')}>
              Create
            </Button>
          </Box>
        )}
        {type !== 'address' && (
          <Box sx={{ display: 'flex', justifyContent: 'start' }}>
            <Button variant='contained' size='sm' onClick={() => setType('address')}>
              Back
            </Button>
          </Box>
        )}
      </div>
    )
  }

  const Edit = () => {
    return (
      <a
        href='#'
        onClick={e => {
          e.preventDefault()
          setType('edit')
        }}
      >
        Edit
      </a>
    )
  }
  const [selectedAddress, setSelectedAddress] = useState('1')
  const [address, setAddress] = useState(null)

  const fetchAddress = () => {
    customerApi.post('/api/customer/address/listing', { number: data.number }).then(res => {
      console.log(res.data)
      if (res.data.error) {
        return toast.error(res.data.error)
      }
      setAddress(res.data.data.rows)
    })
  }

  const AddressSelect = () => {
    useEffect(() => {
      if (address == null) {
        fetchAddress()
      }
    }, [])

    return (
      <Grid container spacing={6}>
        <Grid item xs={12} sm={12}>
          <Typography variant='h4'>Select Address</Typography>
        </Grid>
        {address != null &&
          address.map((val, index) => {
            return (
              <Grid item xs={12} sm={6} key={index}>
                <CustomRadioIcons
                  selected={selectedAddress}
                  handleChange={e => setSelectedAddress(e)}
                  Footer={Edit}
                  data={{
                    title: val.title,
                    value: `${val.id}`,
                    content: (
                      <>
                        <Typography variant='p'>{val.address}</Typography>
                      </>
                    )
                  }}
                />
              </Grid>
            )
          })}
      </Grid>
    )
  }
  useEffect(() => {
    if (type !== 'address') {
      setActionButtons(false)
    } else {
      setActionButtons(true)
    }
  }, [setActionButtons, type])

  return (
    <>
      <Switcher />
      {type === 'create' && <CreateAddress setType={setType} fetchAddress={fetchAddress} />}
      {type === 'edit' && <EditAddress setType={setType} />}
      {type === 'address' && <AddressSelect setType={setType} />}
    </>
  )
}

export default LocationSearch
