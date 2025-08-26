// ** Third Party Imports
import axios from 'axios'
import { useRouter } from 'next/router'

// ** Demo Components Imports
import AccountSettings from 'src/pages/apps/account-settings/AccountSettings'

const AccountSettingsTab = ({ apiPricingPlanData }) => {
  const router = useRouter()

  return <AccountSettings tab={router.query.tab} apiPricingPlanData={apiPricingPlanData} />
}

export default AccountSettingsTab
