import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  CircularProgress,
  Alert,
  Slide
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Icon } from '@iconify/react'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import themeConfig from 'src/configs/themeConfig'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const backendUrl = themeConfig.backendUrl

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

const ExcelExport = ({
  listingUrl,
  columnMapping,
  customFormatters = {},
  buttonText = 'Export to Excel',
  buttonProps = {},
  dialogTitle = 'Export Data to Excel',
  fileNamePrefix = 'orders',
  pharmacyId = ''
}) => {
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOpen = () => {
    setOpen(true)
    setError('')
  }

  const handleClose = () => {
    setOpen(false)
    setError('')
    setLoading(false)
    setStartDate(new Date())
    setEndDate(new Date())
  }

  const formatDate = date => {
    return date.toISOString().split('T')[0]
  }

  const downloadExcel = (data, filename) => {
    try {
      const excelData = data.map(row => {
        const formattedRow = {}

        Object.keys(columnMapping).forEach(key => {
          const columnName = columnMapping[key]

          if (typeof customFormatters[key] === 'function') {
            formattedRow[columnName] = customFormatters[key](row)
          } else {
            formattedRow[columnName] = row[key] ?? ''
          }
        })

        return formattedRow
      })

      const worksheet = XLSX.utils.json_to_sheet(excelData)

      const colWidths = Object.keys(excelData[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }))
      worksheet['!cols'] = colWidths

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      saveAs(blob, filename)
    } catch (error) {
      console.error('Error downloading Excel file:', error)
      toast.error('Error downloading Excel file')
    }
  }

  const handleExport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates')

      return
    }

    if (startDate > endDate) {
      setError('Start date cannot be later than end date')

      return
    }

    setLoading(true)
    setError('')

    try {
      const params = {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        pharmacy_id: pharmacyId
      }

      const response = await axios.post(`${backendUrl}${listingUrl}`, params)

      if (response.data.error) {
        setError(response.data.message || 'An error occurred while fetching data')
        toast.error(response.data.message || 'Export failed')

        return
      }

      if (!response.data.data || response?.data?.data?.length === 0 || response?.data?.data?.rows?.length === 0) {
        setError('No data found for the selected date range')
        toast.error('No data found for the selected date range')

        return
      }

      const filename = `${fileNamePrefix}_${formatDate(startDate)}_to_${formatDate(endDate)}.xlsx`
      downloadExcel(response.data.data.rows, filename)

      toast.success('Excel file downloaded successfully!')
      handleClose()
    } catch (err) {
      console.error('Export error:', err)
      const errorMessage = err.response?.data?.message || 'Failed to export data. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant='contained' startIcon={<Icon icon='tabler:download' />} onClick={handleOpen} {...buttonProps}>
        {buttonText}
      </Button>

      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={handleClose}
        TransitionComponent={Transition}
        onBackdropClick={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>

          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h4' sx={{ mb: 3 }}>
              {dialogTitle}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Select a date range to export your data to Excel format.
            </Typography>
          </Box>

          {error && (
            <Alert severity='error' sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          <DatePickerWrapper>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ mb: 2, fontWeight: 500 }}>
                  Start Date
                </Typography>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  dateFormat='dd/MM/yyyy'
                  customInput={
                    <Box
                      sx={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      {startDate ? startDate.toLocaleDateString() : 'Select start date'}
                    </Box>
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ mb: 2, fontWeight: 500 }}>
                  End Date
                </Typography>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  dateFormat='dd/MM/yyyy'
                  minDate={startDate}
                  customInput={
                    <Box
                      sx={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      {endDate ? endDate.toLocaleDateString() : 'Select end date'}
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </DatePickerWrapper>

          <Box sx={{ mt: 6, p: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant='body2' sx={{ fontWeight: 500, mb: 1 }}>
              Export Information:
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              • Data will be exported in Excel format
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              • Columns: {Object.values(columnMapping).join(', ')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              • Date range: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button
            variant='contained'
            onClick={handleExport}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Icon icon='tabler:download' />}
            sx={{ mr: 2 }}
          >
            {loading ? 'Exporting...' : 'Export Excel'}
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExcelExport
