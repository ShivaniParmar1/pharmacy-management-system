// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import AboutOverivew from 'src/views/pages/user-profile/profile/AboutOverivew'
import ProjectsTable from 'src/views/pages/user-profile/profile/ProjectsTable'
import ActivityTimeline from 'src/views/pages/user-profile/profile/ActivityTimeline'
import ConnectionsTeams from 'src/views/pages/user-profile/profile/ConnectionsTeams'
import { Typography } from '@mui/material'

const ProfileTab = () => {
  const data = [
    'Lorem ipsum dolor sit amet',
    'Consectetur adipiscing elit',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
  ]

  return (
    <Grid container spacing={6}>
      <Grid item lg={3} md={5} xs={12}>
        <AboutOverivew about={data} />
      </Grid>
      {/* <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ActivityTimeline />
          </Grid>
          <ConnectionsTeams connections={data.connections} teams={data.teamsTech} />
          <Grid item xs={12}>
            <ProjectsTable />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  )
}

export default ProfileTab
