// ** React Imports
import { forwardRef, useState, useEffect, useRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import themeConfig from 'src/configs/themeConfig'

const backendUrl = themeConfig.backendUrl

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports

import axios from 'axios'

const defaultValues = {
  discount: '',
  medicineName: '',
  quantity: '',
  unitId: '1',
  unit: '',
  UnitPrice: '',
  discountType: 'percentage',
  discount: ''
}

const FormValidationBasic = ({ quoteId, fetchData }) => {
  // ** Hooks
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** States for autocomplete
  const [medicineSuggestions, setMedicineSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const medicineInputRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  const discountType = watch('discountType')
  const medicineNameValue = watch('medicineName')

  // ** Function to search medicines
  const searchMedicines = async query => {
    if (!query || query.trim().length < 2) {
      setMedicineSuggestions([])
      setShowSuggestions(false)

      return
    }

    setIsLoadingSuggestions(true)

    try {
      const response = await axios.get(`${backendUrl}/api/medicines/search`, {
        params: {
          query: query.trim(),
          limit: 10
        }
      })

      if (response.data.success) {
        setMedicineSuggestions(response.data.data)
        setShowSuggestions(response.data.data.length > 0)
      } else {
        setMedicineSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Error searching medicines:', error)
      setMedicineSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // ** Effect to handle medicine search with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchMedicines(medicineNameValue)
    }, 300) // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [medicineNameValue])

  // ** Function to handle medicine selection
  const handleMedicineSelect = medicine => {
    setValue('medicineName', medicine.name)
    setShowSuggestions(false)
    setMedicineSuggestions([])
  }

  // ** Function to handle click away
  const handleClickAway = () => {
    setShowSuggestions(false)
  }

  const onSubmit = async data => {
    ;(data.quote_id = quoteId),
      axios
        .post(`${backendUrl}/api/quotes/createitem`, data)
        .then(res => {
          toast.success('Medicine Added')

          fetchData()

          setValue('discount', '')
          setValue('medicineName', '')
          setValue('quantity', '')
          setValue('unitId', '1')
          setValue('unit', '')
          setValue('UnitPrice', '')
          setValue('discountType', 'percentage')
        })
        .catch(error => {
          console.log('inside error')
          console.log(error)
        })
  }

  return (
    <Card
      sx={{
        position: 'relative',
        zIndex: 1, // Reduced from 1500
        overflow: 'visible' // very important
      }}
    >
      <CardHeader title='Add Item' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid
              item
              xs={12}
              sm={2}
              sx={{
                position: 'relative',
                zIndex: 1300 // High z-index for medicine autocomplete
              }}
            >
              <ClickAwayListener onClickAway={handleClickAway}>
                <div>
                  <Controller
                    name='medicineName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        ref={medicineInputRef}
                        value={field.value}
                        label='Medicine Name'
                        onChange={e => {
                          field.onChange(e.target.value)
                          setHighlightedIndex(-1) // Reset highlight on change
                        }}
                        onKeyDown={e => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault()
                            setHighlightedIndex(prev => Math.min(prev + 1, medicineSuggestions.length - 1))
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault()
                            setHighlightedIndex(prev => Math.max(prev - 1, 0))
                          } else if (e.key === 'Enter') {
                            if (highlightedIndex >= 0 && medicineSuggestions[highlightedIndex]) {
                              e.preventDefault()
                              handleMedicineSelect(medicineSuggestions[highlightedIndex])
                              setShowSuggestions(false)
                              setMedicineSuggestions([])
                            }
                          }
                        }}
                        placeholder='Paracetamol'
                        error={Boolean(errors.medicineName)}
                        aria-describedby='validation-basic-medicine-name'
                        autoComplete='off'
                        {...(errors.medicineName && { helperText: 'This field is required' })}
                      />
                    )}
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && (
                    <Paper
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1400, // Higher than the grid container
                        maxHeight: '200px',
                        overflow: 'auto',
                        mt: 1
                      }}
                      elevation={3}
                    >
                      <List dense>
                        {isLoadingSuggestions ? (
                          <ListItem>
                            <ListItemText primary='Loading...' />
                          </ListItem>
                        ) : medicineSuggestions.length > 0 ? (
                          medicineSuggestions.map((medicine, index) => (
                            <ListItem
                              key={medicine.id}
                              button
                              selected={index === highlightedIndex}
                              onClick={() => handleMedicineSelect(medicine)}
                              sx={{
                                '&.Mui-selected': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                  fontWeight: 500
                                },
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                              }}
                            >
                              <ListItemText
                                primary={medicine.name}
                                primaryTypographyProps={{
                                  fontSize: '0.875rem',
                                  fontWeight: index === highlightedIndex ? 600 : 500
                                }}
                              />
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText
                              primary='No medicines found'
                              primaryTypographyProps={{
                                fontSize: '0.875rem',
                                color: 'text.secondary'
                              }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Paper>
                  )}
                </div>
              </ClickAwayListener>
            </Grid>

            <Grid item xs={12} sm={1.5}>
              <Controller
                name='UnitPrice'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    type='number'
                    label='Single Unit Price'
                    onChange={onChange}
                    placeholder='1'
                    error={Boolean(errors.UnitPrice)}
                    aria-describedby='validation-basic-first-name'
                    InputProps={{
                      inputMode: 'numeric',
                      min: '0',
                      pattern: '[0-9]'
                    }}
                    {...(errors.UnitPrice && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={1}>
              <Controller
                name='quantity'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    type='number'
                    label='Quantity'
                    onChange={onChange}
                    placeholder='10'
                    error={Boolean(errors.quantity)}
                    aria-describedby='validation-basic-last-name'
                    {...(errors.quantity && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={1.8}>
              <Controller
                name='unit'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Unit Strength (Power)'
                    type='number'
                    onChange={onChange}
                    placeholder='1'
                    error={Boolean(errors.unit)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.unit && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={1.5}
              sx={{
                position: 'relative',
                zIndex: 1200 // High z-index for unit dropdown
              }}
            >
              <Controller
                name='unitId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    label='Unit of Strength'
                    type='number'
                    SelectProps={{
                      value: value,
                      onChange: e => onChange(e),
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            zIndex: 1250 // Ensure dropdown menu appears above other elements
                          }
                        }
                      }
                    }}
                    id='validation-basic-select'
                    error={Boolean(errors.select)}
                    aria-describedby='validation-basic-select'
                    {...(errors.select && { helperText: 'This field is required' })}
                  >
                    <MenuItem value='1'>Milligram</MenuItem>
                    <MenuItem value='2'>Gram</MenuItem>
                    <MenuItem value='4'>Milliliter</MenuItem>
                    <MenuItem value='3'>Kilogram</MenuItem>
                    <MenuItem value='5'>Liter</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={1}>
              <Controller
                name='discount'
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
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    type='number'
                    label='Discount'
                    placeholder='1'
                    onChange={e => {
                      const inputValue = e.target.value
                      if (discountType === 'percentage' && parseFloat(inputValue) > 100) {
                        onChange('100')
                      } else {
                        onChange(inputValue)
                      }
                    }}
                    inputProps={{
                      min: 0,
                      ...(discountType === 'percentage' && { max: 100 })
                    }}
                    error={Boolean(errors.discount)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.discount && {
                      helperText: errors.discount.message || 'This field is required'
                    })}
                  />
                )}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={1.8}
              sx={{
                position: 'relative',
                zIndex: 1100 // High z-index for discount type dropdown
              }}
            >
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
                        setValue('discount', '')
                      },
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            zIndex: 1150 // Ensure dropdown menu appears above other elements
                          }
                        }
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

            <Grid item xs={12} sm={1} sx={{ marginTop: '20px', padding: '0' }}>
              <Button type='submit' variant='contained'>
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormValidationBasic
