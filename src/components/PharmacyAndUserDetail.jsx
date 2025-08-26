import { Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import themeConfig from 'src/configs/themeConfig'

const ImgStyled = styled('img')({
  width: 100,
  height: 100,
  marginRight: 6,
  borderRadius: 8,
  cursor: 'pointer'
})

const PharmacyAnduserDetail = ({ pharmacyData, userData }) => {
  const pharmacyInfo = pharmacyData

  const handleOpenGoogleMapForUser = () => {
    const url = `https://www.google.com/maps/place/${userData?.latitude},${userData?.longitude}`
    window.open(url, '_blank')
  }

  const handleOpenGoogleMapForPharmacy = () => {
    const url = `https://www.google.com/maps/place/${pharmacyInfo?.lat},${pharmacyInfo?.lng}`
    window.open(url, '_blank')
  }

  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Grid container spacing={5} style={{ display: 'flex' }}>
        <Grid item xs={12} sm={6}>
          {/* First Sub-Card */}
          <Card style={{ height: '100%' }}>
            <Grid container justifyContent='space-between'>
              <Grid item>
                <CardContent>
                  {/* Dummy Typography for Title */}
                  <Typography variant='h5' gutterBottom>
                    Pharmacy Information
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {`Pharmacy : ${
                      pharmacyInfo?.pharmacy_name
                        ? pharmacyInfo?.pharmacy_name.charAt(0).toUpperCase() + pharmacyInfo?.pharmacy_name.slice(1)
                        : '...loading'
                    }`}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {`Owner Name : ${
                      pharmacyInfo?.owner_name
                        ? pharmacyInfo?.owner_name.charAt(0).toUpperCase() + pharmacyInfo?.owner_name.slice(1)
                        : '...loading'
                    }`}
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item>
                <CardContent>
                  <Button onClick={handleOpenGoogleMapForPharmacy}>
                    <ImgStyled
                      src={'https://upload.wikimedia.org/wikipedia/commons/b/bd/Google_Maps_Logo_2020.svg'}
                      alt='Profile Pic'
                    />
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          {/* Second Sub-Card */}

          <Card style={{ height: '100%' }}>
            <Grid container justifyContent='space-between'>
              <Grid item>
                <CardContent>
                  {/* Dummy Typography for Title */}
                  <Typography variant='h5' gutterBottom>
                    Customer Information
                  </Typography>

                  <Typography variant='body2' color='text.secondary'>
                    {`Name : ${
                      userData?.user_name
                        ? userData.user_name?.charAt(0).toUpperCase() + userData?.user_name?.slice(1)
                        : '...loading'
                    }`}
                  </Typography>
                  {/* <Typography variant='body2' color='text.secondary' sx={{ display: 'none' }}>
                    {`Mobile : ${
                      userData?.mobile_number
                        ? userData.mobile_number?.charAt(0).toUpperCase() + userData?.mobile_number?.slice(1)
                        : '...loading'
                    }`}
                  </Typography> */}
                  <Typography variant='body2' color='text.secondary'>
                    {`Address : ${
                      userData?.user_entered_address
                        ? userData.user_entered_address?.charAt(0).toUpperCase() +
                          userData?.user_entered_address?.slice(1)
                        : '...loading'
                    }`}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {`Address Title : ${
                      userData?.title
                        ? userData.title?.charAt(0).toUpperCase() + userData?.title?.slice(1)
                        : '...loading'
                    }`}
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item>
                <CardContent>
                  <Button onClick={handleOpenGoogleMapForUser}>
                    <ImgStyled
                      src={'https://upload.wikimedia.org/wikipedia/commons/b/bd/Google_Maps_Logo_2020.svg'}
                      alt='Profile Pic'
                    />
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PharmacyAnduserDetail
