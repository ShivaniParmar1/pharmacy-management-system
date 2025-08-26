import React, { useState } from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css' // Import the styles
import { styled } from '@mui/system'

const ImgStyled = styled('img')({
  width: 100,
  height: 100,
  marginRight: 6,
  borderRadius: 8,
  cursor: 'pointer'
})

function ImageLightbox({ image, onClick, ...props }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const handleImageClick = e => {
    setLightboxOpen(true)

    if (typeof onClick === 'function') {
      onClick(e)
    }
  }

  const handleLightboxClose = () => {
    setLightboxOpen(false)
  }

  return (
    <>
      <ImgStyled src={image} alt='Profile Pic' onClick={handleImageClick} {...props} />
      {lightboxOpen && (
        <Lightbox
          mainSrc={image}
          onCloseRequest={handleLightboxClose}
          enableZoom={false}
          reactModalStyle={{ overlay: { zIndex: 1500 } }}
        />
      )}
    </>
  )
}

export default ImageLightbox
