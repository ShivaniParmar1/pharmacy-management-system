// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import TableServerSide from 'src/views/admins/Table'

const DataGrid = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableServerSide />
      </Grid>
    </Grid>
  )
}

export default DataGrid
