import React, { useEffect, useMemo, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Button } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Lodash (or your own debounce)
import debounce from 'lodash/debounce'

const ServerSideToolbar = props => {
  const [searchValue, setSearchValue] = useState(props.value || '')

  // Create a stable callback for onChange
  const handleSearchChange = useCallback((val) => {
    if (props.onChange) {
      props.onChange({ target: { value: val } })
    }
  }, [props.onChange])

  // Debounce search input handler with stable dependency
  const debouncedSearch = useMemo(() => {
    return debounce(handleSearchChange, 500)
  }, [handleSearchChange])

  // Only trigger search when searchValue changes and it's different from props.value
  useEffect(() => {
    if (searchValue !== props.value) {
      debouncedSearch(searchValue)
    }

    return () => debouncedSearch.cancel()
  }, [searchValue, debouncedSearch, props.value])

  // Update local state when props.value changes (external reset)
  useEffect(() => {
    if (props.value !== searchValue) {
      setSearchValue(props.value || '')
    }
  }, [props.value])

  const handleInputChange = event => {
    setSearchValue(event.target.value)
  }

  const handleClear = () => {
    setSearchValue('')
    if (props.clearSearch) props.clearSearch()
  }

  return (

    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-end',
          p: theme => theme.spacing(2, 5, 4, 5)
        }}
      >
        <CustomTextField
          value={searchValue}
          placeholder='Search…'
          onChange={handleInputChange}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <Icon fontSize='1.25rem' icon='tabler:search' />
              </Box>
            ),
            endAdornment: searchValue ? (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={handleClear}>
                <Icon fontSize='1.25rem' icon='tabler:x' />
              </IconButton>
            ) : null
          }}
          sx={{
            width: {
              xs: 1,
              sm: 'auto'
            },
            '& .MuiInputBase-root > svg': {
              mr: 2
            }
          }}
        />

        <Button
          id='table-refresh-btn'
          onClick={props.refresh}
          color='primary'
          title='Refresh Data'
        >
          <Icon fontSize='1.25rem' icon='tabler:refresh' />
        </Button>
      </Box>
    </Box>
  )
}

export default ServerSideToolbar
