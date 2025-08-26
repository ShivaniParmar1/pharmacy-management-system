import { useAuth } from 'src/hooks/useAuth'

function Logout() {
  const auth = useAuth()

  return auth.logout()
}

export default Logout
