// ** Demo Components Imports
import CreateDeal from 'src/views/pages/wizard-examples/create-deal'

// ** Custom Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Box, Container } from '@mui/system'
import { Card, CardContent, Typography } from '@mui/material'
import Registration from 'src/views/pharmacy/Registration'

const WizardExamples = () => {
  return (
    <Container sx={{ marginTop: '20px' }}>
      <Card>
        <Box display={'flex'}>
          <CardContent>
            <Box display={'flex'} alignItems={'center'}>
              <Box component={'img'} src='/images/logos/logo.png' maxHeight={'80px'}></Box>
              <Typography gutterBottom variant='h5' component='div'>
                Pharmacy Registration Form
              </Typography>
            </Box>
            <Typography variant='body2' color='text.secondary'>
              Welcome to our pharmacy registration portal. To register your pharmacy, please fill in the required
              details in the provided form. Upon submission, your application will undergo a thorough review process
              that usually takes 2-3 days. Once approved, you will receive confirmation and be authorized to operate as
              a registered pharmacy.
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <DatePickerWrapper sx={{ marginTop: '20px' }}>
        <Registration />
      </DatePickerWrapper>
    </Container>
  )
}

WizardExamples.getLayout = page => <BlankLayout>{page}</BlankLayout>
WizardExamples.authGuard = false

export default WizardExamples
