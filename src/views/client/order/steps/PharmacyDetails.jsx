// ** React Imports
import { useState, forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import format from 'date-fns/format'
import { styled } from '@mui/material/styles'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { Divider, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { setRegistrationData } from 'src/store/apps/pharmacy'

// ** Custom Components Imports

const CustomInput = forwardRef((props, ref) => {
  console.log(props)
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const value = `${startDate}`

  return <CustomTextField fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
})

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const PharmacyDetails = () => {
  // ** Hook
  const [startDate, setStartDate] = useState(null)
  const dispatch = useDispatch()
  const data = useSelector(state => state.pharmacy).registrationData

  const handleDateChange = dates => {
    setStartDate(dates)
    dispatch(setRegistrationData({ ...data, registration_date: dates }))
  }

  return (
    <>
      <Typography variant='h4'>Pharmacy Details</Typography>
      <Divider sx={{ mb: 5, mt: 1 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='Authorized Email Address.'
            value={data.email}
            onChange={e => {
              dispatch(setRegistrationData({ ...data, email: e.target.value }))
            }}
            placeholder='Enter Authorized Email Address.'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            value={data.license_no}
            onChange={e => {
              dispatch(setRegistrationData({ ...data, license_no: e.target.value }))
            }}
            fullWidth
            label='Licence No.'
            placeholder='Enter Licence No.'
            type='email'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            selectsRange={false}
            value={data.registration_date}
            id='date-range-picker'
            onChange={handleDateChange}
            shouldCloseOnSelect={true}
            customInput={<CustomInput label='Pharmacy Established Date' start={startDate} />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            value={data.whatsapp_no}
            onChange={e => {
              dispatch(setRegistrationData({ ...data, whatsapp_no: e.target.value }))
            }}
            label='Whatsapp Business Number'
            placeholder='Whatsapp Business Number'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            value={data.awards}
            onChange={e => {
              dispatch(setRegistrationData({ ...data, awards: e.target.value }))
            }}
            label='Awards and Rewards'
            placeholder='Enter Awards and Rewards'
          />
        </Grid>
      </Grid>
      <Typography sx={{ mt: 5 }} variant='h4'>
        Bank Details
      </Typography>
      <Divider sx={{ mb: 5, mt: 1 }} />
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            value={data.bank_account_number}
            onChange={e => {
              dispatch(setRegistrationData({ ...data, bank_account_number: e.target.value }))
            }}
            label='Account Number'
            placeholder='Enter Account Number.'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            value={data.bank_ifsc}
            onChange={e => {
              dispatch(setRegistrationData({ ...data, bank_ifsc: e.target.value }))
            }}
            label='ISFC Code'
            placeholder='Enter ISFC Code'
            type='email'
          />
        </Grid>
      </Grid>
    </>
  )
}

export default PharmacyDetails
