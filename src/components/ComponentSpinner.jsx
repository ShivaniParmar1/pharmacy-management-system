import { Card } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

const Spinner = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ height: '100%', padding: '20px' }}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <img src='/images/logos/logo.png' width={350} />

          <CircularProgress disableShrink sx={{ mt: 6 }} />
        </Box>
      </Box>
    </Card>
  )
}

export default Spinner
