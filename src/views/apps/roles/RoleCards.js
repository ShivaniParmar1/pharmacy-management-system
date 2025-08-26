// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import api from 'src/interceptors/api'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'

const RolesCards = () => {
  // ** States
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)
  const [roleName, setRoleName] = useState('')
  const [modules, setModules] = useState([])
  const [rolesArr, setRolesArr] = useState([])
  const [updateId, setUpdateId] = useState(null)
  const [cardData, setCardData] = useState([])
  const [totalModules, setTotalModules] = useState(0)

  const handleClickOpen = (item = undefined) => {
    if (item !== undefined) {
      setRoleName(item.title)
      setSelectedCheckbox(JSON.parse(item.permissions))
    }
    setOpen(true)
  }

  const handleClose = () => {
    setUpdateId(null)
    setOpen(false)
    setSelectedCheckbox([])
    setRoleName('')
    setIsIndeterminateCheckbox(false)
  }

  const togglePermission = id => {
    const arr = selectedCheckbox
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedCheckbox([...arr])
    } else {
      arr.push(id)
      setSelectedCheckbox([...arr])
    }
  }

  const handleSelectAllCheckbox = () => {
    if (isIndeterminateCheckbox) {
      setSelectedCheckbox([])
    } else {
      rolesArr.forEach(row => {
        const id = row.toLowerCase().split(' ').join('-')
        if (modules[row].permissions.includes('read')) {
          togglePermission(`${id}-read`)
        }
        if (modules[row].permissions.includes('write')) {
          togglePermission(`${id}-write`)
        }
        if (modules[row].permissions.includes('update')) {
          togglePermission(`${id}-update`)
        }
        if (modules[row].permissions.includes('delete')) {
          togglePermission(`${id}-delete`)
        }
      })
    }
  }

  const handleModuleSubmit = () => {
    if (updateId === null) {
      return api.post('/api/role/create', { roleName, permissions: selectedCheckbox }).then(res => {
        setroles()

        if (res.data.error) {
          return toast.error(res.data.message)
        }
        toast.success(res.data.message)

        return handleClose()
      })
    }

    return api.post('/api/role/update', { id: updateId.id, roleName, permissions: selectedCheckbox }).then(res => {
      setroles()

      if (res.data.error) {
        return toast.error(res.data.message)
      }
      toast.success(res.data.message)

      return handleClose()
    })
  }

  const setroles = () => {
    api.post('/api/role/listing').then(res => {
      setCardData(res.data.data.cardData)
    })
  }
  useEffect(() => {
    if (selectedCheckbox.length > 0 && selectedCheckbox.length < totalModules) {
      setIsIndeterminateCheckbox(true)
    } else {
      setIsIndeterminateCheckbox(false)
    }
  }, [selectedCheckbox])
  useEffect(() => {
    setroles()
    api.post('/api/admin/modules').then(res => {
      let total = 0
      setModules(res.data)
      setRolesArr(
        Object.keys(res.data).map(val => {
          total += res.data[val].permissions.length

          return val
        })
      )
      setTotalModules(total)
    })
  }, [])

  const renderCards = () =>
    cardData.map((item, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>{`Total ${item.totalUsers} users`}</Typography>
              <AvatarGroup
                max={4}
                className='pull-up'
                sx={{
                  '& .MuiAvatar-root': { width: 32, height: 32, fontSize: theme => theme.typography.body2.fontSize }
                }}
              >
                {item.avatars.map((img, index) => (
                  <Avatar key={index} alt={item.title} src={`/images/avatars/${img}`} />
                ))}
              </AvatarGroup>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography variant='h4' sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography
                  href='/'
                  component={Link}
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                  onClick={e => {
                    e.preventDefault()
                    setUpdateId(item)
                    handleClickOpen(cardData[index])
                    setDialogTitle('Edit')
                  }}
                >
                  Edit Role
                </Typography>
              </Box>
              <IconButton size='small' sx={{ color: 'text.disabled' }}>
                <Icon icon='tabler:copy' />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))

  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            handleClickOpen()
            setDialogTitle('Add')
          }}
        >
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={5}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: 140,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}
              >
                <img height={122} alt='add-role' src='/images/pages/add-new-role-illustration.png' />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <CardContent sx={{ pl: 0, height: '100%' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant='contained'
                    sx={{ mb: 3, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      handleClickOpen()
                      setDialogTitle('Add')
                    }}
                  >
                    Add New Role
                  </Button>
                  <Typography sx={{ color: 'text.secondary' }}>Add role, if it doesn't exist.</Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      {renderCards()}
      <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={open}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`${dialogTitle} Role`}</Typography>
          <Typography color='text.secondary'>Set Role Permissions</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => setRoleName(e.target.value)}
                value={roleName}
                fullWidth
                label='Role Name'
                placeholder='Enter Role Name'
              />
            </FormControl>
          </Box>
          <Typography variant='h4'>Role Permissions</Typography>
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: '0 !important' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        whiteSpace: 'nowrap',
                        alignItems: 'center',
                        textTransform: 'capitalize',
                        '& svg': { ml: 1, cursor: 'pointer' },
                        color: theme => theme.palette.text.secondary,
                        fontSize: theme => theme.typography.h6.fontSize
                      }}
                    >
                      Administrator Access
                      <Tooltip placement='top' title='Allows a full access to the system'>
                        <Box sx={{ display: 'flex' }}>
                          <Icon icon='tabler:info-circle' fontSize='1.25rem' />
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={3}>
                    <FormControlLabel
                      label='Select All'
                      sx={{ '& .MuiTypography-root': { textTransform: 'capitalize', color: 'text.secondary' } }}
                      control={
                        <Checkbox
                          size='small'
                          onChange={handleSelectAllCheckbox}
                          indeterminate={isIndeterminateCheckbox}
                          checked={selectedCheckbox.length === totalModules}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rolesArr.map((i, index) => {
                  const id = i.toLowerCase().split(' ').join('-')

                  return (
                    <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          fontSize: theme => theme.typography.h6.fontSize
                        }}
                      >
                        {modules[i].title}
                      </TableCell>
                      <TableCell>
                        {modules[i].permissions.includes('read') ? (
                          <>
                            <FormControlLabel
                              label='Read'
                              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                              control={
                                <Checkbox
                                  size='small'
                                  id={`${id}-read`}
                                  onChange={() => togglePermission(`${id}-read`)}
                                  checked={selectedCheckbox.includes(`${id}-read`)}
                                />
                              }
                            />{' '}
                          </>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {modules[i].permissions.includes('write') ? (
                          <>
                            <FormControlLabel
                              label='Write'
                              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                              control={
                                <Checkbox
                                  size='small'
                                  id={`${id}-write`}
                                  onChange={() => togglePermission(`${id}-write`)}
                                  checked={selectedCheckbox.includes(`${id}-write`)}
                                />
                              }
                            />
                          </>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {modules[i].permissions.includes('update') ? (
                          <>
                            <FormControlLabel
                              label='Update'
                              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                              control={
                                <Checkbox
                                  size='small'
                                  id={`${id}-update`}
                                  onChange={() => togglePermission(`${id}-update`)}
                                  checked={selectedCheckbox.includes(`${id}-update`)}
                                />
                              }
                            />
                          </>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {modules[i].permissions.includes('delete') ? (
                          <>
                            <FormControlLabel
                              label='Delete'
                              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                              control={
                                <Checkbox
                                  size='small'
                                  id={`${id}-delete`}
                                  onChange={() => togglePermission(`${id}-delete`)}
                                  checked={selectedCheckbox.includes(`${id}-delete`)}
                                />
                              }
                            />
                          </>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button type='submit' variant='contained' onClick={handleModuleSubmit}>
              Submit
            </Button>
            <Button color='secondary' variant='tonal' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default RolesCards
