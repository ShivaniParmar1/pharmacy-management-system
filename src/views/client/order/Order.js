// ** React Imports
import { useEffect, useState } from 'react'

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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Step Components
import General from './steps/General'
import AddressDetails from './steps/Address'
import Review from './steps/Review'
import { useSelector, useDispatch } from 'react-redux'


// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import { useRouter } from 'next/router'
import customerApi from 'src/interceptors/customer'
import toast from 'react-hot-toast'
import { updateAuth } from 'src/store/apps/customer'


const steps = [
  {
    title: 'General Details',
    icon: 'tabler:users',
    subtitle: 'Enter General details.'
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


const Order = () => {
  const dispatch = useDispatch()
  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState({})
  const { orderId } = useRouter().query
  const customerStore = useSelector(state => state.customer)
  const [firstTime, setFirstTime] = useState(false)
  const [loginStatus, setLoginStatus] = useState(false);
  const [loginData, setLoginData] = useState({})
  const [number, setNumber] = useState({})


  const login = (mobile) => {
    console.log(mobile)
    customerApi.post("/api/customer/auth/login", { number: mobile }).then(res => {
      if (res.data.error) {

        return toast.error(res.data.message)
      }

      return toast.success(res.data.message)
    })
  }

  const getToken = () => {
    console.log("test")
    customerApi.post("/api/customer/auth/verify-otp", { number, ...loginData }).then(res => {
      if (res.data.error) {
        return toast.error(res.data.message)
      }
      setActiveStep(1)
      dispatch(updateAuth(res.data.userData))

      return toast.success(res.data.message)


    })
  }

  // ** States
  useEffect(() => {
    if (orderId) {
      customerApi.post("/api/customer/auth/get-order", { order_id: orderId }).then(res => {
        if (res.data.error) {

          return toast.error(res.data.message)
        }
        setNumber(res.data.data.number)
        if (res.data.is_registered !== undefined && res.data.is_registered === true) {

          setFirstTime(false)
        } else {

          setFirstTime(true)
        }

        if (customerStore.number === res.data.data.number) {
          //create an auth me route
        }

        return login(res.data.data.number)

      })
    }
  }, [orderId])


  // ** Hook
  const theme = useTheme()

  // Handle Stepper
  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const [actionButtons, setActionButtons] = useState(true)

  const getStepContent = step => {
    switch (step) {
      case 0:
        return <General {...{ firstTime, setFirstTime, loginData, setActiveStep, loginStatus, setLoginStatus, setLoginData }} />
      case 1:
        return <AddressDetails setActionButtons={setActionButtons} />
      case 2:
        return (
          <Review
            setForm={val => {
              setForm(val)
            }}
          />
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }





  const renderFooter = () => {
    const stepCondition = activeStep === steps.length - 1

    return (
      <>
        {actionButtons && (
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
            {activeStep !== 0 ? (
              <Button
                variant='tonal'
                color='secondary'
                onClick={handlePrev}
                disabled={activeStep === 0}
                startIcon={<Icon icon={theme.direction === 'ltr' ? 'tabler:arrow-left' : 'tabler:arrow-right'} />}
              >
                Previous
              </Button>
            ) : (
              <Box></Box>
            )}
            {!stepCondition && (
              <Button
                variant='contained'
                color={stepCondition ? 'success' : 'primary'}
                onClick={() => {
                  if (activeStep === 0) {
                    return getToken()
                  }

                  return (stepCondition ? alert('Submitted..!!') : handleNext())
                }}
                endIcon={
                  <Icon
                    icon={
                      stepCondition
                        ? 'tabler:check'
                        : theme.direction === 'ltr'
                          ? 'tabler:arrow-right'
                          : 'tabler:arrow-left'
                    }
                  />
                }
              >
                {stepCondition ? 'Submit' : 'Next'}
              </Button>
            )}
          </Box>
        )}
      </>
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

export default Order
