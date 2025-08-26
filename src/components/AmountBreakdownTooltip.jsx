import { Tooltip, Typography, Box, Divider, useTheme } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

const AmountBreakdownTooltip = ({ orderDetails = {} }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const { transaction_type, amount = 0, delivery_cost, platform_fees, order_amount, note = '' } = orderDetails

  // Ensure numbers are safe for toFixed()
  const safeAmount = Number(amount) || 0
  const safeDeliveryCost = Number(delivery_cost) || 0
  const safePlatformFees = Number(platform_fees) || 0
  const safeOrderAmount = Number(order_amount) || 0

  let tooltipContent

  if (transaction_type === 'pharmacy_wallet_credit') {
    const pharmacyTotal = safeOrderAmount - safeDeliveryCost
    const finalAmount = pharmacyTotal - safePlatformFees

    tooltipContent = (
      <Box sx={{ p: 1, minWidth: 200 }}>
        <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
          Wallet Credit Summary
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant='body2'>Order Amount</Typography>
          <Typography variant='body2'>₹ {safeOrderAmount.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant='body2'>Delivery Cost</Typography>
          <Typography variant='body2'>-₹ {safeDeliveryCost.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant='body2'>Pharmacy Total</Typography>
          <Typography variant='body2'>₹ {pharmacyTotal.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant='body2'>Platform Fees</Typography>
          <Typography variant='body2'>-₹ {safePlatformFees.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
            Wallet Credit (Final)
          </Typography>
          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
            ₹ {finalAmount.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    )
  } else if (transaction_type === 'pharmacy_wallet_withdraw') {
    tooltipContent = (
      <Box sx={{ p: 1, minWidth: 200 }}>
        <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
          Wallet Withdraw Summary
        </Typography>

        <Typography variant='body2' sx={{ fontWeight: 200, mb: 1 }}>
          Note:- {note}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant='body2'>Amount</Typography>
          <Typography variant='body2'>₹ {safeOrderAmount.toFixed(2)}</Typography>
        </Box>
      </Box>
    )
  } else {
    const pharmacyTotal = safeAmount

    tooltipContent = (
      <Box sx={{ p: 1, minWidth: 200 }}>
        <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
          Order Summary
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant='body2'>Pharmacy Total</Typography>
          <Typography variant='body2'>₹ {pharmacyTotal.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant='body2'>Delivery Cost</Typography>
          <Typography variant='body2'>+₹ {safeDeliveryCost.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
            Order Amount (Total)
          </Typography>
          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
            ₹ {safeOrderAmount.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Tooltip
        title={tooltipContent}
        arrow
        placement='top'
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: isDarkMode ? '' : 'common.white',
              color: isDarkMode ? 'common.white' : 'text.primary',
              boxShadow: isDarkMode ? 3 : 1,
              border: isDarkMode ? 'none' : '1px solid #e0e0e0',
              '& .MuiTooltip-arrow': {
                color: isDarkMode ? '' : 'common.white'
              }
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            ₹ {transaction_type === 'pharmacy_wallet_credit' ? safeAmount.toFixed(2) : safeOrderAmount.toFixed(2)}
          </Typography>
          <InfoIcon sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.7 }} />
        </Box>
      </Tooltip>
    </>
  )
}

export { AmountBreakdownTooltip }
