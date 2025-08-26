// ** Custom Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Box, Container } from '@mui/system'
import { Card, CircularProgress, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useEffect, useState } from 'react'
import themeConfig from 'src/configs/themeConfig'

import TableBasic from '../../../components/BasicTableForQuotesForUser'
import TableBasicForTransactions from '../../../components/TransactionsTableForOrderTablerForUser'
import PharmacyAnduserDetail from 'src/components/PharmacyAnduserDetail'
import PrescriptionImage from 'src/components/PrescriptionImage'
import QuoteTotal from 'src/components/QuoteTotalForUser'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const WizardExamples = () => {
  const router = useRouter()

  const { orderId_, jwttoken } = router.query

  const [error, setError] = useState('')
  const [quoteId, setQuoteId] = useState('')
  const [orderId, setOrderId] = useState('')
  const [quotation, setQuotation] = useState('')
  const [discount, setDiscount] = useState('')
  const [finaltotal, setFinalTotal] = useState('')
  const [deliveryCharge, setDeliveryCharge] = useState('')
  const [finalTax, setFinalTax] = useState('')
  const [pharmacyData, setPharmacyData] = useState([])
  const [userData, setUserData] = useState([])
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false)
  const [transaction, setTransactionData] = useState([])

  const [data, setData] = useState([])

  const backendUrl = themeConfig.backendUrl

  useEffect(() => {
    if (!router.isReady) return

    const fetchData = async () => {
      if (orderId_ && jwttoken) {
        try {
          console.log('inside oderId page')
          const response = await axios.get(`${backendUrl}/api/order/${orderId_}?jwttoken=${jwttoken}`)

          const data = response.data.decodedData

          console.log(data)

          setQuoteId(data.quote_id)
          setUserData(data.userData)
          setFinalTotal(Number(data.finalTotal))
          setDeliveryCharge(data.deliveryCharge)
          setQuotation(data.finalQuotation)
          setDiscount(data.totalDiscount)
          setFinalTax(data.finalTax)
          setOrderId(data.order_id)
          setPharmacyData(data.pharmacyData)
        } catch (error) {
          setError(error.response)
        }
      } else {
        console.error('orderId_ or jwttoken is undefined')
      }
    }

    fetchData() // Call the fetchData function
  }, [router.isReady])

  async function fetchData() {
    if (quoteId) {
      try {
        const response = await axios.post(`${backendUrl}/api/quotes/getquotes`, { quoteId })
        const result = await response.data.data
        setData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }

  useEffect(() => {
    if (!quoteId) return

    const fetchData = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/quotes/getquotesfromid`, { quoteId })
        console.log('getquotesfromid')
        console.log(response.data.data[0])
        setDiscount(response.data.data[0].qoute_discount)
        setFinalTax(response.data.data[0].tax)
        setQuotation(response.data.data[0].qoute_total)

        // setRazorpayId(response.data.data)
      } catch (error) {
        console.error('Error getting razorpay id:', error)
      }
    }

    fetchData()
  }, [quoteId])

  async function fetchPaymentStatus() {
    try {
      const response = await axios.post(`${backendUrl}/api/transactions/listing`, { orderId, type: 'customer_payment' })
      let result = await response.data.data
      console.log('inside fetchpaymentstatus()')
      console.log(result)
      setTransactionData(result)

      result.map(transaction => {
        if (transaction.status == 'captured') {
          setIsPaymentSuccessful(true)
        }
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [quoteId, orderId])

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
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box component={'img'} src='/images/logos/logo.png' maxHeight={'80px'}></Box>
              <Box sx={{ marginRight: '20px' }}>
                <Typography gutterBottom variant='h5' component='div' sx={{ marginTop: '25px' }}>
                  {`Welcome to Medsers Order Page`}
                </Typography>
              </Box>
              <Box sx={{ marginRight: '20px' }}>
                <Typography gutterBottom variant='h5' component='div' sx={{ marginTop: '25px' }}>
                  {`Order ID : ${orderId}`}
                </Typography>
              </Box>
            </Box>
          </Card>
          <DatePickerWrapper sx={{ marginTop: '20px' }}>
            <PharmacyAnduserDetail pharmacyData={pharmacyData} userData={userData} />
            <PrescriptionImage orderId={orderId} />
            <TableBasic data={data} />
            <QuoteTotal
              deliveryCharge={deliveryCharge}
              finaltotal={finaltotal}
              quoteId={quoteId}
              finalTax={finalTax}
              discount={discount}
              quotation={quotation}
              pharmacyData={pharmacyData}
              orderId={orderId}
              userData={userData}
              transaction={transaction}
              isPaymentSuccessful={isPaymentSuccessful}
              fetchPaymentStatus={fetchPaymentStatus}
            />
            <TableBasicForTransactions transaction={transaction} />
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
