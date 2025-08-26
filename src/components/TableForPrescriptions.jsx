import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'

// ** Utils Import
import themeConfig from 'src/configs/themeConfig'

// ** Data Import
import axios from 'axios'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

const backendUrl = themeConfig.backendUrl

const TableForPrescriptions = ({ columns, refreshKey, awaiting = true, title = 'Prescriptions' }) => {
  // ** States
  const [rows, setRows] = useState([])
  const [rowCount, setRowCount] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [loading, setLoading] = useState(false)

  const storedData = localStorage.getItem('userData')
  const parsedData = JSON.parse(storedData)
  const pharmacyId = parsedData?.pharmacy_id

  const fetchData = async () => {
    try {
      setLoading(true)

      const response = await axios.post(`${backendUrl}/api/quotes/getorderdatausingpharmacyid`, {
        pharmacyId,
        awaiting,
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        search: searchText
      })

      const { data, total } = response.data

      setRows(data)
      setRowCount(total || 0)
    } catch (error) {
      console.error('Error fetching prescription data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch when refreshKey, page, pageSize, or searchText changes
  useEffect(() => {
    if (pharmacyId) fetchData()
  }, [refreshKey, paginationModel.page, paginationModel.pageSize, searchText, pharmacyId])

  const handleSearch = value => {
    setSearchText(value)
    setPaginationModel(prev => ({ ...prev, page: 0 }))
  }

  return (
    <Card>
      <CardHeader title={title} />
      <DataGrid
        autoHeight
        columns={columns}
        pagination
        paginationMode='server'
        rowCount={rowCount}
        rows={rows}
        loading={loading}
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={[
          {
            field: 'id',
            sort: 'desc'
          }
        ]}
        slots={{ toolbar: ServerSideToolbar }}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            refresh: fetchData
          }
        }}
      />
    </Card>
  )
}

export default TableForPrescriptions
