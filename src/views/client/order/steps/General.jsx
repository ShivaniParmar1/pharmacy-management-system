// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useSelector, useDispatch } from 'react-redux'
import { setRegistrationData } from 'src/store/apps/pharmacy'

// ** Custom Components Imports

const ImgWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 4, 0, 4)
  },
  [theme.breakpoints.up('sm')]: {
    height: 250,
    padding: theme.spacing(5, 5, 0, 5)
  },
  '& img': {
    height: 'auto',
    maxWidth: '100%'
  }
}))

const GeneralDetails = ({ firstTime, setActiveStep, loginStatus, ...props }) => {
  // ** States
  useEffect(() => {
    if (loginStatus) {
      setActiveStep(1)
    }
  }, [loginStatus])

  // ** Hook
  const theme = useTheme()
  const dispatch = useDispatch()
  const data = useSelector(state => state.pharmacy).registrationData

  return (
    <>
      <Grid container sx={{ mb: 6 }} spacing={4}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <ImgWrapper>
            <img width={650} alt='illustration' src={`/images/pages/create-deal-type-${theme.palette.mode}.png`} />
          </ImgWrapper>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        {firstTime && (
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              type='text'
              label='Enter your Full Name'
              value={props.loginData.full_name}
              onChange={e => props.setLoginData({ ...props.loginData, full_name: e.target.value })}
              placeholder='Enter Full Name'
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            type='text'
            label='Enter OTP sent to your number'
            placeholder='Enter OTP'
            value={props.loginData.otp}
            onChange={e => props.setLoginData({ ...props.loginData, otp: e.target.value })}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default GeneralDetails
