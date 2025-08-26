import { useEffect, useState, useCallback, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import api from 'src/interceptors/api'
import { Button } from '@mui/material'
import authGuard from 'src/helpers/authGuard'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid'
import Fade from '@mui/material/Fade'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

// ** ThirdParty Components

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'

const PageConfig = {
  listingUrl: `/api/admin/listing`,
  editUrl: '',
  deleteUrl: '',
  module: '',
  pageTitle: '',
  createText: 'Create Admin',
  createSubText: 'Please Enter admin Details to create an admin User',
  editText: 'Edit Admin',
  editSubText: 'Updating user details will receive a privacy audit.'
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

// ** renders client column
const renderClient = params => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  return (
    <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
      {getInitials(`${row.firstname} ${row.lastname}` ? `${row.firstname} ${row.lastname}` : 'John Doe')}
    </CustomAvatar>
  )
}

const UsersTable = () => {
  // ** States

  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('desc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('id')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [show, setShow] = useState(false)
  const [dialogData, setDialogData] = useState({})

  const handleAdminDelete = e => {
    e.preventDefault()
    console.log('hello delete submit')
  }

  const columns = [
    {
      flex: 0.03,
      minWidth: 10,
      field: 'id',
      headerName: 'Sr.',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.sr}
        </Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 290,
      field: 'firstname',
      headerName: 'Name',
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {`${row.firstname} ${row.lastname}`}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.175,
      minWidth: 110,
      field: 'test',
      headerName: 'Action',
      renderCell: params => (
        <Box>
          {authGuard.hasPermission('admin', 'update') && (
            <Button
              onClick={() => {
                setDialogData(params.row)
                setShow(true)
              }}
            >
              <Icon icon='mingcute:edit-line' />
            </Button>
          )}
          {authGuard.hasPermission('admin', 'delete') && (
            <Button onClick={e => handleAdminDelete(e)} color='error'>
              <Icon icon='icon-park-twotone:delete' />
            </Button>
          )}
        </Box>
      )
    }
  ]

  const fetchTableData = useCallback(
    async (sort, q, column) => {
      await api
        .post(PageConfig.listingUrl, {
          search: q,
          order: sort,
          sort: column,
          limit: paginationModel.pageSize,
          offset: Math.round(Math.round(paginationModel.page) * paginationModel.pageSize)
        })
        .then(res => {
          if (res.data.error) {
            return toast.error(res.data.message)
          }
          setTotal(res.data.data.total.total)
          setRows(res.data.data.rows)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginationModel]
  )
  useEffect(() => {
    fetchTableData(sort, searchValue, sortColumn)
  }, [fetchTableData, searchValue, sort, sortColumn])

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('firstname')
    }
  }

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  const CustomCloseButton = styled(IconButton)(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
      transform: 'translate(7px, -5px)'
    }
  }))

  const handleClose = () => {
    setDialogData({})
    setShow(false)
  }

  const AddDialog = ({ dialogData }) => {
    console.log(dialogData)

    const handleSubmit = e => {
      e.preventDefault()
      console.log('hello modal submit')
    }

    const [prefill, setPrefill] = useState(dialogData)

    const addValueProps = name => {
      if (prefill[name]) {
        return {
          value: prefill[name],
          onChange: e => {
            setPrefill({ ...prefill, [name]: e.target.value })
          }
        }
      }
    }

    return (
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        onBackdropClick={() => handleClose()}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={() => handleClose()}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              {PageConfig.createText}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Updating user details will receive a privacy audit.
            </Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item sm={6} xs={12}>
              <CustomTextField fullWidth label='First Name' placeholder='John' {...addValueProps('firstname')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 1 }} onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' onClick={() => handleClose()}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <>
      <AddDialog dialogData={dialogData} />
      <Card>
        <CardHeader
          title='Server Side'
          action={
            <>
              {authGuard.hasPermission('admin', 'write') && (
                <>
                  <Button variant='contained' size='small' onClick={() => setShow(true)}>
                    Create
                  </Button>
                </>
              )}
            </>
          }
        />
        {authGuard.hasPermission('admin', 'read') && (
          <DataGrid
            autoHeight
            pagination
            rows={rows}
            rowCount={total}
            columns={columns}
            sortingMode='server'
            paginationMode='server'
            pageSizeOptions={[1, 5, 10, 25, 50]}
            paginationModel={paginationModel}
            onSortModelChange={handleSortModel}
            slots={{ toolbar: ServerSideToolbar }}
            onPaginationModelChange={setPaginationModel}
            slotProps={{
              baseButton: {
                size: 'medium',
                variant: 'tonal'
              },
              toolbar: {
                value: searchValue,
                clearSearch: () => handleSearch(''),
                onChange: event => handleSearch(event.target.value)
              }
            }}
          />
        )}
      </Card>
    </>
  )
}

export default authGuard.validateView(UsersTable, 'admin')
