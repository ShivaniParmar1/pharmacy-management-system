import { Card, CardContent, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import ImageLightbox from './LightBox'
import axios from 'axios'
import themeConfig from 'src/configs/themeConfig'

const backendUrl = themeConfig.backendUrl

const PrescriptionImage = ({ orderId }) => {
  const [asseturl, setAssetUrl] = useState([])

  async function fetchPrescriptionsImage() {
    if (orderId) {
      try {
        const response = await axios.post(`${backendUrl}/api/quotes/getprescriptionsimage`, { orderId })
        const result = await response.data.data[0].asset_url
        const parsedArray = JSON.parse(result)
        setAssetUrl(parsedArray)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }

  useEffect(() => {
    fetchPrescriptionsImage()
  }, [orderId]) // Include orderId in the dependency array

  return (
    <>
      <Box sx={{ marginBottom: '20px' }}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Card>
              <Typography variant='h5' sx={{ paddingTop: '20px', paddingLeft: '20px' }}>
                Prescriptions
              </Typography>
              <CardContent>
                {asseturl.map(item => (
                  <ImageLightbox key={item} image={`${backendUrl}/${item}`} sx={{ marginRight: '15px' }} />
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default PrescriptionImage
