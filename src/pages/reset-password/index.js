import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Box, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import toast from 'react-hot-toast'
import themeConfig from 'src/configs/themeConfig'

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const backendUrl = themeConfig.backendUrl

  const router = useRouter()
  const { token } = router.query

  useEffect(() => {
    if (router.isReady) {
      setLoading(false)
    }
  }, [router.isReady])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')

      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post(`${backendUrl}/api/authorization/reset-password/${token}`, {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword
      })

      if (response.data.error) {
        toast.error(response.data.message)
      } else {
        toast.success(response.data.message)
        setSuccess(response.data.message)
      }

      setTimeout(() => router.push('/login'), 3000) // Redirect to login after success
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
        <Typography variant='h5' align='center' gutterBottom>
          Reset Password
        </Typography>

        {error && <Alert severity='error'>{error}</Alert>}
        {success && <Alert severity='success'>{success}</Alert>}

        <TextField
          fullWidth
          type='password'
          label='New Password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          margin='normal'
        />

        <TextField
          fullWidth
          type='password'
          label='Confirm Password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          margin='normal'
        />

        <Button fullWidth type='submit' variant='contained' color='primary' disabled={isSubmitting} sx={{ mt: 2 }}>
          {isSubmitting ? <CircularProgress size={24} /> : 'Reset Password'}
        </Button>
      </form>
    </Box>
  )
}

ResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ResetPassword.guestGuard = true

export default ResetPassword
