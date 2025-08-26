import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { Box, styled, useTheme } from '@mui/system'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Paper from '@mui/material/Paper'

const MySwal = withReactContent(Swal)

import themeConfig from 'src/configs/themeConfig'

const backendUrl = themeConfig.backendUrl

let intervalId

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const QuoteTotal = ({
  deliveryCharge,
  finaltotal,
  discount,
  finalTax,
  quotation,
  quoteId,
  orderId,
  fetchPaymentStatus,
  isPaymentSuccessful
}) => {
  const theme = useTheme()

  const [isCashOnDeliveryEnabled, setIsCashOnDeliveryEnabled] = useState(true)

  const Tax = (quotation * finalTax) / 100

  const roundedTax = Number(Tax.toFixed(2))

  const handleConfirmCodPayment = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you want to confirm the COD payment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        // Proceed with the COD payment confirmation
        try {
          axios
            .post(`${backendUrl}/api/payment/add-codTransaction`, { orderId, quoteId })
            .then(res => {
              if (res.data.error) {
                MySwal.fire('Not Done!', `${res.data.message}`)
                fetchPaymentStatus()
                MySwal.fire('Confirmed!', 'The COD payment has been confirmed.', 'success')
              } else {
                MySwal.fire('Confirmed!', 'The COD payment has been confirmed.', 'success')
              }
            })
            .catch(error => {
              console.log('Error occurred during COD confirmation', error)
              MySwal.fire('Error!', 'There was an issue confirming the payment. Please try again later.', 'error')
            })
        } catch (error) {
          console.error('Error posting COD status:', error)
          MySwal.fire('Error!', 'There was an issue confirming the payment. Please try again later.', 'error')
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire('Cancelled', 'The COD payment confirmation was cancelled.', 'error')
      }
    })
  }

  useEffect(() => {
    // Simulated fetch from the database
    // Replace this with your actual fetch logic
    const fetchData = async () => {
      if (!quoteId) return

      console.log('inside quote total for users')

      try {
        axios
          .post(`${backendUrl}/api/quotes/checkcod`, { quoteId })
          .then(res => {
            if (res.data.data.cod == 0) {
              setIsCashOnDeliveryEnabled(false)
            } else {
              setIsCashOnDeliveryEnabled(true)
            }
          })
          .catch(error => {
            console.log(error)
          })

        // Update state based on fetched data
      } catch (error) {
        console.error('Error fetching COD status:', error)
      }
    }

    // Call fetchData function
    fetchData()
  }, [quoteId])

  useEffect(() => {
    // Simulated fetch from the database
    // Replace this with your actual fetch logic
    const fetchData = async () => {
      if (!quoteId) return

      try {
        axios
          .post(`${backendUrl}/api/quotes/checkcod`, { quoteId })
          .then(res => {
            if (res.data.data == 0) {
              setIsCashOnDeliveryEnabled(false)
            } else {
              setIsCashOnDeliveryEnabled(false)
            }
          })
          .catch(error => {
            console.log('inside error')
            console.log(error)
          })

        // Update state based on fetched data
      } catch (error) {
        console.error('Error fetching COD status:', error)
      }
    }

    // Call fetchData function
    fetchData()
  }, [quoteId])

  useEffect(() => {
    fetchPaymentStatus()
  }, [orderId])

  useEffect(() => {
    return () => {
      clearInterval(intervalId)
    }
  }, [fetchPaymentStatus])

  // Handle component unmount to clear the interval

  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Grid container>
        <Grid item xs={12} sm={12}>
          <Card>
            {/*  */}
            <Typography variant='h5' sx={{ ml: 5, mt: 5, fontWeight: 500, color: 'text.secondary' }}>
              Quotation Total
            </Typography>

            <CardContent>
              <Grid container display={'flex'} justifyContent={isPaymentSuccessful ? 'end' : 'end'}>
                {/* <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    mb: { sm: 4, xs: 4 },
                    order: { sm: 1, xs: 2 },
                    display: isPaymentSuccessful ? 'none' : 'block'
                  }}
                >
                  <Typography variant='h6' sx={{ color: 'text.primary', mb: 2, textAlign: 'center' }}>
                    Have you received the COD payment?
                  </Typography>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleConfirmCodPayment}
                    sx={{
                      textTransform: 'none',
                      width: '100%',
                      fontWeight: 'bold'
                    }}
                  >
                    Confirm Payment
                  </Button>
                </Grid> */}
                <Grid item xs={12} sm={5} lg={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
                  <CalcWrapper>
                    <Typography sx={{ color: 'text.secondary' }}>Subtotal :</Typography>
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {`${process.env.CURRENCY} ${quotation ? quotation : '0'}`}
                    </Typography>
                  </CalcWrapper>
                  <CalcWrapper>
                    <Typography sx={{ color: 'text.secondary' }}>Discount :</Typography>
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {` ${discount ? '-' + process.env.CURRENCY + discount : '0'}`}
                    </Typography>
                  </CalcWrapper>
                  <CalcWrapper sx={{ mb: '0 !important' }}>
                    <Typography sx={{ color: 'text.secondary' }}>Tax {`(${finalTax ? finalTax : '0'}`}%) :</Typography>
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {/* {`${finalTax ? finalTax : '0'}%`} */}
                      {` +${finalTax ? process.env.CURRENCY + roundedTax : '0'}    `}
                    </Typography>
                  </CalcWrapper>
                  <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
                  <CalcWrapper>
                    <Typography sx={{ color: 'text.secondary' }}>Total:</Typography>

                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {`${process.env.CURRENCY} ${finaltotal ? finaltotal : '0'}`}
                    </Typography>
                  </CalcWrapper>
                  <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
                  {deliveryCharge && (
                    <CalcWrapper>
                      <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>Delivery Charge:</Typography>

                      <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>
                        {`+ ${process.env.CURRENCY} ${deliveryCharge ? `${deliveryCharge}` : 'Not available'}`}
                      </Typography>
                    </CalcWrapper>
                  )}
                  {deliveryCharge && (
                    <CalcWrapper>
                      <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>Final Total will be:</Typography>

                      <Typography sx={{ fontWeight: 800, color: 'text.secondary' }}>
                        {`${process.env.CURRENCY} ${(
                          parseFloat(finaltotal || '0') + parseFloat(deliveryCharge || '0')
                        ).toFixed(2)}`}
                      </Typography>
                    </CalcWrapper>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default QuoteTotal
