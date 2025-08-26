// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const renderList = arr => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 3 },
            '& svg': { color: 'text.secondary' }
          }}
        >
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Icon fontSize='1.25rem' icon={item.icon} />
          </Box>

          <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {`${item?.property?.charAt(0).toUpperCase() + item?.property?.slice(1)}:`}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1)}
            </Typography>
          </Box>
        </Box>
      )
    })
  } else {
    return null
  }
}

const renderTeams = arr => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:not(:last-of-type)': { mb: 3 },
            '& svg': { color: `${item.color}.main` }
          }}
        >
          <Icon fontSize='1.25rem' icon={item.icon} />

          <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
            {item?.property?.charAt(0).toUpperCase() + item?.property?.slice(1)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1)}
          </Typography>
        </Box>
      )
    })
  } else {
    return null
  }
}

const AboutOverivew = props => {
  // const { teams, about, contacts, overview } = props

  // Dummy data for teams
  const teams = [{ icon: 'mdi:account', property: 'name', value: 'John Doe', color: 'primary' }]

  // Dummy data for about
  const about = [
    {
      icon: 'tabler:user',
      property: 'Full Name',
      value: 'Mitesh bhagwant'
    }
  ]

  // Dummy data for contacts
  const contacts = [
    { icon: 'mdi:email', property: 'Email', value: 'info@example.com' },
    { icon: 'mdi:phone', property: 'Phone', value: '+1234567890' },
    { icon: 'mdi:map-marker', property: 'Address', value: '123 Street, City, Country' }
  ]

  // Dummy data for overview
  const overview = [
    {
      icon: 'mdi:information',
      property: 'overview',
      value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      icon: 'mdi:information',
      property: 'overview',
      value: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      icon: 'mdi:information',
      property: 'overview',
      value:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  ]

  return (
    <Grid container spacing={12}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                About
              </Typography>
              {renderList(about)}
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                Contacts
              </Typography>
              {renderList(contacts)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverivew
