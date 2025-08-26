// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Switch from '@mui/material/Switch'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@mui/material'
import api from 'src/interceptors/api'
import toast from 'react-hot-toast'
import { setRegistrationData } from 'src/store/apps/pharmacy'
import Router from 'next/router'

const Review = () => {
  const data = useSelector(state => state.pharmacy).registrationData
  const dispatch = useDispatch()

  const handleSubmit = () => {
    api.post('/api/pharmacy/register', { ...data }).then(res => {
      if (res.data.error) {
        return toast.error(res.data.message)
      }
      toast.success(res.data.message)
      dispatch(setRegistrationData({}))
      Router.push('/login')
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={6} xl={7}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4' sx={{ mb: 4 }}>
              Almost done! 🚀
            </Typography>
            <Typography sx={{ mb: 1, color: 'text.secondary' }}>
              Confirm your deal details information and submit to create it.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableBody
                  sx={{
                    '& .MuiTableCell-root': {
                      borderBottom: 0,
                      verticalAlign: 'top',
                      '&:last-of-type': { px: '0 !important' },
                      '&:first-of-type': { pl: '0 !important' },
                      py: theme => `${theme.spacing(0.75)} !important`
                    }
                  }}
                >
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Pharmacy Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data.pharmacy_name}</Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Owner Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data.owner_name}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Email
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data.email}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Registration Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{JSON.stringify(data.registration_date)}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        License No.
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data.license_no}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Bank Account Number
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data.bank_account_number}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Bank IFSC
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data.bank_ifsc}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Awards
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data.awards}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Whatsapp Number
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>{data.whatsapp_no}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch />} label='I have confirmed the deal details.' />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        lg={6}
        xl={5}
        xs={12}
        sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', '& img': { maxWidth: '100%' } }}
      >
        <Box
          sx={{
            pt: 5,
            px: 5,
            width: '100%',
            height: '100%',
            display: 'flex',
            borderRadius: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
            border: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <img height={230} alt='review-illustration' src='/images/pages/create-deal-review-complete.png' />
        </Box>
      </Grid>
      <Grid item>
        <Button color='success' variant='contained' onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>
    </Grid>
  )
}

export default Review
