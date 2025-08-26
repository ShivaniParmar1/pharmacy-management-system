// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import MuiStep from '@mui/material/Step'
import MuiStepper from '@mui/material/Stepper'
import CardContent from '@mui/material/CardContent'
import { resetRegistrationData } from 'src/store/apps/pharmacy'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Step Components
import PharmacyDetails from './registration-steps/PharmacyDetails'
import General from './registration-steps/General'
import AddressDetails from './registration-steps/Address'
import Review from './registration-steps/Review'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import StepReview from 'src/views/pages/wizard-examples/create-deal/StepReview'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import api from 'src/interceptors/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

const steps = [
  {
    title: 'General Details',
    icon: 'tabler:users',
    subtitle: 'Enter General details.'
  },
  {
    icon: 'tabler:id',
    title: 'Pharmacy Details',
    subtitle: 'Provide Pharmacy Details'
  },
  {
    title: 'Pharmacy Address',
    icon: 'ion:location',
    subtitle: 'Enter Pharmacy Location Details'
  },
  {
    icon: 'tabler:checkbox',
    subtitle: 'Launch a deal',
    title: 'Upload & Review'
  }
]

const Stepper = styled(MuiStepper)(({ theme }) => ({
  height: '100%',
  minWidth: '15rem',
  '& .MuiStep-root:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(5)
  },
  [theme.breakpoints.down('md')]: {
    minWidth: 0
  }
}))

const StepperHeaderContainer = styled(CardContent)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const Step = styled(MuiStep)(({ theme }) => ({
  '& .MuiStepLabel-root': {
    paddingTop: 0
  },
  '&:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(6)
  },
  '&:last-of-type .MuiStepLabel-root': {
    paddingBottom: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`
  },
  '& + svg': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled
  },
  '& .MuiStepLabel-label': {
    cursor: 'pointer'
  }
}))

const Registration = () => {
  // ** States
  const RegistrationData = useSelector(state => state.pharmacy).registrationData

  const [activeStep, setActiveStep] = useState(0)
  const dispatch = useDispatch()

  // ** Hook
  const theme = useTheme()

  // Function to validate email format
  const isValidEmail = email => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
  }

  // Function to validate phone number format
  const isValidPhoneNumber = phoneNumber => {
    // Regular expression to validate phone number format
    const phoneRegex = /^\d{10}$/

    return phoneRegex.test(phoneNumber)
  }

  const handleNext = () => {
    let isValidStep = true
    if (activeStep === 0) {
      isValidStep = validateDataForStep(0, {
        pharmacy_name: 'Please enter your pharmacy name.',
        owner_name: 'Please enter the owner name.'
      })
    } else if (activeStep === 1) {
      isValidStep = validateDataForStep(1, {
        email: 'Please enter your email.',
        password: 'Please enter your password.',
        license_no: 'Please enter license number.',
        registration_date: 'Please select the registration date.',
        whatsapp_no: 'Please enter your phone number.',
        bank_account_number: 'Please enter the bank account number.',
        bank_ifsc: 'Please enter the bank IFSC code.'
      })
    } else if (activeStep === 2) {
      isValidStep = validateDataForStep(2, {
        lat: 'Please enter your address',
        lng: 'Please enter your address'
      })
    }

    if (isValidStep) {
      setActiveStep(activeStep + 1)
    }
  }

  const validateDataForStep = (step, validations) => {
    let isValid = true

    const errorMessages = Object.keys(validations).reduce((errors, key) => {
      if (!RegistrationData[key]) {
        errors.push(validations[key])
        isValid = false
      } else if (key === 'email' && !isValidEmail(RegistrationData.email)) {
        errors.push('Please enter a valid email address.')
        isValid = false
      } else if (key === 'whatsapp_no' && !isValidPhoneNumber(RegistrationData.whatsapp_no)) {
        errors.push('Please enter a valid phone number.')
        isValid = false
      } else if (key === 'lat' && !RegistrationData.lat) {
        errors.push(validations[key])
        isValid = false
      } else if (key === 'lng' && !RegistrationData.lng) {
        errors.push(validations[key])
        isValid = false
      }

      return errors
    }, [])

    if (!isValid) {
      errorMessages.forEach(message => toast.error(message))
    }

    return isValid
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return <General />
      case 1:
        return <PharmacyDetails />
      case 2:
        return <AddressDetails />
      case 3:
        return <Review />
      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }
  const router = useRouter()

  const handleSubmit = e => {
    api.post('/api/pharmacy/register', RegistrationData).then(res => {
      if (res.data.error) {
        return toast.error(res.data.message)
      }
      router.push('/login')
      dispatch(resetRegistrationData())

      return toast.success(res.data.message)
    })
  }

  const renderFooter = () => {
    const stepCondition = activeStep === steps.length - 1

    return (
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant='tonal'
          color='secondary'
          onClick={handlePrev}
          disabled={activeStep === 0}
          startIcon={<Icon icon={theme.direction === 'ltr' ? 'tabler:arrow-left' : 'tabler:arrow-right'} />}
        >
          Previous
        </Button>

        <Button
          variant='contained'
          color={stepCondition ? 'success' : 'primary'}
          onClick={e => (stepCondition ? handleSubmit(e) : handleNext())}
          endIcon={
            <Icon
              icon={
                stepCondition ? 'tabler:check' : theme.direction === 'ltr' ? 'tabler:arrow-right' : 'tabler:arrow-left'
              }
            />
          }
        >
          {stepCondition ? 'Submit' : 'Next'}
        </Button>
      </Box>
    )
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <StepperHeaderContainer>
        <StepperWrapper sx={{ height: '100%' }}>
          <Stepper
            connector={<></>}
            orientation='vertical'
            activeStep={activeStep}
            sx={{ height: '100%', minWidth: '15rem' }}
          >
            {steps.map((step, index) => {
              const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

              return (
                <Step
                  key={index}
                  onClick={() => setActiveStep(index)}
                  sx={{ '&.Mui-completed + svg': { color: 'primary.main' } }}
                >
                  <StepLabel>
                    <div className='step-label'>
                      <RenderAvatar
                        variant='rounded'
                        {...(activeStep >= index && { skin: 'light' })}
                        {...(activeStep === index && { skin: 'filled' })}
                        {...(activeStep >= index && { color: 'primary' })}
                        sx={{
                          ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                          ...(activeStep > index && { color: theme => hexToRGBA(theme.palette.primary.main, 0.4) })
                        }}
                      >
                        <Icon icon={step.icon} fontSize='1.5rem' />
                      </RenderAvatar>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </StepperHeaderContainer>
      <CardContent sx={{ pt: theme => `${theme.spacing(6)} !important`, width: '100%' }}>
        {renderContent()}
        {renderFooter()}
      </CardContent>
    </Card>
  )
}

export default Registration
