import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Typography
} from '@mui/material'
import { Box, styled, useTheme } from '@mui/system'
import axios from 'axios'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import themeConfig from 'src/configs/themeConfig'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material'

import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const backendUrl = themeConfig.backendUrl

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const defaultValues = {
  quote_discount: '',
  tax: '',
  discountType: 'percentage'
}

const QuoteTotal = ({ finaltotal, discount, finalTax, quotation, quoteId, fetchData, deliveryCharge }) => {
  const theme = useTheme()
  const [showCompareDialog, setShowCompareDialog] = useState(false)
  const [comparisonData, setComparisonData] = useState(null)
  const [isLoadingComparison, setIsLoadingComparison] = useState(false)

  const Tax = (quotation * finalTax) / 100
  const roundedTax = Number(Tax.toFixed(2))

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({ defaultValues })

  const discountType = watch('discountType')

  const onSubmit = async data => {
    data.id = quoteId

    axios
      .post(`${backendUrl}/api/quotes/updatequotesdiscountandtax`, data)
      .then(res => {
        toast.success('Tax and Discount Updated')
        fetchData()
      })
      .catch(error => {
        console.log('inside error')
        console.log(error)
      })
  }

  // ** Function to compare medicines
  const compareMedicines = async () => {
    setIsLoadingComparison(true)
    setShowCompareDialog(true)

    try {
      const response = await axios.get(`${backendUrl}/api/quotes/${quoteId}/compare-medicine`)
      if (response.data.success) {
        setComparisonData(response.data.data)
      } else {
        toast.error('No comparison data available')
        setShowCompareDialog(false)
      }
    } catch (error) {
      console.error('Error comparing medicines:', error)
      toast.error('Failed to compare medicines')
      setShowCompareDialog(false)
    } finally {
      setIsLoadingComparison(false)
    }
  }

  // ** Function to render comparison summary
  const renderComparisonSummary = () => {
    if (!comparisonData) return null

    const { total_items_compared, items_with_differences, current_pharmacy_name } = comparisonData

    return (
      <Alert severity={items_with_differences > 0 ? 'info' : 'success'} sx={{ mb: 3 }}>
        <Typography variant='body1' fontWeight={600} gutterBottom>
          Price Comparison for {current_pharmacy_name}
        </Typography>
        <Typography variant='body2'>
          Compared <strong>{total_items_compared}</strong> medicine(s) and found{' '}
          <strong>{items_with_differences}</strong> with price or discount differences.
        </Typography>
      </Alert>
    )
  }

  // ** Function to calculate price difference
  const getPriceDifference = (currentPrice, comparePrice) => {
    const diff = comparePrice - currentPrice
    if (Math.abs(diff) < 0.01) return { difference: 0, type: 'same' }

    return {
      difference: Math.abs(diff),
      type: diff > 0 ? 'higher' : 'lower',
      percentage: currentPrice > 0 ? ((Math.abs(diff) / currentPrice) * 100).toFixed(1) : '0'
    }
  }

  // ** Function to render individual medicine comparison
  const renderMedicineComparison = (comparison, index) => {
    const currentPharmacy = comparison.all_prices.find(price => price.is_current)
    const otherPharmacies = comparison.all_prices.filter(price => !price.is_current)

    return (
      <Accordion key={index} defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='subtitle1' fontWeight={600}>
            {comparison.medicine_name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper} variant='outlined'>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Pharmacy</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Unit Price</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Quantity</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Before Discount</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Discount</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Final Total</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Price Difference</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Current Pharmacy Row */}
                {currentPharmacy && (
                  <TableRow sx={{ '& td': { fontWeight: 600 } }}>
                    <TableCell>
                      <Box display='flex' alignItems='center' gap={1}>
                        {currentPharmacy.pharmacy_name}
                        <Chip label='Your Pharmacy' color='primary' size='small' />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {process.env.CURRENCY}
                      {currentPharmacy.unit_price.toFixed(2)}
                    </TableCell>
                    <TableCell>{currentPharmacy.quantity}</TableCell>
                    <TableCell>
                      {process.env.CURRENCY}
                      {currentPharmacy.total_before_discount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {currentPharmacy.discount_amount > 0 ? (
                        <Box>
                          <Typography variant='body2'>
                            {currentPharmacy.discount_type === 'percentage'
                              ? `${currentPharmacy.discount_value}%`
                              : `{process.env.CURRENCY}${currentPharmacy.discount_value}`}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            ({process.env.CURRENCY}
                            {currentPharmacy.discount_amount.toFixed(2)})
                          </Typography>
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {process.env.CURRENCY}
                      {currentPharmacy.final_total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip label='Base Price' color='primary' size='small' />
                    </TableCell>
                  </TableRow>
                )}

                {/* Other Pharmacies */}
                {otherPharmacies.map((pharmacy, idx) => {
                  const priceDiff = getPriceDifference(currentPharmacy?.final_total || 0, pharmacy.final_total)

                  return (
                    <TableRow key={idx}>
                      <TableCell>{pharmacy.pharmacy_name}</TableCell>
                      <TableCell
                        sx={{
                          color: pharmacy.unit_price < (currentPharmacy?.unit_price || 0) ? 'red !important' : '',
                          '& *': {
                            color: pharmacy.unit_price < (currentPharmacy?.unit_price || 0) ? 'red !important' : ''
                          }
                        }}
                      >
                        {process.env.CURRENCY}
                        {pharmacy.unit_price.toFixed(2)}
                      </TableCell>
                      <TableCell>{pharmacy.quantity}</TableCell>
                      <TableCell>
                        {process.env.CURRENCY}
                        {pharmacy.total_before_discount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {pharmacy.discount_amount > 0 ? (
                          <Box>
                            <Typography variant='body2'>
                              {pharmacy.discount_type === 'percentage'
                                ? `${pharmacy.discount_value}%`
                                : `${process.env.CURRENCY} ${pharmacy.discount_value}`}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              ({process.env.CURRENCY}
                              {pharmacy.discount_amount.toFixed(2)})
                            </Typography>
                          </Box>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: pharmacy.final_total < (currentPharmacy?.final_total || 0) ? 'red !important' : '',
                          '& *': {
                            color: pharmacy.final_total < (currentPharmacy?.final_total || 0) ? 'red !important' : ''
                          }
                        }}
                      >
                        {process.env.CURRENCY}
                        {pharmacy.final_total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {priceDiff.type === 'same' ? (
                          <Chip label='Same Price' size='small' />
                        ) : priceDiff.type === 'lower' ? (
                          <Chip
                            label={`${process.env.CURRENCY} ${priceDiff.difference.toFixed(2)} cheaper (${
                              priceDiff.percentage
                            }%)`}
                            color='success'
                            size='small'
                          />
                        ) : (
                          <Chip
                            label={`${process.env.CURRENCY} ${priceDiff.difference.toFixed(2)} costlier (${
                              priceDiff.percentage
                            }%)`}
                            color='error'
                            size='small'
                            variant='outlined'
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    )
  }

  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Grid container>
        <Grid item xs={12} sm={12}>
          <Card>
            <Typography variant='h5' sx={{ paddingTop: '20px', paddingLeft: '20px' }}>
              Quotation Total
            </Typography>
            <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
              <Grid container sx={{ minHeight: '100%' }} alignItems='stretch'>
                <Grid
                  item
                  xs={12}
                  sm={7}
                  lg={9}
                  sx={{ order: { sm: 1, xs: 2 }, display: 'flex', flexDirection: 'column' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, flexGrow: 1 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Grid container spacing={5}>
                        <Grid item xs={12} sm={2}>
                          <Controller
                            name='quote_discount'
                            control={control}
                            rules={{
                              required: true,
                              validate: value => {
                                if (discountType === 'percentage' && parseFloat(value) > 100) {
                                  return 'Percentage discount cannot exceed 100%'
                                }

                                return true
                              }
                            }}
                            render={({ field }) => (
                              <CustomTextField
                                fullWidth
                                type='number'
                                value={field.value}
                                label='Quote Discount'
                                onChange={e => {
                                  const inputValue = e.target.value
                                  if (discountType === 'percentage' && parseFloat(inputValue) > 100) {
                                    field.onChange('100')
                                  } else {
                                    field.onChange(inputValue)
                                  }
                                }}
                                inputProps={{
                                  min: 0,
                                  ...(discountType === 'percentage' && { max: 100 })
                                }}
                                placeholder='10'
                                error={Boolean(errors.quote_discount)}
                                aria-describedby='validation-basic-medecine-name'
                                {...(errors.quote_discount && { helperText: 'This field is required' })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2.5}>
                          <Controller
                            name='discountType'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <CustomTextField
                                select
                                fullWidth
                                defaultValue=''
                                label='Discount Type'
                                SelectProps={{
                                  value: value,
                                  onChange: e => {
                                    onChange(e)
                                    setValue('quote_discount', '')
                                  }
                                }}
                                id='validation-basic-select'
                                error={Boolean(errors.select)}
                                aria-describedby='validation-basic-select'
                                {...(errors.select && { helperText: 'This field is required' })}
                              >
                                <MenuItem value='percentage'>Percentage</MenuItem>
                                <MenuItem value='flat'>Flat</MenuItem>
                              </CustomTextField>
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Controller
                            name='tax'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <CustomTextField
                                fullWidth
                                type='number'
                                value={field.value}
                                label='Quote Tax (%)'
                                onChange={e => {
                                  const inputValue = e.target.value
                                  if (parseFloat(inputValue) > 100) {
                                    field.onChange('100')
                                  } else {
                                    field.onChange(inputValue)
                                  }
                                }}
                                placeholder='10%'
                                error={Boolean(errors.tax)}
                                aria-describedby='validation-basic-medecine-name'
                                inputProps={{
                                  min: 0,
                                  max: 100
                                }}
                                {...(errors.tax && { helperText: 'This field is required' })}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={2} sx={{ marginTop: '20px', padding: '0' }}>
                          <Button type='submit' variant='contained'>
                            Update
                          </Button>
                        </Grid>
                      </Grid>
                    </form>

                    <Button
                      variant='contained'
                      color='info'
                      sx={{ maxWidth: 280 }}
                      onClick={compareMedicines}
                      disabled={isLoadingComparison}
                    >
                      {isLoadingComparison ? 'Comparing...' : 'Compare with Other Pharmacies'}
                    </Button>

                    <Dialog
                      open={showCompareDialog}
                      onClose={() => setShowCompareDialog(false)}
                      maxWidth='xl'
                      fullWidth
                    >
                      <DialogTitle>Medicine Price Comparison</DialogTitle>
                      <DialogContent>
                        {renderComparisonSummary()}
                        {comparisonData?.comparisons?.map((comparison, index) =>
                          renderMedicineComparison(comparison, index)
                        )}
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setShowCompareDialog(false)}>Close</Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                </Grid>

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
                      {` +${finalTax ? process.env.CURRENCY + roundedTax : '0'}    `}
                    </Typography>
                  </CalcWrapper>
                  <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
                  <CalcWrapper>
                    <Typography sx={{ color: 'text.secondary' }}>Pharmacy Total:</Typography>
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {`${process.env.CURRENCY} ${finaltotal ? finaltotal : '0'}`}
                    </Typography>
                  </CalcWrapper>
                  <Divider sx={{ my: `${theme.spacing(2)} !important` }} />

                  <CalcWrapper>
                    <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>Delivery Charge:</Typography>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>
                      {`${deliveryCharge ? `+ ${process.env.CURRENCY}  ${deliveryCharge}` : 'Not available'}`}
                    </Typography>
                  </CalcWrapper>

                  <CalcWrapper>
                    <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>Final Total will be:</Typography>
                    <Typography sx={{ fontWeight: 800, color: 'text.secondary' }}>
                      {`${process.env.CURRENCY} ${(
                        parseFloat(finaltotal || '0') + parseFloat(deliveryCharge || '0')
                      ).toFixed(2)}`}
                    </Typography>
                  </CalcWrapper>

                  <Alert severity='warning' sx={{ mb: 4, fontSize: '1.0rem' }}>
                    <AlertTitle sx={{ fontWeight: 500, fontSize: 12, mb: theme => `${theme.spacing(2.5)} !important` }}>
                      If you not see Delivery Charge that Means Delivery is Not Currently Available.
                    </AlertTitle>
                  </Alert>
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
