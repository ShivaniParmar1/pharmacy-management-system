// ** Custom Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Box, Container } from '@mui/system'
import { Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import Order from 'src/views/client/order/Order'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useEffect, useState } from 'react'
import themeConfig from 'src/configs/themeConfig'

import FormValidationBasic from '../../../components/FormValdidationforQuotes'
import TableBasic from '../../../components/BasicTableForQuotes'
import PharmacyAnduserDetail from 'src/components/PharmacyAnduserDetail'
import PrescriptionImage from 'src/components/PrescriptionImage'
import QuoteTotal from 'src/components/QuoteTotal'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from 'react-hot-toast'

const MySwal = withReactContent(Swal)

const WizardExamples = () => {
  const router = useRouter()

  const { pharmacyId, jwttoken } = router.query

  const [error, setError] = useState('')
  const [quoteId, setQuoteId] = useState('')
  const [orderId, setOrderId] = useState('')
  const [quotation, setQuotation] = useState('')
  const [discount, setDiscount] = useState('')
  const [finaltotal, setFinalTotal] = useState('')
  const [finalTax, setFinalTax] = useState('')
  const [pharmacyData, setPharmacyData] = useState([])
  const [userData, setUserData] = useState([])
  const [deliveryCharge, setDeliveryCharge] = useState(null)

  const [data, setData] = useState([])

  const backendUrl = themeConfig.backendUrl

  useEffect(() => {
    if (!router.isReady) return

    const fetchData = async () => {
      // Check if both pharmacyId and jwttoken are defined
      if (pharmacyId && jwttoken) {
        try {
          const response = await axios.get(`${backendUrl}/api/quotes/${pharmacyId}?jwttoken=${jwttoken}`)
          const data = response.data

          setQuoteId(data.quoteId)
          setOrderId(data.orderId)
          setDeliveryCharge(data.delivery_charge)
        } catch (error) {
          setError(error.response)
        }
      } else {
        console.error('pharmacyId or jwttoken is undefined')
      }
    }

    fetchData() // Call the fetchData function
  }, [router.isReady])

  async function fetchPharmacyData() {
    if (pharmacyId) {
      try {
        const response = await axios.post(`${backendUrl}/api/quotes/getpharmacyinfo`, { pharmacyId })
        const result = await response.data.data
        setPharmacyData(result) // Uncomment this line to update the state
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }

  async function fetchDataForTotal() {
    if (quoteId) {
      try {
        const response = await axios.post(`${backendUrl}/api/quotes/getquotesfromid`, { quoteId })
        const result = await response.data.data[0]

        setFinalTotal(result.final_total)
        setQuotation(result.qoute_total)
        setDiscount(result.qoute_discount)
        setFinalTax(result.tax)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }

  async function fetchData() {
    if (quoteId) {
      try {
        const response = await axios.post(`${backendUrl}/api/quotes/getquotes`, { quoteId })
        const result = await response.data.data
        setData(result)
        fetchDataForTotal()
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }

  async function fetchUserData() {
    if (orderId) {
      try {
        const response = await axios.post(`${backendUrl}/api/quotes/userdata`, { orderId })
        const result = await response.data.data[0]
        setUserData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }

  async function fetchDeliveryCharge() {
    try {
      if (orderId) {
        const response = await axios.post(`${backendUrl}/api/quotes/getDeliveryCharge`, {
          orderId,
          pharmacyId,
          taking_amount: finaltotal || '0'
        })
        const result = (await response?.data?.data) || { is_available: false, delivery_charge: 0 }

        setDeliveryCharge(result?.delivery_charge || 0)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (!router.isReady) {
      return
    } else {
      fetchDeliveryCharge()
    }
  }, [router.isReady, finaltotal])

  useEffect(() => {
    fetchData()

    fetchPharmacyData()
    fetchUserData()
  }, [pharmacyId, quoteId, orderId])

  const handleSubmit = id => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `You won't be able to make changes after the quote is submitted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit!'
    }).then(result => {
      if (result.isConfirmed) {
        // Show loading swal
        MySwal.fire({
          title: 'Submitting...',
          allowOutsideClick: false,
          didOpen: () => {
            MySwal.showLoading()
          }
        })

        axios
          .post(`${backendUrl}/api/quotes/finalsubmit`, {
            id: id,
            finaltotal: finaltotal,
            orderId: orderId,
            userData: userData,
            pharmacyData: pharmacyData,
            deliveryCharge: deliveryCharge
          })
          .then(res => {
            if (res.data.error) {
              MySwal.close() // Close loader

              return toast.error(res.data.message)
            }

            router.push('/')
            MySwal.fire({
              icon: 'success',
              title: 'Submitted!',
              text: 'Submitted Successfully!'
            })
          })
          .catch(error => {
            MySwal.close() // Close loader
            toast.error('Something went wrong. Please try again.')
          })
      }
    })
  }

  if (jwttoken === undefined) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh' // Set minimum height to fill the entire viewport
        }}
      >
        <CircularProgress />
      </Box>
    ) // or you can return a loading indicator or other content
  }

  return (
    <>
      {!error ? (
        <Container sx={{ marginTop: '20px' }}>
          <Card>
            <Box display={'flex'} justifyContent={'space-between'} alignItems='center'>
              <Box
                component={'img'}
                src='/images/logos/logo.png'
                maxHeight={{ xs: '60px', md: '80px' }}
                sx={{ alignItems: 'center', display: 'block' }} // Add display: 'block' here
              />
              <Box
                marginLeft={{ xs: '0', md: '20px' }}
                marginRight={{ xs: '0', md: '20px' }}
                marginTop={{ xs: '15px', md: '0' }}
                sx={{ textAlign: { xs: 'center', md: 'left' } }}
              >
                <Typography gutterBottom variant='h5' component='div' sx={{ fontSize: { xs: '0.8rem', lg: '1.2rem' } }}>
                  {`Welcome to Medsers Quotation Page`}
                </Typography>
              </Box>

              <Box
                marginLeft={{ xs: '0', md: '20px' }}
                marginRight={{ xs: '0', md: '20px' }}
                marginTop={{ xs: '15px', md: '0' }}
                sx={{ textAlign: { xs: 'center', md: 'left' } }}
              >
                <Typography gutterBottom variant='h5' component='div' sx={{ fontSize: { xs: '0.8rem', lg: '1.2rem' } }}>
                  {`Order ID : ${orderId}`}
                </Typography>
              </Box>
            </Box>
          </Card>
          <DatePickerWrapper sx={{ marginTop: '20px' }}>
            <PharmacyAnduserDetail pharmacyData={pharmacyData} userData={userData} />
            <PrescriptionImage orderId={orderId} />
            <FormValidationBasic fetchData={fetchData} quoteId={quoteId} />
            <TableBasic fetchData={fetchData} data={data} />
            <QuoteTotal
              fetchData={fetchData}
              finaltotal={finaltotal}
              quoteId={quoteId}
              finalTax={finalTax}
              discount={discount}
              quotation={quotation}
              deliveryCharge={deliveryCharge}
            />
            <Box sx={{ textAlign: 'center' }}>
              <Button
                onClick={e => {
                  if (deliveryCharge) {
                    handleSubmit(quoteId)
                  } else {
                    toast.error('Delivery not Available at your location !')
                  }
                }}
                sx={{ marginBottom: '20px' }}
                variant='contained'
              >
                Send Quotation
              </Button>
            </Box>
          </DatePickerWrapper>
        </Container>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh' // Set minimum height to fill the entire viewport
          }}
        >
          <Typography>{error.data.error}</Typography>
        </Box>
      )}
    </>
  )
}

WizardExamples.getLayout = page => <BlankLayout>{page}</BlankLayout>
WizardExamples.authGuard = false

export default WizardExamples
