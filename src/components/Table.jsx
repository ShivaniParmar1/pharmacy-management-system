import React, { useCallback, useEffect, useRef, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TableSortLabel from '@mui/material/TableSortLabel'
import TablePagination from '@mui/material/TablePagination'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { Button, Card, CardHeader, IconButton } from '@mui/material'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

// ** Utils Import
import themeConfig from 'src/configs/themeConfig'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import debounce from 'lodash/debounce'

const backendUrl = themeConfig.backendUrl
const MySwal = withReactContent(Swal)

const MuiTable = ({
  columns,
  pageConfig,
  AddDialog,
  CustomCreate,
  expandableRows,
  ExpandableComponent,
  HeadingForExpandableComponent
}) => {
  const storedData = localStorage.getItem('userData')

  const parsedData = JSON.parse(storedData)

  const pharmacyId = parsedData?.pharmacy_id

  const [expandedRows, setExpandedRows] = useState([])

  columns = [
    ...columns,
    {
      flex: 0.175,
      minWidth: 110,
      field: 'field',
      headerName: 'Action',
      renderCell: params => (
        <Box>
          <a target='_blank' href={`/prescriptions/${pharmacyId}/?jwttoken=${params?.customer_validation}`}>
            <Button color='primary'>
              <Icon icon='charm:link-external' />
            </Button>
          </a>
        </Box>
      )
    }
  ]

  if (expandableRows && expandableRows === true) {
    columns = [
      {
        flex: 0.175,
        minWidth: 110,
        field: 'test',
        headerName: '',
        renderCell: params => (
          <Box>
            <IconButton
              onClick={() => {
                if (expandedRows.includes(params.id)) {
                  setExpandedRows(expandedRows.filter(rowId => rowId !== params.id))
                } else {
                  setExpandedRows([...expandedRows, params.id])
                }
              }}
            >
              {expandedRows.includes(params?.id) ? (
                <Icon icon='fluent:chevron-down-12-filled' />
              ) : (
                <Icon icon='fluent:chevron-right-12-filled' />
              )}
            </IconButton>
          </Box>
        )
      },
      ...columns
    ]
  }

  const headCells = columns.map(val => {
    return {
      id: val.field,
      label: val.headerName
    }
  })

  const defaultData = {
    edit: false
  }

  const [query, setQuery] = useState({ sort: 'id', order: 'desc', limit: 5, offset: 0 })
  const [total, setTotal] = useState(0)
  const [dialogData, setDialogData] = useState(defaultData)
  const [isLoading, setSetIsLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [responseData, setResponseData] = useState({})
  const [rows, setRows] = useState([])

  const request = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/quotes/getquotedatausingpharmacyid`, {
        pharmacyId,
        sort: query.sort || 'id',
        order: query.order || 'desc',
        limit: query.limit,
        offset: query.offset,
        search: query.search || ''
      })

      setRows(response.data.data)
      setTotal(response.data.total || 0)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleRequestSort = property => {
    setQuery(prevQuery => ({
      ...prevQuery,
      sort: property,
      order: prevQuery.sort === property && prevQuery.order === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleChangePage = (event, newPage) => {
    setQuery(prevQuery => ({
      ...prevQuery,
      offset: newPage * prevQuery.limit
    }))
  }

  const handleChangeRowsPerPage = event => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setQuery(prevQuery => ({
      ...prevQuery,
      limit: newRowsPerPage,
      offset: 0
    }))
  }

  const handleClose = () => {
    setDialogData(defaultData)
    setShow(false)
  }

  useEffect(() => {
    request()
  }, [query])

  const searchRef = useRef(query.search || '')

  const handleSearch = useCallback(
    debounce(value => {
      setQuery(prevQuery => ({
        ...prevQuery,
        search: value,
        offset: 0 // reset to first page on new search
      }))
    }, 500),
    []
  )

  const handleSearchInput = e => {
    const value = e.target.value
    searchRef.current = value
    handleSearch(value)
  }

  const handleClearSearch = () => {
    searchRef.current = ''
    handleSearch('')
  }

  return (
    <div>
      {AddDialog && (
        <AddDialog
          {...{
            dialogData,
            setShow,
            setDialogData,
            show,
            handleClose,
            responseData,
            isLoading,
            defaultData
          }}
        />
      )}
      <Card>
        <CardHeader title='Quotes' />

        <ServerSideToolbar
          value={searchRef.current}
          onChange={handleSearchInput}
          clearSearch={handleClearSearch}
          refresh={request}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map(headCell => (
                  <TableCell key={headCell.id} sortDirection={query.sort === headCell.id ? query.order : false}>
                    <TableSortLabel
                      active={query.sort === headCell.id}
                      direction={query.sort === headCell.id ? query.order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <TableRow>
                    {columns.map((column, columnIndex) => (
                      <TableCell key={columnIndex}>{column.renderCell(row)}</TableCell>
                    ))}
                  </TableRow>
                  {expandableRows && ExpandableComponent && expandedRows.includes(row.id) && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <Table>
                          <ExpandableComponent row={row} />
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 25, 100]}
          component='div'
          count={total}
          rowsPerPage={query.limit}
          page={query.offset / query.limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </div>
  )
}

export default MuiTable
