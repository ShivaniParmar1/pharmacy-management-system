import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))

function ImageUpload({ title, defaultImage, onChange, name, text, onReset, fileId = 'image' }) {
  const image = '/images/avatars/15.png'
  const [imgSrc, setImgSrc] = useState(image)
  useEffect(() => {
    setImgSrc(defaultImage || image)
  }, [defaultImage])
  const [inputValue, setInputValue] = useState('')

  const handleInputImageChange = e => {
    const reader = new FileReader()
    const { files } = e.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
      if (reader.result !== null) {
        setInputValue(reader.result)
      }
    }
    if (typeof onChange === 'function') {
      onChange(e)
    }
  }

  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc(defaultImage || image)
    if (typeof onReset === 'function') {
      onReset()
    }
  }

  console.log(defaultImage)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ImgStyled src={imgSrc} alt='Profile Pic' />
      <div>
        <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
          Upload
          <input
            hidden
            type='file'
            value={inputValue}
            accept='image/png, image/jpeg'
            onChange={handleInputImageChange}
            id='account-settings-upload-image'
          />
        </ButtonStyled>

        <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
          Reset
        </ResetButtonStyled>
        <Typography sx={{ mt: 4, color: 'text.disabled' }}>{text || ''}</Typography>
      </div>
    </Box>
  )
}

export default ImageUpload
