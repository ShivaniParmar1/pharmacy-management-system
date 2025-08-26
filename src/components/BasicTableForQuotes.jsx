// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Icon from 'src/@core/components/icon'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import themeConfig from 'src/configs/themeConfig'

const backendUrl = themeConfig.backendUrl

const MySwal = withReactContent(Swal)

import { forwardRef, useEffect, useState } from 'react'
import axios from 'axios'
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  Typography
} from '@mui/material'
import { Box, styled } from '@mui/system'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useForm, setValue } from 'react-hook-form'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

// Call the fetchData function as needed, for example, in a useEffect or an event handler

const TableBasic = ({ fetchData, data }) => {
  const [show, setShow] = useState(false)

  const deleteRecord = (id, name, unit, unit_id, qty) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `${name.charAt(0).toUpperCase() + name.slice(1)} ${unit} ${
        unit_id == 1
          ? 'mg'
          : unit_id == 2
          ? 'gram'
          : unit_id == 3
          ? 'Kg'
          : unit_id == 4
          ? 'ml'
          : unit_id == 5
          ? 'l'
          : ''
      } x ${qty}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        axios.post(`${backendUrl}/api/quotes/deletequoteitem`, { id: id }).then(res => {
          fetchData()

          if (res.data.error) {
            const resMessage = res.data.message

            return toast.error(resMessage)
          }

          return MySwal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Deleted Successfully!'
          })
        })
      }
    })
  }

  // Add state variables for other form fields

  useEffect(() => {
    fetchData()
  }, [])

  const defaultValues = {
    medicineName: '',
    quantity: '',
    unitId: '1',
    unit: '',
    UnitPrice: '',
    discountType: 'percentage',
    discount: ''
  }

  const {
    control,
    handleSubmit,
    setValue,

    formState: { errors }
  } = useForm({ defaultValues })

  const [id, setId] = useState('')

  async function handleEdit(e, id) {
    if (id) {
      setId(id)
      try {
        const response = await axios.post(`${backendUrl}/api/quotes/getquoteitem`, { id })
        const result = await response.data.data[0]
        console.log(result)

        // Update default values based on API response
        setValue('medicineName', result.item_name)
        setValue('quantity', result.qty)
        setValue('unitId', result.unit_id)
        setValue('unit', result.unit)
        setValue('UnitPrice', result.unit_amount)
        setValue('discountType', result.discount_type)
        setValue('discount', result.discount)
        setShow(true)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }

  const onSubmit = async data => {
    data.id = id

    try {
      // Your API call or state update logic here
      axios.post(`${backendUrl}/api/quotes/updatequoteitem`, data).then(res => {
        console.log(res)
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    }
    setShow(false)
    fetchData()
    toast.success('Medicine updated')
  }

  return (
    <>
      <TableContainer component={Card} sx={{ marginBottom: '20px', marginTop: '24px', zIndex: 1500 }}>
        <Table sx={{ minWidth: 450 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Medicine Name</TableCell>
              <TableCell align='center'>Single Unit Price</TableCell>
              <TableCell align='center'>Quantity</TableCell>
              <TableCell align='center'>Unit Strength</TableCell>
              <TableCell align='center'>Total Units Price</TableCell>
              <TableCell align='center'>Discount</TableCell>
              <TableCell align='center'>Total</TableCell>
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!data.length ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  <Box sx={{ margin: '20px' }}>
                    <Typography>Please add items to view the table</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              ''
            )}

            {data.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.item_name.charAt(0).toUpperCase() + row.item_name.slice(1)}</TableCell>
                <TableCell align='center'>
                  {process.env.CURRENCY} {row.unit_amount}
                </TableCell>
                <TableCell align='center'>{row.qty}</TableCell>
                <TableCell align='center'>
                  {`${row.unit} ${
                    row.unit_id == 1
                      ? 'mg'
                      : row.unit_id == 2
                      ? 'gram'
                      : row.unit_id == 3
                      ? 'Kg'
                      : row.unit_id == 4
                      ? 'ml'
                      : row.unit_id == 5
                      ? 'l'
                      : ''
                  }`}
                </TableCell>
                <TableCell align='center'>{`${process.env.CURRENCY} ${row.price}`}</TableCell>
                <TableCell align='center'>{`${row.discount} ${
                  row.discount_type.charAt(0).toUpperCase() + row.discount_type.slice(1)
                }`}</TableCell>
                <TableCell align='center'>{`${process.env.CURRENCY} ${row.item_total}`}</TableCell>
                <TableCell align='center'>
                  <Button color='primary' onClick={e => handleEdit(e, row.id)}>
                    <Icon icon='mingcute:edit-line' />
                  </Button>
                  <Button
                    onClick={e => {
                      deleteRecord(row.id, row.item_name, row.unit, row.unit_id, row.qty)
                    }}
                    color='error'
                  >
                    <Icon icon='icon-park-twotone:delete' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <form>
          <Dialog
            fullWidth
            open={show}
            maxWidth='md'
            scroll='body'
            onClose={() => setShow(false)}
            TransitionComponent={Transition}
            onBackdropClick={() => setShow(false)}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
          >
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <CustomCloseButton onClick={() => setShow(false)}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h3' sx={{ mb: 3 }}>
                  Update Medicine
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Updating Medicine details will receive a privacy audit.
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='medicineName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        value={field.value} // Use field.value here instead of value
                        label='Medicine Name'
                        onChange={e => field.onChange(e.target.value)} // Update the form state on change
                        placeholder='Paracetamol'
                        error={Boolean(errors.medicineName)} // Use 'medicineName' for the error check
                        aria-describedby='validation-basic-medicine-name'
                        {...(errors.medicineName && { helperText: 'This field is required' })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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

                <Grid item xs={12} sm={6}>
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
                          onChange: e => onChange(e)
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
                <Grid item xs={12} sm={6}>
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

                <Grid item xs={12} sm={6}>
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
                          inputMode: 'numeric', // Disable the number spinner
                          min: '0', // Set the minimum value to 0,
                          pattern: '[0-9]'
                        }}
                        {...(errors.UnitPrice && { helperText: 'This field is required' })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='discount'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        label='Discount'
                        onChange={onChange}
                        placeholder='1'
                        error={Boolean(errors.discount)}
                        aria-describedby='validation-basic-first-name'
                        {...(errors.discount && { helperText: 'This field is required' })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
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
                          onChange: e => onChange(e)
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
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 1 }} type='submit' onClick={handleSubmit(onSubmit)}>
                Update
              </Button>
              <Button variant='tonal' color='secondary' onClick={() => setShow(false)}>
                Discard
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </TableContainer>
    </>
  )
}

export default TableBasic
